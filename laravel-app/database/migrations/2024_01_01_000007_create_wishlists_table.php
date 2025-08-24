<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Polymorphic relationship for wishlistable items (trips or accommodations)
            $table->morphs('wishlistable');
            
            // Organization
            $table->string('list_name')->default('My Wishlist');
            $table->text('notes')->nullable();
            $table->boolean('is_private')->default(false);
            $table->integer('priority')->default(0); // for ordering within wishlist
            
            // Notification Preferences
            $table->boolean('notify_price_drop')->default(true);
            $table->boolean('notify_availability')->default(true);
            $table->boolean('notify_special_offers')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index(['wishlistable_type', 'wishlistable_id']);
            $table->unique(['user_id', 'wishlistable_type', 'wishlistable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};