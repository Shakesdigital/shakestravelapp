#!/bin/bash

# ShakesTravel Laravel Deployment Script for cPanel
# Usage: ./deploy-cpanel.sh [environment]

set -e

ENVIRONMENT=${1:-production}
APP_DIR="/home/your_username/shakestravel-laravel"
PUBLIC_HTML="/home/your_username/public_html"

echo "🚀 Starting ShakesTravel deployment to cPanel..."
echo "Environment: $ENVIRONMENT"
echo "App Directory: $APP_DIR"
echo "Public HTML: $PUBLIC_HTML"

# Step 1: Navigate to application directory
cd $APP_DIR

echo "📋 Step 1: Checking PHP version..."
php -v

# Step 2: Install/Update Composer dependencies
echo "📦 Step 2: Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

# Step 3: Copy environment file
echo "⚙️  Step 3: Setting up environment..."
if [ ! -f .env ]; then
    cp .env.production .env
    echo "✅ Environment file copied"
else
    echo "⚠️  Environment file already exists"
fi

# Step 4: Generate application key
echo "🔐 Step 4: Generating application key..."
php artisan key:generate --force

# Step 5: Clear all caches
echo "🗑️  Step 5: Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Step 6: Run database migrations
echo "🗄️  Step 6: Running database migrations..."
php artisan migrate --force

# Step 7: Seed database (if needed)
if [ "$ENVIRONMENT" = "staging" ] || [ "$ENVIRONMENT" = "development" ]; then
    echo "🌱 Step 7: Seeding database..."
    php artisan db:seed --force
else
    echo "⏭️  Step 7: Skipping database seeding in production"
fi

# Step 8: Create storage symlink
echo "🔗 Step 8: Creating storage symlink..."
php artisan storage:link

# Step 9: Optimize for production
echo "🚄 Step 9: Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Step 10: Set correct permissions
echo "🔐 Step 10: Setting permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod -R 644 .env

# Step 11: Build frontend assets (if Vite is available)
if command -v npm &> /dev/null; then
    echo "🎨 Step 11: Building frontend assets..."
    npm ci --production
    npm run build
else
    echo "⚠️  Step 11: npm not found, skipping asset build"
fi

# Step 12: Create .htaccess for public directory
echo "🌐 Step 12: Creating .htaccess files..."
cp .htaccess.production public/.htaccess

# Step 13: Final verification
echo "✅ Step 13: Running final checks..."
php artisan about

echo ""
echo "🎉 Deployment completed successfully!"
echo "📱 Your application should now be available at: https://www.shakestravel.com"
echo ""
echo "📝 Next steps:"
echo "   1. Test the application thoroughly"
echo "   2. Monitor error logs: tail -f storage/logs/laravel.log"
echo "   3. Set up scheduled tasks in cPanel Cron Jobs"
echo "   4. Configure email settings if needed"
echo ""