<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->enum('role', ['guest', 'host', 'admin', 'superadmin'])->default('guest');
            
            // Profile Information
            $table->json('profile')->nullable(); // avatar, dateOfBirth, nationality, languages, bio, interests, emergencyContact
            $table->json('location')->nullable(); // country, city, coordinates
            $table->json('preferences')->nullable(); // currency, language, notifications, accessibility, privacy
            
            // Verification Status
            $table->json('verification')->nullable(); // email, phone, identity verification data
            $table->json('social_logins')->nullable(); // social login providers
            
            // Host Profile
            $table->json('host_profile')->nullable(); // business info, bank details, performance metrics
            
            // Security & Authentication
            $table->string('password_reset_token')->nullable();
            $table->timestamp('password_reset_expires')->nullable();
            $table->timestamp('password_changed_at')->nullable();
            
            // Login tracking
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->integer('login_attempts')->default(0);
            $table->timestamp('lock_until')->nullable();
            
            // Account Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_suspended')->default(false);
            $table->timestamp('suspended_at')->nullable();
            $table->string('suspension_reason')->nullable();
            
            // Soft delete
            $table->timestamp('deleted_at')->nullable();
            $table->string('deletion_reason')->nullable();
            
            // Statistics
            $table->json('stats')->nullable(); // activity stats
            
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes
            $table->index('email');
            $table->index('role');
            $table->index(['is_active', 'is_suspended']);
            $table->index('created_at');
            $table->index('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};