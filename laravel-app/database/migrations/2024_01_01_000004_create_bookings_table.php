<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Polymorphic relationship for bookable items (trips or accommodations)
            $table->morphs('bookable');
            
            // Booking Details
            $table->date('booking_date');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('group_size')->default(1);
            $table->json('guest_details'); // guest information
            $table->json('room_details')->nullable(); // for accommodations
            $table->json('additional_services')->nullable(); // extras, add-ons
            
            // Pricing
            $table->decimal('base_price', 10, 2);
            $table->decimal('additional_fees', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            $table->string('currency', 3)->default('USD');
            
            // Status & Lifecycle
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'])
                  ->default('pending');
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'refunded', 'failed'])
                  ->default('pending');
            
            // Additional Information
            $table->text('special_requests')->nullable();
            $table->json('contact_info'); // emergency contact, preferences
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            
            // Confirmation & Communication
            $table->timestamp('confirmed_at')->nullable();
            $table->boolean('confirmation_sent')->default(false);
            $table->boolean('reminder_sent')->default(false);
            $table->json('notifications_sent')->nullable();
            
            // Review & Feedback
            $table->boolean('review_requested')->default(false);
            $table->timestamp('review_requested_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index(['bookable_type', 'bookable_id']);
            $table->index('booking_reference');
            $table->index('status');
            $table->index('payment_status');
            $table->index('start_date');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};