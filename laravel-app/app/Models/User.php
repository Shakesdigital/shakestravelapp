<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'email',
        'password',
        'first_name',
        'last_name',
        'phone',
        'role',
        'profile',
        'location',
        'preferences',
        'verification',
        'social_logins',
        'host_profile',
        'is_active',
        'stats',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'password_reset_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password_changed_at' => 'datetime',
        'last_login_at' => 'datetime',
        'lock_until' => 'datetime',
        'suspended_at' => 'datetime',
        'deleted_at' => 'datetime',
        'profile' => 'array',
        'location' => 'array',
        'preferences' => 'array',
        'verification' => 'array',
        'social_logins' => 'array',
        'host_profile' => 'array',
        'stats' => 'array',
        'is_active' => 'boolean',
        'is_suspended' => 'boolean',
        'login_attempts' => 'integer',
    ];

    protected $dates = ['deleted_at'];

    // Relationships
    public function trips()
    {
        return $this->hasMany(Trip::class, 'host_id');
    }

    public function accommodations()
    {
        return $this->hasMany(Accommodation::class, 'host_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    // Accessors & Mutators
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAvatarUrlAttribute()
    {
        return $this->profile['avatar']['url'] ?? '/images/default-avatar.png';
    }

    public function getIsHostAttribute()
    {
        return $this->role === 'host' && ($this->host_profile['is_host'] ?? false);
    }

    public function getIsVerifiedHostAttribute()
    {
        return $this->isHost && ($this->host_profile['is_verified'] ?? false);
    }

    public function getIsAccountLockedAttribute()
    {
        return $this->lock_until && $this->lock_until->isFuture();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('is_suspended', false);
    }

    public function scopeHosts($query)
    {
        return $query->where('role', 'host')->whereJsonContains('host_profile->is_host', true);
    }

    public function scopeVerifiedHosts($query)
    {
        return $query->hosts()->whereJsonContains('host_profile->is_verified', true);
    }

    // Helper Methods
    public function incrementLoginAttempts()
    {
        $this->increment('login_attempts');
        
        if ($this->login_attempts >= 5) {
            $this->update(['lock_until' => now()->addHours(2)]);
        }
    }

    public function resetLoginAttempts()
    {
        $this->update([
            'login_attempts' => 0,
            'lock_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);
    }

    public function updateStats($type, $increment = 1)
    {
        $stats = $this->stats ?? [];
        $stats[$type] = ($stats[$type] ?? 0) + $increment;
        $this->update(['stats' => $stats]);
    }

    public function becomeHost($businessInfo = [])
    {
        $this->update([
            'role' => 'host',
            'host_profile' => [
                'is_host' => true,
                'business_info' => $businessInfo,
                'is_verified' => false,
                'joined_as_host_at' => now(),
                'rating' => 0,
                'total_reviews' => 0,
                'total_bookings' => 0,
                'response_time' => 24,
                'response_rate' => 100,
            ],
        ]);
    }
}