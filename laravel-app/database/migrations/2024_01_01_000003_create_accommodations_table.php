<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade');
            
            // Basic Information
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('type', ['hotel', 'lodge', 'camp', 'guesthouse', 'apartment', 'villa']);
            $table->json('location'); // address, coordinates, nearby attractions
            
            // Accommodation Details
            $table->json('rooms'); // room types, capacity, amenities
            $table->json('amenities'); // facilities and services
            $table->json('policies'); // check-in/out, cancellation, house rules
            $table->integer('max_guests');
            $table->decimal('price_per_night', 10, 2);
            $table->json('pricing'); // seasonal rates, discounts
            
            // Availability
            $table->json('availability'); // calendar, blocked dates
            $table->integer('minimum_stay')->default(1);
            $table->integer('maximum_stay')->nullable();
            
            // Media & Marketing
            $table->json('media'); // images, virtual tours
            $table->json('highlights'); // key selling points
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
            
            // Verification & Quality
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->json('certifications')->nullable(); // safety, quality certifications
            
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('host_id');
            $table->index('type');
            $table->index(['is_active', 'is_featured']);
            $table->index('rating');
            $table->index('price_per_night');
            $table->index('created_at');
            $table->fullText(['name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};