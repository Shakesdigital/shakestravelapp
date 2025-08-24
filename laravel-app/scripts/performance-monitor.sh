#!/bin/bash

# ShakesTravel Performance Monitoring Script
# Monitors application performance and generates reports

set -e

# Configuration
APP_DIR="$HOME/shakestravel-laravel"
SITE_URL="https://www.shakestravel.com"
REPORT_DIR="$APP_DIR/storage/reports"
DATE=$(date +"%Y%m%d_%H%M%S")

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 ShakesTravel Performance Monitor${NC}"
echo "=================================="
echo "Time: $(date)"

cd "$APP_DIR"
mkdir -p "$REPORT_DIR"

# Performance metrics
REPORT_FILE="$REPORT_DIR/performance_$DATE.txt"

# Function to test page load time
test_page_load() {
    local url="$1"
    local page_name="$2"
    
    echo -n "Testing $page_name... "
    
    RESPONSE=$(curl -w "@-" -s -o /dev/null "$url" <<< '
    time_namelookup:    %{time_namelookup}
    time_connect:       %{time_connect}
    time_appconnect:    %{time_appconnect}
    time_pretransfer:   %{time_pretransfer}
    time_redirect:      %{time_redirect}
    time_starttransfer: %{time_starttransfer}
    time_total:         %{time_total}
    http_code:          %{http_code}
    size_download:      %{size_download}
    ')
    
    TOTAL_TIME=$(echo "$RESPONSE" | grep "time_total:" | awk '{print $2}')
    HTTP_CODE=$(echo "$RESPONSE" | grep "http_code:" | awk '{print $2}')
    SIZE_DOWNLOAD=$(echo "$RESPONSE" | grep "size_download:" | awk '{print $2}')
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}${TOTAL_TIME}s (${SIZE_DOWNLOAD} bytes)${NC}"
    else
        echo -e "${RED}HTTP $HTTP_CODE${NC}"
    fi
    
    echo "$page_name: ${TOTAL_TIME}s (HTTP $HTTP_CODE, ${SIZE_DOWNLOAD} bytes)" >> "$REPORT_FILE"
}

# Function to check database performance
check_database_performance() {
    echo -e "\n${YELLOW}🗄️  Database Performance Check${NC}"
    
    # Test database connection time
    DB_START=$(date +%s.%N)
    php artisan tinker --execute="DB::connection()->getPdo(); echo 'OK';" > /dev/null 2>&1
    DB_END=$(date +%s.%N)
    DB_TIME=$(echo "$DB_END - $DB_START" | bc)
    
    echo "Database connection time: ${DB_TIME}s" >> "$REPORT_FILE"
    echo -e "Database connection: ${GREEN}${DB_TIME}s${NC}"
    
    # Check slow queries (if enabled)
    if mysql -u "$(grep DB_USERNAME .env | cut -d'=' -f2)" -p"$(grep DB_PASSWORD .env | cut -d'=' -f2)" -e "SHOW VARIABLES LIKE 'slow_query_log';" "$(grep DB_DATABASE .env | cut -d'=' -f2)" 2>/dev/null | grep -q "ON"; then
        SLOW_QUERIES=$(mysql -u "$(grep DB_USERNAME .env | cut -d'=' -f2)" -p"$(grep DB_PASSWORD .env | cut -d'=' -f2)" -e "SHOW STATUS LIKE 'Slow_queries';" "$(grep DB_DATABASE .env | cut -d'=' -f2)" 2>/dev/null | awk 'NR==2 {print $2}')
        echo "Slow queries count: $SLOW_QUERIES" >> "$REPORT_FILE"
        echo -e "Slow queries: ${YELLOW}$SLOW_QUERIES${NC}"
    fi
}

# Function to check system resources
check_system_resources() {
    echo -e "\n${YELLOW}💻 System Resources Check${NC}"
    
    # Disk usage
    DISK_USAGE=$(df -h "$HOME" | awk 'NR==2 {print $5}' | sed 's/%//')
    echo "Disk usage: ${DISK_USAGE}%" >> "$REPORT_FILE"
    echo -e "Disk usage: ${BLUE}${DISK_USAGE}%${NC}"
    
    # Memory usage (if available)
    if command -v free &> /dev/null; then
        MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
        echo "Memory usage: ${MEMORY_USAGE}%" >> "$REPORT_FILE"
        echo -e "Memory usage: ${BLUE}${MEMORY_USAGE}%${NC}"
    fi
    
    # Load average (if available)
    if [ -f /proc/loadavg ]; then
        LOAD_AVG=$(cat /proc/loadavg | awk '{print $1}')
        echo "Load average: $LOAD_AVG" >> "$REPORT_FILE"
        echo -e "Load average: ${BLUE}$LOAD_AVG${NC}"
    fi
}

# Function to check Laravel performance
check_laravel_performance() {
    echo -e "\n${YELLOW}🚀 Laravel Performance Check${NC}"
    
    # Check if caches are enabled
    if [ -f "bootstrap/cache/config.php" ]; then
        echo "Config cache: ENABLED" >> "$REPORT_FILE"
        echo -e "Config cache: ${GREEN}ENABLED${NC}"
    else
        echo "Config cache: DISABLED" >> "$REPORT_FILE"
        echo -e "Config cache: ${RED}DISABLED${NC}"
    fi
    
    if [ -f "bootstrap/cache/routes-v7.php" ]; then
        echo "Route cache: ENABLED" >> "$REPORT_FILE"
        echo -e "Route cache: ${GREEN}ENABLED${NC}"
    else
        echo "Route cache: DISABLED" >> "$REPORT_FILE"
        echo -e "Route cache: ${RED}DISABLED${NC}"
    fi
    
    # Check view cache directory
    VIEW_CACHE_COUNT=$(find storage/framework/views -name "*.php" 2>/dev/null | wc -l)
    echo "View cache files: $VIEW_CACHE_COUNT" >> "$REPORT_FILE"
    echo -e "View cache files: ${BLUE}$VIEW_CACHE_COUNT${NC}"
    
    # Check session storage
    SESSION_COUNT=$(find storage/framework/sessions -type f 2>/dev/null | wc -l)
    echo "Active sessions: $SESSION_COUNT" >> "$REPORT_FILE"
    echo -e "Active sessions: ${BLUE}$SESSION_COUNT${NC}"
}

# Function to analyze log files
analyze_logs() {
    echo -e "\n${YELLOW}📋 Log Analysis${NC}"
    
    if [ -f "storage/logs/laravel.log" ]; then
        # Count errors in last 24 hours
        YESTERDAY=$(date -d "1 day ago" +"%Y-%m-%d")
        ERRORS_24H=$(grep "$YESTERDAY\|$(date +%Y-%m-%d)" storage/logs/laravel.log | grep -i "error\|exception" | wc -l)
        echo "Errors (24h): $ERRORS_24H" >> "$REPORT_FILE"
        echo -e "Errors (24h): ${YELLOW}$ERRORS_24H${NC}"
        
        # Log file size
        LOG_SIZE=$(du -h storage/logs/laravel.log | cut -f1)
        echo "Log file size: $LOG_SIZE" >> "$REPORT_FILE"
        echo -e "Log file size: ${BLUE}$LOG_SIZE${NC}"
        
        # Most common errors
        echo -e "\nTop 5 error types:" >> "$REPORT_FILE"
        grep -i "error\|exception" storage/logs/laravel.log | tail -100 | awk -F'] ' '{print $3}' | sort | uniq -c | sort -rn | head -5 >> "$REPORT_FILE"
    fi
}

# Main performance test
main() {
    echo -e "${BLUE}Starting performance analysis...${NC}"
    
    # Initialize report
    echo "ShakesTravel Performance Report" > "$REPORT_FILE"
    echo "Generated: $(date)" >> "$REPORT_FILE"
    echo "========================================" >> "$REPORT_FILE"
    
    # Page load tests
    echo -e "\n${YELLOW}🌐 Page Load Performance${NC}"
    echo "" >> "$REPORT_FILE"
    echo "Page Load Times:" >> "$REPORT_FILE"
    
    test_page_load "$SITE_URL" "Homepage"
    test_page_load "$SITE_URL/trips" "Trips Page"
    test_page_load "$SITE_URL/accommodations" "Accommodations Page"
    test_page_load "$SITE_URL/admin" "Admin Panel"
    
    # Database performance
    check_database_performance
    
    # System resources
    check_system_resources
    
    # Laravel-specific checks
    check_laravel_performance
    
    # Log analysis
    analyze_logs
    
    # Generate recommendations
    echo -e "\n${YELLOW}💡 Performance Recommendations${NC}"
    echo "" >> "$REPORT_FILE"
    echo "Recommendations:" >> "$REPORT_FILE"
    
    # Check if caches should be enabled
    if [ ! -f "bootstrap/cache/config.php" ]; then
        echo "- Enable config cache: php artisan config:cache" >> "$REPORT_FILE"
        echo -e "${YELLOW}💡 Enable config cache${NC}"
    fi
    
    if [ ! -f "bootstrap/cache/routes-v7.php" ]; then
        echo "- Enable route cache: php artisan route:cache" >> "$REPORT_FILE"
        echo -e "${YELLOW}💡 Enable route cache${NC}"
    fi
    
    # Check log file size
    if [ -f "storage/logs/laravel.log" ]; then
        LOG_SIZE_MB=$(du -m storage/logs/laravel.log | cut -f1)
        if [ "$LOG_SIZE_MB" -gt 50 ]; then
            echo "- Rotate large log file (${LOG_SIZE_MB}MB)" >> "$REPORT_FILE"
            echo -e "${YELLOW}💡 Rotate large log file${NC}"
        fi
    fi
    
    # Check session files
    if [ "$SESSION_COUNT" -gt 1000 ]; then
        echo "- Clean up old session files ($SESSION_COUNT active)" >> "$REPORT_FILE"
        echo -e "${YELLOW}💡 Clean up old sessions${NC}"
    fi
    
    # Finalize report
    echo "" >> "$REPORT_FILE"
    echo "========================================" >> "$REPORT_FILE"
    echo "Report completed: $(date)" >> "$REPORT_FILE"
    
    # Display summary
    echo -e "\n${GREEN}📊 Performance Analysis Complete${NC}"
    echo "================================"
    echo "Report saved: $REPORT_FILE"
    echo ""
    echo -e "${BLUE}📋 Summary:${NC}"
    echo "- Page load times tested"
    echo "- Database performance checked"  
    echo "- System resources monitored"
    echo "- Laravel optimization reviewed"
    echo "- Log files analyzed"
    echo "- Recommendations generated"
    
    # Show recent reports
    echo -e "\n${YELLOW}📁 Recent Reports:${NC}"
    ls -lt "$REPORT_DIR"/performance_*.txt 2>/dev/null | head -5
    
    # Cleanup old reports (keep last 30)
    find "$REPORT_DIR" -name "performance_*.txt" -type f | sort -r | tail -n +31 | xargs -r rm
}

# Run main function
main