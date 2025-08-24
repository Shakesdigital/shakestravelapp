<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\TripController;
use App\Http\Controllers\API\AccommodationController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\WishlistController;
use App\Http\Controllers\API\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'environment' => app()->environment(),
    ]);
});

// Public API Routes
Route::prefix('v1')->group(function () {
    
    // Authentication Routes
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])->name('register');
        Route::post('/login', [AuthController::class, 'login'])->name('login');
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');
        Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
        Route::post('/verify-email', [AuthController::class, 'verifyEmail'])->name('verify-email');
        
        // Protected Auth Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            Route::post('/refresh', [AuthController::class, 'refreshToken'])->name('refresh');
            Route::put('/profile', [AuthController::class, 'updateProfile'])->name('update-profile');
            Route::post('/change-password', [AuthController::class, 'changePassword'])->name('change-password');
            Route::post('/resend-verification', [AuthController::class, 'resendVerification'])->name('resend-verification');
        });
    });

    // Public Content Routes
    Route::prefix('trips')->name('trips.')->group(function () {
        Route::get('/', [TripController::class, 'index'])->name('index');
        Route::get('/search', [TripController::class, 'search'])->name('search');
        Route::get('/featured', [TripController::class, 'featured'])->name('featured');
        Route::get('/categories', [TripController::class, 'categories'])->name('categories');
        Route::get('/category/{category}', [TripController::class, 'byCategory'])->name('by-category');
        Route::get('/{trip:slug}', [TripController::class, 'show'])->name('show');
        Route::post('/{trip}/increment-views', [TripController::class, 'incrementViews'])->name('increment-views');
    });

    Route::prefix('accommodations')->name('accommodations.')->group(function () {
        Route::get('/', [AccommodationController::class, 'index'])->name('index');
        Route::get('/search', [AccommodationController::class, 'search'])->name('search');
        Route::get('/featured', [AccommodationController::class, 'featured'])->name('featured');
        Route::get('/{accommodation:slug}', [AccommodationController::class, 'show'])->name('show');
        Route::post('/{accommodation}/increment-views', [AccommodationController::class, 'incrementViews'])->name('increment-views');
    });

    // Review Routes (public reading)
    Route::prefix('reviews')->name('reviews.')->group(function () {
        Route::get('/trip/{trip}', [ReviewController::class, 'tripReviews'])->name('trip-reviews');
        Route::get('/accommodation/{accommodation}', [ReviewController::class, 'accommodationReviews'])->name('accommodation-reviews');
    });

    // Authenticated API Routes
    Route::middleware('auth:sanctum')->group(function () {
        
        // User Routes
        Route::prefix('user')->name('user.')->group(function () {
            Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
            Route::get('/stats', [AuthController::class, 'stats'])->name('stats');
            Route::post('/become-host', [AuthController::class, 'becomeHost'])->name('become-host');
        });

        // Booking Routes
        Route::prefix('bookings')->name('bookings.')->group(function () {
            Route::get('/', [BookingController::class, 'index'])->name('index');
            Route::post('/', [BookingController::class, 'store'])->name('store');
            Route::get('/{booking}', [BookingController::class, 'show'])->name('show');
            Route::put('/{booking}', [BookingController::class, 'update'])->name('update');
            Route::post('/{booking}/cancel', [BookingController::class, 'cancel'])->name('cancel');
            Route::get('/{booking}/invoice', [BookingController::class, 'invoice'])->name('invoice');
        });

        // Review Routes
        Route::prefix('reviews')->name('reviews.')->group(function () {
            Route::get('/', [ReviewController::class, 'userReviews'])->name('user-reviews');
            Route::post('/', [ReviewController::class, 'store'])->name('store');
            Route::put('/{review}', [ReviewController::class, 'update'])->name('update');
            Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
            Route::post('/{review}/helpful', [ReviewController::class, 'markHelpful'])->name('mark-helpful');
            Route::post('/{review}/flag', [ReviewController::class, 'flag'])->name('flag');
        });

        // Wishlist Routes
        Route::prefix('wishlist')->name('wishlist.')->group(function () {
            Route::get('/', [WishlistController::class, 'index'])->name('index');
            Route::post('/', [WishlistController::class, 'store'])->name('store');
            Route::delete('/{wishlist}', [WishlistController::class, 'destroy'])->name('destroy');
            Route::post('/toggle', [WishlistController::class, 'toggle'])->name('toggle');
        });

        // Payment Routes
        Route::prefix('payments')->name('payments.')->group(function () {
            Route::get('/', [PaymentController::class, 'index'])->name('index');
            Route::post('/create-intent', [PaymentController::class, 'createPaymentIntent'])->name('create-intent');
            Route::post('/confirm', [PaymentController::class, 'confirmPayment'])->name('confirm');
            Route::get('/{payment}', [PaymentController::class, 'show'])->name('show');
            Route::post('/{payment}/refund', [PaymentController::class, 'refund'])->name('refund');
        });

        // Upload Routes
        Route::prefix('uploads')->name('uploads.')->group(function () {
            Route::post('/avatar', [UploadController::class, 'uploadAvatar'])->name('avatar');
            Route::post('/trip-images', [UploadController::class, 'uploadTripImages'])->name('trip-images');
            Route::post('/accommodation-images', [UploadController::class, 'uploadAccommodationImages'])->name('accommodation-images');
            Route::post('/review-images', [UploadController::class, 'uploadReviewImages'])->name('review-images');
            Route::delete('/image/{publicId}', [UploadController::class, 'deleteImage'])->name('delete-image');
        });

        // Host Routes
        Route::middleware('role:host|admin')->prefix('host')->name('host.')->group(function () {
            Route::get('/dashboard', [TripController::class, 'hostDashboard'])->name('dashboard');
            
            // Host Trip Management
            Route::prefix('trips')->name('trips.')->group(function () {
                Route::get('/', [TripController::class, 'hostTrips'])->name('index');
                Route::post('/', [TripController::class, 'store'])->name('store');
                Route::put('/{trip}', [TripController::class, 'update'])->name('update');
                Route::delete('/{trip}', [TripController::class, 'destroy'])->name('destroy');
                Route::get('/{trip}/bookings', [TripController::class, 'tripBookings'])->name('bookings');
                Route::get('/{trip}/analytics', [TripController::class, 'tripAnalytics'])->name('analytics');
            });

            // Host Accommodation Management
            Route::prefix('accommodations')->name('accommodations.')->group(function () {
                Route::get('/', [AccommodationController::class, 'hostAccommodations'])->name('index');
                Route::post('/', [AccommodationController::class, 'store'])->name('store');
                Route::put('/{accommodation}', [AccommodationController::class, 'update'])->name('update');
                Route::delete('/{accommodation}', [AccommodationController::class, 'destroy'])->name('destroy');
                Route::get('/{accommodation}/bookings', [AccommodationController::class, 'accommodationBookings'])->name('bookings');
            });

            // Host Booking Management
            Route::prefix('bookings')->name('bookings.')->group(function () {
                Route::get('/manage', [BookingController::class, 'hostBookings'])->name('manage');
                Route::post('/{booking}/accept', [BookingController::class, 'accept'])->name('accept');
                Route::post('/{booking}/reject', [BookingController::class, 'reject'])->name('reject');
                Route::post('/{booking}/complete', [BookingController::class, 'complete'])->name('complete');
            });

            // Host Review Management
            Route::prefix('reviews')->name('reviews.')->group(function () {
                Route::get('/received', [ReviewController::class, 'hostReviews'])->name('received');
                Route::post('/{review}/respond', [ReviewController::class, 'respond'])->name('respond');
            });

            // Host Analytics
            Route::prefix('analytics')->name('analytics.')->group(function () {
                Route::get('/overview', [AuthController::class, 'hostAnalytics'])->name('overview');
                Route::get('/bookings', [BookingController::class, 'hostBookingAnalytics'])->name('bookings');
                Route::get('/revenue', [PaymentController::class, 'hostRevenueAnalytics'])->name('revenue');
            });
        });

        // Admin Routes
        Route::middleware('role:admin|superadmin')->prefix('admin')->name('admin.')->group(function () {
            Route::get('/dashboard', [AuthController::class, 'adminDashboard'])->name('dashboard');
            
            // User Management
            Route::prefix('users')->name('users.')->group(function () {
                Route::get('/', [AuthController::class, 'adminUsers'])->name('index');
                Route::get('/{user}', [AuthController::class, 'adminUserShow'])->name('show');
                Route::post('/{user}/suspend', [AuthController::class, 'suspendUser'])->name('suspend');
                Route::post('/{user}/activate', [AuthController::class, 'activateUser'])->name('activate');
                Route::post('/{user}/verify-host', [AuthController::class, 'verifyHost'])->name('verify-host');
            });

            // Content Moderation
            Route::prefix('moderation')->name('moderation.')->group(function () {
                Route::get('/trips', [TripController::class, 'adminTrips'])->name('trips');
                Route::get('/accommodations', [AccommodationController::class, 'adminAccommodations'])->name('accommodations');
                Route::get('/reviews', [ReviewController::class, 'adminReviews'])->name('reviews');
                Route::post('/trips/{trip}/feature', [TripController::class, 'toggleFeatured'])->name('feature-trip');
                Route::post('/trips/{trip}/approve', [TripController::class, 'approve'])->name('approve-trip');
                Route::post('/reviews/{review}/hide', [ReviewController::class, 'hide'])->name('hide-review');
            });

            // Analytics
            Route::prefix('analytics')->name('analytics.')->group(function () {
                Route::get('/overview', [AuthController::class, 'platformAnalytics'])->name('overview');
                Route::get('/bookings', [BookingController::class, 'platformBookingAnalytics'])->name('bookings');
                Route::get('/revenue', [PaymentController::class, 'platformRevenueAnalytics'])->name('revenue');
                Route::get('/users', [AuthController::class, 'platformUserAnalytics'])->name('users');
            });
        });
    });
});

// Rate limited routes
Route::middleware('throttle:60,1')->group(function () {
    // Contact form, newsletter, etc.
    Route::post('/contact', function (Request $request) {
        // Handle contact form submission
        return response()->json(['success' => true, 'message' => 'Message sent successfully']);
    });
});

// Webhook routes (no authentication)
Route::prefix('webhooks')->name('webhooks.')->group(function () {
    Route::post('/stripe', [PaymentController::class, 'stripeWebhook'])->name('stripe');
    Route::post('/paypal', [PaymentController::class, 'paypalWebhook'])->name('paypal');
});