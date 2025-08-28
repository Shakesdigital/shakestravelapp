const { netlifyDB } = require('../../config/netlify-db');

class Booking {
  constructor(data) {
    this._id = data._id || netlifyDB.generateId();
    this.userId = data.userId || '';
    this.tripId = data.tripId || '';
    this.accommodationId = data.accommodationId || null;
    this.bookingDate = data.bookingDate || new Date().toISOString();
    this.travelDate = data.travelDate || '';
    this.numberOfGuests = data.numberOfGuests || 1;
    this.guestDetails = data.guestDetails || [];
    this.totalAmount = data.totalAmount || 0;
    this.currency = data.currency || 'USD';
    this.paymentStatus = data.paymentStatus || 'pending';
    this.paymentId = data.paymentId || '';
    this.bookingStatus = data.bookingStatus || 'confirmed';
    this.specialRequests = data.specialRequests || '';
    this.emergencyContact = data.emergencyContact || {};
    this.cancellationReason = data.cancellationReason || '';
    this.refundAmount = data.refundAmount || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Static methods
  static async create(bookingData) {
    const booking = new Booking(bookingData);
    return await netlifyDB.create('bookings', booking._id, booking.toObject());
  }

  static async findById(id) {
    const bookingData = await netlifyDB.findById('bookings', id);
    return bookingData ? new Booking(bookingData) : null;
  }

  static async findByUserId(userId, options = {}) {
    const bookings = await netlifyDB.findByField('bookings', 'userId', userId, options);
    return bookings.map(bookingData => new Booking(bookingData));
  }

  static async findByTripId(tripId, options = {}) {
    const bookings = await netlifyDB.findByField('bookings', 'tripId', tripId, options);
    return bookings.map(bookingData => new Booking(bookingData));
  }

  static async findByPaymentId(paymentId) {
    const bookings = await netlifyDB.findByField('bookings', 'paymentId', paymentId);
    return bookings.length > 0 ? new Booking(bookings[0]) : null;
  }

  static async findAll(options = {}) {
    const bookings = await netlifyDB.findAll('bookings', options);
    return bookings.map(bookingData => new Booking(bookingData));
  }

  static async findByStatus(status, options = {}) {
    const bookings = await netlifyDB.findByField('bookings', 'bookingStatus', status, options);
    return bookings.map(bookingData => new Booking(bookingData));
  }

  static async findByPaymentStatus(status, options = {}) {
    const bookings = await netlifyDB.findByField('bookings', 'paymentStatus', status, options);
    return bookings.map(bookingData => new Booking(bookingData));
  }

  static async findByDateRange(startDate, endDate, options = {}) {
    const allBookings = await Booking.findAll(options);
    return allBookings.filter(booking => {
      const travelDate = new Date(booking.travelDate);
      return travelDate >= new Date(startDate) && travelDate <= new Date(endDate);
    });
  }

  static async deleteById(id) {
    return await netlifyDB.delete('bookings', id);
  }

  // Instance methods
  async save() {
    this.updatedAt = new Date().toISOString();
    
    if (await netlifyDB.exists('bookings', this._id)) {
      return await netlifyDB.update('bookings', this._id, this.toObject());
    } else {
      return await netlifyDB.create('bookings', this._id, this.toObject());
    }
  }

  async update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return await netlifyDB.update('bookings', this._id, this.toObject());
  }

  async delete() {
    return await netlifyDB.delete('bookings', this._id);
  }

  async cancel(reason = '') {
    this.bookingStatus = 'cancelled';
    this.cancellationReason = reason;
    this.updatedAt = new Date().toISOString();
    return await this.save();
  }

  async confirm() {
    this.bookingStatus = 'confirmed';
    this.updatedAt = new Date().toISOString();
    return await this.save();
  }

  async complete() {
    this.bookingStatus = 'completed';
    this.updatedAt = new Date().toISOString();
    return await this.save();
  }

  async updatePaymentStatus(status, paymentId = '') {
    this.paymentStatus = status;
    if (paymentId) {
      this.paymentId = paymentId;
    }
    this.updatedAt = new Date().toISOString();
    return await this.save();
  }

  async processRefund(amount) {
    this.refundAmount = amount;
    this.paymentStatus = 'refunded';
    this.bookingStatus = 'cancelled';
    this.updatedAt = new Date().toISOString();
    return await this.save();
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      tripId: this.tripId,
      accommodationId: this.accommodationId,
      bookingDate: this.bookingDate,
      travelDate: this.travelDate,
      numberOfGuests: this.numberOfGuests,
      guestDetails: this.guestDetails,
      totalAmount: this.totalAmount,
      currency: this.currency,
      paymentStatus: this.paymentStatus,
      paymentId: this.paymentId,
      bookingStatus: this.bookingStatus,
      specialRequests: this.specialRequests,
      emergencyContact: this.emergencyContact,
      cancellationReason: this.cancellationReason,
      refundAmount: this.refundAmount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toJSON() {
    return this.toObject();
  }

  // Utility methods
  canBeCancelled() {
    const travelDate = new Date(this.travelDate);
    const now = new Date();
    const timeDiff = travelDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff >= 3 && this.bookingStatus === 'confirmed';
  }

  calculateRefundAmount() {
    const travelDate = new Date(this.travelDate);
    const now = new Date();
    const timeDiff = travelDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff >= 14) {
      return this.totalAmount * 0.9; // 10% cancellation fee
    } else if (daysDiff >= 7) {
      return this.totalAmount * 0.5; // 50% refund
    } else if (daysDiff >= 3) {
      return this.totalAmount * 0.25; // 25% refund
    } else {
      return 0; // No refund
    }
  }

  isUpcoming() {
    const travelDate = new Date(this.travelDate);
    const now = new Date();
    return travelDate > now && this.bookingStatus === 'confirmed';
  }

  isPast() {
    const travelDate = new Date(this.travelDate);
    const now = new Date();
    return travelDate < now;
  }

  // Validation methods
  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.tripId) {
      errors.push('Trip ID is required');
    }

    if (!this.travelDate) {
      errors.push('Travel date is required');
    }

    if (this.numberOfGuests < 1) {
      errors.push('Number of guests must be at least 1');
    }

    if (this.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0');
    }

    const validPaymentStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(this.paymentStatus)) {
      errors.push('Invalid payment status');
    }

    const validBookingStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validBookingStatuses.includes(this.bookingStatus)) {
      errors.push('Invalid booking status');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Booking;