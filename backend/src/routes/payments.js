const express = require('express');
const paymentsController = require('../controllers/paymentsController');
const { authenticate, authorize } = require('../middleware/auth');
const { rateLimiters } = require('../middleware/security');
const externalApiService = require('../services/externalApis');
const { catchAsync, AppError } = require('../middleware/errorHandler');

/**
 * Payments Routes
 * 
 * TripAdvisor-inspired payment processing and external API integrations
 * Includes Stripe simulation, Uganda payment methods, and travel APIs
 */

const router = express.Router();

// Apply rate limiting to payment routes
router.use(rateLimiters.api);

/**
 * Payment Processing Routes
 */

/**
 * @route   POST /api/payments/checkout
 * @desc    Create payment checkout session
 * @access  Private
 * @body    { bookingId, paymentMethod, returnUrl?, currency? }
 */
router.post('/checkout',
  authenticate,
  paymentsController.createCheckout
);

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle payment webhooks (Stripe, Mobile Money, etc.)
 * @access  Public (but signature verified)
 * @body    { event, data, signature }
 */
router.post('/webhook',
  // Don't apply authentication to webhooks
  express.raw({ type: 'application/json' }), // Store raw body for signature verification
  paymentsController.handleWebhook
);

/**
 * @route   GET /api/payments
 * @desc    Get user's payments
 * @access  Private
 * @query   { page?, limit?, status?, paymentMethod?, sortBy?, sortOrder? }
 */
router.get('/',
  authenticate,
  paymentsController.getUserPayments
);

/**
 * @route   GET /api/payments/:paymentId
 * @desc    Get payment status and details
 * @access  Private (Payment owner or Admin)
 * @params  { paymentId } - Payment ID
 */
router.get('/:paymentId',
  authenticate,
  paymentsController.getPaymentStatus
);

/**
 * @route   POST /api/payments/:paymentId/refund
 * @desc    Process payment refund
 * @access  Private (Payment owner or Admin)
 * @params  { paymentId } - Payment ID
 * @body    { amount?, reason }
 */
router.post('/:paymentId/refund',
  authenticate,
  paymentsController.processRefund
);

/**
 * External API Integration Routes
 */

/**
 * @route   GET /api/payments/external/maps/places/search
 * @desc    Search for places in Uganda using Google Maps
 * @access  Public
 * @query   { query, type? }
 */
router.get('/external/maps/places/search',
  catchAsync(async (req, res) => {
    const { query, type = 'tourist_attraction' } = req.query;
    
    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const result = await externalApiService.searchPlaces(query, type);
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * @route   GET /api/payments/external/maps/places/:placeId
 * @desc    Get detailed information about a specific place
 * @access  Public
 * @params  { placeId } - Google Places ID
 */
router.get('/external/maps/places/:placeId',
  catchAsync(async (req, res) => {
    const { placeId } = req.params;
    
    const result = await externalApiService.getPlaceDetails(placeId);
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * @route   GET /api/payments/external/maps/distance
 * @desc    Get distance and duration between locations
 * @access  Public
 * @query   { origins, destinations }
 */
router.get('/external/maps/distance',
  catchAsync(async (req, res) => {
    const { origins, destinations } = req.query;
    
    if (!origins || !destinations) {
      throw new AppError('Origins and destinations are required', 400);
    }

    const result = await externalApiService.getDistanceMatrix(origins, destinations);
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * @route   GET /api/payments/external/weather/current
 * @desc    Get current weather for Uganda location
 * @access  Public
 * @query   { city? }
 */
router.get('/external/weather/current',
  catchAsync(async (req, res) => {
    const { city = 'Kampala' } = req.query;
    
    const result = await externalApiService.getCurrentWeather(city);
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * @route   GET /api/payments/external/weather/forecast
 * @desc    Get weather forecast for Uganda location
 * @access  Public
 * @query   { city?, days? }
 */
router.get('/external/weather/forecast',
  catchAsync(async (req, res) => {
    const { city = 'Kampala', days = 5 } = req.query;
    
    const result = await externalApiService.getWeatherForecast(city, parseInt(days));
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * @route   GET /api/payments/external/exchange-rates
 * @desc    Get current exchange rates for Uganda Shilling
 * @access  Public
 * @query   { base? }
 */
router.get('/external/exchange-rates',
  catchAsync(async (req, res) => {
    const { base = 'USD' } = req.query;
    
    const result = await externalApiService.getExchangeRates(base);
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * @route   GET /api/payments/external/uganda/national-parks
 * @desc    Get Uganda national parks information
 * @access  Public
 */
router.get('/external/uganda/national-parks',
  catchAsync(async (req, res) => {
    const result = await externalApiService.getUgandaNationalParks();
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * @route   GET /api/payments/external/flights/entebbe
 * @desc    Get flight information for Entebbe International Airport
 * @access  Public
 * @query   { flightNumber? }
 */
router.get('/external/flights/entebbe',
  catchAsync(async (req, res) => {
    const { flightNumber } = req.query;
    
    const result = await externalApiService.getFlightInfo(flightNumber);
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  })
);

/**
 * Payment Method Information Routes
 */

/**
 * @route   GET /api/payments/methods
 * @desc    Get available payment methods and their details
 * @access  Public
 */
router.get('/methods',
  catchAsync(async (req, res) => {
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay securely with Visa, Mastercard, or American Express',
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        processingTime: 'Instant',
        fees: {
          percentage: 2.9,
          fixed: 30 // cents
        },
        icon: 'credit-card',
        enabled: true
      },
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Pay with MTN Mobile Money or Airtel Money',
        supportedCurrencies: ['UGX'],
        processingTime: 'Instant',
        fees: {
          percentage: 1.5,
          fixed: 0
        },
        providers: [
          {
            name: 'MTN Mobile Money',
            shortCode: '*165*3#',
            logo: 'mtn-logo.png'
          },
          {
            name: 'Airtel Money',
            shortCode: '*185*9#',
            logo: 'airtel-logo.png'
          }
        ],
        icon: 'mobile',
        enabled: true
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer to our account',
        supportedCurrencies: ['UGX', 'USD'],
        processingTime: '1-3 business days',
        fees: {
          percentage: 0,
          fixed: 0
        },
        bankDetails: {
          bankName: 'Stanbic Bank Uganda',
          accountName: 'Shakes Travel Limited',
          accountNumber: '9030012345678',
          swiftCode: 'SBICUGKX'
        },
        icon: 'bank',
        enabled: true
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        paymentMethods,
        defaultCurrency: 'UGX',
        supportedCurrencies: ['UGX', 'USD', 'EUR', 'GBP']
      }
    });
  })
);

/**
 * @route   GET /api/payments/fees/calculator
 * @desc    Calculate payment fees for different methods
 * @access  Public
 * @query   { amount, currency, method }
 */
router.get('/fees/calculator',
  catchAsync(async (req, res) => {
    const { amount, currency = 'UGX', method } = req.query;
    
    if (!amount) {
      throw new AppError('Amount is required', 400);
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      throw new AppError('Invalid amount', 400);
    }

    const feeCalculations = {
      stripe: {
        percentage: 2.9,
        fixed: currency === 'UGX' ? 1000 : (currency === 'USD' ? 0.30 : 0.25),
        total: Math.round(amountNumber * 0.029 + (currency === 'UGX' ? 1000 : (currency === 'USD' ? 0.30 : 0.25)))
      },
      mobile_money: {
        percentage: 1.5,
        fixed: 0,
        total: Math.round(amountNumber * 0.015)
      },
      bank_transfer: {
        percentage: 0,
        fixed: 0,
        total: 0
      }
    };

    const selectedFee = method ? feeCalculations[method] : feeCalculations;

    res.status(200).json({
      success: true,
      data: {
        amount: amountNumber,
        currency,
        fees: selectedFee,
        totalWithFees: method ? 
          amountNumber + selectedFee.total : 
          Object.keys(feeCalculations).reduce((acc, key) => {
            acc[key] = amountNumber + feeCalculations[key].total;
            return acc;
          }, {})
      }
    });
  })
);

module.exports = router;