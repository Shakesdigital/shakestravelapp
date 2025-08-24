<?php

use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\TripController;
use App\Http\Controllers\Web\AccommodationController;
use App\Http\Controllers\Web\BookingController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\Host\HostDashboardController;
use App\Http\Controllers\Web\Admin\AdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/search', [HomeController::class, 'search'])->name('search');

// Trips
Route::prefix('trips')->name('trips.')->group(function () {
    Route::get('/', [TripController::class, 'index'])->name('index');
    Route::get('/category/{category}', [TripController::class, 'category'])->name('category');
    Route::get('/{trip:slug}', [TripController::class, 'show'])->name('show');
});

// Accommodations
Route::prefix('accommodations')->name('accommodations.')->group(function () {
    Route::get('/', [AccommodationController::class, 'index'])->name('index');
    Route::get('/{accommodation:slug}', [AccommodationController::class, 'show'])->name('show');
});

// Static Pages
Route::view('/about', 'pages.about')->name('about');
Route::view('/contact', 'pages.contact')->name('contact');
Route::view('/travel-guide', 'pages.travel-guide')->name('travel-guide');
Route::view('/privacy-policy', 'pages.privacy-policy')->name('privacy-policy');
Route::view('/terms-of-service', 'pages.terms-of-service')->name('terms-of-service');

// Authentication Routes (handled by Laravel Breeze/Jetstream)
Auth::routes(['verify' => true]);

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Profile Management
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'show'])->name('show');
        Route::get('/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::get('/bookings', [ProfileController::class, 'bookings'])->name('bookings');
        Route::get('/reviews', [ProfileController::class, 'reviews'])->name('reviews');
        Route::get('/wishlist', [ProfileController::class, 'wishlist'])->name('wishlist');
    });

    // Booking Management
    Route::prefix('bookings')->name('bookings.')->group(function () {
        Route::get('/', [BookingController::class, 'index'])->name('index');
        Route::get('/create/{type}/{id}', [BookingController::class, 'create'])->name('create');
        Route::post('/', [BookingController::class, 'store'])->name('store');
        Route::get('/{booking}', [BookingController::class, 'show'])->name('show');
        Route::post('/{booking}/cancel', [BookingController::class, 'cancel'])->name('cancel');
        Route::get('/{booking}/checkout', [BookingController::class, 'checkout'])->name('checkout');
        Route::post('/{booking}/payment', [BookingController::class, 'processPayment'])->name('payment');
    });

    // Host Routes
    Route::middleware(['role:host|admin'])->prefix('host')->name('host.')->group(function () {
        Route::get('/dashboard', [HostDashboardController::class, 'index'])->name('dashboard');
        
        // Trip Management
        Route::prefix('trips')->name('trips.')->group(function () {
            Route::get('/', [HostDashboardController::class, 'trips'])->name('index');
            Route::get('/create', [HostDashboardController::class, 'createTrip'])->name('create');
            Route::post('/', [HostDashboardController::class, 'storeTrip'])->name('store');
            Route::get('/{trip}/edit', [HostDashboardController::class, 'editTrip'])->name('edit');
            Route::put('/{trip}', [HostDashboardController::class, 'updateTrip'])->name('update');
            Route::delete('/{trip}', [HostDashboardController::class, 'deleteTrip'])->name('delete');
        });
        
        // Accommodation Management
        Route::prefix('accommodations')->name('accommodations.')->group(function () {
            Route::get('/', [HostDashboardController::class, 'accommodations'])->name('index');
            Route::get('/create', [HostDashboardController::class, 'createAccommodation'])->name('create');
            Route::post('/', [HostDashboardController::class, 'storeAccommodation'])->name('store');
            Route::get('/{accommodation}/edit', [HostDashboardController::class, 'editAccommodation'])->name('edit');
            Route::put('/{accommodation}', [HostDashboardController::class, 'updateAccommodation'])->name('update');
            Route::delete('/{accommodation}', [HostDashboardController::class, 'deleteAccommodation'])->name('delete');
        });
        
        // Booking Management for Hosts
        Route::prefix('bookings')->name('bookings.')->group(function () {
            Route::get('/', [HostDashboardController::class, 'bookings'])->name('index');
            Route::get('/{booking}', [HostDashboardController::class, 'showBooking'])->name('show');
            Route::post('/{booking}/confirm', [HostDashboardController::class, 'confirmBooking'])->name('confirm');
            Route::post('/{booking}/reject', [HostDashboardController::class, 'rejectBooking'])->name('reject');
        });
        
        // Reviews Management
        Route::prefix('reviews')->name('reviews.')->group(function () {
            Route::get('/', [HostDashboardController::class, 'reviews'])->name('index');
            Route::post('/{review}/respond', [HostDashboardController::class, 'respondToReview'])->name('respond');
        });
    });

    // Admin Routes
    Route::middleware(['role:admin|superadmin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
        
        // User Management
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [AdminController::class, 'users'])->name('index');
            Route::get('/{user}', [AdminController::class, 'showUser'])->name('show');
            Route::post('/{user}/suspend', [AdminController::class, 'suspendUser'])->name('suspend');
            Route::post('/{user}/activate', [AdminController::class, 'activateUser'])->name('activate');
            Route::post('/{user}/verify-host', [AdminController::class, 'verifyHost'])->name('verify-host');
        });
        
        // Content Management
        Route::prefix('content')->name('content.')->group(function () {
            Route::get('/trips', [AdminController::class, 'trips'])->name('trips');
            Route::get('/accommodations', [AdminController::class, 'accommodations'])->name('accommodations');
            Route::get('/reviews', [AdminController::class, 'reviews'])->name('reviews');
            Route::post('/trips/{trip}/feature', [AdminController::class, 'featureTrip'])->name('feature-trip');
            Route::post('/accommodations/{accommodation}/feature', [AdminController::class, 'featureAccommodation'])->name('feature-accommodation');
        });
        
        // Analytics & Reports
        Route::prefix('analytics')->name('analytics.')->group(function () {
            Route::get('/', [AdminController::class, 'analytics'])->name('index');
            Route::get('/bookings', [AdminController::class, 'bookingAnalytics'])->name('bookings');
            Route::get('/revenue', [AdminController::class, 'revenueAnalytics'])->name('revenue');
            Route::get('/users', [AdminController::class, 'userAnalytics'])->name('users');
        });
        
        // Settings
        Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
        Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
    });
});

// Guest Application to become Host
Route::middleware(['auth', 'role:guest'])->group(function () {
    Route::get('/become-host', [ProfileController::class, 'becomeHost'])->name('become-host');
    Route::post('/apply-host', [ProfileController::class, 'applyHost'])->name('apply-host');
});

// Webhook Routes (exclude from CSRF)
Route::post('/webhooks/stripe', [BookingController::class, 'stripeWebhook'])->name('webhooks.stripe');
Route::post('/webhooks/paypal', [BookingController::class, 'paypalWebhook'])->name('webhooks.paypal');