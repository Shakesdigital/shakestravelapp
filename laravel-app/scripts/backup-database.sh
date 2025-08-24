#!/bin/bash

# ShakesTravel Database Backup Script
# Run this daily via cron job

set -e

# Configuration
DB_NAME="your_cpanel_username_shakestravel"
DB_USER="your_cpanel_username_dbuser"
DB_PASS="your_database_password"
BACKUP_DIR="$HOME/backups/database"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🗄️  ShakesTravel Database Backup Started${NC}"
echo "Date: $(date)"
echo "Database: $DB_NAME"
echo "Backup Directory: $BACKUP_DIR"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create database backup
BACKUP_FILE="$BACKUP_DIR/shakestravel_db_$DATE.sql"
echo -e "${YELLOW}📦 Creating database backup...${NC}"

if mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --add-drop-database \
    --comments \
    --create-options \
    --dump-date \
    --lock-tables=false > "$BACKUP_FILE"; then
    
    echo -e "${GREEN}✅ Database backup created: $BACKUP_FILE${NC}"
    
    # Compress the backup
    gzip "$BACKUP_FILE"
    COMPRESSED_FILE="${BACKUP_FILE}.gz"
    echo -e "${GREEN}✅ Backup compressed: $COMPRESSED_FILE${NC}"
    
    # Get file size
    FILE_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
    echo -e "${GREEN}📊 Backup size: $FILE_SIZE${NC}"
    
    # Remove old backups
    echo -e "${YELLOW}🧹 Cleaning old backups (older than $RETENTION_DAYS days)...${NC}"
    find "$BACKUP_DIR" -name "shakestravel_db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    OLD_REMOVED=$(find "$BACKUP_DIR" -name "shakestravel_db_*.sql.gz" -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)
    
    if [ "$OLD_REMOVED" -gt 0 ]; then
        echo -e "${GREEN}✅ Removed $OLD_REMOVED old backup(s)${NC}"
    else
        echo -e "${YELLOW}ℹ️  No old backups to remove${NC}"
    fi
    
    # List current backups
    echo -e "${YELLOW}📋 Current backups:${NC}"
    ls -lh "$BACKUP_DIR"/shakestravel_db_*.sql.gz | tail -5
    
    echo -e "${GREEN}🎉 Database backup completed successfully!${NC}"
    
else
    echo -e "${RED}❌ Database backup failed!${NC}"
    exit 1
fi

# Optional: Upload to cloud storage (uncomment and configure as needed)
# echo -e "${YELLOW}☁️  Uploading to cloud storage...${NC}"
# rsync -av "$COMPRESSED_FILE" user@remote-server:/path/to/backups/
# echo -e "${GREEN}✅ Cloud backup completed${NC}"

echo "Backup process completed at: $(date)"