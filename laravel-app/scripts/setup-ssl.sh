#!/bin/bash

# SSL Configuration Script for ShakesTravel
# Configures SSL settings and security headers

set -e

APP_DIR="$HOME/shakestravel-laravel"
DOMAIN="www.shakestravel.com"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔒 ShakesTravel SSL Configuration${NC}"
echo "================================="

cd "$APP_DIR"

# Function to check SSL certificate
check_ssl() {
    echo -e "\n${YELLOW}🔍 Checking SSL certificate status...${NC}"
    
    if echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
        EXPIRY_DATE=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
        echo -e "${GREEN}✅ SSL certificate is installed${NC}"
        echo -e "${BLUE}📅 Certificate expires: $EXPIRY_DATE${NC}"
        
        # Check days until expiry
        EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null || echo "0")
        CURRENT_TIMESTAMP=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
        
        if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ] && [ "$DAYS_UNTIL_EXPIRY" -gt 0 ]; then
            echo -e "${YELLOW}⚠️  SSL certificate expires in $DAYS_UNTIL_EXPIRY days - consider renewal${NC}"
        elif [ "$DAYS_UNTIL_EXPIRY" -le 0 ]; then
            echo -e "${RED}❌ SSL certificate has expired - immediate renewal required${NC}"
        else
            echo -e "${GREEN}✅ SSL certificate is valid for $DAYS_UNTIL_EXPIRY days${NC}"
        fi
        
        return 0
    else
        echo -e "${RED}❌ SSL certificate not found or invalid${NC}"
        return 1
    fi
}

# Function to update .env for HTTPS
configure_env_https() {
    echo -e "\n${YELLOW}⚙️  Configuring environment for HTTPS...${NC}"
    
    # Update APP_URL to use HTTPS
    sed -i 's|^APP_URL=.*|APP_URL=https://'"$DOMAIN"'|' .env
    
    # Add HTTPS-specific configuration
    if ! grep -q "ASSET_URL" .env; then
        echo "" >> .env
        echo "# HTTPS Configuration" >> .env
        echo "ASSET_URL=https://$DOMAIN" >> .env
    fi
    
    # Configure session security
    sed -i 's|^SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=true|' .env || echo "SESSION_SECURE_COOKIE=true" >> .env
    sed -i 's|^SESSION_SAME_SITE=.*|SESSION_SAME_SITE=lax|' .env || echo "SESSION_SAME_SITE=lax" >> .env
    
    echo -e "${GREEN}✅ Environment configured for HTTPS${NC}"
}

# Function to update .htaccess for HTTPS redirect
configure_htaccess_https() {
    echo -e "\n${YELLOW}🔄 Configuring HTTPS redirect...${NC}"
    
    # Update public/.htaccess to force HTTPS
    if [ -f "public/.htaccess" ]; then
        # Check if HTTPS redirect already exists
        if grep -q "RewriteCond %{HTTPS} off" "public/.htaccess"; then
            echo -e "${GREEN}✅ HTTPS redirect already configured${NC}"
        else
            # Add HTTPS redirect after RewriteEngine On
            sed -i '/RewriteEngine On/a\\n    # Force HTTPS\n    RewriteCond %{HTTPS} off\n    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]' "public/.htaccess"
            echo -e "${GREEN}✅ HTTPS redirect added to .htaccess${NC}"
        fi
    else
        echo -e "${RED}❌ public/.htaccess file not found${NC}"
    fi
}

# Function to add security headers
add_security_headers() {
    echo -e "\n${YELLOW}🛡️  Adding security headers...${NC}"
    
    # Create security headers configuration
    cat > "public/.htaccess.security" << 'EOF'
# Security Headers for ShakesTravel
<IfModule mod_headers.c>
    # HSTS (HTTP Strict Transport Security)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Prevent MIME type confusion attacks
    Header always set X-Content-Type-Options "nosniff"
    
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Enable XSS filtering
    Header always set X-XSS-Protection "1; mode=block"
    
    # Control referrer information
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' https:; object-src 'none';"
    
    # Permissions Policy (Feature Policy)
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()"
    
    # Remove server information
    Header unset Server
    Header unset X-Powered-By
    
    # Cache control for sensitive pages
    <FilesMatch "\.(php|cgi|pl|htm)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires "0"
    </FilesMatch>
</IfModule>
EOF

    # Merge security headers with main .htaccess
    if [ -f "public/.htaccess" ]; then
        if ! grep -q "Strict-Transport-Security" "public/.htaccess"; then
            echo "" >> "public/.htaccess"
            cat "public/.htaccess.security" >> "public/.htaccess"
            echo -e "${GREEN}✅ Security headers added${NC}"
        else
            echo -e "${GREEN}✅ Security headers already configured${NC}"
        fi
        rm "public/.htaccess.security"
    fi
}

# Function to configure Laravel for HTTPS
configure_laravel_https() {
    echo -e "\n${YELLOW}⚙️  Configuring Laravel for HTTPS...${NC}"
    
    # Clear configuration cache
    php artisan config:clear
    
    # Create HTTPS service provider if it doesn't exist
    if [ ! -f "app/Providers/HttpsServiceProvider.php" ]; then
        mkdir -p app/Providers
        cat > "app/Providers/HttpsServiceProvider.php" << 'EOF'
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Schema;

class HttpsServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Force HTTPS in production
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
        
        // Set default string length for MySQL
        Schema::defaultStringLength(191);
        
        // Force HTTPS for asset URLs
        if (request()->isSecure()) {
            $this->app['url']->forceScheme('https');
        }
    }

    public function register()
    {
        //
    }
}
EOF
        
        # Add to config/app.php providers array
        echo -e "${GREEN}✅ HTTPS service provider created${NC}"
        echo -e "${YELLOW}📝 Don't forget to add App\\Providers\\HttpsServiceProvider::class to config/app.php providers array${NC}"
    fi
    
    # Cache configuration
    php artisan config:cache
    echo -e "${GREEN}✅ Laravel configured for HTTPS${NC}"
}

# Function to test HTTPS configuration
test_https() {
    echo -e "\n${YELLOW}🧪 Testing HTTPS configuration...${NC}"
    
    # Test HTTPS response
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ HTTPS site is accessible${NC}"
    else
        echo -e "${RED}❌ HTTPS site returned status: $HTTP_STATUS${NC}"
    fi
    
    # Test HTTP to HTTPS redirect
    REDIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" || echo "000")
    if [ "$REDIRECT_STATUS" = "301" ] || [ "$REDIRECT_STATUS" = "302" ]; then
        echo -e "${GREEN}✅ HTTP to HTTPS redirect is working${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTP redirect returned status: $REDIRECT_STATUS${NC}"
    fi
    
    # Test security headers
    SECURITY_HEADERS=$(curl -s -I "https://$DOMAIN" | grep -i "strict-transport-security\|x-frame-options\|x-content-type-options" | wc -l)
    if [ "$SECURITY_HEADERS" -gt 0 ]; then
        echo -e "${GREEN}✅ Security headers are present${NC}"
    else
        echo -e "${YELLOW}⚠️  Security headers not detected${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Starting SSL configuration for $DOMAIN...${NC}"
    
    # Check if SSL certificate exists
    if check_ssl; then
        echo -e "\n${GREEN}SSL certificate is installed. Configuring application...${NC}"
        
        configure_env_https
        configure_htaccess_https
        add_security_headers
        configure_laravel_https
        test_https
        
        echo -e "\n${GREEN}🎉 SSL configuration completed!${NC}"
        echo -e "${BLUE}📋 Summary:${NC}"
        echo "✅ Environment configured for HTTPS"
        echo "✅ .htaccess updated with HTTPS redirect"
        echo "✅ Security headers added"
        echo "✅ Laravel configured for HTTPS"
        echo "✅ Configuration tested"
        
        echo -e "\n${YELLOW}📝 Next Steps:${NC}"
        echo "1. Test your website: https://$DOMAIN"
        echo "2. Use SSL testing tools: https://www.ssllabs.com/ssltest/"
        echo "3. Check security headers: https://securityheaders.com/"
        echo "4. Monitor SSL certificate expiration"
        
    else
        echo -e "\n${RED}❌ SSL certificate not found!${NC}"
        echo -e "${YELLOW}📝 To install SSL certificate:${NC}"
        echo "1. Go to cPanel → SSL/TLS"
        echo "2. Use Let's Encrypt (free) or upload your certificate"
        echo "3. Run this script again after SSL installation"
    fi
}

# Run main function
main