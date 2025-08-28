const { netlifyDB } = require('../../config/netlify-db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(data) {
    this._id = data._id || netlifyDB.generateId();
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.phoneNumber = data.phoneNumber || '';
    this.dateOfBirth = data.dateOfBirth || null;
    this.profileImage = data.profileImage || '';
    this.role = data.role || 'user';
    this.isVerified = data.isVerified || false;
    this.preferences = data.preferences || {};
    this.wishlist = data.wishlist || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Static methods
  static async create(userData) {
    const user = new User(userData);
    
    // Hash password if provided
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    return await netlifyDB.create('users', user._id, user.toObject());
  }

  static async findById(id) {
    const userData = await netlifyDB.findById('users', id);
    return userData ? new User(userData) : null;
  }

  static async findByEmail(email) {
    const users = await netlifyDB.findByField('users', 'email', email);
    return users.length > 0 ? new User(users[0]) : null;
  }

  static async findAll(options = {}) {
    const users = await netlifyDB.findAll('users', options);
    return users.map(userData => new User(userData));
  }

  static async search(searchTerm) {
    const users = await netlifyDB.search('users', searchTerm, ['firstName', 'lastName', 'email']);
    return users.map(userData => new User(userData));
  }

  static async deleteById(id) {
    return await netlifyDB.delete('users', id);
  }

  // Instance methods
  async save() {
    this.updatedAt = new Date().toISOString();
    
    if (await netlifyDB.exists('users', this._id)) {
      return await netlifyDB.update('users', this._id, this.toObject());
    } else {
      return await netlifyDB.create('users', this._id, this.toObject());
    }
  }

  async update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return await netlifyDB.update('users', this._id, this.toObject());
  }

  async delete() {
    return await netlifyDB.delete('users', this._id);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  generateAuthToken() {
    const payload = {
      id: this._id,
      email: this.email,
      role: this.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  toObject() {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      profileImage: this.profileImage,
      role: this.role,
      isVerified: this.isVerified,
      preferences: this.preferences,
      wishlist: this.wishlist,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toJSON() {
    const obj = this.toObject();
    // Remove sensitive data
    delete obj.password;
    return obj;
  }

  // Wishlist methods
  async addToWishlist(itemId, itemType = 'trip') {
    if (!this.wishlist.some(item => item.id === itemId)) {
      this.wishlist.push({
        id: itemId,
        type: itemType,
        addedAt: new Date().toISOString()
      });
      await this.save();
    }
    return this.wishlist;
  }

  async removeFromWishlist(itemId) {
    this.wishlist = this.wishlist.filter(item => item.id !== itemId);
    await this.save();
    return this.wishlist;
  }

  // Validation methods
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return password && password.length >= 6;
  }

  validate() {
    const errors = [];

    if (!this.firstName.trim()) {
      errors.push('First name is required');
    }

    if (!this.lastName.trim()) {
      errors.push('Last name is required');
    }

    if (!User.validateEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (!User.validatePassword(this.password)) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = User;