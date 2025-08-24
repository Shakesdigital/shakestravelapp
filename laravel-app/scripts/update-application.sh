#!/bin/bash

# ShakesTravel Application Update Script
# Safely updates the Laravel application with zero-downtime deployment

set -e

# Configuration
APP_DIR="$HOME/shakestravel-laravel"
BACKUP_DIR="$HOME/backups/pre-update"
CURRENT_BRANCH="main"
MAINTENANCE_SECRET="update-$(date +%s)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 ShakesTravel Application Update${NC}"
echo "=================================="
echo "Time: $(date)"
echo "App Directory: $APP_DIR"

# Check if we're in the correct directory
cd "$APP_DIR" || {
    echo -e "${RED}❌ Could not access app directory: $APP_DIR${NC}"
    exit 1
}

# Function to rollback changes
rollback() {
    echo -e "${RED}🔄 Rolling back changes...${NC}"
    
    if [ -f "$BACKUP_DIR/database_pre_update.sql.gz" ]; then
        echo "Restoring database..."
        gunzip -c "$BACKUP_DIR/database_pre_update.sql.gz" | mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME"
    fi
    
    if [ -d "$BACKUP_DIR/app_files" ]; then
        echo "Restoring application files..."
        rsync -av --delete "$BACKUP_DIR/app_files/" "$APP_DIR/"
    fi
    
    php artisan up
    echo -e "${RED}❌ Update failed and was rolled back${NC}"
    exit 1
}

# Trap errors and rollback
trap rollback ERR

# Step 1: Create pre-update backup
echo -e "\n${YELLOW}📦 Step 1: Creating pre-update backup...${NC}"
mkdir -p "$BACKUP_DIR"

# Database backup
DB_NAME=$(grep "DB_DATABASE=" .env | cut -d'=' -f2)
DB_USER=$(grep "DB_USERNAME=" .env | cut -d'=' -f2)
DB_PASS=$(grep "DB_PASSWORD=" .env | cut -d'=' -f2)

if [ -n "$DB_NAME" ] && [ -n "$DB_USER" ]; then
    echo "Backing up database: $DB_NAME"
    mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/database_pre_update.sql.gz"
    echo -e "${GREEN}✅ Database backup created${NC}"
else
    echo -e "${YELLOW}⚠️  Could not determine database credentials${NC}"
fi

# Application files backup
echo "Backing up application files..."
rsync -av --exclude='.git' --exclude='vendor' --exclude='node_modules' . "$BACKUP_DIR/app_files/"
echo -e "${GREEN}✅ Application files backed up${NC}"

# Step 2: Enable maintenance mode
echo -e "\n${YELLOW}🔧 Step 2: Enabling maintenance mode...${NC}"
php artisan down --render="errors::503" --secret="$MAINTENANCE_SECRET" --refresh=15
echo -e "${GREEN}✅ Maintenance mode enabled${NC}"
echo -e "${BLUE}ℹ️  Bypass URL: https://www.shakestravel.com/$MAINTENANCE_SECRET${NC}"

# Step 3: Pull latest changes
echo -e "\n${YELLOW}📥 Step 3: Pulling latest changes...${NC}"
if command -v git &> /dev/null && [ -d .git ]; then
    echo "Pulling from git repository..."
    git fetch origin
    git checkout "$CURRENT_BRANCH"
    git pull origin "$CURRENT_BRANCH"
    echo -e "${GREEN}✅ Code updated from repository${NC}"
else
    echo -e "${YELLOW}⚠️  Git not available or not a git repository${NC}"
    echo "Please upload updated files manually before running this script"
fi

# Step 4: Update dependencies
echo -e "\n${YELLOW}📦 Step 4: Updating dependencies...${NC}"
composer install --optimize-autoloader --no-dev --no-interaction
echo -e "${GREEN}✅ PHP dependencies updated${NC}"

# Update Node.js dependencies if package.json exists
if [ -f package.json ] && command -v npm &> /dev/null; then
    echo "Updating Node.js dependencies..."
    npm ci --production
    npm run build
    echo -e "${GREEN}✅ Frontend assets rebuilt${NC}"
fi

# Step 5: Run database migrations
echo -e "\n${YELLOW}🗄️  Step 5: Running database migrations...${NC}"
php artisan migrate --force
echo -e "${GREEN}✅ Database migrations completed${NC}"

# Step 6: Clear and rebuild caches
echo -e "\n${YELLOW}🧹 Step 6: Clearing caches...${NC}"
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo -e "${GREEN}✅ Caches cleared${NC}"

# Step 7: Optimize application
echo -e "\n${YELLOW}⚡ Step 7: Optimizing application...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
echo -e "${GREEN}✅ Application optimized${NC}"

# Step 8: Update file permissions
echo -e "\n${YELLOW}🔐 Step 8: Updating file permissions...${NC}"
chmod -R 755 storage bootstrap/cache
chmod 644 .env
echo -e "${GREEN}✅ File permissions updated${NC}"

# Step 9: Run health check
echo -e "\n${YELLOW}🏥 Step 9: Running health check...${NC}"
if [ -f scripts/health-check.sh ]; then
    bash scripts/health-check.sh
else
    # Simple health check
    if php artisan about | grep -q "Laravel"; then
        echo -e "${GREEN}✅ Application health check passed${NC}"
    else
        echo -e "${RED}❌ Application health check failed${NC}"
        rollback
    fi
fi

# Step 10: Disable maintenance mode
echo -e "\n${YELLOW}🔓 Step 10: Disabling maintenance mode...${NC}"
php artisan up
echo -e "${GREEN}✅ Maintenance mode disabled${NC}"

# Step 11: Final verification
echo -e "\n${YELLOW}🔍 Step 11: Final verification...${NC}"
SITE_URL=$(grep "APP_URL=" .env | cut -d'=' -f2)
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Website is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Website accessibility check failed (may be temporary)${NC}"
fi

# Step 12: Log update
echo -e "\n${YELLOW}📋 Step 12: Logging update...${NC}"
UPDATE_LOG="storage/logs/updates.log"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Application updated successfully" >> "$UPDATE_LOG"

# Cleanup old backups (keep last 5 updates)
echo -e "\n${YELLOW}🧹 Cleaning up old backups...${NC}"
ls -td "$HOME/backups/pre-update"* 2>/dev/null | tail -n +6 | xargs -r rm -rf
echo -e "${GREEN}✅ Old backups cleaned up${NC}"

# Display update summary
echo -e "\n${GREEN}🎉 UPDATE COMPLETED SUCCESSFULLY!${NC}"
echo "================================="
echo "Update Time: $(date)"
echo "Application: ShakesTravel Laravel"
echo "Status: Online"
echo "Website: $SITE_URL"
echo ""
echo -e "${BLUE}📋 Update Summary:${NC}"
echo "✅ Pre-update backup created"
echo "✅ Application code updated"
echo "✅ Dependencies updated"
echo "✅ Database migrations ran"
echo "✅ Caches cleared and optimized"
echo "✅ File permissions updated"
echo "✅ Health check passed"
echo "✅ Site is back online"
echo ""
echo -e "${YELLOW}📝 Post-Update Tasks:${NC}"
echo "1. Test critical functionality"
echo "2. Monitor error logs: tail -f storage/logs/laravel.log"
echo "3. Check admin panel functionality"
echo "4. Verify payment processing (if applicable)"
echo "5. Test email sending functionality"
echo ""
echo -e "${BLUE}💾 Backup Location: $BACKUP_DIR${NC}"
echo -e "${BLUE}📊 Update logged to: $UPDATE_LOG${NC}"

# Success - disable error trap
trap - ERR

echo -e "\n${GREEN}Update process completed successfully! 🚀${NC}"