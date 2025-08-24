<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ProductionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the production database seeds.
     * Only creates essential data for production environment
     */
    public function run(): void
    {
        $this->command->info('Seeding production data...');

        // Create roles
        $this->createRoles();
        
        // Create permissions
        $this->createPermissions();
        
        // Create admin user
        $this->createAdminUser();
        
        // Create essential settings
        $this->createSettings();
        
        $this->command->info('Production seeding completed!');
    }

    /**
     * Create user roles
     */
    private function createRoles(): void
    {
        $roles = ['superadmin', 'admin', 'host', 'guest'];
        
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
            $this->command->info("Created role: {$role}");
        }
    }

    /**
     * Create permissions
     */
    private function createPermissions(): void
    {
        $permissions = [
            // User management
            'view users', 'create users', 'edit users', 'delete users',
            
            // Trip management
            'view trips', 'create trips', 'edit trips', 'delete trips', 'feature trips',
            
            // Accommodation management
            'view accommodations', 'create accommodations', 'edit accommodations', 'delete accommodations', 'feature accommodations',
            
            // Booking management
            'view bookings', 'create bookings', 'edit bookings', 'delete bookings', 'manage bookings',
            
            // Review management
            'view reviews', 'create reviews', 'edit reviews', 'delete reviews', 'moderate reviews',
            
            // Payment management
            'view payments', 'process payments', 'refund payments',
            
            // Admin functions
            'access admin panel', 'view analytics', 'manage settings', 'view logs',
            
            // Host functions
            'access host dashboard', 'manage own listings', 'respond to reviews',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign permissions to roles
        $superadmin = Role::findByName('superadmin');
        $superadmin->syncPermissions(Permission::all());

        $admin = Role::findByName('admin');
        $admin->syncPermissions(Permission::whereNotIn('name', [
            'delete users', // Only superadmin can delete users
        ])->get());

        $host = Role::findByName('host');
        $host->syncPermissions(Permission::whereIn('name', [
            'access host dashboard', 'manage own listings', 'respond to reviews',
            'view bookings', 'edit bookings', 'create trips', 'edit trips', 'delete trips',
            'create accommodations', 'edit accommodations', 'delete accommodations',
        ])->get());

        $guest = Role::findByName('guest');
        $guest->syncPermissions(Permission::whereIn('name', [
            'view trips', 'view accommodations', 'create bookings', 'create reviews',
        ])->get());

        $this->command->info('Permissions created and assigned to roles');
    }

    /**
     * Create admin user
     */
    private function createAdminUser(): void
    {
        $adminEmail = 'admin@shakestravel.com';
        
        if (!User::where('email', $adminEmail)->exists()) {
            $admin = User::create([
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => $adminEmail,
                'password' => Hash::make('AdminShakes2025!'), // Change this password
                'email_verified_at' => now(),
                'role' => 'superadmin',
                'is_active' => true,
                'verification' => [
                    'is_email_verified' => true,
                    'email_verified_at' => now(),
                ],
                'stats' => [
                    'total_trips_booked' => 0,
                    'total_accommodations_booked' => 0,
                    'total_reviews_written' => 0,
                    'profile_views' => 0,
                ],
            ]);

            $admin->assignRole('superadmin');
            
            $this->command->warn("Admin user created:");
            $this->command->warn("Email: {$adminEmail}");
            $this->command->warn("Password: AdminShakes2025! (CHANGE THIS IMMEDIATELY)");
        } else {
            $this->command->info('Admin user already exists');
        }
    }

    /**
     * Create essential application settings
     */
    private function createSettings(): void
    {
        // You can create a settings table and seed it here
        // For now, we'll just log that settings would be created
        $this->command->info('Essential settings would be created here');
    }
}