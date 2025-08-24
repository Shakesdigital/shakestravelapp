#!/bin/bash

# ShakesTravel File Backup Script
# Creates backup of application files excluding unnecessary directories

set -e

# Configuration
APP_DIR="$HOME/shakestravel-laravel"
BACKUP_DIR="$HOME/backups/files"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=14

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}📁 ShakesTravel File Backup Started${NC}"
echo "Date: $(date)"
echo "Source: $APP_DIR"
echo "Backup Directory: $BACKUP_DIR"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create application backup
BACKUP_FILE="$BACKUP_DIR/shakestravel_files_$DATE.tar.gz"
echo -e "${YELLOW}📦 Creating file backup...${NC}"

if tar -czf "$BACKUP_FILE" \
    -C "$(dirname "$APP_DIR")" \
    --exclude='node_modules' \
    --exclude='storage/logs/*.log' \
    --exclude='storage/framework/cache/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/views/*' \
    --exclude='bootstrap/cache/*.php' \
    --exclude='.git' \
    --exclude='vendor' \
    --exclude='*.log' \
    "$(basename "$APP_DIR")"; then
    
    echo -e "${GREEN}✅ File backup created: $BACKUP_FILE${NC}"
    
    # Get file size
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}📊 Backup size: $FILE_SIZE${NC}"
    
    # Remove old backups
    echo -e "${YELLOW}🧹 Cleaning old file backups (older than $RETENTION_DAYS days)...${NC}"
    find "$BACKUP_DIR" -name "shakestravel_files_*.tar.gz" -mtime +$RETENTION_DAYS -delete
    OLD_REMOVED=$(find "$BACKUP_DIR" -name "shakestravel_files_*.tar.gz" -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)
    
    if [ "$OLD_REMOVED" -gt 0 ]; then
        echo -e "${GREEN}✅ Removed $OLD_REMOVED old file backup(s)${NC}"
    else
        echo -e "${YELLOW}ℹ️  No old file backups to remove${NC}"
    fi
    
    # List current backups
    echo -e "${YELLOW}📋 Current file backups:${NC}"
    ls -lh "$BACKUP_DIR"/shakestravel_files_*.tar.gz | tail -3
    
    echo -e "${GREEN}🎉 File backup completed successfully!${NC}"
    
else
    echo -e "${RED}❌ File backup failed!${NC}"
    exit 1
fi

# Create a backup of just the storage/app directory (user uploads)
STORAGE_BACKUP_FILE="$BACKUP_DIR/shakestravel_storage_$DATE.tar.gz"
echo -e "${YELLOW}📸 Creating storage backup (user uploads)...${NC}"

if [ -d "$APP_DIR/storage/app/public" ]; then
    tar -czf "$STORAGE_BACKUP_FILE" -C "$APP_DIR" storage/app/public
    STORAGE_SIZE=$(du -h "$STORAGE_BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Storage backup created: $STORAGE_BACKUP_FILE ($STORAGE_SIZE)${NC}"
else
    echo -e "${YELLOW}⚠️  No storage/app/public directory found${NC}"
fi

echo "File backup process completed at: $(date)"