const { netlifyDB } = require('../../config/netlify-db');

class Trip {
  constructor(data) {
    this._id = data._id || netlifyDB.generateId();
    this.title = data.title || '';
    this.description = data.description || '';
    this.location = data.location || {};
    this.duration = data.duration || '';
    this.price = data.price || 0;
    this.maxGroupSize = data.maxGroupSize || 1;
    this.difficulty = data.difficulty || 'easy';
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.inclusions = data.inclusions || [];
    this.exclusions = data.exclusions || [];
    this.itinerary = data.itinerary || [];
    this.images = data.images || [];
    this.availability = data.availability || {};
    this.ratings = data.ratings || { average: 0, count: 0 };
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.isFeatured = data.isFeatured || false;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Static methods
  static async create(tripData) {
    const trip = new Trip(tripData);
    return await netlifyDB.create('trips', trip._id, trip.toObject());
  }

  static async findById(id) {
    const tripData = await netlifyDB.findById('trips', id);
    return tripData ? new Trip(tripData) : null;
  }

  static async findAll(options = {}) {
    let trips = await netlifyDB.findAll('trips', options);
    
    // Filter active trips by default
    trips = trips.filter(trip => trip.isActive !== false);
    
    return trips.map(tripData => new Trip(tripData));
  }

  static async findFeatured(limit = 6) {
    const trips = await Trip.findAll();
    return trips
      .filter(trip => trip.isFeatured)
      .slice(0, limit);
  }

  static async findByCategory(category, options = {}) {
    const trips = await netlifyDB.findByField('trips', 'category', category, options);
    return trips
      .filter(trip => trip.isActive !== false)
      .map(tripData => new Trip(tripData));
  }

  static async findByLocation(location, options = {}) {
    const allTrips = await Trip.findAll(options);
    return allTrips.filter(trip => {
      if (typeof location === 'string') {
        return trip.location.country?.toLowerCase().includes(location.toLowerCase()) ||
               trip.location.city?.toLowerCase().includes(location.toLowerCase()) ||
               trip.location.region?.toLowerCase().includes(location.toLowerCase());
      }
      return false;
    });
  }

  static async search(searchTerm, filters = {}) {
    let trips = await netlifyDB.search('trips', searchTerm, ['title', 'description', 'category']);
    
    // Apply filters
    if (filters.category) {
      trips = trips.filter(trip => trip.category === filters.category);
    }
    
    if (filters.minPrice !== undefined) {
      trips = trips.filter(trip => trip.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      trips = trips.filter(trip => trip.price <= filters.maxPrice);
    }
    
    if (filters.difficulty) {
      trips = trips.filter(trip => trip.difficulty === filters.difficulty);
    }
    
    if (filters.duration) {
      trips = trips.filter(trip => trip.duration === filters.duration);
    }

    // Filter active trips
    trips = trips.filter(trip => trip.isActive !== false);
    
    return trips.map(tripData => new Trip(tripData));
  }

  static async deleteById(id) {
    return await netlifyDB.delete('trips', id);
  }

  // Instance methods
  async save() {
    this.updatedAt = new Date().toISOString();
    
    if (await netlifyDB.exists('trips', this._id)) {
      return await netlifyDB.update('trips', this._id, this.toObject());
    } else {
      return await netlifyDB.create('trips', this._id, this.toObject());
    }
  }

  async update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return await netlifyDB.update('trips', this._id, this.toObject());
  }

  async delete() {
    // Soft delete by setting isActive to false
    this.isActive = false;
    return await this.save();
  }

  async hardDelete() {
    return await netlifyDB.delete('trips', this._id);
  }

  toObject() {
    return {
      _id: this._id,
      title: this.title,
      description: this.description,
      location: this.location,
      duration: this.duration,
      price: this.price,
      maxGroupSize: this.maxGroupSize,
      difficulty: this.difficulty,
      category: this.category,
      tags: this.tags,
      inclusions: this.inclusions,
      exclusions: this.exclusions,
      itinerary: this.itinerary,
      images: this.images,
      availability: this.availability,
      ratings: this.ratings,
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toJSON() {
    return this.toObject();
  }

  // Rating methods
  async updateRating(newRating) {
    const currentTotal = this.ratings.average * this.ratings.count;
    this.ratings.count += 1;
    this.ratings.average = (currentTotal + newRating) / this.ratings.count;
    await this.save();
    return this.ratings;
  }

  // Availability methods
  async setAvailability(dates) {
    this.availability = { ...this.availability, ...dates };
    await this.save();
    return this.availability;
  }

  isAvailable(date) {
    if (!this.availability || !this.availability[date]) {
      return true; // Assume available if not specified
    }
    return this.availability[date] > 0;
  }

  // Image methods
  async addImage(imageUrl) {
    if (!this.images.includes(imageUrl)) {
      this.images.push(imageUrl);
      await this.save();
    }
    return this.images;
  }

  async removeImage(imageUrl) {
    this.images = this.images.filter(img => img !== imageUrl);
    await this.save();
    return this.images;
  }

  // Validation methods
  validate() {
    const errors = [];

    if (!this.title.trim()) {
      errors.push('Title is required');
    }

    if (!this.description.trim()) {
      errors.push('Description is required');
    }

    if (!this.price || this.price < 0) {
      errors.push('Valid price is required');
    }

    if (!this.maxGroupSize || this.maxGroupSize < 1) {
      errors.push('Max group size must be at least 1');
    }

    if (!['easy', 'moderate', 'challenging', 'extreme'].includes(this.difficulty)) {
      errors.push('Difficulty must be easy, moderate, challenging, or extreme');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Trip;