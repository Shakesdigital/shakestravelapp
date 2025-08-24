const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { cache, CacheKeys, CacheTTL } = require('./cache');

// Rate limiting configurations for external APIs
const rateLimiters = {
  maps: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many map requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),
  
  payments: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 payment requests per minute
    message: 'Too many payment requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),
  
  weather: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 weather requests per minute
    message: 'Too many weather requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),
};

// External API configurations
const apiConfigs = {
  google: {
    maps: {
      baseURL: 'https://maps.googleapis.com/maps/api',
      key: process.env.GOOGLE_MAPS_API_KEY,
      timeout: 5000,
      retries: 3,
    },
    places: {
      baseURL: 'https://places.googleapis.com/v1',
      key: process.env.GOOGLE_MAPS_API_KEY,
      timeout: 5000,
      retries: 3,
    },
  },
  
  stripe: {
    baseURL: 'https://api.stripe.com/v1',
    key: process.env.STRIPE_SECRET_KEY,
    timeout: 10000,
    retries: 2,
  },
  
  weather: {
    baseURL: 'https://api.openweathermap.org/data/2.5',
    key: process.env.OPENWEATHER_API_KEY,
    timeout: 3000,
    retries: 2,
  },

  currencyExchange: {
    baseURL: 'https://api.exchangerate-api.com/v4/latest',
    timeout: 3000,
    retries: 2,
  },
};

// Error types for better handling
class ExternalAPIError extends Error {
  constructor(message, apiName, statusCode, retryable = false) {
    super(message);
    this.name = 'ExternalAPIError';
    this.apiName = apiName;
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}

// Retry logic with exponential backoff
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries || !error.retryable) {
        throw error;
      }
      
      const backoffDelay = delay * Math.pow(2, i) + Math.random() * 1000;
      console.warn(`Retry ${i + 1}/${retries} after ${backoffDelay}ms for ${error.apiName}`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}

// Google Maps API integration
class GoogleMapsAPI {
  constructor() {
    this.config = apiConfigs.google.maps;
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
    });
  }

  async geocode(address) {
    const cacheKey = `geocode:${address.toLowerCase()}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    return retryWithBackoff(async () => {
      try {
        const response = await this.client.get('/geocode/json', {
          params: {
            address: address,
            key: this.config.key,
            components: 'country:UG', // Restrict to Uganda
          },
        });

        if (response.data.status !== 'OK') {
          throw new ExternalAPIError(
            `Geocoding failed: ${response.data.status}`,
            'google-maps',
            400,
            response.data.status === 'OVER_QUERY_LIMIT'
          );
        }

        const result = {
          formatted_address: response.data.results[0]?.formatted_address,
          location: response.data.results[0]?.geometry?.location,
          place_id: response.data.results[0]?.place_id,
        };

        // Cache successful results for 7 days
        await cache.set(cacheKey, result, 7 * 24 * 60 * 60);
        return result;

      } catch (error) {
        if (error instanceof ExternalAPIError) {
          throw error;
        }

        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalAPIError(
          `Google Maps API error: ${error.message}`,
          'google-maps',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }

  async getPlaceDetails(placeId) {
    const cacheKey = `place:${placeId}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    return retryWithBackoff(async () => {
      try {
        const response = await this.client.get('/place/details/json', {
          params: {
            place_id: placeId,
            key: this.config.key,
            fields: 'name,formatted_address,geometry,photos,rating,reviews,website,international_phone_number',
          },
        });

        if (response.data.status !== 'OK') {
          throw new ExternalAPIError(
            `Place details failed: ${response.data.status}`,
            'google-places',
            400,
            response.data.status === 'OVER_QUERY_LIMIT'
          );
        }

        const result = response.data.result;
        
        // Cache for 24 hours
        await cache.set(cacheKey, result, CacheTTL.VERY_LONG);
        return result;

      } catch (error) {
        if (error instanceof ExternalAPIError) {
          throw error;
        }

        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalAPIError(
          `Google Places API error: ${error.message}`,
          'google-places',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }

  async searchNearbyPlaces(lat, lng, radius = 5000, type = 'tourist_attraction') {
    const cacheKey = `nearby:${lat}:${lng}:${radius}:${type}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    return retryWithBackoff(async () => {
      try {
        const response = await this.client.get('/place/nearbysearch/json', {
          params: {
            location: `${lat},${lng}`,
            radius: radius,
            type: type,
            key: this.config.key,
          },
        });

        if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
          throw new ExternalAPIError(
            `Nearby search failed: ${response.data.status}`,
            'google-places',
            400,
            response.data.status === 'OVER_QUERY_LIMIT'
          );
        }

        const result = response.data.results || [];
        
        // Cache for 6 hours
        await cache.set(cacheKey, result, CacheTTL.LONG);
        return result;

      } catch (error) {
        if (error instanceof ExternalAPIError) {
          throw error;
        }

        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalAPIError(
          `Google Nearby Search API error: ${error.message}`,
          'google-places',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }
}

// Stripe Payment API integration
class StripeAPI {
  constructor() {
    this.config = apiConfigs.stripe;
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    return retryWithBackoff(async () => {
      try {
        const response = await this.client.post('/payment_intents', new URLSearchParams({
          amount: amount.toString(),
          currency: currency,
          'metadata[booking_id]': metadata.booking_id || '',
          'metadata[user_id]': metadata.user_id || '',
          'metadata[item_type]': metadata.item_type || '',
          'metadata[item_id]': metadata.item_id || '',
        }));

        return {
          id: response.data.id,
          client_secret: response.data.client_secret,
          amount: response.data.amount,
          currency: response.data.currency,
          status: response.data.status,
        };

      } catch (error) {
        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalAPIError(
          `Stripe payment intent error: ${error.response?.data?.error?.message || error.message}`,
          'stripe',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }

  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    return retryWithBackoff(async () => {
      try {
        const response = await this.client.post(`/payment_intents/${paymentIntentId}/confirm`, 
          new URLSearchParams({
            payment_method: paymentMethodId,
          })
        );

        return {
          id: response.data.id,
          status: response.data.status,
          amount_received: response.data.amount_received,
          charges: response.data.charges.data.map(charge => ({
            id: charge.id,
            status: charge.status,
            receipt_url: charge.receipt_url,
          })),
        };

      } catch (error) {
        const statusCode = error.response?.status || 500;
        
        throw new ExternalAPIError(
          `Stripe payment confirmation error: ${error.response?.data?.error?.message || error.message}`,
          'stripe',
          statusCode,
          false // Payment errors usually shouldn't be retried
        );
      }
    }, 1); // Only retry once for payments
  }

  async createCustomer(email, name, metadata = {}) {
    return retryWithBackoff(async () => {
      try {
        const response = await this.client.post('/customers', new URLSearchParams({
          email: email,
          name: name,
          'metadata[user_id]': metadata.user_id || '',
        }));

        return {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          created: response.data.created,
        };

      } catch (error) {
        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500;
        
        throw new ExternalAPIError(
          `Stripe customer creation error: ${error.response?.data?.error?.message || error.message}`,
          'stripe',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }

  async getPaymentIntent(paymentIntentId) {
    return retryWithBackoff(async () => {
      try {
        const response = await this.client.get(`/payment_intents/${paymentIntentId}`);

        return {
          id: response.data.id,
          status: response.data.status,
          amount: response.data.amount,
          currency: response.data.currency,
          metadata: response.data.metadata,
          charges: response.data.charges.data,
        };

      } catch (error) {
        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500;
        
        throw new ExternalAPIError(
          `Stripe get payment intent error: ${error.response?.data?.error?.message || error.message}`,
          'stripe',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }
}

// Weather API integration
class WeatherAPI {
  constructor() {
    this.config = apiConfigs.weather;
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
    });
  }

  async getCurrentWeather(lat, lng) {
    const cacheKey = `weather:current:${lat}:${lng}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    return retryWithBackoff(async () => {
      try {
        const response = await this.client.get('/weather', {
          params: {
            lat: lat,
            lon: lng,
            appid: this.config.key,
            units: 'metric',
          },
        });

        const result = {
          temperature: response.data.main.temp,
          feels_like: response.data.main.feels_like,
          humidity: response.data.main.humidity,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
          wind_speed: response.data.wind.speed,
          visibility: response.data.visibility,
          location: response.data.name,
        };

        // Cache weather data for 30 minutes
        await cache.set(cacheKey, result, 30 * 60);
        return result;

      } catch (error) {
        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalAPIError(
          `Weather API error: ${error.message}`,
          'weather',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }

  async getForecast(lat, lng, days = 5) {
    const cacheKey = `weather:forecast:${lat}:${lng}:${days}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    return retryWithBackoff(async () => {
      try {
        const response = await this.client.get('/forecast', {
          params: {
            lat: lat,
            lon: lng,
            appid: this.config.key,
            units: 'metric',
            cnt: days * 8, // 8 forecasts per day (3-hour intervals)
          },
        });

        const result = response.data.list.map(item => ({
          datetime: new Date(item.dt * 1000).toISOString(),
          temperature: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
        }));

        // Cache forecast for 2 hours
        await cache.set(cacheKey, result, 2 * 60 * 60);
        return result;

      } catch (error) {
        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalAPIError(
          `Weather Forecast API error: ${error.message}`,
          'weather',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }
}

// Currency Exchange API
class CurrencyAPI {
  constructor() {
    this.config = apiConfigs.currencyExchange;
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
    });
  }

  async getExchangeRates(baseCurrency = 'USD') {
    const cacheKey = CacheKeys.rates(baseCurrency, 'all');
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    return retryWithBackoff(async () => {
      try {
        const response = await this.client.get(`/${baseCurrency}`);

        const result = {
          base: response.data.base,
          date: response.data.date,
          rates: response.data.rates,
        };

        // Cache exchange rates for 6 hours
        await cache.set(cacheKey, result, CacheTTL.LONG);
        return result;

      } catch (error) {
        const statusCode = error.response?.status || 500;
        const retryable = statusCode >= 500 || statusCode === 429;
        
        throw new ExternalAPIError(
          `Currency API error: ${error.message}`,
          'currency',
          statusCode,
          retryable
        );
      }
    }, this.config.retries);
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const rates = await this.getExchangeRates(fromCurrency);
      const rate = rates.rates[toCurrency];
      
      if (!rate) {
        throw new ExternalAPIError(
          `Currency ${toCurrency} not supported`,
          'currency',
          400,
          false
        );
      }

      return {
        amount,
        fromCurrency,
        toCurrency,
        rate,
        convertedAmount: amount * rate,
        date: rates.date,
      };
    } catch (error) {
      if (error instanceof ExternalAPIError) {
        throw error;
      }
      throw new ExternalAPIError(
        `Currency conversion error: ${error.message}`,
        'currency',
        500,
        true
      );
    }
  }
}

// API instances
const googleMaps = new GoogleMapsAPI();
const stripe = new StripeAPI();
const weather = new WeatherAPI();
const currency = new CurrencyAPI();

// Middleware for handling external API errors
const handleExternalAPIError = (error, req, res, next) => {
  if (error instanceof ExternalAPIError) {
    console.error(`External API Error [${error.apiName}]:`, error.message);
    
    return res.status(error.statusCode || 500).json({
      success: false,
      error: {
        message: error.message,
        api: error.apiName,
        retryable: error.retryable,
        timestamp: new Date().toISOString(),
      },
    });
  }

  next(error);
};

// Health check for all external APIs
async function healthCheckExternalAPIs() {
  const results = {};
  
  try {
    // Test Google Maps (simple geocoding)
    await googleMaps.geocode('Kampala, Uganda');
    results.googleMaps = { status: 'healthy', latency: 'low' };
  } catch (error) {
    results.googleMaps = { status: 'error', error: error.message };
  }

  try {
    // Test weather API
    await weather.getCurrentWeather(0.3476, 32.5825); // Kampala coordinates
    results.weather = { status: 'healthy', latency: 'low' };
  } catch (error) {
    results.weather = { status: 'error', error: error.message };
  }

  try {
    // Test currency API
    await currency.getExchangeRates('USD');
    results.currency = { status: 'healthy', latency: 'low' };
  } catch (error) {
    results.currency = { status: 'error', error: error.message };
  }

  // Stripe health check is more complex and requires actual API key validation
  results.stripe = { status: 'configured', hasKey: !!process.env.STRIPE_SECRET_KEY };

  return results;
}

module.exports = {
  googleMaps,
  stripe,
  weather,
  currency,
  rateLimiters,
  handleExternalAPIError,
  healthCheckExternalAPIs,
  ExternalAPIError,
};