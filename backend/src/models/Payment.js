const mongoose = require('mongoose');

/**
 * Payment Schema - Comprehensive payment tracking with Stripe integration
 * 
 * Features:
 * - Stripe payment intent and charge tracking
 * - Multi-payment method support
 * - Refund and dispute handling
 * - Payment history and audit trail
 * - Webhook event tracking
 * - Fraud prevention and security
 * - Multi-currency support
 * - Installment and partial payment support
 */

const paymentSchema = new mongoose.Schema({
  // Booking Reference
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required'],
    index: true
  },

  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Payment Identification
  paymentNumber: {
    type: String,
    unique: true,
    uppercase: true,
    index: true
  },

  // Payment Amount Details
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },

  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'UGX', 'EUR', 'GBP', 'KES', 'TZS'],
    default: 'USD',
    index: true
  },

  // Amount breakdown for transparency
  breakdown: {
    baseAmount: { type: Number, default: 0 },
    taxes: [{
      name: String,
      percentage: Number,
      amount: Number
    }],
    fees: [{
      name: String, // e.g., 'processing_fee', 'service_fee'
      amount: Number,
      description: String
    }],
    discounts: [{
      name: String,
      amount: Number,
      code: String
    }]
  },

  // Payment Method Information
  paymentMethod: {
    type: {
      type: String,
      required: [true, 'Payment method type is required'],
      enum: [
        'card',              // Credit/debit card
        'bank_transfer',     // Direct bank transfer
        'mobile_money',      // Mobile money (MTN, Airtel)
        'paypal',           // PayPal
        'apple_pay',        // Apple Pay
        'google_pay',       // Google Pay
        'cash',             // Cash payment
        'voucher',          // Gift voucher/credit
        'crypto'            // Cryptocurrency
      ],
      index: true
    },
    
    // Card payment details (masked for security)
    card: {
      last4: String,
      brand: String, // 'visa', 'mastercard', 'amex'
      country: String,
      expMonth: Number,
      expYear: Number,
      fingerprint: String,
      funding: String // 'credit', 'debit', 'prepaid'
    },
    
    // Mobile money details
    mobileMoney: {
      provider: String, // 'mtn', 'airtel', 'mpesa'
      phoneNumber: String,
      reference: String
    },
    
    // Bank transfer details
    bankTransfer: {
      bankName: String,
      accountNumber: String,
      reference: String,
      swiftCode: String
    },
    
    // Digital wallet details
    wallet: {
      provider: String, // 'paypal', 'apple_pay', 'google_pay'
      email: String,
      reference: String
    }
  },

  // Payment Provider Details
  provider: {
    name: {
      type: String,
      required: [true, 'Payment provider is required'],
      enum: ['stripe', 'paypal', 'flutterwave', 'paystack', 'razorpay', 'manual'],
      index: true
    },
    
    // Stripe-specific data
    stripe: {
      paymentIntentId: {
        type: String,
        index: true
      },
      chargeId: {
        type: String,
        index: true
      },
      customerId: String,
      paymentMethodId: String,
      setupIntentId: String,
      balanceTransactionId: String,
      receiptUrl: String,
      description: String
    },
    
    // PayPal-specific data
    paypal: {
      orderId: String,
      paymentId: String,
      payerId: String,
      facilitatorAccessToken: String
    },
    
    // Flutterwave-specific data
    flutterwave: {
      transactionId: String,
      txRef: String,
      flwRef: String,
      deviceFingerprint: String
    },
    
    // Generic provider data
    transactionId: String,
    reference: String,
    metadata: mongoose.Schema.Types.Mixed
  },

  // Payment Status
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: [
      'pending',              // Payment initiated but not processed
      'processing',           // Payment being processed
      'requires_action',      // Requires additional authentication (3D Secure)
      'succeeded',           // Payment completed successfully
      'failed',              // Payment failed
      'cancelled',           // Payment cancelled by user
      'refunded',            // Payment refunded
      'partially_refunded',  // Partial refund processed
      'disputed',            // Payment disputed/charged back
      'expired'              // Payment intent expired
    ],
    default: 'pending',
    index: true
  },

  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    reason: String,
    providerResponse: mongoose.Schema.Types.Mixed
  }],

  // Payment Intent and Processing
  intent: {
    type: String,
    enum: ['payment', 'setup', 'refund', 'partial_refund'],
    default: 'payment'
  },

  // Failure Information
  failure: {
    code: String,
    message: String,
    declineCode: String,
    networkStatus: String,
    reason: String,
    type: String // 'card_error', 'validation_error', 'api_error'
  },

  // Refund Information
  refunds: [{
    refundId: String, // Provider refund ID
    amount: {
      type: Number,
      required: true,
      min: [0, 'Refund amount cannot be negative']
    },
    currency: String,
    reason: {
      type: String,
      enum: [
        'duplicate', 'fraudulent', 'requested_by_customer',
        'cancelled_booking', 'service_not_provided', 'other'
      ]
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'cancelled'],
      default: 'pending'
    },
    processedAt: Date,
    expectedAt: Date,
    receiptNumber: String,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Dispute/Chargeback Information
  disputes: [{
    disputeId: String, // Provider dispute ID
    amount: Number,
    currency: String,
    reason: String,
    status: String, // 'warning_needs_response', 'warning_closed', 'needs_response', 'won', 'lost'
    evidence: {
      submittedAt: Date,
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      documents: [String], // URLs to evidence documents
      description: String
    },
    createdAt: Date,
    dueBy: Date
  }],

  // Security and Fraud Detection
  security: {
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    riskScore: Number, // 0-100
    fraudPrevention: {
      cvcCheck: String, // 'pass', 'fail', 'unavailable'
      addressLine1Check: String,
      addressPostalCodeCheck: String,
      threeDSecure: {
        authenticated: Boolean,
        succeeded: Boolean,
        version: String
      }
    },
    ipAddress: String,
    userAgent: String,
    deviceFingerprint: String
  },

  // Timeline and Dates
  dates: {
    initiated: { type: Date, default: Date.now },
    authorized: Date,
    captured: Date,
    settled: Date,
    failed: Date,
    refunded: Date,
    disputed: Date
  },

  // Installment and Partial Payments
  installment: {
    isInstallment: { type: Boolean, default: false },
    currentInstallment: Number,
    totalInstallments: Number,
    installmentAmount: Number,
    nextDueDate: Date,
    schedule: [{
      installmentNumber: Number,
      amount: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue', 'cancelled'],
        default: 'pending'
      },
      paidAt: Date,
      paymentId: String
    }]
  },

  // Receipt and Documentation
  receipt: {
    number: String,
    url: String,
    emailSent: { type: Boolean, default: false },
    emailSentAt: Date,
    downloadCount: { type: Number, default: 0 },
    lastDownloadAt: Date
  },

  // Webhook Events Tracking
  webhookEvents: [{
    eventId: String,
    eventType: String,
    providerId: String,
    data: mongoose.Schema.Types.Mixed,
    processedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['received', 'processed', 'failed'],
      default: 'received'
    }
  }],

  // Customer Communication
  notifications: {
    confirmationSent: { type: Boolean, default: false },
    receiptSent: { type: Boolean, default: false },
    failureNotificationSent: { type: Boolean, default: false },
    refundNotificationSent: { type: Boolean, default: false }
  },

  // Administrative
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false }
  }],

  // Reconciliation
  reconciliation: {
    isReconciled: { type: Boolean, default: false },
    reconciledAt: Date,
    reconciledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    discrepancies: [String],
    bankStatementReference: String
  },

  // Metadata
  metadata: {
    source: String, // 'web', 'mobile', 'admin'
    campaignId: String,
    affiliateId: String,
    customFields: mongoose.Schema.Types.Mixed
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimal query performance

// Basic indexes
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentNumber: 1 }, { unique: true });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'provider.name': 1 });
paymentSchema.index({ createdAt: -1 });

// Payment provider specific indexes
paymentSchema.index({ 'provider.stripe.paymentIntentId': 1 });
paymentSchema.index({ 'provider.stripe.chargeId': 1 });
paymentSchema.index({ 'provider.transactionId': 1 });

// Amount and currency indexes
paymentSchema.index({ amount: 1 });
paymentSchema.index({ currency: 1, amount: 1 });

// Date-based indexes
paymentSchema.index({ 'dates.initiated': -1 });
paymentSchema.index({ 'dates.captured': -1 });

// Security and fraud indexes
paymentSchema.index({ 'security.riskLevel': 1 });
paymentSchema.index({ 'security.ipAddress': 1 });

// Compound indexes for complex queries
paymentSchema.index({ userId: 1, status: 1, createdAt: -1 });
paymentSchema.index({ bookingId: 1, status: 1 });
paymentSchema.index({ status: 1, 'provider.name': 1 });
paymentSchema.index({ currency: 1, status: 1, 'dates.captured': -1 });

// Virtual fields
paymentSchema.virtual('isSuccessful').get(function() {
  return this.status === 'succeeded';
});

paymentSchema.virtual('isFailed').get(function() {
  return ['failed', 'cancelled', 'expired'].includes(this.status);
});

paymentSchema.virtual('isPending').get(function() {
  return ['pending', 'processing', 'requires_action'].includes(this.status);
});

paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'succeeded')
    .reduce((total, refund) => total + refund.amount, 0);
});

paymentSchema.virtual('netAmount').get(function() {
  return this.amount - this.totalRefunded;
});

paymentSchema.virtual('isPartiallyRefunded').get(function() {
  const refunded = this.totalRefunded;
  return refunded > 0 && refunded < this.amount;
});

paymentSchema.virtual('isFullyRefunded').get(function() {
  return this.totalRefunded >= this.amount;
});

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  // Generate payment number if not provided
  if (!this.paymentNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Generate random 6-digit number
    const random = Math.floor(100000 + Math.random() * 900000);
    
    this.paymentNumber = `PAY${year}${month}${day}${random}`;
  }
  
  next();
});

paymentSchema.pre('save', function(next) {
  // Update status history if status changed
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      reason: 'Status updated'
    });
  }
  
  next();
});

// Instance methods
paymentSchema.methods.updateStatus = function(newStatus, reason = null, providerResponse = null) {
  this.statusHistory.push({
    status: this.status,
    timestamp: new Date(),
    reason,
    providerResponse
  });
  
  this.status = newStatus;
  
  // Update relevant dates
  const now = new Date();
  switch (newStatus) {
    case 'succeeded':
      this.dates.captured = now;
      break;
    case 'failed':
      this.dates.failed = now;
      break;
    case 'refunded':
      this.dates.refunded = now;
      break;
    case 'disputed':
      this.dates.disputed = now;
      break;
  }
  
  return this.save();
};

paymentSchema.methods.addRefund = function(refundData) {
  this.refunds.push({
    ...refundData,
    processedAt: new Date()
  });
  
  // Update payment status if fully refunded
  const totalRefunded = this.refunds
    .filter(r => r.status === 'succeeded')
    .reduce((sum, r) => sum + r.amount, 0);
  
  if (totalRefunded >= this.amount) {
    this.status = 'refunded';
  } else if (totalRefunded > 0) {
    this.status = 'partially_refunded';
  }
  
  return this.save();
};

paymentSchema.methods.addDispute = function(disputeData) {
  this.disputes.push({
    ...disputeData,
    createdAt: new Date()
  });
  
  if (this.status !== 'disputed') {
    this.status = 'disputed';
  }
  
  return this.save();
};

paymentSchema.methods.recordWebhookEvent = function(eventData) {
  this.webhookEvents.push({
    ...eventData,
    processedAt: new Date()
  });
  
  return this.save();
};

paymentSchema.methods.generateReceipt = function() {
  if (!this.receipt.number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    
    this.receipt.number = `REC-${year}${month}${day}-${random}`;
  }
  
  return {
    receiptNumber: this.receipt.number,
    paymentNumber: this.paymentNumber,
    amount: this.amount,
    currency: this.currency,
    paymentMethod: this.paymentMethod.type,
    status: this.status,
    date: this.dates.captured || this.createdAt,
    breakdown: this.breakdown
  };
};

// Static methods
paymentSchema.statics.findByPaymentNumber = function(paymentNumber) {
  return this.findOne({ paymentNumber: paymentNumber.toUpperCase() });
};

paymentSchema.statics.findByStripePaymentIntent = function(paymentIntentId) {
  return this.findOne({ 'provider.stripe.paymentIntentId': paymentIntentId });
};

paymentSchema.statics.findByTransactionId = function(transactionId) {
  return this.findOne({ 'provider.transactionId': transactionId });
};

paymentSchema.statics.getPaymentsByUser = function(userId, status = null) {
  const query = { userId };
  if (status) query.status = status;
  
  return this.find(query).sort({ createdAt: -1 });
};

paymentSchema.statics.getPaymentsByBooking = function(bookingId) {
  return this.find({ bookingId }).sort({ createdAt: -1 });
};

paymentSchema.statics.getRevenueStats = function(startDate, endDate, currency = 'USD') {
  return this.aggregate([
    {
      $match: {
        status: 'succeeded',
        currency,
        'dates.captured': { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
        averagePayment: { $avg: '$amount' },
        totalRefunded: { 
          $sum: {
            $reduce: {
              input: '$refunds',
              initialValue: 0,
              in: {
                $cond: [
                  { $eq: ['$$this.status', 'succeeded'] },
                  { $add: ['$$value', '$$this.amount'] },
                  '$$value'
                ]
              }
            }
          }
        }
      }
    },
    {
      $addFields: {
        netRevenue: { $subtract: ['$totalRevenue', '$totalRefunded'] }
      }
    }
  ]);
};

paymentSchema.statics.getFailedPayments = function(hours = 24) {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - hours);
  
  return this.find({
    status: 'failed',
    createdAt: { $gte: cutoffDate }
  }).populate('userId', 'firstName lastName email');
};

paymentSchema.statics.getPendingRefunds = function() {
  return this.find({
    'refunds.status': 'pending'
  }).populate('userId', 'firstName lastName email');
};

paymentSchema.statics.getDisputedPayments = function() {
  return this.find({
    status: 'disputed'
  }).populate('userId bookingId');
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;