const {
  putItem,
  getItem,
  queryItems,
  scanItems,
  updateItem,
  deleteItem,
  queryWithPagination,
  scanWithPagination,
  generateId,
  getCurrentTimestamp,
  TABLES
} = require('../config/dynamodb');

/**
 * DynamoDB Models for User-Generated Content
 *
 * This module provides CRUD operations for:
 * - Experiences (Trips)
 * - Accommodations
 * - Articles
 */

// ============================================
// EXPERIENCES
// ============================================

class ExperienceModel {
  /**
   * Create a new experience
   */
  static async create(userId, data) {
    const now = getCurrentTimestamp();
    const experience = {
      id: generateId(),
      userId: userId.toString(),
      ...data,
      status: data.status || 'draft',
      isActive: true,
      rating: { average: 0, count: 0 },
      createdAt: now,
      updatedAt: now
    };

    await putItem(TABLES.EXPERIENCES, experience);
    return experience;
  }

  /**
   * Find experience by ID
   */
  static async findById(id) {
    return await getItem(TABLES.EXPERIENCES, { id });
  }

  /**
   * Find experiences by user ID
   */
  static async findByUserId(userId, status = null) {
    const params = {
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId.toString()
      },
      ScanIndexForward: false // Sort by createdAt DESC
    };

    if (status) {
      params.FilterExpression = '#status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues[':status'] = status;
    }

    const result = await queryWithPagination(TABLES.EXPERIENCES, params, 1000);
    return result;
  }

  /**
   * Find approved experiences
   */
  static async findApproved(filters = {}) {
    const params = {
      IndexName: 'StatusIndex',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'approved'
      },
      FilterExpression: 'isActive = :isActive',
      ExpressionAttributeValues: {
        ':status': 'approved',
        ':isActive': true
      },
      ScanIndexForward: false // Sort by createdAt DESC
    };

    // Add additional filters
    if (filters.category) {
      params.FilterExpression += ' AND category = :category';
      params.ExpressionAttributeValues[':category'] = filters.category;
    }

    if (filters.region) {
      params.FilterExpression += ' AND region = :region';
      params.ExpressionAttributeValues[':region'] = filters.region;
    }

    if (filters.featured) {
      params.FilterExpression += ' AND featured = :featured';
      params.ExpressionAttributeValues[':featured'] = true;
    }

    const limit = filters.limit || 100;
    const result = await queryWithPagination(TABLES.EXPERIENCES, params, limit);
    return result;
  }

  /**
   * Update experience
   */
  static async update(id, userId, data) {
    const experience = await this.findById(id);

    if (!experience || experience.userId !== userId.toString()) {
      return null;
    }

    // Don't allow updating if not in draft or rejected status
    if (!['draft', 'rejected'].includes(experience.status)) {
      throw new Error('Cannot update experience with current status');
    }

    const updates = {
      ...data,
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.EXPERIENCES, { id }, updates);
  }

  /**
   * Delete experience
   */
  static async delete(id, userId) {
    const experience = await this.findById(id);

    if (!experience || experience.userId !== userId.toString() || experience.status !== 'draft') {
      return false;
    }

    await deleteItem(TABLES.EXPERIENCES, { id });
    return true;
  }

  /**
   * Submit experience for review
   */
  static async submitForReview(id, userId) {
    const experience = await this.findById(id);

    if (!experience || experience.userId !== userId.toString() || experience.status !== 'draft') {
      return null;
    }

    const updates = {
      status: 'pending',
      submittedAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.EXPERIENCES, { id }, updates);
  }

  /**
   * Approve experience (admin)
   */
  static async approve(id) {
    const updates = {
      status: 'approved',
      approvedAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.EXPERIENCES, { id }, updates);
  }

  /**
   * Reject experience (admin)
   */
  static async reject(id, reason) {
    const updates = {
      status: 'rejected',
      rejectedAt: getCurrentTimestamp(),
      rejectionReason: reason,
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.EXPERIENCES, { id }, updates);
  }
}

// ============================================
// ACCOMMODATIONS
// ============================================

class AccommodationModel {
  /**
   * Create a new accommodation
   */
  static async create(userId, data) {
    const now = getCurrentTimestamp();
    const accommodation = {
      id: generateId(),
      userId: userId.toString(),
      ...data,
      status: data.status || 'draft',
      isActive: true,
      rating: { average: 0, count: 0 },
      createdAt: now,
      updatedAt: now
    };

    await putItem(TABLES.ACCOMMODATIONS, accommodation);
    return accommodation;
  }

  /**
   * Find accommodation by ID
   */
  static async findById(id) {
    return await getItem(TABLES.ACCOMMODATIONS, { id });
  }

  /**
   * Find accommodations by user ID
   */
  static async findByUserId(userId, status = null) {
    const params = {
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId.toString()
      },
      ScanIndexForward: false
    };

    if (status) {
      params.FilterExpression = '#status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues[':status'] = status;
    }

    const result = await queryWithPagination(TABLES.ACCOMMODATIONS, params, 1000);
    return result;
  }

  /**
   * Find approved accommodations
   */
  static async findApproved(filters = {}) {
    const params = {
      IndexName: 'StatusIndex',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'approved'
      },
      FilterExpression: 'isActive = :isActive',
      ExpressionAttributeValues: {
        ':status': 'approved',
        ':isActive': true
      },
      ScanIndexForward: false
    };

    if (filters.type) {
      params.FilterExpression += ' AND #type = :type';
      params.ExpressionAttributeNames['#type'] = 'type';
      params.ExpressionAttributeValues[':type'] = filters.type;
    }

    if (filters.location) {
      params.FilterExpression += ' AND contains(#location, :location)';
      params.ExpressionAttributeNames['#location'] = 'location';
      params.ExpressionAttributeValues[':location'] = filters.location;
    }

    if (filters.featured) {
      params.FilterExpression += ' AND featured = :featured';
      params.ExpressionAttributeValues[':featured'] = true;
    }

    const limit = filters.limit || 100;
    const result = await queryWithPagination(TABLES.ACCOMMODATIONS, params, limit);
    return result;
  }

  /**
   * Update accommodation
   */
  static async update(id, userId, data) {
    const accommodation = await this.findById(id);

    if (!accommodation || accommodation.userId !== userId.toString()) {
      return null;
    }

    if (!['draft', 'rejected'].includes(accommodation.status)) {
      throw new Error('Cannot update accommodation with current status');
    }

    const updates = {
      ...data,
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.ACCOMMODATIONS, { id }, updates);
  }

  /**
   * Delete accommodation
   */
  static async delete(id, userId) {
    const accommodation = await this.findById(id);

    if (!accommodation || accommodation.userId !== userId.toString() || accommodation.status !== 'draft') {
      return false;
    }

    await deleteItem(TABLES.ACCOMMODATIONS, { id });
    return true;
  }

  /**
   * Submit accommodation for review
   */
  static async submitForReview(id, userId) {
    const accommodation = await this.findById(id);

    if (!accommodation || accommodation.userId !== userId.toString() || accommodation.status !== 'draft') {
      return null;
    }

    const updates = {
      status: 'pending',
      submittedAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.ACCOMMODATIONS, { id }, updates);
  }
}

// ============================================
// ARTICLES
// ============================================

class ArticleModel {
  /**
   * Create a new article
   */
  static async create(authorId, data) {
    const now = getCurrentTimestamp();
    const article = {
      id: generateId(),
      authorId: authorId.toString(),
      ...data,
      slug: data.slug || this._generateSlug(data.title),
      moderationStatus: data.moderationStatus || 'draft',
      publishStatus: data.publishStatus || 'draft',
      readingTime: this._calculateReadingTime(data.content || ''),
      engagement: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0
      },
      isActive: true,
      version: 1,
      createdAt: now,
      updatedAt: now,
      publishedAt: now
    };

    // Auto-populate SEO if not provided
    if (!article.seo) {
      article.seo = {
        metaTitle: data.title.substring(0, 60),
        metaDescription: data.excerpt.substring(0, 160),
        keywords: data.tags || []
      };
    }

    await putItem(TABLES.ARTICLES, article);
    return article;
  }

  /**
   * Find article by ID
   */
  static async findById(id) {
    return await getItem(TABLES.ARTICLES, { id });
  }

  /**
   * Find article by slug
   */
  static async findBySlug(slug) {
    const params = {
      IndexName: 'SlugIndex',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug
      }
    };

    const result = await queryItems(TABLES.ARTICLES, params);
    return result.items.length > 0 ? result.items[0] : null;
  }

  /**
   * Find articles by author ID
   */
  static async findByAuthorId(authorId, moderationStatus = null) {
    const params = {
      IndexName: 'AuthorIdIndex',
      KeyConditionExpression: 'authorId = :authorId',
      ExpressionAttributeValues: {
        ':authorId': authorId.toString()
      },
      ScanIndexForward: false
    };

    if (moderationStatus) {
      params.FilterExpression = 'moderationStatus = :moderationStatus';
      params.ExpressionAttributeValues[':moderationStatus'] = moderationStatus;
    }

    const result = await queryWithPagination(TABLES.ARTICLES, params, 1000);
    return result;
  }

  /**
   * Find published articles
   */
  static async findPublished(filters = {}) {
    const params = {
      IndexName: 'ModerationStatusIndex',
      KeyConditionExpression: 'moderationStatus = :moderationStatus',
      ExpressionAttributeValues: {
        ':moderationStatus': 'approved'
      },
      FilterExpression: 'publishStatus = :publishStatus AND isActive = :isActive',
      ExpressionAttributeValues: {
        ':moderationStatus': 'approved',
        ':publishStatus': 'published',
        ':isActive': true
      },
      ScanIndexForward: false
    };

    if (filters.category) {
      params.FilterExpression += ' AND category = :category';
      params.ExpressionAttributeValues[':category'] = filters.category;
    }

    if (filters.featured) {
      params.FilterExpression += ' AND featured = :featured';
      params.ExpressionAttributeValues[':featured'] = true;
    }

    const limit = filters.limit || 20;
    const result = await queryWithPagination(TABLES.ARTICLES, params, limit);
    return result;
  }

  /**
   * Update article
   */
  static async update(id, authorId, data) {
    const article = await this.findById(id);

    if (!article || article.authorId !== authorId.toString()) {
      return null;
    }

    if (!['draft', 'rejected'].includes(article.moderationStatus)) {
      throw new Error('Cannot update article with current status');
    }

    const updates = {
      ...data,
      version: article.version + 1,
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.ARTICLES, { id }, updates);
  }

  /**
   * Submit article for review
   */
  static async submitForReview(id, authorId) {
    const article = await this.findById(id);

    if (!article || article.authorId !== authorId.toString()) {
      return null;
    }

    if (!['draft', 'rejected'].includes(article.moderationStatus)) {
      return null;
    }

    const updates = {
      moderationStatus: 'pending',
      submittedForReviewAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.ARTICLES, { id }, updates);
  }

  /**
   * Increment view count
   */
  static async incrementViews(id) {
    const article = await this.findById(id);
    if (!article) return;

    const updates = {
      'engagement.views': (article.engagement?.views || 0) + 1,
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.ARTICLES, { id }, updates);
  }

  /**
   * Approve article (admin)
   */
  static async approve(id) {
    const updates = {
      moderationStatus: 'approved',
      publishStatus: 'published',
      approvedAt: getCurrentTimestamp(),
      publishedAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.ARTICLES, { id }, updates);
  }

  /**
   * Reject article (admin)
   */
  static async reject(id, reason) {
    const updates = {
      moderationStatus: 'rejected',
      rejectedAt: getCurrentTimestamp(),
      rejectionReason: reason,
      updatedAt: getCurrentTimestamp()
    };

    return await updateItem(TABLES.ARTICLES, { id }, updates);
  }

  static _generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      + '-' + Date.now();
  }

  static _calculateReadingTime(content) {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200); // 200 words per minute
  }
}

module.exports = {
  ExperienceModel,
  AccommodationModel,
  ArticleModel
};
