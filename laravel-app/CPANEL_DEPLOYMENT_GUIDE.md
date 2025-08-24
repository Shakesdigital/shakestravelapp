# ShakesTravel Laravel cPanel Deployment Guide

## 🚀 Complete Step-by-Step Deployment to www.shakestravel.com

### Prerequisites Checklist
- [ ] cPanel account with PHP 8.2+ support
- [ ] Access to cPanel File Manager, phpMyAdmin, and Terminal
- [ ] Domain www.shakestravel.com pointed to your hosting account
- [ ] Composer access in cPanel
- [ ] Git access in cPanel (preferred) or zip upload capability

---

## PHASE 1: Pre-Deployment Preparation

### Step 1: Verify PHP Version and Extensions

**Via cPanel > PHP Selector:**
1. Set PHP version to **8.2 or higher**
2. Enable required extensions:
   - ✅ BCMath
   - ✅ Ctype
   - ✅ Fileinfo
   - ✅ JSON
   - ✅ Mbstring
   - ✅ OpenSSL
   - ✅ PDO
   - ✅ PDO_MySQL
   - ✅ Tokenizer
   - ✅ XML
   - ✅ Zip

**Via Terminal (if available):**
```bash
php -v
php -m | grep -i "bcmath\|ctype\|fileinfo\|json\|mbstring\|openssl\|pdo\|tokenizer\|xml\|zip"
```

---

## PHASE 2: Upload Application Files

### Option A: Git Clone (Recommended)

**1. Access cPanel Terminal and navigate to home directory:**
```bash
cd ~
```

**2. Clone the repository:**
```bash
git clone https://github.com/yourusername/shakestravelapp-laravel.git shakestravel-laravel
cd shakestravel-laravel
```

**3. Set proper permissions:**
```bash
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod +x deploy-cpanel.sh
```

### Option B: Zip Upload via File Manager

**1. Create deployment zip file locally:**
```bash
# On your local machine
cd "C:\Users\TECH DEAL\Desktop\shakestravelapp\laravel-app"
# Create a zip file excluding node_modules and other unnecessary files
```

**2. Upload via cPanel File Manager:**
- Navigate to your home directory (not public_html)
- Upload the zip file
- Extract it to a folder named `shakestravel-laravel`

---

## PHASE 3: Database Setup

### Step 1: Create Database in cPanel

**Via cPanel > MySQL Databases:**
1. Create database: `your_username_shakestravel`
2. Create user: `your_username_shakestravel`
3. Set strong password and note it down
4. Add user to database with ALL PRIVILEGES

### Step 2: Configure Database Connection

**Edit .env file:**
```bash
cd ~/shakestravel-laravel
cp .env.production .env
nano .env
```

**Update these lines in .env:**
```env
DB_DATABASE=your_actual_database_name
DB_USERNAME=your_actual_database_user
DB_PASSWORD=your_actual_database_password

APP_URL=https://www.shakestravel.com
APP_DEBUG=false
APP_ENV=production
```

### Step 3: Run Initial Database Setup

**Via phpMyAdmin:**
1. Select your database
2. Import the file: `database/cpanel-setup.sql`

---

## PHASE 4: Install Dependencies and Configure

### Step 1: Install Composer Dependencies

```bash
cd ~/shakestravel-laravel

# Install dependencies (production only)
composer install --optimize-autoloader --no-dev --no-interaction
```

### Step 2: Generate Application Key

```bash
php artisan key:generate --force
```

### Step 3: Run Database Migrations

```bash
php artisan migrate --force
```

### Step 4: Seed Production Data

```bash
php artisan db:seed --class=ProductionSeeder --force
```

### Step 5: Create Storage Link

```bash
php artisan storage:link
```

### Step 6: Set Correct Permissions

```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 .env
```

---

## PHASE 5: Configure Domain and Public Access

### Step 1: Set Document Root

**Via cPanel > Addon Domains or Subdomains:**
1. Point `www.shakestravel.com` to `/home/yourusername/shakestravel-laravel/public`

**Or create symbolic link in public_html:**
```bash
# Remove default public_html if empty
rm -rf ~/public_html/*

# Create symbolic link to Laravel public directory
ln -s ~/shakestravel-laravel/public/* ~/public_html/
```

### Step 2: Configure .htaccess Files

**Copy production .htaccess files:**
```bash
cd ~/shakestravel-laravel
cp .htaccess.production .htaccess
cp public/.htaccess.production public/.htaccess
```

---

## PHASE 6: Optimize for Production

### Step 1: Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Step 2: Build Frontend Assets (if Node.js available)

```bash
# Only if Node.js is available
npm ci --production
npm run build
```

---

## PHASE 7: Final Testing and Verification

### Step 1: Test Application

**Visit these URLs:**
- https://www.shakestravel.com - Homepage
- https://www.shakestravel.com/trips - Trips listing
- https://www.shakestravel.com/accommodations - Accommodations
- https://www.shakestravel.com/admin - Admin login

### Step 2: Test Admin Access

**Default admin credentials (CHANGE IMMEDIATELY):**
- Email: `admin@shakestravel.com`
- Password: `AdminShakes2025!`

### Step 3: Check Error Logs

```bash
tail -f ~/shakestravel-laravel/storage/logs/laravel.log
```

---

## PHASE 8: Security and Performance Setup

### Step 1: Configure SSL Certificate

**Via cPanel > SSL/TLS:**
1. Install SSL certificate (Let's Encrypt recommended)
2. Force HTTPS redirect
3. Uncomment HTTPS redirect lines in .htaccess files

### Step 2: Set Up Cron Jobs

**Via cPanel > Cron Jobs:**
Add this cron job to run every minute:
```bash
* * * * * cd /home/yourusername/shakestravel-laravel && php artisan schedule:run >> /dev/null 2>&1
```

### Step 3: Configure Email Settings

**Update .env with your hosting email settings:**
```env
MAIL_MAILER=smtp
MAIL_HOST=mail.shakestravel.com
MAIL_PORT=587
MAIL_USERNAME=noreply@shakestravel.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@shakestravel.com
MAIL_FROM_NAME="ShakesTravel"
```

---

## TROUBLESHOOTING COMMON ISSUES

### Issue 1: 500 Internal Server Error

**Diagnosis:**
```bash
tail -20 ~/shakestravel-laravel/storage/logs/laravel.log
```

**Common fixes:**
- Check file permissions: `chmod -R 755 storage bootstrap/cache`
- Verify .env file configuration
- Ensure database connection is working

### Issue 2: Composer Memory Limit

**If composer install fails:**
```bash
php -d memory_limit=512M /usr/local/bin/composer install --optimize-autoloader --no-dev
```

### Issue 3: Missing PHP Extensions

**Check available extensions:**
```bash
php -m
```

**Enable via cPanel > PHP Selector or contact hosting support**

### Issue 4: Database Connection Errors

**Test database connection:**
```bash
php artisan tinker
DB::connection()->getPdo();
```

### Issue 5: Storage Permission Issues

**Fix storage permissions:**
```bash
chown -R $USER:$USER ~/shakestravel-laravel/storage
chmod -R 775 ~/shakestravel-laravel/storage
```

---

## MAINTENANCE TASKS

### Daily Tasks
- Monitor error logs: `tail -f storage/logs/laravel.log`
- Check application status: visit homepage and admin panel

### Weekly Tasks
- Clear old log files: `php artisan log:clear`
- Update dependencies: `composer update` (test on staging first)

### Monthly Tasks
- Database backup via phpMyAdmin
- Review and optimize database queries
- Update SSL certificates if needed

---

## PERFORMANCE OPTIMIZATION

### Enable OPcache (if available)
```php
; Add to php.ini or .htaccess
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
```

### Database Optimization
```sql
-- Run monthly in phpMyAdmin
OPTIMIZE TABLE users, trips, accommodations, bookings, reviews;
```

### Monitor Resource Usage
```bash
# Check disk usage
du -sh ~/shakestravel-laravel

# Check database size
mysql -u username -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema='your_database_name' GROUP BY table_schema;"
```

---

## BACKUP STRATEGY

### Automated Database Backup Script
```bash
#!/bin/bash
# Save as ~/backup-database.sh
DATE=$(date +"%Y%m%d_%H%M%S")
mysqldump -u your_db_user -p'your_db_password' your_database_name > ~/backups/shakestravel_$DATE.sql
gzip ~/backups/shakestravel_$DATE.sql

# Keep only last 30 days of backups
find ~/backups -name "shakestravel_*.sql.gz" -mtime +30 -delete
```

### File Backup
```bash
# Weekly file backup
tar -czf ~/backups/shakestravel_files_$(date +%Y%m%d).tar.gz ~/shakestravel-laravel --exclude=node_modules --exclude=storage/logs
```

---

## SECURITY CHECKLIST

- [ ] SSL certificate installed and working
- [ ] Default admin password changed
- [ ] Database credentials secured
- [ ] .env file permissions set to 644
- [ ] Error display disabled (APP_DEBUG=false)
- [ ] Security headers configured in .htaccess
- [ ] Regular backups scheduled
- [ ] Monitoring set up for suspicious activities

---

## SUPPORT AND MONITORING

### Log Locations
- Laravel logs: `~/shakestravel-laravel/storage/logs/`
- Web server logs: Check cPanel Error Logs
- Database logs: Check cPanel MySQL logs

### Monitoring Commands
```bash
# Check application health
curl -I https://www.shakestravel.com

# Monitor database connections
mysqladmin -u username -p processlist

# Check disk usage
df -h

# Monitor memory usage
free -m
```

This completes your comprehensive cPanel deployment guide for the ShakesTravel Laravel application!