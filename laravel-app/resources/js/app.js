import './bootstrap';
import Alpine from 'alpinejs';

// Alpine.js plugins
import focus from '@alpinejs/focus';
import collapse from '@alpinejs/collapse';

// Register Alpine plugins
Alpine.plugin(focus);
Alpine.plugin(collapse);

// Alpine.js global data and methods
Alpine.data('app', () => ({
    // Global app state
    loading: false,
    notifications: [],
    
    // Navigation state
    mobileMenuOpen: false,
    userMenuOpen: false,
    
    // Search functionality
    searchQuery: '',
    searchResults: [],
    searchLoading: false,
    
    // Wishlist functionality
    wishlistItems: [],
    
    // Booking functionality
    bookingData: {
        guests: 1,
        startDate: null,
        endDate: null,
        specialRequests: ''
    },
    
    // Methods
    init() {
        this.loadWishlist();
        this.setupEventListeners();
    },
    
    // Notification methods
    showNotification(message, type = 'success') {
        const notification = {
            id: Date.now(),
            message,
            type,
            show: true
        };
        
        this.notifications.push(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 5000);
    },
    
    removeNotification(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
            this.notifications[index].show = false;
            setTimeout(() => {
                this.notifications.splice(index, 1);
            }, 300);
        }
    },
    
    // Search methods
    async performSearch(query) {
        if (!query || query.length < 2) {
            this.searchResults = [];
            return;
        }
        
        this.searchLoading = true;
        
        try {
            const response = await fetch(`/api/v1/trips/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.searchResults = data.data.slice(0, 5); // Limit to 5 results
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            this.searchLoading = false;
        }
    },
    
    // Wishlist methods
    loadWishlist() {
        const saved = localStorage.getItem('shakestravelapp_wishlist');
        if (saved) {
            this.wishlistItems = JSON.parse(saved);
        }
    },
    
    saveWishlist() {
        localStorage.setItem('shakestravelapp_wishlist', JSON.stringify(this.wishlistItems));
    },
    
    toggleWishlist(item) {
        const index = this.wishlistItems.findIndex(w => w.id === item.id && w.type === item.type);
        
        if (index > -1) {
            this.wishlistItems.splice(index, 1);
            this.showNotification('Removed from wishlist', 'info');
        } else {
            this.wishlistItems.push({
                id: item.id,
                type: item.type,
                title: item.title,
                image: item.image,
                price: item.price
            });
            this.showNotification('Added to wishlist', 'success');
        }
        
        this.saveWishlist();
    },
    
    isInWishlist(item) {
        return this.wishlistItems.some(w => w.id === item.id && w.type === item.type);
    },
    
    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },
    
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    setupEventListeners() {
        // Handle escape key for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.mobileMenuOpen = false;
                this.userMenuOpen = false;
            }
        });
        
        // Handle clicks outside dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('[data-dropdown]')) {
                this.userMenuOpen = false;
            }
        });
    }
}));

// Search component
Alpine.data('search', () => ({
    query: '',
    results: [],
    loading: false,
    showResults: false,
    
    async search() {
        if (this.query.length < 2) {
            this.results = [];
            this.showResults = false;
            return;
        }
        
        this.loading = true;
        this.showResults = true;
        
        try {
            const params = new URLSearchParams({
                q: this.query,
                limit: 8
            });
            
            const response = await fetch(`/api/v1/trips/search?${params}`);
            const data = await response.json();
            
            if (data.success) {
                this.results = data.data;
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            this.loading = false;
        }
    },
    
    selectResult(result) {
        window.location.href = result.url;
    },
    
    clearResults() {
        setTimeout(() => {
            this.showResults = false;
        }, 200);
    }
}));

// Image gallery component
Alpine.data('imageGallery', (images) => ({
    images: images || [],
    currentIndex: 0,
    showLightbox: false,
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    
    prev() {
        this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    },
    
    goTo(index) {
        this.currentIndex = index;
    },
    
    openLightbox(index = null) {
        if (index !== null) {
            this.currentIndex = index;
        }
        this.showLightbox = true;
        document.body.style.overflow = 'hidden';
    },
    
    closeLightbox() {
        this.showLightbox = false;
        document.body.style.overflow = '';
    }
}));

// Booking widget component
Alpine.data('bookingWidget', (trip) => ({
    trip: trip,
    guests: 1,
    startDate: '',
    endDate: '',
    specialRequests: '',
    loading: false,
    totalPrice: 0,
    
    init() {
        this.calculatePrice();
    },
    
    calculatePrice() {
        if (this.trip && this.guests) {
            this.totalPrice = this.trip.base_price * this.guests;
            
            // Apply group discounts if available
            if (this.trip.pricing && this.trip.pricing.group_discounts) {
                for (const discount of this.trip.pricing.group_discounts) {
                    if (this.guests >= discount.min_size) {
                        this.totalPrice *= (1 - discount.discount_percentage / 100);
                    }
                }
            }
        }
    },
    
    async checkAvailability() {
        if (!this.startDate) return;
        
        try {
            const response = await fetch(`/api/v1/trips/${this.trip.id}/availability?date=${this.startDate}`);
            const data = await response.json();
            
            return data.available;
        } catch (error) {
            console.error('Availability check error:', error);
            return false;
        }
    },
    
    async submitBooking() {
        if (!this.startDate || this.guests < 1) {
            this.$dispatch('show-notification', {
                message: 'Please fill in all required fields',
                type: 'error'
            });
            return;
        }
        
        this.loading = true;
        
        try {
            const response = await fetch('/api/v1/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    bookable_type: 'trip',
                    bookable_id: this.trip.id,
                    start_date: this.startDate,
                    end_date: this.endDate || this.startDate,
                    group_size: this.guests,
                    special_requests: this.specialRequests
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                window.location.href = `/bookings/${data.data.id}/checkout`;
            } else {
                throw new Error(data.message || 'Booking failed');
            }
        } catch (error) {
            this.$dispatch('show-notification', {
                message: error.message || 'Booking failed. Please try again.',
                type: 'error'
            });
        } finally {
            this.loading = false;
        }
    }
}));

// Rating component
Alpine.data('rating', (initialRating = 0, readonly = false) => ({
    rating: initialRating,
    hoveredRating: 0,
    readonly: readonly,
    
    setRating(value) {
        if (!this.readonly) {
            this.rating = value;
            this.$dispatch('rating-changed', { rating: value });
        }
    },
    
    hoverRating(value) {
        if (!this.readonly) {
            this.hoveredRating = value;
        }
    },
    
    clearHover() {
        this.hoveredRating = 0;
    },
    
    getStarClass(index) {
        const rating = this.hoveredRating || this.rating;
        return index <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300';
    }
}));

// Initialize Alpine
window.Alpine = Alpine;
Alpine.start();

// Global utility functions
window.shakesTravel = {
    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format date
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
            .format(new Date(date));
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    },
    
    // Share functionality
    async share(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
        
        // Fallback to copying URL
        if (data.url) {
            return await this.copyToClipboard(data.url);
        }
        
        return false;
    }
};

// Service Worker registration
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}