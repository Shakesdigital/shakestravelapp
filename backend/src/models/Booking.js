const mongoose = require('mongoose');

/**
 * Booking Schema - Unified booking system for trips and accommodations
 * 
 * Features:
 * - Polymorphic references to Trip or Accommodation
 * - Comprehensive guest and participant management
 * - Multi-stage booking workflow
 * - Payment tracking and integration
 * - Cancellation and refund handling
 * - Communication history
 * - Document management (vouchers, tickets)
 * - Review and rating prompts
 */

const bookingSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Polymorphic Reference to Trip or Accommodation
  itemType: {
    type: String,
    required: [true, 'Item type is required'],
    enum: {
      values: ['trip', 'accommodation'],
      message: 'Item type must be either trip or accommodation'
    },
    index: true
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Item ID is required'],
    refPath: 'itemType',
    index: true
  },

  // Booking Reference Numbers
  bookingNumber: {
    type: String,
    unique: true,
    uppercase: true,
    index: true
  },

  confirmationCode: {
    type: String,
    unique: true,
    uppercase: true,
    index: true
  },

  // Trip-Specific Booking Details
  tripDetails: {
    availabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: function() { return this.itemType === 'trip'; }
    },
    startDate: {
      type: Date,
      required: function() { return this.itemType === 'trip'; },
      index: true
    },
    endDate: {
      type: Date,
      required: function() { return this.itemType === 'trip'; },
      validate: {
        validator: function(endDate) {
          return !this.tripDetails.startDate || endDate >= this.tripDetails.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    participants: [{
      name: {
        type: String,
        required: [true, 'Participant name is required'],
        trim: true
      },
      age: {
        type: Number,
        required: [true, 'Participant age is required'],
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age cannot exceed 120']
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say']
      },
      nationality: {
        type: String,
        trim: true
      },
      passportNumber: {
        type: String,
        trim: true
      },
      dietaryRequirements: [String],
      medicalConditions: [String],
      emergencyContact: {
        name: String,
        phone: String,
        relationship: String
      },
      isMainBooker: {
        type: Boolean,
        default: false
      }
    }],
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    pickupLocation: String,
    transportation: {
      required: { type: Boolean, default: false },
      details: String
    }
  },

  // Accommodation-Specific Booking Details
  accommodationDetails: {
    checkIn: {
      type: Date,
      required: function() { return this.itemType === 'accommodation'; },
      index: true
    },
    checkOut: {
      type: Date,
      required: function() { return this.itemType === 'accommodation'; },
      validate: {
        validator: function(checkOut) {
          return !this.accommodationDetails.checkIn || checkOut > this.accommodationDetails.checkIn;
        },
        message: 'Check-out date must be after check-in date'
      }
    },
    rooms: [{
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      roomType: {
        type: String,
        required: true
      },
      guests: {
        adults: {
          type: Number,
          required: true,
          min: [1, 'At least one adult is required']
        },
        children: {
          type: Number,
          default: 0,
          min: [0, 'Children count cannot be negative']
        }
      },
      guestDetails: [{
        name: {
          type: String,
          required: true,
          trim: true
        },
        age: {
          type: Number,
          required: true,
          min: [0, 'Age cannot be negative']
        },
        isMainGuest: {
          type: Boolean,
          default: false
        }
      }],
      pricePerNight: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
      },
      totalNights: {
        type: Number,
        required: true,
        min: [1, 'Must be at least one night']
      }
    }],
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    arrivalTime: String,
    guestPreferences: {
      bedType: String,
      floorPreference: String,
      smokingRoom: { type: Boolean, default: false },
      accessibilityNeeds: [String]
    }
  },

  // Dates (Generic)
  dates: {
    requested: {
      start: Date,
      end: Date
    },
    confirmed: {
      start: Date,
      end: Date
    }
  },

  // Pricing and Payment Details
  pricing: {
    baseAmount: {
      type: Number,
      required: [true, 'Base amount is required'],
      min: [0, 'Base amount cannot be negative']
    },
    
    breakdown: {
      itemPrice: { type: Number, default: 0 },
      taxes: [{
        name: String,
        percentage: Number,
        amount: Number
      }],
      fees: [{
        name: String,
        amount: Number,
        description: String
      }],
      discounts: [{
        name: String,
        type: String, // 'percentage' or 'fixed'
        value: Number,
        amount: Number,
        code: String
      }],
      extras: [{
        name: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number
      }]
    },
    
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    
    currency: {
      type: String,
      enum: ['USD', 'UGX', 'EUR', 'GBP'],
      default: 'USD'
    },
    
    paymentSchedule: [{
      description: {
        type: String,
        required: true // e.g., 'deposit', 'balance', 'full payment'
      },
      amount: {
        type: Number,
        required: true,
        min: [0, 'Payment amount cannot be negative']
      },
      dueDate: {
        type: Date,
        required: true
      },
      isPaid: {
        type: Boolean,
        default: false
      },
      paidAt: Date,
      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
      }
    }]
  },

  // Booking Status Management
  status: {
    type: String,
    enum: [
      'pending',           // Initial booking request
      'payment_pending',   // Awaiting payment
      'confirmed',         // Booking confirmed and paid
      'checked_in',        // Guest has checked in (accommodations)
      'in_progress',       // Trip/stay is ongoing
      'completed',         // Trip/stay completed successfully
      'cancelled',         // Cancelled by user or host
      'no_show',          // Guest didn't show up
      'refunded'          // Refund processed
    ],
    default: 'pending',
    index: true
  },

  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    notes: String
  }],

  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone format']
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    }
  },

  // Cancellation Details
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledByRole: {
      type: String,
      enum: ['guest', 'host', 'admin']
    },
    reason: {
      type: String,
      enum: [
        'personal_emergency', 'travel_restrictions', 'weather_conditions',
        'health_issues', 'work_commitments', 'financial_constraints',
        'changed_plans', 'found_alternative', 'host_cancelled',
        'system_error', 'fraud_prevention', 'other'
      ]
    },
    reasonText: String,
    refund: {
      eligibleAmount: { type: Number, default: 0 },
      processedAmount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'denied'],
        default: 'pending'
      },
      processedAt: Date,
      method: String, // 'original_payment', 'bank_transfer', 'voucher'
      reference: String
    }
  },

  // Communication History
  communications: [{
    from: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['guest', 'host', 'admin'],
        required: true
      }
    },
    to: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['guest', 'host', 'admin'],
        required: true
      }
    },
    type: {
      type: String,
      enum: ['message', 'notification', 'reminder', 'update', 'request'],
      default: 'message'
    },
    subject: String,
    message: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number
    }]
  }],

  // Documents and Attachments
  documents: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'voucher', 'ticket', 'invoice', 'receipt', 'confirmation',
        'itinerary', 'insurance', 'passport', 'visa', 'medical_certificate'
      ],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: String, // Cloudinary public ID
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }],

  // Review and Rating
  review: {
    isEligible: {
      type: Boolean,
      default: false
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderSentAt: Date,
    submitted: {
      type: Boolean,
      default: false
    },
    submittedAt: Date,
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review' // If you have a separate Review model
    }
  },

  // Notifications and Reminders
  notifications: {
    confirmationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    followUpSent: { type: Boolean, default: false },
    reviewReminderSent: { type: Boolean, default: false }
  },

  // Emergency Information
  emergency: {
    contact: {
      name: String,
      phone: String,
      relationship: String
    },
    medicalInfo: String,
    insurance: {
      provider: String,
      policyNumber: String,
      coverage: String
    }
  },

  // Host/Provider Information (denormalized for quick access)
  provider: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    email: String,
    phone: String,
    businessName: String
  },

  // Administrative Fields
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'email', 'partner', 'admin'],
    default: 'website'
  },

  referenceNumber: String, // External system reference
  
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],

  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: String,
    browser: String,
    referrer: String
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimal query performance

// Basic indexes
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ itemType: 1, itemId: 1 });
bookingSchema.index({ bookingNumber: 1 }, { unique: true });
bookingSchema.index({ confirmationCode: 1 }, { unique: true });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Date-based indexes
bookingSchema.index({ 'tripDetails.startDate': 1 });
bookingSchema.index({ 'accommodationDetails.checkIn': 1 });
bookingSchema.index({ 'dates.confirmed.start': 1 });

// Provider/host indexes
bookingSchema.index({ 'provider.id': 1, status: 1 });
bookingSchema.index({ 'provider.id': 1, createdAt: -1 });

// Payment tracking indexes
bookingSchema.index({ 'pricing.paymentSchedule.dueDate': 1, 'pricing.paymentSchedule.isPaid': 1 });

// Communication indexes
bookingSchema.index({ 'communications.isRead': 1, 'communications.timestamp': -1 });

// Compound indexes for complex queries
bookingSchema.index({ userId: 1, itemType: 1, status: 1 });
bookingSchema.index({ itemType: 1, itemId: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Virtual fields
bookingSchema.virtual('totalNights').get(function() {
  if (this.itemType === 'accommodation' && this.accommodationDetails.checkIn && this.accommodationDetails.checkOut) {
    const checkIn = new Date(this.accommodationDetails.checkIn);
    const checkOut = new Date(this.accommodationDetails.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }
  return null;
});

bookingSchema.virtual('totalDays').get(function() {
  if (this.itemType === 'trip' && this.tripDetails.startDate && this.tripDetails.endDate) {
    const start = new Date(this.tripDetails.startDate);
    const end = new Date(this.tripDetails.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }
  return null;
});

bookingSchema.virtual('totalGuests').get(function() {
  if (this.itemType === 'trip') {
    return this.tripDetails.participants.length;
  } else if (this.itemType === 'accommodation') {
    return this.accommodationDetails.rooms.reduce((total, room) => 
      total + room.guests.adults + room.guests.children, 0
    );
  }
  return 0;
});

bookingSchema.virtual('isActive').get(function() {
  return ['confirmed', 'checked_in', 'in_progress'].includes(this.status);
});

bookingSchema.virtual('isPending').get(function() {
  return ['pending', 'payment_pending'].includes(this.status);
});

bookingSchema.virtual('isCompleted').get(function() {
  return ['completed', 'cancelled', 'no_show', 'refunded'].includes(this.status);
});

bookingSchema.virtual('remainingBalance').get(function() {
  const totalPaid = this.pricing.paymentSchedule
    .filter(payment => payment.isPaid)
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  return this.pricing.totalAmount - totalPaid;
});

// Pre-save middleware
bookingSchema.pre('save', async function(next) {
  // Generate booking number if not provided
  if (!this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Generate random 4-digit number
    const random = Math.floor(1000 + Math.random() * 9000);
    
    this.bookingNumber = `BK${year}${month}${day}${random}`;
  }
  
  // Generate confirmation code if not provided
  if (!this.confirmationCode) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.confirmationCode = code;
  }
  
  next();
});

bookingSchema.pre('save', function(next) {
  // Set main booker/guest flags
  if (this.itemType === 'trip' && this.tripDetails.participants.length > 0) {
    const hasMainBooker = this.tripDetails.participants.some(p => p.isMainBooker);
    if (!hasMainBooker) {
      this.tripDetails.participants[0].isMainBooker = true;
    }
  }
  
  if (this.itemType === 'accommodation') {
    this.accommodationDetails.rooms.forEach(room => {
      if (room.guestDetails.length > 0) {
        const hasMainGuest = room.guestDetails.some(g => g.isMainGuest);
        if (!hasMainGuest) {
          room.guestDetails[0].isMainGuest = true;
        }
      }
    });
  }
  
  next();
});

// Pre-save middleware to populate provider information
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('itemId')) {
    let item;
    
    if (this.itemType === 'trip') {
      item = await mongoose.model('Trip').findById(this.itemId).populate('providerId');
      if (item) {
        this.provider = {
          id: item.providerId._id,
          name: `${item.providerId.firstName} ${item.providerId.lastName}`,
          email: item.providerId.email,
          phone: item.providerId.phone,
          businessName: item.providerId.hostProfile?.businessInfo?.companyName
        };
      }
    } else if (this.itemType === 'accommodation') {
      item = await mongoose.model('Accommodation').findById(this.itemId).populate('hostId');
      if (item) {
        this.provider = {
          id: item.hostId._id,
          name: `${item.hostId.firstName} ${item.hostId.lastName}`,
          email: item.hostId.email,
          phone: item.hostId.phone,
          businessName: item.hostId.hostProfile?.businessInfo?.companyName
        };
      }
    }
  }
  
  next();
});

// Instance methods
bookingSchema.methods.updateStatus = function(newStatus, changedBy, reason, notes) {
  this.statusHistory.push({
    status: this.status,
    changedAt: new Date(),
    changedBy,
    reason,
    notes
  });
  
  this.status = newStatus;
  return this.save();
};

bookingSchema.methods.addCommunication = function(communicationData) {
  this.communications.push({
    ...communicationData,
    timestamp: new Date()
  });
  
  return this.save();
};

bookingSchema.methods.calculateRefundAmount = function() {
  const now = new Date();
  let refundPercentage = 0;
  
  // Get cancellation policy from the booked item
  // This would need to be populated or fetched
  
  // Simple cancellation policy logic
  if (this.itemType === 'trip') {
    const daysUntilTrip = Math.ceil((this.tripDetails.startDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilTrip >= 30) {
      refundPercentage = 0.9; // 90% refund
    } else if (daysUntilTrip >= 14) {
      refundPercentage = 0.5; // 50% refund
    } else if (daysUntilTrip >= 7) {
      refundPercentage = 0.25; // 25% refund
    } else {
      refundPercentage = 0; // No refund
    }
  }
  
  return this.pricing.totalAmount * refundPercentage;
};

bookingSchema.methods.processRefund = async function(amount, method = 'original_payment') {
  this.cancellation.refund = {
    eligibleAmount: amount,
    processedAmount: amount,
    status: 'processing',
    method,
    processedAt: new Date()
  };
  
  // Here you would integrate with payment processor
  // For now, just mark as completed
  this.cancellation.refund.status = 'completed';
  
  return this.save();
};

bookingSchema.methods.markPaymentReceived = function(paymentScheduleIndex, paymentId) {
  if (this.pricing.paymentSchedule[paymentScheduleIndex]) {
    this.pricing.paymentSchedule[paymentScheduleIndex].isPaid = true;
    this.pricing.paymentSchedule[paymentScheduleIndex].paidAt = new Date();
    this.pricing.paymentSchedule[paymentScheduleIndex].paymentId = paymentId;
    
    // Check if all payments are complete
    const allPaid = this.pricing.paymentSchedule.every(payment => payment.isPaid);
    if (allPaid && this.status === 'payment_pending') {
      this.status = 'confirmed';
    }
  }
  
  return this.save();
};

bookingSchema.methods.generateVoucher = function() {
  // Generate booking voucher/confirmation document
  return {
    bookingNumber: this.bookingNumber,
    confirmationCode: this.confirmationCode,
    guestName: `${this.contactInfo.firstName} ${this.contactInfo.lastName}`,
    itemType: this.itemType,
    dates: this.itemType === 'trip' 
      ? { start: this.tripDetails.startDate, end: this.tripDetails.endDate }
      : { start: this.accommodationDetails.checkIn, end: this.accommodationDetails.checkOut },
    totalAmount: this.pricing.totalAmount,
    status: this.status,
    generatedAt: new Date()
  };
};

// Static methods
bookingSchema.statics.findByBookingNumber = function(bookingNumber) {
  return this.findOne({ bookingNumber: bookingNumber.toUpperCase() });
};

bookingSchema.statics.findByConfirmationCode = function(confirmationCode) {
  return this.findOne({ confirmationCode: confirmationCode.toUpperCase() });
};

bookingSchema.statics.getUpcomingBookings = function(userId, days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    userId,
    status: { $in: ['confirmed', 'checked_in'] },
    $or: [
      { 'tripDetails.startDate': { $lte: futureDate } },
      { 'accommodationDetails.checkIn': { $lte: futureDate } }
    ]
  }).sort({ createdAt: -1 });
};

bookingSchema.statics.getBookingsByProvider = function(providerId, status = null) {
  const query = { 'provider.id': providerId };
  if (status) query.status = status;
  
  return this.find(query).sort({ createdAt: -1 });
};

bookingSchema.statics.getBookingsRequiringPayment = function() {
  const now = new Date();
  
  return this.find({
    status: 'payment_pending',
    'pricing.paymentSchedule': {
      $elemMatch: {
        dueDate: { $lte: now },
        isPaid: false
      }
    }
  });
};

bookingSchema.statics.getRevenueStats = function(providerId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'provider.id': mongoose.Types.ObjectId(providerId),
        status: { $in: ['confirmed', 'completed'] },
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.totalAmount' },
        totalBookings: { $sum: 1 },
        averageBookingValue: { $avg: '$pricing.totalAmount' }
      }
    }
  ]);
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;