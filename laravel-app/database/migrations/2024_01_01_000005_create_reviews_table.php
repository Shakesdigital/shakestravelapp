<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            
            // Polymorphic relationship for reviewable items (trips or accommodations)
            $table->morphs('reviewable');
            
            // Review Content
            $table->integer('rating')->check('rating >= 1 AND rating <= 5');
            $table->string('title')->nullable();
            $table->text('comment');
            $table->json('detailed_ratings')->nullable(); // cleanliness, service, value, etc.
            $table->json('media')->nullable(); // photos, videos
            
            // Review Metadata
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Interaction & Moderation
            $table->integer('helpful_count')->default(0);
            $table->integer('not_helpful_count')->default(0);
            $table->json('flags')->nullable(); // moderation flags
            $table->boolean('is_hidden')->default(false);
            $table->string('hidden_reason')->nullable();
            
            // Response from Host
            $table->text('host_response')->nullable();
            $table->timestamp('host_responded_at')->nullable();
            
            // Trip/Stay Details
            $table->date('experience_date')->nullable(); // when the trip/stay occurred
            $table->enum('traveler_type', ['solo', 'couple', 'family', 'friends', 'business'])->nullable();
            $table->json('trip_highlights')->nullable(); // what they liked most
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('booking_id');
            $table->index(['reviewable_type', 'reviewable_id']);
            $table->index('rating');
            $table->index(['is_verified', 'is_hidden']);
            $table->index('created_at');
            $table->fullText(['title', 'comment']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};