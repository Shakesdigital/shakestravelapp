const { logger, businessLogger } = require('../utils/logger');
const { Review, User, Booking } = require('../models');

/**
 * Fraud Detection Service for Review System
 * 
 * Advanced fraud detection algorithms inspired by TripAdvisor's content moderation
 * Includes machine learning-inspired heuristics, pattern detection, and behavioral analysis
 */

class FraudDetectionService {
  constructor() {
    this.suspiciousPatterns = {
      // Common spam phrases
      spamPhrases: [
        'click here', 'visit my website', 'buy now', 'special offer',
        'limited time', 'call now', 'free gift', 'guaranteed',
        'act now', 'don\'t miss out', 'exclusive deal'
      ],
      
      // Template-like patterns
      templatePatterns: [
        /^(great|good|excellent|amazing|wonderful|terrible|awful|horrible)\s+(place|hotel|trip|experience)/i,
        /^(highly|definitely|strongly)\s+(recommend|not recommend)/i,
        /^(the\s+)?(staff|service|room|food)\s+(was|were)\s+(great|good|bad|terrible)/i
      ],
      
      // Suspicious character patterns
      characterPatterns: [
        /(.)\1{4,}/, // Repeated characters (aaaaa)
        /[A-Z]{5,}/, // All caps words
        /\d{4,}/, // Long number sequences
        /[!?]{3,}/ // Multiple punctuation
      ]
    };
    
    this.qualityThresholds = {
      minContentLength: 50,
      maxContentLength: 2000,
      minWordCount: 10,
      maxDuplicateScore: 0.7,
      maxTemplateScore: 0.6,
      maxRiskScore: 70
    };
    
    // Cache for performance
    this.userCache = new Map();
    this.contentCache = new Map();
  }

  /**
   * Comprehensive fraud analysis for a review
   */
  async analyzeReview(reviewData, userId, bookingId) {
    try {
      logger.info('Starting fraud detection analysis', {
        userId,
        bookingId,
        contentLength: reviewData.content?.length,
        rating: reviewData.rating
      });

      const analysis = {
        riskScore: 0,
        riskFactors: [],
        flags: {},
        userMetrics: {},
        contentAnalysis: {},
        timingAnalysis: {},
        recommendations: []
      };

      // Parallel analysis for performance
      const [
        userAnalysis,
        contentAnalysis,
        timingAnalysis,
        behavioralAnalysis
      ] = await Promise.all([
        this.analyzeUser(userId),
        this.analyzeContent(reviewData.content, reviewData.title),
        this.analyzeTimingPatterns(userId, bookingId),
        this.analyzeBehavioralPatterns(userId, reviewData.rating)
      ]);

      // Combine analyses
      analysis.userMetrics = userAnalysis;
      analysis.contentAnalysis = contentAnalysis;
      analysis.timingAnalysis = timingAnalysis;

      // Calculate overall risk score
      analysis.riskScore = this.calculateOverallRiskScore({
        userAnalysis,
        contentAnalysis,
        timingAnalysis,
        behavioralAnalysis,
        reviewData
      });

      // Set flags based on analysis
      analysis.flags = this.determineFlags(analysis);
      
      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      logger.info('Fraud detection analysis completed', {
        userId,
        riskScore: analysis.riskScore,
        flagCount: Object.keys(analysis.flags).filter(key => analysis.flags[key]).length
      });

      return analysis;

    } catch (error) {
      logger.error('Error in fraud detection analysis', {
        error: error.message,
        userId,
        bookingId
      });
      
      // Return safe default for errors
      return {
        riskScore: 50, // Medium risk when analysis fails
        riskFactors: [{ factor: 'analysis_error', weight: 50, description: 'Could not complete fraud analysis' }],
        flags: { analysisFailed: true },
        userMetrics: {},
        contentAnalysis: {},
        timingAnalysis: {},
        recommendations: ['Manual review required due to analysis error']
      };
    }
  }

  /**
   * Analyze user behavior patterns
   */
  async analyzeUser(userId) {
    try {
      // Check cache first
      if (this.userCache.has(userId)) {
        const cached = this.userCache.get(userId);
        if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
          return cached.data;
        }
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const accountAge = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
      
      // Get user's review history
      const userReviews = await Review.find({ userId }).sort({ createdAt: -1 });
      const recentReviews = userReviews.filter(
        review => Date.now() - review.createdAt < (7 * 24 * 60 * 60 * 1000) // Last 7 days
      );

      // Get verified bookings count
      const verifiedBookings = await Booking.countDocuments({
        userId,
        status: { $in: ['confirmed', 'completed'] }
      });

      // Calculate metrics
      const reviewCount = userReviews.length;
      const averageRating = reviewCount > 0 
        ? userReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
        : 0;
      
      const reviewFrequency = recentReviews.length; // Reviews per week
      
      const analysis = {
        accountAge,
        reviewCount,
        averageRating,
        reviewFrequency,
        verifiedBookingsCount: verifiedBookings,
        isNewUser: accountAge < 30,
        isVolumeReviewer: reviewCount > 50,
        hasExtremeAverageRating: averageRating < 2 || averageRating > 4.5,
        recentActivitySpike: recentReviews.length > 5
      };

      // Cache the result
      this.userCache.set(userId, {
        data: analysis,
        timestamp: Date.now()
      });

      return analysis;

    } catch (error) {
      logger.error('Error analyzing user', { error: error.message, userId });
      return {
        accountAge: 0,
        reviewCount: 0,
        averageRating: 0,
        reviewFrequency: 0,
        verifiedBookingsCount: 0,
        isNewUser: true,
        analysisError: true
      };
    }
  }

  /**
   * Analyze content for spam, quality, and authenticity
   */
  async analyzeContent(content, title) {
    try {
      const analysis = {
        length: content.length,
        wordCount: content.split(/\s+/).length,
        duplicateScore: 0,
        templateScore: 0,
        spamScore: 0,
        qualityScore: 0,
        languageConsistency: true,
        hasPersonalInfo: false,
        hasExternalLinks: false,
        sentiment: 'neutral'
      };

      // Content quality analysis
      analysis.qualityScore = this.calculateContentQuality(content, title);
      
      // Spam detection
      analysis.spamScore = this.detectSpamPatterns(content);
      
      // Template detection
      analysis.templateScore = this.detectTemplateContent(content);
      
      // Duplicate content detection
      analysis.duplicateScore = await this.detectDuplicateContent(content);
      
      // Personal information detection
      analysis.hasPersonalInfo = this.detectPersonalInfo(content);
      
      // External links detection
      analysis.hasExternalLinks = this.detectExternalLinks(content);
      
      // Basic sentiment analysis
      analysis.sentiment = this.analyzeSentiment(content);

      return analysis;

    } catch (error) {
      logger.error('Error analyzing content', { error: error.message });
      return {
        length: content?.length || 0,
        wordCount: 0,
        duplicateScore: 0,
        templateScore: 0,
        spamScore: 0,
        qualityScore: 0.5,
        analysisError: true
      };
    }
  }

  /**
   * Analyze timing patterns for suspicious behavior
   */
  async analyzeTimingPatterns(userId, bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return { analysisError: true, message: 'Booking not found' };
      }

      const now = new Date();
      const bookingCompletionDate = booking.dates.endDate || booking.dates.checkOut;
      
      if (!bookingCompletionDate) {
        return { analysisError: true, message: 'No completion date found' };
      }

      const timeToReview = (now - bookingCompletionDate) / (1000 * 60 * 60); // Hours
      
      // Get user's review submission patterns
      const userReviews = await Review.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      const submissionHours = userReviews.map(review => review.createdAt.getHours());
      const submissionDays = userReviews.map(review => review.createdAt.getDay());

      const analysis = {
        timeToReview,
        isRushReview: timeToReview < 1, // Less than 1 hour
        isDelayedReview: timeToReview > (30 * 24), // More than 30 days
        submissionHour: now.getHours(),
        submissionDay: now.getDay(),
        isOffHours: now.getHours() < 6 || now.getHours() > 23,
        hasConsistentTiming: this.checkTimingConsistency(submissionHours, submissionDays),
        averageTimeToReview: timeToReview
      };

      return analysis;

    } catch (error) {
      logger.error('Error analyzing timing patterns', { error: error.message, userId, bookingId });
      return { analysisError: true };
    }
  }

  /**
   * Analyze behavioral patterns for fraud indicators
   */
  async analyzeBehavioralPatterns(userId, rating) {
    try {
      const userReviews = await Review.find({ userId }).sort({ createdAt: -1 });
      
      if (userReviews.length === 0) {
        return { isFirstReview: true };
      }

      const ratingHistory = userReviews.map(review => review.rating);
      const ratingVariance = this.calculateVariance(ratingHistory);
      
      const analysis = {
        ratingVariance,
        hasExtremeRatings: ratingHistory.some(r => r === 1 || r === 5),
        ratingConsistency: ratingVariance < 0.5,
        tendencyToExtremes: ratingHistory.filter(r => r === 1 || r === 5).length / ratingHistory.length,
        averageRating: ratingHistory.reduce((sum, r) => sum + r, 0) / ratingHistory.length,
        reviewCount: userReviews.length
      };

      return analysis;

    } catch (error) {
      logger.error('Error analyzing behavioral patterns', { error: error.message, userId });
      return { analysisError: true };
    }
  }

  /**
   * Calculate overall risk score from all analyses
   */
  calculateOverallRiskScore(analyses) {
    let riskScore = 0;
    const { userAnalysis, contentAnalysis, timingAnalysis, behavioralAnalysis, reviewData } = analyses;

    // User-based risk factors
    if (userAnalysis.isNewUser) riskScore += 15;
    if (userAnalysis.accountAge < 7) riskScore += 20;
    if (userAnalysis.verifiedBookingsCount === 0) riskScore += 25;
    if (userAnalysis.recentActivitySpike) riskScore += 20;
    if (userAnalysis.hasExtremeAverageRating) riskScore += 10;

    // Content-based risk factors
    if (contentAnalysis.spamScore > 0.7) riskScore += 30;
    if (contentAnalysis.templateScore > 0.6) riskScore += 25;
    if (contentAnalysis.duplicateScore > 0.7) riskScore += 35;
    if (contentAnalysis.qualityScore < 0.3) riskScore += 20;
    if (contentAnalysis.hasPersonalInfo) riskScore += 15;
    if (contentAnalysis.hasExternalLinks) riskScore += 20;

    // Timing-based risk factors
    if (timingAnalysis.isRushReview) riskScore += 15;
    if (timingAnalysis.isOffHours) riskScore += 5;
    if (!timingAnalysis.hasConsistentTiming && userAnalysis.reviewCount > 5) riskScore += 10;

    // Rating-based risk factors
    if (reviewData.rating === 1 || reviewData.rating === 5) riskScore += 5;
    if (behavioralAnalysis.tendencyToExtremes > 0.8) riskScore += 15;

    return Math.min(100, Math.max(0, riskScore));
  }

  /**
   * Determine flags based on analysis results
   */
  determineFlags(analysis) {
    const flags = {};
    
    // Spam flags
    flags.isSpam = analysis.contentAnalysis.spamScore > 0.7;
    flags.isLowQuality = analysis.contentAnalysis.qualityScore < 0.3;
    flags.isPotentialFraud = analysis.riskScore > 70;
    flags.isFake = analysis.contentAnalysis.duplicateScore > 0.8 || analysis.contentAnalysis.templateScore > 0.7;
    flags.hasPersonalInfo = analysis.contentAnalysis.hasPersonalInfo;
    flags.hasExternalLinks = analysis.contentAnalysis.hasExternalLinks;
    
    // Behavioral flags
    flags.isRushReview = analysis.timingAnalysis.isRushReview;
    flags.isNewUserRisk = analysis.userMetrics.isNewUser && analysis.userMetrics.verifiedBookingsCount === 0;
    flags.isVolumeSpam = analysis.userMetrics.recentActivitySpike;
    
    return flags;
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.riskScore > 80) {
      recommendations.push('Block review - high fraud risk');
    } else if (analysis.riskScore > 60) {
      recommendations.push('Flag for manual review');
    } else if (analysis.riskScore > 40) {
      recommendations.push('Monitor user activity');
    }
    
    if (analysis.flags.isSpam) {
      recommendations.push('Content shows spam patterns');
    }
    
    if (analysis.flags.isFake) {
      recommendations.push('Content appears to be templated or duplicate');
    }
    
    if (analysis.flags.isNewUserRisk) {
      recommendations.push('New user with no booking history');
    }
    
    if (analysis.flags.isVolumeSpam) {
      recommendations.push('User showing high review volume');
    }
    
    return recommendations;
  }

  /**
   * Calculate content quality score
   */
  calculateContentQuality(content, title) {
    let score = 1.0;
    
    // Length checks
    if (content.length < 50) score -= 0.3;
    if (content.length > 1500) score -= 0.1;
    
    // Word count checks
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 10) score -= 0.3;
    
    // Basic grammar and structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) score -= 0.2;
    
    // Character diversity
    const uniqueChars = new Set(content.toLowerCase()).size;
    if (uniqueChars < 10) score -= 0.2;
    
    // Title-content relevance (basic check)
    if (title && content.toLowerCase().includes(title.toLowerCase().split(' ')[0])) {
      score += 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Detect spam patterns in content
   */
  detectSpamPatterns(content) {
    let spamScore = 0;
    const contentLower = content.toLowerCase();
    
    // Check for spam phrases
    const spamHits = this.suspiciousPatterns.spamPhrases.filter(
      phrase => contentLower.includes(phrase)
    ).length;
    spamScore += spamHits * 0.2;
    
    // Check for character patterns
    this.suspiciousPatterns.characterPatterns.forEach(pattern => {
      if (pattern.test(content)) spamScore += 0.3;
    });
    
    // Check for repeated words
    const words = content.split(/\s+/);
    const wordCounts = {};
    words.forEach(word => {
      const normalized = word.toLowerCase().replace(/[^\w]/g, '');
      if (normalized.length > 3) {
        wordCounts[normalized] = (wordCounts[normalized] || 0) + 1;
      }
    });
    
    const maxRepeats = Math.max(...Object.values(wordCounts));
    if (maxRepeats > 5) spamScore += 0.4;
    
    return Math.min(1, spamScore);
  }

  /**
   * Detect templated content
   */
  detectTemplateContent(content) {
    let templateScore = 0;
    
    this.suspiciousPatterns.templatePatterns.forEach(pattern => {
      if (pattern.test(content)) templateScore += 0.3;
    });
    
    // Check for very generic language
    const genericPhrases = [
      'it was great', 'highly recommend', 'good value', 'nice place',
      'enjoyed my stay', 'will come back', 'perfect location'
    ];
    
    const genericHits = genericPhrases.filter(
      phrase => content.toLowerCase().includes(phrase)
    ).length;
    
    templateScore += genericHits * 0.1;
    
    return Math.min(1, templateScore);
  }

  /**
   * Detect duplicate content (simplified version)
   */
  async detectDuplicateContent(content) {
    try {
      // In production, this would use more sophisticated text similarity algorithms
      const contentHash = this.generateContentHash(content);
      
      // Check cache for similar content
      if (this.contentCache.has(contentHash)) {
        return 0.9; // High duplicate score
      }
      
      // Check database for similar content (simplified)
      const similarReviews = await Review.find({
        $text: { $search: content.substring(0, 50) }
      }).limit(5);
      
      if (similarReviews.length > 0) {
        // Basic similarity check
        const similarities = similarReviews.map(review => 
          this.calculateStringSimilarity(content, review.content)
        );
        
        const maxSimilarity = Math.max(...similarities);
        
        // Cache the content hash
        this.contentCache.set(contentHash, Date.now());
        
        return maxSimilarity;
      }
      
      return 0;
      
    } catch (error) {
      logger.error('Error detecting duplicate content', { error: error.message });
      return 0;
    }
  }

  /**
   * Detect personal information in content
   */
  detectPersonalInfo(content) {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phonePattern = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    return emailPattern.test(content) || phonePattern.test(content) || urlPattern.test(content);
  }

  /**
   * Detect external links
   */
  detectExternalLinks(content) {
    const linkPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    return linkPattern.test(content);
  }

  /**
   * Basic sentiment analysis
   */
  analyzeSentiment(content) {
    const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'worst', 'disgusting', 'hate'];
    
    const contentLower = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Utility functions
   */
  generateContentHash(content) {
    // Simple hash function - in production use crypto.createHash
    return content.length + content.substring(0, 10) + content.substring(content.length - 10);
  }

  calculateStringSimilarity(str1, str2) {
    // Simplified Jaccard similarity
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  calculateVariance(numbers) {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  checkTimingConsistency(hours, days) {
    if (hours.length < 3) return true; // Not enough data
    
    const hourVariance = this.calculateVariance(hours);
    const dayVariance = this.calculateVariance(days);
    
    return hourVariance < 25 && dayVariance < 4; // Reasonable consistency thresholds
  }

  /**
   * Batch analysis for multiple reviews
   */
  async batchAnalyzeReviews(reviews) {
    const results = [];
    
    for (const review of reviews) {
      try {
        const analysis = await this.analyzeReview(
          { content: review.content, title: review.title, rating: review.rating },
          review.userId,
          review.bookingId
        );
        
        results.push({
          reviewId: review._id,
          analysis
        });
        
      } catch (error) {
        logger.error('Error in batch analysis', { 
          error: error.message, 
          reviewId: review._id 
        });
        
        results.push({
          reviewId: review._id,
          analysis: { error: error.message, riskScore: 50 }
        });
      }
    }
    
    return results;
  }

  /**
   * Get fraud statistics for monitoring
   */
  async getFraudStatistics(timeRange = 24) {
    try {
      const since = new Date(Date.now() - timeRange * 60 * 60 * 1000);
      
      const stats = await Review.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            flaggedReviews: {
              $sum: {
                $cond: [{ $eq: ['$moderation.status', 'flagged'] }, 1, 0]
              }
            },
            highRiskReviews: {
              $sum: {
                $cond: [{ $gte: ['$fraudDetection.riskScore', 70] }, 1, 0]
              }
            },
            avgRiskScore: { $avg: '$fraudDetection.riskScore' }
          }
        }
      ]);
      
      return stats[0] || {
        totalReviews: 0,
        flaggedReviews: 0,
        highRiskReviews: 0,
        avgRiskScore: 0
      };
      
    } catch (error) {
      logger.error('Error getting fraud statistics', { error: error.message });
      return null;
    }
  }
}

// Export singleton instance
const fraudDetectionService = new FraudDetectionService();

module.exports = {
  FraudDetectionService,
  fraudDetectionService
};