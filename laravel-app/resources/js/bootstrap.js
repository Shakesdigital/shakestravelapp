/**
 * Bootstrap Laravel JavaScript configuration for ShakesTravel
 */

import axios from 'axios';
window.axios = axios;

// Set default Axios configuration
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// CSRF Token configuration
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Global error handling for API requests
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Handle common HTTP errors
            switch (error.response.status) {
                case 401:
                    // Unauthorized - redirect to login
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 422:
                    // Validation errors
                    console.error('Validation errors:', error.response.data);
                    break;
                case 500:
                    // Server error
                    console.error('Server error');
                    break;
                default:
                    console.error('Request failed:', error.response.data);
            }
        }
        
        return Promise.reject(error);
    }
);

// Global configuration
window.shakesTravel = window.shakesTravel || {};

// API configuration
window.shakesTravel.api = {
    baseUrl: '/api/v1',
    timeout: 10000
};

// Application configuration
window.shakesTravel.config = {
    currency: 'USD',
    locale: 'en-US',
    dateFormat: 'MM/dd/yyyy',
    timezone: 'UTC'
};