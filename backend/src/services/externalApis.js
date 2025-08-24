const axios = require('axios');
const { logger } = require('../utils/logger');

/**
 * External API Services
 * 
 * TripAdvisor-inspired integrations for travel services
 * Includes Google Maps, Weather API, and other travel-related services
 */

class ExternalAPIService {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    this.exchangeRateApiKey = process.env.EXCHANGE_RATE_API_KEY;
    
    // API base URLs
    this.googleMapsBaseUrl = 'https://maps.googleapis.com/maps/api';
    this.weatherBaseUrl = 'https://api.openweathermap.org/data/2.5';
    this.exchangeRateBaseUrl = 'https://api.exchangerate-api.com/v4/latest';
    
    // Uganda-specific configurations
    this.ugandaCenter = { lat: 1.3733, lng: 32.2903 }; // Kampala coordinates
    this.ugandaTimezone = 'Africa/Kampala';
  }

  /**
   * Google Maps API Integration
   */
  
  /**
   * Get place details for Uganda locations
   */
  async getPlaceDetails(placeId) {
    if (!this.googleMapsApiKey) {
      logger.warn('Google Maps API key not configured');
      return this.getMockPlaceDetails(placeId);
    }

    try {
      const url = `${this.googleMapsBaseUrl}/place/details/json`;
      const params = {
        place_id: placeId,
        fields: 'name,formatted_address,geometry,photos,rating,reviews,types,opening_hours,international_phone_number',
        key: this.googleMapsApiKey
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status === 'OK') {
        return {
          success: true,
          data: this.formatPlaceDetails(response.data.result)
        };
      } else {
        throw new Error(`Google Maps API error: ${response.data.status}`);
      }
    } catch (error) {
      logger.error('Google Maps API request failed', { 
        placeId, 
        error: error.message 
      });
      return this.getMockPlaceDetails(placeId);
    }
  }

  /**
   * Search for places in Uganda
   */
  async searchPlaces(query, type = 'tourist_attraction') {
    if (!this.googleMapsApiKey) {
      logger.warn('Google Maps API key not configured');
      return this.getMockPlaceSearch(query, type);
    }

    try {
      const url = `${this.googleMapsBaseUrl}/place/textsearch/json`;
      const params = {
        query: `${query} Uganda`,
        type: type,
        location: `${this.ugandaCenter.lat},${this.ugandaCenter.lng}`,
        radius: 500000, // 500km radius from Kampala
        key: this.googleMapsApiKey
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status === 'OK') {
        return {
          success: true,
          data: {
            places: response.data.results.map(place => this.formatPlaceDetails(place)),
            nextPageToken: response.data.next_page_token
          }
        };
      } else {
        throw new Error(`Google Maps API error: ${response.data.status}`);
      }
    } catch (error) {
      logger.error('Google Maps search failed', { 
        query, 
        type, 
        error: error.message 
      });
      return this.getMockPlaceSearch(query, type);
    }
  }

  /**
   * Get distance and duration between two points
   */
  async getDistanceMatrix(origins, destinations) {
    if (!this.googleMapsApiKey) {
      logger.warn('Google Maps API key not configured');
      return this.getMockDistanceMatrix(origins, destinations);
    }

    try {
      const url = `${this.googleMapsBaseUrl}/distancematrix/json`;
      const params = {
        origins: Array.isArray(origins) ? origins.join('|') : origins,
        destinations: Array.isArray(destinations) ? destinations.join('|') : destinations,
        units: 'metric',
        key: this.googleMapsApiKey
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status === 'OK') {
        return {
          success: true,
          data: response.data
        };
      } else {
        throw new Error(`Google Maps API error: ${response.data.status}`);
      }
    } catch (error) {
      logger.error('Distance matrix request failed', { 
        origins, 
        destinations, 
        error: error.message 
      });
      return this.getMockDistanceMatrix(origins, destinations);
    }
  }

  /**
   * Weather API Integration for Uganda
   */
  
  /**
   * Get current weather for Uganda location
   */
  async getCurrentWeather(city = 'Kampala') {
    if (!this.weatherApiKey) {
      logger.warn('Weather API key not configured');
      return this.getMockWeatherData(city);
    }

    try {
      const url = `${this.weatherBaseUrl}/weather`;
      const params = {
        q: `${city},Uganda`,
        appid: this.weatherApiKey,
        units: 'metric'
      };

      const response = await axios.get(url, { params });
      
      return {
        success: true,
        data: this.formatWeatherData(response.data)
      };
    } catch (error) {
      logger.error('Weather API request failed', { 
        city, 
        error: error.message 
      });
      return this.getMockWeatherData(city);
    }
  }

  /**
   * Get weather forecast for Uganda adventure planning
   */
  async getWeatherForecast(city = 'Kampala', days = 5) {
    if (!this.weatherApiKey) {
      logger.warn('Weather API key not configured');
      return this.getMockWeatherForecast(city, days);
    }

    try {
      const url = `${this.weatherBaseUrl}/forecast`;
      const params = {
        q: `${city},Uganda`,
        appid: this.weatherApiKey,
        units: 'metric',
        cnt: days * 8 // 8 forecasts per day (3-hour intervals)
      };

      const response = await axios.get(url, { params });
      
      return {
        success: true,
        data: this.formatForecastData(response.data)
      };
    } catch (error) {
      logger.error('Weather forecast request failed', { 
        city, 
        days, 
        error: error.message 
      });
      return this.getMockWeatherForecast(city, days);
    }
  }

  /**
   * Currency Exchange Rate API
   */
  
  /**
   * Get exchange rates for Uganda Shilling (UGX)
   */
  async getExchangeRates(baseCurrency = 'USD') {
    try {
      const url = `${this.exchangeRateBaseUrl}/${baseCurrency}`;
      const response = await axios.get(url);
      
      return {
        success: true,
        data: {
          base: response.data.base,
          date: response.data.date,
          rates: {
            UGX: response.data.rates.UGX,
            EUR: response.data.rates.EUR,
            GBP: response.data.rates.GBP,
            KES: response.data.rates.KES, // Kenya Shilling
            TZS: response.data.rates.TZS, // Tanzania Shilling
            RWF: response.data.rates.RWF  // Rwanda Franc
          }
        }
      };
    } catch (error) {
      logger.error('Exchange rate request failed', { 
        baseCurrency, 
        error: error.message 
      });
      return this.getMockExchangeRates(baseCurrency);
    }
  }

  /**
   * Uganda National Parks API Integration (Placeholder)
   */
  
  /**
   * Get Uganda national parks information
   */
  async getUgandaNationalParks() {
    // This would integrate with Uganda Wildlife Authority API if available
    return {
      success: true,
      data: {
        parks: [
          {
            id: 'qenp',
            name: 'Queen Elizabeth National Park',
            location: { lat: -0.2, lng: 29.9 },
            activities: ['Game drives', 'Boat safaris', 'Chimpanzee tracking'],
            entryFee: { citizens: 20000, residents: 30000, nonResidents: 40 }, // UGX/USD
            bestVisitTime: ['December-February', 'June-September'],
            wildlife: ['Lions', 'Elephants', 'Hippos', 'Crocodiles', 'Chimpanzees'],
            accommodation: ['Luxury lodges', 'Mid-range camps', 'Budget camping']
          },
          {
            id: 'mnp',
            name: 'Murchison Falls National Park',
            location: { lat: 2.2, lng: 31.8 },
            activities: ['Game drives', 'Boat trips', 'Hiking to falls'],
            entryFee: { citizens: 20000, residents: 30000, nonResidents: 45 },
            bestVisitTime: ['December-February', 'June-September'],
            wildlife: ['Giraffes', 'Lions', 'Elephants', 'Nile crocodiles'],
            accommodation: ['Luxury lodges', 'Mid-range lodges', 'Budget camps']
          },
          {
            id: 'binp',
            name: 'Bwindi Impenetrable National Park',
            location: { lat: -1.05, lng: 29.7 },
            activities: ['Gorilla trekking', 'Bird watching', 'Nature walks'],
            entryFee: { citizens: 20000, residents: 30000, nonResidents: 40 },
            gorillaPermit: { citizens: 250000, residents: 250000, nonResidents: 700 }, // UGX/USD
            bestVisitTime: ['June-August', 'December-February'],
            wildlife: ['Mountain gorillas', 'Chimpanzees', 'Forest elephants'],
            accommodation: ['Luxury eco-lodges', 'Mid-range lodges', 'Community camps']
          }
        ]
      }
    };
  }

  /**
   * Flight Information API (Placeholder)
   */
  
  /**
   * Get flight information for Entebbe International Airport
   */
  async getFlightInfo(flightNumber = null) {
    // This would integrate with aviation APIs like FlightAware or airline APIs
    return {
      success: true,
      data: {
        airport: {
          code: 'EBB',
          name: 'Entebbe International Airport',
          city: 'Entebbe',
          country: 'Uganda'
        },
        flights: [
          {
            flightNumber: 'KL565',
            airline: 'KLM',
            route: 'Amsterdam (AMS) - Entebbe (EBB)',
            status: 'On Time',
            scheduledArrival: '2024-12-01T23:25:00Z',
            estimatedArrival: '2024-12-01T23:25:00Z',
            terminal: 'Main Terminal'
          },
          {
            flightNumber: 'ET338',
            airline: 'Ethiopian Airlines',
            route: 'Addis Ababa (ADD) - Entebbe (EBB)',
            status: 'On Time',
            scheduledArrival: '2024-12-01T14:15:00Z',
            estimatedArrival: '2024-12-01T14:15:00Z',
            terminal: 'Main Terminal'
          }
        ]
      }
    };
  }

  // Mock data methods for when APIs are not available

  getMockPlaceDetails(placeId) {
    return {
      success: true,
      data: {
        placeId,
        name: 'Mock Location in Uganda',
        address: 'Sample Address, Uganda',
        coordinates: { lat: 1.3733, lng: 32.2903 },
        rating: 4.2,
        photos: [],
        types: ['tourist_attraction'],
        openingHours: null
      }
    };
  }

  getMockPlaceSearch(query, type) {
    return {
      success: true,
      data: {
        places: [
          {
            name: `${query} - Sample Location`,
            address: 'Sample Address, Uganda',
            coordinates: { lat: 1.3733, lng: 32.2903 },
            rating: 4.5,
            types: [type]
          }
        ]
      }
    };
  }

  getMockDistanceMatrix(origins, destinations) {
    return {
      success: true,
      data: {
        rows: [
          {
            elements: [
              {
                distance: { text: '150 km', value: 150000 },
                duration: { text: '2 hours 30 mins', value: 9000 },
                status: 'OK'
              }
            ]
          }
        ]
      }
    };
  }

  getMockWeatherData(city) {
    return {
      success: true,
      data: {
        city,
        country: 'Uganda',
        temperature: 24,
        description: 'Partly cloudy',
        humidity: 75,
        windSpeed: 8,
        visibility: 10,
        uvIndex: 7,
        sunrise: '06:45',
        sunset: '18:45',
        bestForActivities: true
      }
    };
  }

  getMockWeatherForecast(city, days) {
    const forecast = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: { min: 18 + i, max: 28 + i },
        description: i % 2 === 0 ? 'Sunny' : 'Partly cloudy',
        humidity: 70 + i * 2,
        chanceOfRain: i * 10,
        windSpeed: 5 + i
      });
    }
    
    return {
      success: true,
      data: { city, forecast }
    };
  }

  getMockExchangeRates(baseCurrency) {
    return {
      success: true,
      data: {
        base: baseCurrency,
        date: new Date().toISOString().split('T')[0],
        rates: {
          UGX: 3700.50,
          EUR: 0.85,
          GBP: 0.73,
          KES: 110.25,
          TZS: 2450.00,
          RWF: 1050.75
        }
      }
    };
  }

  // Data formatting methods

  formatPlaceDetails(place) {
    return {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      coordinates: {
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng
      },
      rating: place.rating,
      photos: place.photos?.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      })) || [],
      types: place.types || [],
      openingHours: place.opening_hours,
      phoneNumber: place.international_phone_number
    };
  }

  formatWeatherData(data) {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      visibility: data.visibility / 1000, // Convert to km
      uvIndex: null, // Not available in current weather
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { timeZone: this.ugandaTimezone }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { timeZone: this.ugandaTimezone }),
      bestForActivities: data.main.temp > 20 && data.main.temp < 30 && data.weather[0].main !== 'Rain'
    };
  }

  formatForecastData(data) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temperatures: [],
          descriptions: [],
          humidity: [],
          chanceOfRain: 0,
          windSpeed: []
        };
      }
      
      dailyForecasts[date].temperatures.push(item.main.temp);
      dailyForecasts[date].descriptions.push(item.weather[0].description);
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].windSpeed.push(item.wind.speed);
      
      if (item.weather[0].main === 'Rain') {
        dailyForecasts[date].chanceOfRain += 12.5; // Each forecast represents 3 hours
      }
    });
    
    const forecast = Object.values(dailyForecasts).map(day => ({
      date: day.date,
      temperature: {
        min: Math.round(Math.min(...day.temperatures)),
        max: Math.round(Math.max(...day.temperatures))
      },
      description: day.descriptions[0], // Use first description of the day
      humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
      chanceOfRain: Math.min(100, day.chanceOfRain),
      windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length)
    }));
    
    return {
      city: data.city.name,
      forecast
    };
  }
}

module.exports = new ExternalAPIService();