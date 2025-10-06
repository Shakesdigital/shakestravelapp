const oracle = require('../config/oracle');
const logger = require('../utils/logger');

/**
 * Oracle Database Models for User-Generated Content
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
    const sql = `
      INSERT INTO user_experiences (
        user_id, title, description, overview, location, region, country,
        latitude, longitude, category, difficulty, price, original_price,
        currency, price_includes, duration, duration_days, duration_hours,
        max_group_size, min_group_size, highlights, included, excluded,
        itinerary, additional_info, availability_type, available_from,
        available_to, available_days, eco_friendly, instant_booking,
        free_cancel, pickup_included, status
      ) VALUES (
        :userId, :title, :description, :overview, :location, :region, :country,
        :latitude, :longitude, :category, :difficulty, :price, :originalPrice,
        :currency, :priceIncludes, :duration, :durationDays, :durationHours,
        :maxGroupSize, :minGroupSize, :highlights, :included, :excluded,
        :itinerary, :additionalInfo, :availabilityType, :availableFrom,
        :availableTo, :availableDays, :ecoFriendly, :instantBooking,
        :freeCancel, :pickupIncluded, :status
      ) RETURNING id INTO :id
    `;

    const binds = {
      userId,
      title: data.title,
      description: data.description,
      overview: data.overview || null,
      location: data.location,
      region: data.region || null,
      country: data.country || 'Uganda',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      category: data.category,
      difficulty: data.difficulty || null,
      price: data.price,
      originalPrice: data.originalPrice || null,
      currency: data.currency || 'USD',
      priceIncludes: data.priceIncludes ? JSON.stringify(data.priceIncludes) : null,
      duration: data.duration || null,
      durationDays: data.durationDays || null,
      durationHours: data.durationHours || null,
      maxGroupSize: data.maxGroupSize || null,
      minGroupSize: data.minGroupSize || 1,
      highlights: data.highlights ? JSON.stringify(data.highlights) : null,
      included: data.included ? JSON.stringify(data.included) : null,
      excluded: data.excluded ? JSON.stringify(data.excluded) : null,
      itinerary: data.itinerary ? JSON.stringify(data.itinerary) : null,
      additionalInfo: data.additionalInfo ? JSON.stringify(data.additionalInfo) : null,
      availabilityType: data.availabilityType || 'daily',
      availableFrom: data.availableFrom || null,
      availableTo: data.availableTo || null,
      availableDays: data.availableDays ? JSON.stringify(data.availableDays) : null,
      ecoFriendly: data.ecoFriendly ? 1 : 0,
      instantBooking: data.instantBooking ? 1 : 0,
      freeCancel: data.freeCancel ? 1 : 0,
      pickupIncluded: data.pickupIncluded ? 1 : 0,
      status: data.status || 'draft',
      id: { dir: oracle.oracledb.BIND_OUT, type: oracle.oracledb.NUMBER }
    };

    const result = await oracle.execute(sql, binds);
    const experienceId = result.outBinds.id[0];

    // Insert images if provided
    if (data.images && data.images.length > 0) {
      await this.addImages(experienceId, data.images);
    }

    return await this.findById(experienceId);
  }

  /**
   * Find experience by ID
   */
  static async findById(id) {
    const sql = `
      SELECT * FROM user_experiences WHERE id = :id
    `;
    const experience = await oracle.executeOne(sql, { id });

    if (experience) {
      // Fetch images
      const images = await oracle.executeMany(
        'SELECT * FROM experience_images WHERE experience_id = :id ORDER BY position, id',
        { id }
      );
      experience.images = images;

      // Parse JSON fields
      this._parseJsonFields(experience);
    }

    return experience;
  }

  /**
   * Find experiences by user ID
   */
  static async findByUserId(userId, status = null) {
    let sql = 'SELECT * FROM user_experiences WHERE user_id = :userId';
    const binds = { userId };

    if (status) {
      sql += ' AND status = :status';
      binds.status = status;
    }

    sql += ' ORDER BY created_at DESC';

    const experiences = await oracle.executeMany(sql, binds);

    // Fetch images for each experience
    for (const exp of experiences) {
      const images = await oracle.executeMany(
        'SELECT * FROM experience_images WHERE experience_id = :id ORDER BY position, id',
        { id: exp.ID }
      );
      exp.images = images;
      this._parseJsonFields(exp);
    }

    return experiences;
  }

  /**
   * Find approved experiences
   */
  static async findApproved(filters = {}) {
    let sql = `
      SELECT * FROM user_experiences
      WHERE status = 'approved' AND is_active = 1
    `;
    const binds = {};

    if (filters.category) {
      sql += ' AND category = :category';
      binds.category = filters.category;
    }

    if (filters.region) {
      sql += ' AND region = :region';
      binds.region = filters.region;
    }

    if (filters.featured) {
      sql += ' AND featured = 1';
    }

    sql += ' ORDER BY featured DESC, approved_at DESC, created_at DESC';

    if (filters.limit) {
      sql += ' FETCH FIRST :limit ROWS ONLY';
      binds.limit = filters.limit;
    }

    const experiences = await oracle.executeMany(sql, binds);

    // Fetch images
    for (const exp of experiences) {
      const images = await oracle.executeMany(
        'SELECT * FROM experience_images WHERE experience_id = :id ORDER BY position, id',
        { id: exp.ID }
      );
      exp.images = images;
      this._parseJsonFields(exp);
    }

    return experiences;
  }

  /**
   * Update experience
   */
  static async update(id, userId, data) {
    const fields = [];
    const binds = { id, userId };

    // Build dynamic UPDATE query
    Object.keys(data).forEach((key) => {
      const oracleKey = this._toSnakeCase(key);
      fields.push(`${oracleKey} = :${key}`);
      binds[key] = data[key];
    });

    const sql = `
      UPDATE user_experiences
      SET ${fields.join(', ')}
      WHERE id = :id AND user_id = :userId
    `;

    await oracle.execute(sql, binds);
    return await this.findById(id);
  }

  /**
   * Delete experience
   */
  static async delete(id, userId) {
    const sql = `
      DELETE FROM user_experiences
      WHERE id = :id AND user_id = :userId AND status = 'draft'
    `;
    const result = await oracle.execute(sql, { id, userId });
    return result.rowsAffected > 0;
  }

  /**
   * Submit experience for review
   */
  static async submitForReview(id, userId) {
    const sql = `
      UPDATE user_experiences
      SET status = 'pending', submitted_at = CURRENT_TIMESTAMP
      WHERE id = :id AND user_id = :userId AND status = 'draft'
    `;
    await oracle.execute(sql, { id, userId });
    return await this.findById(id);
  }

  /**
   * Add images to experience
   */
  static async addImages(experienceId, images) {
    const sql = `
      INSERT INTO experience_images (experience_id, url, public_id, caption, alt_text, position, is_featured)
      VALUES (:experienceId, :url, :publicId, :caption, :altText, :position, :isFeatured)
    `;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await oracle.execute(sql, {
        experienceId,
        url: img.url,
        publicId: img.publicId || null,
        caption: img.caption || null,
        altText: img.altText || null,
        position: i,
        isFeatured: i === 0 ? 1 : 0
      });
    }
  }

  /**
   * Helper: Convert camelCase to snake_case
   */
  static _toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Helper: Parse JSON fields
   */
  static _parseJsonFields(experience) {
    const jsonFields = [
      'highlights', 'included', 'excluded', 'itinerary',
      'additional_info', 'available_days', 'price_includes'
    ];

    jsonFields.forEach(field => {
      const upperField = field.toUpperCase();
      if (experience[upperField]) {
        try {
          experience[upperField] = JSON.parse(experience[upperField]);
        } catch (e) {
          // Keep as string if parse fails
        }
      }
    });
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
    const sql = `
      INSERT INTO user_accommodations (
        user_id, name, description, type, location, address, city, region,
        country, latitude, longitude, price_per_night, original_price,
        currency, max_guests, bedrooms, bathrooms, beds, amenities,
        cancellation_policy, check_in_time, check_out_time, house_rules,
        has_wifi, has_parking, has_pool, has_kitchen, pet_friendly, status
      ) VALUES (
        :userId, :name, :description, :type, :location, :address, :city, :region,
        :country, :latitude, :longitude, :pricePerNight, :originalPrice,
        :currency, :maxGuests, :bedrooms, :bathrooms, :beds, :amenities,
        :cancellationPolicy, :checkInTime, :checkOutTime, :houseRules,
        :hasWifi, :hasParking, :hasPool, :hasKitchen, :petFriendly, :status
      ) RETURNING id INTO :id
    `;

    const binds = {
      userId,
      name: data.name,
      description: data.description,
      type: data.type,
      location: data.location,
      address: data.address || null,
      city: data.city || null,
      region: data.region || null,
      country: data.country || 'Uganda',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      pricePerNight: data.pricePerNight,
      originalPrice: data.originalPrice || null,
      currency: data.currency || 'USD',
      maxGuests: data.maxGuests,
      bedrooms: data.bedrooms || null,
      bathrooms: data.bathrooms || null,
      beds: data.beds || null,
      amenities: data.amenities ? JSON.stringify(data.amenities) : null,
      cancellationPolicy: data.cancellationPolicy || 'moderate',
      checkInTime: data.checkInTime || null,
      checkOutTime: data.checkOutTime || null,
      houseRules: data.houseRules ? JSON.stringify(data.houseRules) : null,
      hasWifi: data.hasWifi ? 1 : 0,
      hasParking: data.hasParking ? 1 : 0,
      hasPool: data.hasPool ? 1 : 0,
      hasKitchen: data.hasKitchen ? 1 : 0,
      petFriendly: data.petFriendly ? 1 : 0,
      status: data.status || 'draft',
      id: { dir: oracle.oracledb.BIND_OUT, type: oracle.oracledb.NUMBER }
    };

    const result = await oracle.execute(sql, binds);
    const accommodationId = result.outBinds.id[0];

    // Insert images if provided
    if (data.images && data.images.length > 0) {
      await this.addImages(accommodationId, data.images);
    }

    return await this.findById(accommodationId);
  }

  /**
   * Find accommodation by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM user_accommodations WHERE id = :id';
    const accommodation = await oracle.executeOne(sql, { id });

    if (accommodation) {
      const images = await oracle.executeMany(
        'SELECT * FROM accommodation_images WHERE accommodation_id = :id ORDER BY position, id',
        { id }
      );
      accommodation.images = images;
      this._parseJsonFields(accommodation);
    }

    return accommodation;
  }

  /**
   * Find accommodations by user ID
   */
  static async findByUserId(userId, status = null) {
    let sql = 'SELECT * FROM user_accommodations WHERE user_id = :userId';
    const binds = { userId };

    if (status) {
      sql += ' AND status = :status';
      binds.status = status;
    }

    sql += ' ORDER BY created_at DESC';

    const accommodations = await oracle.executeMany(sql, binds);

    for (const acc of accommodations) {
      const images = await oracle.executeMany(
        'SELECT * FROM accommodation_images WHERE accommodation_id = :id ORDER BY position, id',
        { id: acc.ID }
      );
      acc.images = images;
      this._parseJsonFields(acc);
    }

    return accommodations;
  }

  /**
   * Find approved accommodations
   */
  static async findApproved(filters = {}) {
    let sql = `
      SELECT * FROM user_accommodations
      WHERE status = 'approved' AND is_active = 1
    `;
    const binds = {};

    if (filters.type) {
      sql += ' AND type = :type';
      binds.type = filters.type;
    }

    if (filters.location) {
      sql += ' AND UPPER(location) LIKE UPPER(:location)';
      binds.location = `%${filters.location}%`;
    }

    sql += ' ORDER BY featured DESC, approved_at DESC, created_at DESC';

    if (filters.limit) {
      sql += ' FETCH FIRST :limit ROWS ONLY';
      binds.limit = filters.limit;
    }

    const accommodations = await oracle.executeMany(sql, binds);

    for (const acc of accommodations) {
      const images = await oracle.executeMany(
        'SELECT * FROM accommodation_images WHERE accommodation_id = :id ORDER BY position, id',
        { id: acc.ID }
      );
      acc.images = images;
      this._parseJsonFields(acc);
    }

    return accommodations;
  }

  /**
   * Update accommodation
   */
  static async update(id, userId, data) {
    const fields = [];
    const binds = { id, userId };

    Object.keys(data).forEach((key) => {
      const oracleKey = this._toSnakeCase(key);
      fields.push(`${oracleKey} = :${key}`);
      binds[key] = data[key];
    });

    const sql = `
      UPDATE user_accommodations
      SET ${fields.join(', ')}
      WHERE id = :id AND user_id = :userId
    `;

    await oracle.execute(sql, binds);
    return await this.findById(id);
  }

  /**
   * Delete accommodation
   */
  static async delete(id, userId) {
    const sql = `
      DELETE FROM user_accommodations
      WHERE id = :id AND user_id = :userId AND status = 'draft'
    `;
    const result = await oracle.execute(sql, { id, userId });
    return result.rowsAffected > 0;
  }

  /**
   * Add images to accommodation
   */
  static async addImages(accommodationId, images) {
    const sql = `
      INSERT INTO accommodation_images (accommodation_id, url, public_id, caption, alt_text, position, is_featured)
      VALUES (:accommodationId, :url, :publicId, :caption, :altText, :position, :isFeatured)
    `;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await oracle.execute(sql, {
        accommodationId,
        url: img.url,
        publicId: img.publicId || null,
        caption: img.caption || null,
        altText: img.altText || null,
        position: i,
        isFeatured: i === 0 ? 1 : 0
      });
    }
  }

  static _toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  static _parseJsonFields(accommodation) {
    const jsonFields = ['amenities', 'house_rules'];
    jsonFields.forEach(field => {
      const upperField = field.toUpperCase();
      if (accommodation[upperField]) {
        try {
          accommodation[upperField] = JSON.parse(accommodation[upperField]);
        } catch (e) {}
      }
    });
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
    const sql = `
      INSERT INTO user_articles (
        author_id, title, slug, excerpt, content, category, tags,
        featured_image_url, featured_image_public_id, featured_image_caption,
        featured_image_alt, location_country, location_region, location_city,
        seo_meta_title, seo_meta_description, seo_keywords, moderation_status,
        publish_status, reading_time
      ) VALUES (
        :authorId, :title, :slug, :excerpt, :content, :category, :tags,
        :featuredImageUrl, :featuredImagePublicId, :featuredImageCaption,
        :featuredImageAlt, :locationCountry, :locationRegion, :locationCity,
        :seoMetaTitle, :seoMetaDescription, :seoKeywords, :moderationStatus,
        :publishStatus, :readingTime
      ) RETURNING id INTO :id
    `;

    const binds = {
      authorId,
      title: data.title,
      slug: data.slug || this._generateSlug(data.title),
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      featuredImageUrl: data.featuredImage?.url || null,
      featuredImagePublicId: data.featuredImage?.publicId || null,
      featuredImageCaption: data.featuredImage?.caption || null,
      featuredImageAlt: data.featuredImage?.altText || null,
      locationCountry: data.location?.country || 'Uganda',
      locationRegion: data.location?.region || null,
      locationCity: data.location?.city || null,
      seoMetaTitle: data.seo?.metaTitle || data.title.substring(0, 60),
      seoMetaDescription: data.seo?.metaDescription || data.excerpt.substring(0, 160),
      seoKeywords: data.seo?.keywords ? JSON.stringify(data.seo.keywords) : null,
      moderationStatus: data.moderationStatus || 'draft',
      publishStatus: data.publishStatus || 'draft',
      readingTime: this._calculateReadingTime(data.content),
      id: { dir: oracle.oracledb.BIND_OUT, type: oracle.oracledb.NUMBER }
    };

    const result = await oracle.execute(sql, binds);
    const articleId = result.outBinds.id[0];

    return await this.findById(articleId);
  }

  /**
   * Find article by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM user_articles WHERE id = :id';
    const article = await oracle.executeOne(sql, { id });

    if (article) {
      this._parseJsonFields(article);
    }

    return article;
  }

  /**
   * Find articles by author ID
   */
  static async findByAuthorId(authorId, moderationStatus = null) {
    let sql = 'SELECT * FROM user_articles WHERE author_id = :authorId';
    const binds = { authorId };

    if (moderationStatus) {
      sql += ' AND moderation_status = :moderationStatus';
      binds.moderationStatus = moderationStatus;
    }

    sql += ' ORDER BY created_at DESC';

    const articles = await oracle.executeMany(sql, binds);
    articles.forEach(article => this._parseJsonFields(article));
    return articles;
  }

  /**
   * Find published articles
   */
  static async findPublished(filters = {}) {
    let sql = `
      SELECT * FROM user_articles
      WHERE moderation_status = 'approved'
      AND publish_status = 'published'
      AND is_active = 1
    `;
    const binds = {};

    if (filters.category) {
      sql += ' AND category = :category';
      binds.category = filters.category;
    }

    if (filters.featured) {
      sql += ' AND is_featured = 1';
    }

    sql += ' ORDER BY is_featured DESC, published_at DESC';

    if (filters.limit) {
      sql += ' FETCH FIRST :limit ROWS ONLY';
      binds.limit = filters.limit;
    }

    const articles = await oracle.executeMany(sql, binds);
    articles.forEach(article => this._parseJsonFields(article));
    return articles;
  }

  /**
   * Update article
   */
  static async update(id, authorId, data) {
    const fields = [];
    const binds = { id, authorId };

    Object.keys(data).forEach((key) => {
      const oracleKey = this._toSnakeCase(key);
      fields.push(`${oracleKey} = :${key}`);
      binds[key] = data[key];
    });

    const sql = `
      UPDATE user_articles
      SET ${fields.join(', ')}, version = version + 1, last_edited_at = CURRENT_TIMESTAMP
      WHERE id = :id AND author_id = :authorId
    `;

    await oracle.execute(sql, binds);
    return await this.findById(id);
  }

  /**
   * Submit article for review
   */
  static async submitForReview(id, authorId) {
    const sql = `
      UPDATE user_articles
      SET moderation_status = 'pending', submitted_for_review_at = CURRENT_TIMESTAMP
      WHERE id = :id AND author_id = :authorId AND moderation_status = 'draft'
    `;
    await oracle.execute(sql, { id, authorId });
    return await this.findById(id);
  }

  /**
   * Increment view count
   */
  static async incrementViews(id) {
    const sql = `
      UPDATE user_articles
      SET views_count = views_count + 1
      WHERE id = :id
    `;
    await oracle.execute(sql, { id });
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

  static _toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  static _parseJsonFields(article) {
    const jsonFields = ['tags', 'seo_keywords'];
    jsonFields.forEach(field => {
      const upperField = field.toUpperCase();
      if (article[upperField]) {
        try {
          article[upperField] = JSON.parse(article[upperField]);
        } catch (e) {}
      }
    });
  }
}

module.exports = {
  ExperienceModel,
  AccommodationModel,
  ArticleModel
};
