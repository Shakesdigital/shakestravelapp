#!/bin/bash

# ShakesTravel Laravel Quick Deployment Script for cPanel
# This script automates the entire deployment process
# Usage: ./quick-deploy.sh

set -e

echo "🚀 ShakesTravel Laravel Quick Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (Update these variables)
APP_DIR="$HOME/shakestravel-laravel"
PUBLIC_HTML="$HOME/public_html"
DOMAIN="www.shakestravel.com"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_requirements() {
    log_info "Step 1: Checking requirements..."
    
    # Check PHP version
    PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
    if (( $(echo "$PHP_VERSION >= 8.2" | bc -l) )); then
        log_success "PHP version: $PHP_VERSION"
    else
        log_error "PHP version $PHP_VERSION is not supported. Laravel 11 requires PHP 8.2+"
        exit 1
    fi
    
    # Check Composer
    if command -v composer &> /dev/null; then
        log_success "Composer is available"
    else
        log_error "Composer not found. Please install Composer first."
        exit 1
    fi
    
    # Check required PHP extensions
    REQUIRED_EXTENSIONS=("bcmath" "ctype" "fileinfo" "json" "mbstring" "openssl" "pdo" "tokenizer" "xml")
    for ext in "${REQUIRED_EXTENSIONS[@]}"; do
        if php -m | grep -i "$ext" > /dev/null; then
            log_success "PHP extension: $ext"
        else
            log_warning "Missing PHP extension: $ext (may cause issues)"
        fi
    done
}

create_directory_structure() {
    log_info "Step 2: Creating directory structure..."
    
    if [ ! -d "$APP_DIR" ]; then
        mkdir -p "$APP_DIR"
        log_success "Created application directory: $APP_DIR"
    else
        log_warning "Application directory already exists"
    fi
    
    # Create necessary directories
    mkdir -p "$APP_DIR/storage/logs"
    mkdir -p "$APP_DIR/storage/framework/cache"
    mkdir -p "$APP_DIR/storage/framework/sessions"
    mkdir -p "$APP_DIR/storage/framework/views"
    mkdir -p "$APP_DIR/bootstrap/cache"
    
    log_success "Directory structure created"
}

setup_environment() {
    log_info "Step 3: Setting up environment..."
    
    cd "$APP_DIR"
    
    if [ ! -f .env ]; then
        if [ -f .env.production ]; then
            cp .env.production .env
            log_success "Copied production environment file"
        else
            log_warning "No environment file found. Please create .env manually."
        fi
    else
        log_warning "Environment file already exists"
    fi
    
    # Set proper permissions for .env
    chmod 644 .env
    log_success "Set environment file permissions"
}

install_dependencies() {
    log_info "Step 4: Installing Composer dependencies..."
    
    cd "$APP_DIR"
    
    # Clear any existing autoload files
    if [ -f composer.lock ]; then
        rm composer.lock
    fi
    
    # Install dependencies with memory limit increase
    php -d memory_limit=512M $(which composer) install --optimize-autoloader --no-dev --no-interaction --prefer-dist
    
    log_success "Dependencies installed successfully"
}

configure_laravel() {
    log_info "Step 5: Configuring Laravel application..."
    
    cd "$APP_DIR"
    
    # Generate application key
    php artisan key:generate --force
    log_success "Application key generated"
    
    # Clear all caches
    php artisan cache:clear
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    log_success "Caches cleared"
    
    # Create storage symlink
    php artisan storage:link
    log_success "Storage symlink created"
}

setup_database() {
    log_info "Step 6: Setting up database..."
    
    cd "$APP_DIR"
    
    # Test database connection
    if php artisan migrate:status --no-interaction 2>/dev/null; then
        log_warning "Database already configured, running migrations..."
        php artisan migrate --force
        log_success "Database migrations completed"
    else
        log_warning "Database not configured or connection failed"
        log_warning "Please configure your database in .env file and run:"
        log_warning "php artisan migrate --force"
        log_warning "php artisan db:seed --class=ProductionSeeder --force"
    fi
}

configure_web_server() {
    log_info "Step 7: Configuring web server..."
    
    cd "$APP_DIR"
    
    # Copy .htaccess files
    if [ -f .htaccess.production ]; then
        cp .htaccess.production .htaccess
        log_success "Root .htaccess file configured"
    fi
    
    if [ -f public/.htaccess.production ]; then
        cp public/.htaccess.production public/.htaccess
        log_success "Public .htaccess file configured"
    fi
    
    # Set up document root
    log_warning "IMPORTANT: Set your domain document root to:"
    log_warning "$APP_DIR/public"
    log_warning "Or create a symbolic link in your public_html directory"
}

set_permissions() {
    log_info "Step 8: Setting file permissions..."
    
    cd "$APP_DIR"
    
    # Set directory permissions
    find . -type d -exec chmod 755 {} \;
    log_success "Directory permissions set to 755"
    
    # Set file permissions
    find . -type f -exec chmod 644 {} \;
    log_success "File permissions set to 644"
    
    # Set specific permissions for storage and cache
    chmod -R 775 storage
    chmod -R 775 bootstrap/cache
    log_success "Storage and cache permissions set to 775"
    
    # Secure sensitive files
    chmod 644 .env
    log_success "Environment file secured"
}

optimize_production() {
    log_info "Step 9: Optimizing for production..."
    
    cd "$APP_DIR"
    
    # Cache configuration
    php artisan config:cache
    log_success "Configuration cached"
    
    php artisan route:cache
    log_success "Routes cached"
    
    php artisan view:cache
    log_success "Views cached"
    
    php artisan event:cache
    log_success "Events cached"
    
    # Build frontend assets if npm is available
    if command -v npm &> /dev/null && [ -f package.json ]; then
        log_info "Building frontend assets..."
        npm ci --production
        npm run build
        log_success "Frontend assets built"
    else
        log_warning "npm not found or no package.json, skipping asset build"
    fi
}

create_admin_user() {
    log_info "Step 10: Creating admin user..."
    
    cd "$APP_DIR"
    
    if php artisan db:seed --class=ProductionSeeder --force 2>/dev/null; then
        log_success "Production database seeded"
        log_warning "Default admin credentials:"
        log_warning "Email: admin@shakestravel.com"
        log_warning "Password: AdminShakes2025!"
        log_warning "⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER LOGIN!"
    else
        log_warning "Database seeding failed. Please run manually:"
        log_warning "php artisan db:seed --class=ProductionSeeder --force"
    fi
}

final_verification() {
    log_info "Step 11: Final verification..."
    
    cd "$APP_DIR"
    
    # Check Laravel installation
    if php artisan about | grep -q "Laravel"; then
        log_success "Laravel application configured successfully"
    else
        log_error "Laravel configuration check failed"
    fi
    
    # Check key permissions
    if [ -r .env ] && [ -r storage ] && [ -r bootstrap/cache ]; then
        log_success "File permissions verified"
    else
        log_warning "Some permission issues detected"
    fi
    
    # Test basic functionality
    if php artisan route:list > /dev/null 2>&1; then
        log_success "Routes loaded successfully"
    else
        log_warning "Route loading issues detected"
    fi
}

display_final_instructions() {
    echo ""
    echo "🎉 Deployment Completed!"
    echo "======================"
    echo ""
    log_info "Next steps:"
    echo "1. Configure your domain's document root to: $APP_DIR/public"
    echo "2. Set up SSL certificate in cPanel"
    echo "3. Configure email settings in .env file"
    echo "4. Set up cron job for Laravel scheduler:"
    echo "   * * * * * cd $APP_DIR && php artisan schedule:run >> /dev/null 2>&1"
    echo "5. Test your application at: https://$DOMAIN"
    echo "6. Login to admin panel and change default password"
    echo ""
    log_warning "Important files:"
    echo "- Application: $APP_DIR"
    echo "- Environment: $APP_DIR/.env"
    echo "- Logs: $APP_DIR/storage/logs/"
    echo ""
    log_info "For troubleshooting, check:"
    echo "tail -f $APP_DIR/storage/logs/laravel.log"
}

# Main execution
main() {
    echo "Starting deployment process..."
    echo "This will deploy ShakesTravel Laravel to: $APP_DIR"
    echo ""
    
    # Confirm before proceeding
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled"
        exit 0
    fi
    
    # Run deployment steps
    check_requirements
    create_directory_structure
    setup_environment
    install_dependencies
    configure_laravel
    setup_database
    configure_web_server
    set_permissions
    optimize_production
    create_admin_user
    final_verification
    display_final_instructions
    
    log_success "Deployment script completed successfully!"
}

# Run main function
main "$@"