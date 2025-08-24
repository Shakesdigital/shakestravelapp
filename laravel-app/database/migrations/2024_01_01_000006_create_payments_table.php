<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_reference')->unique();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Payment Details
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->enum('type', ['full', 'deposit', 'balance', 'refund', 'partial_refund']);
            $table->enum('method', ['stripe', 'paypal', 'bank_transfer', 'mobile_money', 'cash']);
            
            // Status & Processing
            $table->enum('status', ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'])
                  ->default('pending');
            $table->timestamp('processed_at')->nullable();
            $table->text('failure_reason')->nullable();
            
            // External Payment Gateway Integration
            $table->string('stripe_payment_intent_id')->nullable();
            $table->string('stripe_charge_id')->nullable();
            $table->string('paypal_order_id')->nullable();
            $table->json('gateway_response')->nullable(); // full response from payment gateway
            
            // Fees & Breakdown
            $table->decimal('platform_fee', 10, 2)->default(0);
            $table->decimal('gateway_fee', 10, 2)->default(0);
            $table->decimal('host_amount', 10, 2); // amount that goes to host
            $table->decimal('net_amount', 10, 2); // amount after all fees
            
            // Refund Information
            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->timestamp('refunded_at')->nullable();
            $table->string('refund_reference')->nullable();
            $table->text('refund_reason')->nullable();
            
            // Mobile Money (for Uganda market)
            $table->string('mobile_money_number')->nullable();
            $table->string('mobile_money_provider')->nullable(); // MTN, Airtel, etc.
            $table->string('mobile_money_reference')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable(); // additional payment information
            $table->string('description')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('booking_id');
            $table->index('user_id');
            $table->index('payment_reference');
            $table->index('status');
            $table->index('stripe_payment_intent_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};