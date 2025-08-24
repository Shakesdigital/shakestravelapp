<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Trip extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'host_id',
        'title',
        'slug',
        'description',
        'category',
        'location',
        'itinerary',
        'inclusions',
        'exclusions',
        'pricing',
        'max_group_size',
        'min_group_size',
        'duration_days',
        'difficulty_level',
        'languages',
        'tags',
        'availability',
        'policies',
        'requirements',
        'media',
        'features',
        'is_featured',
        'is_active',
        'meta_title',
        'meta_description',
        'structured_data',
    ];

    protected $casts = [
        'location' => 'array',
        'itinerary' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'pricing' => 'array',
        'languages' => 'array',
        'tags' => 'array',
        'availability' => 'array',
        'policies' => 'array',
        'requirements' => 'array',
        'media' => 'array',
        'features' => 'array',
        'structured_data' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'rating' => 'decimal:2',
        'total_reviews' => 'integer',
        'total_bookings' => 'integer',
        'view_count' => 'integer',
        'deleted_at' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    // Boot method to auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($trip) {
            if (empty($trip->slug)) {
                $trip->slug = Str::slug($trip->title);
                
                // Ensure slug is unique
                $originalSlug = $trip->slug;
                $counter = 1;
                while (static::where('slug', $trip->slug)->exists()) {
                    $trip->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
        });

        static::updating(function ($trip) {
            if ($trip->isDirty('title') && empty($trip->slug)) {
                $trip->slug = Str::slug($trip->title);
            }
        });
    }

    // Relationships
    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function bookings()
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function wishlists()
    {
        return $this->morphMany(Wishlist::class, 'wishlistable');
    }

    // Accessors
    public function getBasePriceAttribute()
    {
        return $this->pricing['base_price'] ?? 0;
    }

    public function getPrimaryImageAttribute()
    {
        $media = $this->media ?? [];
        return $media['images'][0]['url'] ?? '/images/default-trip.jpg';
    }

    public function getDestinationAttribute()
    {
        return $this->location['destination'] ?? '';
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('difficulty_level', $difficulty);
    }

    public function scopeByLocation($query, $location)
    {
        return $query->whereJsonContains('location->destination', $location);
    }

    public function scopePriceRange($query, $min = null, $max = null)
    {
        if ($min) {
            $query->whereJsonContains('pricing->base_price', '>=', $min);
        }
        if ($max) {
            $query->whereJsonContains('pricing->base_price', '<=', $max);
        }
        return $query;
    }

    public function scopeByRating($query, $minRating)
    {
        return $query->where('rating', '>=', $minRating);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhereJsonContains('location->destination', $search)
              ->orWhereJsonContains('tags', $search);
        });
    }

    // Helper Methods
    public function incrementViews()
    {
        $this->increment('view_count');
    }

    public function updateRating()
    {
        $avgRating = $this->reviews()->avg('rating');
        $totalReviews = $this->reviews()->count();
        
        $this->update([
            'rating' => round($avgRating, 2),
            'total_reviews' => $totalReviews,
        ]);
    }

    public function isAvailableOn($date)
    {
        $availability = $this->availability ?? [];
        
        // Check if date is within available range
        if (isset($availability['start_date']) && isset($availability['end_date'])) {
            $startDate = \Carbon\Carbon::parse($availability['start_date']);
            $endDate = \Carbon\Carbon::parse($availability['end_date']);
            $checkDate = \Carbon\Carbon::parse($date);
            
            if ($checkDate->lt($startDate) || $checkDate->gt($endDate)) {
                return false;
            }
        }
        
        // Check blackout dates
        $blackoutDates = $availability['blackout_dates'] ?? [];
        if (in_array($date, $blackoutDates)) {
            return false;
        }
        
        return true;
    }

    public function calculatePrice($guests, $date = null, $duration = null)
    {
        $pricing = $this->pricing ?? [];
        $basePrice = $pricing['base_price'] ?? 0;
        
        // Apply group discounts
        if (isset($pricing['group_discounts'])) {
            foreach ($pricing['group_discounts'] as $discount) {
                if ($guests >= $discount['min_size']) {
                    $basePrice *= (1 - $discount['discount_percentage'] / 100);
                }
            }
        }
        
        // Apply seasonal pricing
        if ($date && isset($pricing['seasonal_rates'])) {
            foreach ($pricing['seasonal_rates'] as $rate) {
                $seasonStart = \Carbon\Carbon::parse($rate['start_date']);
                $seasonEnd = \Carbon\Carbon::parse($rate['end_date']);
                $checkDate = \Carbon\Carbon::parse($date);
                
                if ($checkDate->between($seasonStart, $seasonEnd)) {
                    $basePrice *= $rate['multiplier'];
                    break;
                }
            }
        }
        
        return $basePrice * $guests;
    }
}