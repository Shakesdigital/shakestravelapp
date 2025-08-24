#!/bin/bash

# ShakesTravel Health Check Script
# Monitors application health and sends alerts if issues detected

set -e

# Configuration
APP_DIR="$HOME/shakestravel-laravel"
SITE_URL="https://www.shakestravel.com"
LOG_FILE="$APP_DIR/storage/logs/health-check.log"
ALERT_EMAIL="admin@shakestravel.com"
MAX_RESPONSE_TIME=10  # seconds
MAX_LOG_SIZE_MB=100

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Function to send alert (customize based on your email setup)
send_alert() {
    local subject="$1"
    local message="$2"
    
    # Simple mail command (if available)
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
    fi
    
    # Log the alert
    log_message "${RED}ALERT: $subject - $message${NC}"
}

echo -e "${BLUE}🏥 ShakesTravel Health Check Starting${NC}"
echo "Time: $(date)"
echo "Site: $SITE_URL"
echo "App Directory: $APP_DIR"

cd "$APP_DIR"

# Initialize status
OVERALL_STATUS="HEALTHY"
ISSUES=()

# Check 1: Website Accessibility
echo -e "\n${YELLOW}🌐 Checking website accessibility...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}:%{time_total}" -m "$MAX_RESPONSE_TIME" "$SITE_URL" || echo "000:timeout")
HTTP_CODE=$(echo "$RESPONSE" | cut -d':' -f1)
RESPONSE_TIME=$(echo "$RESPONSE" | cut -d':' -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Website is accessible (HTTP $HTTP_CODE)${NC}"
    echo -e "${GREEN}⏱️  Response time: ${RESPONSE_TIME}s${NC}"
    
    if (( $(echo "$RESPONSE_TIME > 5.0" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Slow response time detected${NC}"
        ISSUES+=("Slow response time: ${RESPONSE_TIME}s")
    fi
else
    echo -e "${RED}❌ Website is not accessible (HTTP $HTTP_CODE)${NC}"
    OVERALL_STATUS="CRITICAL"
    ISSUES+=("Website not accessible: HTTP $HTTP_CODE")
fi

# Check 2: Database Connection
echo -e "\n${YELLOW}🗄️  Checking database connection...${NC}"
if php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database OK';" 2>/dev/null | grep -q "Database OK"; then
    echo -e "${GREEN}✅ Database connection is working${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    OVERALL_STATUS="CRITICAL"
    ISSUES+=("Database connection failed")
fi

# Check 3: Disk Space
echo -e "\n${YELLOW}💾 Checking disk space...${NC}"
DISK_USAGE=$(df -h "$HOME" | awk 'NR==2 {print $5}' | sed 's/%//')
echo -e "${BLUE}📊 Disk usage: ${DISK_USAGE}%${NC}"

if [ "$DISK_USAGE" -gt 90 ]; then
    echo -e "${RED}❌ Disk space critically low${NC}"
    OVERALL_STATUS="CRITICAL"
    ISSUES+=("Disk space critically low: ${DISK_USAGE}%")
elif [ "$DISK_USAGE" -gt 80 ]; then
    echo -e "${YELLOW}⚠️  Disk space warning${NC}"
    ISSUES+=("Disk space warning: ${DISK_USAGE}%")
else
    echo -e "${GREEN}✅ Disk space is adequate${NC}"
fi

# Check 4: Log File Sizes
echo -e "\n${YELLOW}📋 Checking log file sizes...${NC}"
if [ -f "storage/logs/laravel.log" ]; then
    LOG_SIZE_MB=$(du -m "storage/logs/laravel.log" | cut -f1)
    echo -e "${BLUE}📊 Laravel log size: ${LOG_SIZE_MB}MB${NC}"
    
    if [ "$LOG_SIZE_MB" -gt "$MAX_LOG_SIZE_MB" ]; then
        echo -e "${YELLOW}⚠️  Large log file detected${NC}"
        ISSUES+=("Large log file: ${LOG_SIZE_MB}MB")
        
        # Rotate the log file
        mv "storage/logs/laravel.log" "storage/logs/laravel.log.$(date +%Y%m%d_%H%M%S)"
        touch "storage/logs/laravel.log"
        echo -e "${GREEN}✅ Log file rotated${NC}"
    fi
else
    echo -e "${GREEN}✅ No large log files${NC}"
fi

# Check 5: Storage Permissions
echo -e "\n${YELLOW}🔐 Checking storage permissions...${NC}"
if [ -w "storage/logs" ] && [ -w "storage/framework" ] && [ -w "bootstrap/cache" ]; then
    echo -e "${GREEN}✅ Storage permissions are correct${NC}"
else
    echo -e "${RED}❌ Storage permission issues detected${NC}"
    OVERALL_STATUS="WARNING"
    ISSUES+=("Storage permission issues")
fi

# Check 6: Recent Errors in Laravel Log
echo -e "\n${YELLOW}🔍 Checking for recent errors...${NC}"
if [ -f "storage/logs/laravel.log" ]; then
    RECENT_ERRORS=$(tail -50 "storage/logs/laravel.log" | grep -i "error\|exception\|failed" | wc -l)
    if [ "$RECENT_ERRORS" -gt 10 ]; then
        echo -e "${RED}❌ High number of recent errors: $RECENT_ERRORS${NC}"
        OVERALL_STATUS="WARNING"
        ISSUES+=("High error count: $RECENT_ERRORS recent errors")
    elif [ "$RECENT_ERRORS" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Some recent errors detected: $RECENT_ERRORS${NC}"
        ISSUES+=("Recent errors: $RECENT_ERRORS")
    else
        echo -e "${GREEN}✅ No recent errors in logs${NC}"
    fi
fi

# Check 7: Queue Status (if using queues)
echo -e "\n${YELLOW}📬 Checking queue status...${NC}"
FAILED_JOBS=$(php artisan queue:failed --format=json 2>/dev/null | jq length 2>/dev/null || echo "0")
if [ "$FAILED_JOBS" -gt 5 ]; then
    echo -e "${YELLOW}⚠️  Failed jobs detected: $FAILED_JOBS${NC}"
    ISSUES+=("Failed jobs: $FAILED_JOBS")
else
    echo -e "${GREEN}✅ Queue status is normal${NC}"
fi

# Check 8: SSL Certificate (if HTTPS)
echo -e "\n${YELLOW}🔒 Checking SSL certificate...${NC}"
if echo | openssl s_client -servername www.shakestravel.com -connect www.shakestravel.com:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
    EXPIRY_DATE=$(echo | openssl s_client -servername www.shakestravel.com -connect www.shakestravel.com:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null || echo "0")
    CURRENT_TIMESTAMP=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
    
    if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ] && [ "$DAYS_UNTIL_EXPIRY" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  SSL certificate expires in $DAYS_UNTIL_EXPIRY days${NC}"
        ISSUES+=("SSL certificate expires in $DAYS_UNTIL_EXPIRY days")
    elif [ "$DAYS_UNTIL_EXPIRY" -le 0 ]; then
        echo -e "${RED}❌ SSL certificate has expired${NC}"
        OVERALL_STATUS="CRITICAL"
        ISSUES+=("SSL certificate expired")
    else
        echo -e "${GREEN}✅ SSL certificate is valid (expires in $DAYS_UNTIL_EXPIRY days)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Could not check SSL certificate${NC}"
fi

# Generate Health Report
echo -e "\n${BLUE}📊 HEALTH REPORT${NC}"
echo "=================="
echo -e "Overall Status: ${OVERALL_STATUS}"
echo "Timestamp: $(date)"
echo "Checks Performed: 8"

if [ ${#ISSUES[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed - System is healthy!${NC}"
    log_message "Health check completed - System healthy"
else
    echo -e "\n${YELLOW}⚠️  Issues detected:${NC}"
    for issue in "${ISSUES[@]}"; do
        echo "  - $issue"
    done
    log_message "Health check completed - ${#ISSUES[@]} issues detected"
    
    # Send alert if critical status
    if [ "$OVERALL_STATUS" = "CRITICAL" ]; then
        send_alert "ShakesTravel Critical Alert" "Critical issues detected: $(printf '%s, ' "${ISSUES[@]}")"
    fi
fi

# Cleanup old health check logs (keep last 30 days)
find "$(dirname "$LOG_FILE")" -name "health-check.log.*" -mtime +30 -delete 2>/dev/null || true

echo -e "\n${BLUE}Health check completed at: $(date)${NC}"