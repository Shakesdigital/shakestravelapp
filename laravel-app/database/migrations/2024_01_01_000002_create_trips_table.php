<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade');
            
            // Basic Information
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('category');
            $table->json('location'); // destination, coordinates, address
            
            // Trip Details
            $table->json('itinerary'); // day-by-day breakdown
            $table->json('inclusions'); // what's included
            $table->json('exclusions'); // what's not included
            $table->json('pricing'); // base price, group discounts, seasonal pricing
            $table->integer('max_group_size');
            $table->integer('min_group_size')->default(1);
            $table->integer('duration_days');
            $table->enum('difficulty_level', ['Easy', 'Moderate', 'Challenging', 'Extreme']);
            $table->json('languages')->nullable(); // supported languages
            $table->json('tags')->nullable(); // searchable tags
            
            // Availability & Booking
            $table->json('availability'); // date ranges, blackout dates
            $table->json('policies'); // cancellation, refund policies
            $table->json('requirements'); // age, fitness, equipment requirements
            
            // Media & Marketing
            $table->json('media'); // images, videos
            $table->json('features'); // highlighted features
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            
            // SEO & Meta
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('structured_data')->nullable();
            
            // Performance Metrics
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_bookings')->default(0);
            $table->integer('view_count')->default(0);
            
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('host_id');
            $table->index('category');
            $table->index('difficulty_level');
            $table->index(['is_active', 'is_featured']);
            $table->index('rating');
            $table->index('created_at');
            $table->fullText(['title', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};