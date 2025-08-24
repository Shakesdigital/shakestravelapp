# ShakesTravel Laravel cPanel Troubleshooting Guide

## 🔧 Common Issues and Solutions

### Issue 1: 500 Internal Server Error

**Symptoms:**
- White screen or "Internal Server Error" message
- Cannot access any page of the application

**Diagnosis Steps:**
```bash
# Check Laravel logs
tail -20 ~/shakestravel-laravel/storage/logs/laravel.log

# Check web server error logs (via cPanel Error Logs)
# Look for recent entries
```

**Common Causes & Solutions:**

**A. File Permissions Issue**
```bash
cd ~/shakestravel-laravel
chmod -R 755 storage bootstrap/cache
chown -R $USER:$USER storage bootstrap/cache
```

**B. Missing .env file**
```bash
cp .env.production .env
php artisan key:generate --force
```

**C. Incorrect APP_KEY**
```bash
php artisan key:generate --force
php artisan config:cache
```

**D. Missing vendor directory**
```bash
composer install --optimize-autoloader --no-dev
```

---

### Issue 2: Database Connection Errors

**Symptoms:**
- "SQLSTATE[HY000] [1045] Access denied"
- "SQLSTATE[HY000] [2002] Connection refused"
- Migration errors

**Diagnosis:**
```bash
# Test database connection
php artisan tinker
# Then run: DB::connection()->getPdo();
```

**Solutions:**

**A. Verify Database Credentials**
```bash
# Edit .env file
nano ~/shakestravel-laravel/.env

# Verify these settings:
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_actual_database_name
DB_USERNAME=your_actual_username
DB_PASSWORD=your_actual_password
```

**B. Check Database Exists**
- Login to phpMyAdmin
- Verify database name matches .env
- Ensure user has proper privileges

**C. Test Connection Manually**
```bash
mysql -u your_username -p -h localhost your_database_name
```

---

### Issue 3: Composer Installation Failures

**Symptoms:**
- "Fatal error: Allowed memory size exhausted"
- "Package requirements could not be resolved"
- Timeout errors

**Solutions:**

**A. Memory Limit Issues**
```bash
# Increase memory limit for Composer
php -d memory_limit=512M $(which composer) install --optimize-autoloader --no-dev

# Or use Composer with no memory limit
php -d memory_limit=-1 $(which composer) install --optimize-autoloader --no-dev
```

**B. Clear Composer Cache**
```bash
composer clear-cache
rm composer.lock
composer install --optimize-autoloader --no-dev
```

**C. Use Different Composer Flags**
```bash
# For shared hosting with limited resources
composer install --optimize-autoloader --no-dev --prefer-dist --no-scripts
```

---

### Issue 4: Missing PHP Extensions

**Symptoms:**
- "Class 'BCMath' not found"
- "mbstring extension missing"
- Various extension-related errors

**Diagnosis:**
```bash
php -m | grep -i "bcmath\|ctype\|fileinfo\|json\|mbstring\|openssl\|pdo\|tokenizer\|xml\|zip"
```

**Solutions:**

**A. Via cPanel PHP Selector:**
1. Go to cPanel > PHP Selector
2. Switch to Extensions tab
3. Enable required extensions:
   - bcmath, ctype, fileinfo, json, mbstring, openssl, pdo, pdo_mysql, tokenizer, xml, zip

**B. Contact Hosting Support**
If extensions cannot be enabled via cPanel, contact your hosting provider.

---

### Issue 5: Permission Denied Errors

**Symptoms:**
- "Permission denied" errors in logs
- Cannot write to storage directory
- Session/cache issues

**Solutions:**

**A. Fix Storage Permissions**
```bash
cd ~/shakestravel-laravel
find storage -type d -exec chmod 775 {} \;
find storage -type f -exec chmod 664 {} \;
find bootstrap/cache -type d -exec chmod 775 {} \;
find bootstrap/cache -type f -exec chmod 664 {} \;
```

**B. Check Ownership**
```bash
chown -R $USER:$USER ~/shakestravel-laravel/storage
chown -R $USER:$USER ~/shakestravel-laravel/bootstrap/cache
```

**C. Verify Web Server User**
```bash
# Check what user the web server runs as
ps aux | grep apache
# or
ps aux | grep nginx
```

---

### Issue 6: Route Not Found (404 Errors)

**Symptoms:**
- Homepage works but other pages show 404
- "Route not found" errors

**Solutions:**

**A. Check .htaccess Files**
```bash
cd ~/shakestravel-laravel
# Ensure .htaccess exists in public directory
ls -la public/.htaccess

# If missing, copy from production template
cp public/.htaccess.production public/.htaccess
```

**B. Verify Document Root**
Ensure your domain points to `~/shakestravel-laravel/public` not just `~/shakestravel-laravel`

**C. Clear Route Cache**
```bash
php artisan route:clear
php artisan route:cache
```

---

### Issue 7: SSL/HTTPS Issues

**Symptoms:**
- Mixed content warnings
- Site not loading over HTTPS
- Redirect loops

**Solutions:**

**A. Force HTTPS in .htaccess**
Uncomment these lines in `public/.htaccess`:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**B. Update APP_URL in .env**
```env
APP_URL=https://www.shakestravel.com
```

**C. Clear Configuration Cache**
```bash
php artisan config:clear
php artisan config:cache
```

---

### Issue 8: Email Not Sending

**Symptoms:**
- Registration emails not received
- Password reset emails missing
- Contact forms not working

**Diagnosis:**
```bash
# Test email configuration
php artisan tinker
# Then: Mail::raw('Test message', function($msg) { $msg->to('test@example.com')->subject('Test'); });
```

**Solutions:**

**A. Verify Email Configuration**
```env
MAIL_MAILER=smtp
MAIL_HOST=mail.yourdomain.com
MAIL_PORT=587
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="ShakesTravel"
```

**B. Test with Different Settings**
Try different ports: 465 (SSL), 587 (TLS), 25 (unsecured)

**C. Check with Hosting Provider**
Some shared hosts require specific SMTP settings or have restrictions.

---

### Issue 9: Slow Performance

**Symptoms:**
- Pages load very slowly
- Timeouts
- High server resource usage

**Solutions:**

**A. Enable Caching**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

**B. Optimize Database**
```sql
-- Run in phpMyAdmin
OPTIMIZE TABLE users, trips, accommodations, bookings, reviews, payments;
```

**C. Enable OPcache (if available)**
Add to `.htaccess` or contact hosting provider:
```apache
php_value opcache.enable 1
php_value opcache.memory_consumption 128
php_value opcache.max_accelerated_files 4000
```

---

### Issue 10: Session Problems

**Symptoms:**
- Users getting logged out
- "Session expired" messages
- Cart/form data not persisting

**Solutions:**

**A. Check Session Configuration**
```env
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=.shakestravel.com
```

**B. Clear Sessions**
```bash
php artisan session:table
php artisan migrate
php artisan cache:clear
```

**C. Verify Session Table**
Check if `sessions` table exists in database and has correct structure.

---

## 🔍 Diagnostic Commands

### Laravel Health Check
```bash
cd ~/shakestravel-laravel
php artisan about
php artisan route:list
php artisan config:show
```

### System Information
```bash
php -v
php -m
df -h
free -m
ps aux | head
```

### Database Check
```bash
php artisan migrate:status
php artisan queue:work --once
mysql -u username -p -e "SHOW TABLES;" database_name
```

### Log Analysis
```bash
# View recent errors
tail -50 storage/logs/laravel.log

# Monitor in real-time
tail -f storage/logs/laravel.log

# Search for specific errors
grep -i "error\|exception\|failed" storage/logs/laravel.log | tail -20
```

---

## 📞 Getting Help

### Before Contacting Support
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check cPanel Error Logs
3. Verify PHP version and extensions
4. Confirm database connection
5. Test with diagnostic commands above

### Information to Provide
- PHP version: `php -v`
- Laravel version: `php artisan --version`
- Error messages from logs
- Steps that reproduce the issue
- Recent changes made

### Contact Information
- **Laravel Documentation**: https://laravel.com/docs
- **cPanel Documentation**: https://docs.cpanel.net/
- **Hosting Provider Support**: Your hosting company's support system

---

## 🚨 Emergency Recovery

### If Site is Completely Down
1. **Enable Maintenance Mode**:
   ```bash
   php artisan down --message="Site maintenance in progress"
   ```

2. **Restore from Backup** (if available):
   ```bash
   # Restore database
   mysql -u username -p database_name < backup.sql
   
   # Restore files
   tar -xzf backup.tar.gz
   ```

3. **Reset to Working State**:
   ```bash
   cd ~/shakestravel-laravel
   git checkout -- .
   composer install --optimize-autoloader --no-dev
   php artisan migrate:fresh --seed
   php artisan up
   ```

### Emergency Contacts
- Keep hosting provider support contact readily available
- Have database backup readily accessible
- Maintain list of recent changes for quick rollback

This troubleshooting guide should help resolve most common issues encountered during and after deployment.