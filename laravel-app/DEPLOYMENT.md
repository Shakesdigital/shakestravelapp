# ShakesTravel Laravel Deployment Guide

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Redis 7+
- Nginx/Apache
- SSL Certificate

## Environment Setup

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd shakestravelapp-laravel
composer install --optimize-autoloader --no-dev
npm install && npm run build
```

2. **Environment Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configure Environment Variables**
Edit `.env` file with your production settings:

```env
APP_NAME="ShakesTravel"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shakestravelapp
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com

CLOUDINARY_URL=your-cloudinary-url
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name

STRIPE_KEY=pk_live_your-stripe-key
STRIPE_SECRET=sk_live_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

GOOGLE_MAPS_API_KEY=your-google-maps-key
GOOGLE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
GOOGLE_RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

## Database Setup

1. **Create Database**
```sql
CREATE DATABASE shakestravelapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shakestravelapp_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON shakestravelapp.* TO 'shakestravelapp_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Run Migrations and Seeders**
```bash
php artisan migrate --force
php artisan db:seed --force
php artisan passport:install --force
```

## File Permissions

```bash
sudo chown -R www-data:www-data /path/to/shakestravelapp
sudo chmod -R 755 /path/to/shakestravelapp
sudo chmod -R 775 /path/to/shakestravelapp/storage
sudo chmod -R 775 /path/to/shakestravelapp/bootstrap/cache
```

## Nginx Configuration

Create `/etc/nginx/sites-available/shakestravelapp`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    root /path/to/shakestravelapp/public;

    # SSL Configuration
    ssl_certificate /path/to/ssl/fullchain.pem;
    ssl_certificate_key /path/to/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    index index.php;

    charset utf-8;

    # Handle Laravel routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM Configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Static Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Deny access to sensitive files
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Deny access to vendor
    location ~ /vendor/ {
        deny all;
        return 404;
    }

    # PHP files in storage
    location ~ /storage/.*\.php$ {
        deny all;
        return 404;
    }

    # Block access to .env and other sensitive files
    location ~ /(\.|composer\.(json|lock)|package\.json|yarn\.lock) {
        deny all;
        return 404;
    }

    # Set max upload size
    client_max_body_size 50M;

    # Error pages
    error_page 404 /index.php;

    # Logging
    access_log /var/log/nginx/shakestravelapp.access.log;
    error_log /var/log/nginx/shakestravelapp.error.log;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/shakestravelapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Queue and Scheduler Setup

1. **Supervisor for Queue Workers**
Create `/etc/supervisor/conf.d/shakestravelapp-worker.conf`:

```ini
[program:shakestravelapp-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/shakestravelapp/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/shakestravelapp/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start shakestravelapp-worker:*
```

2. **Cron Job for Scheduler**
```bash
sudo crontab -e
```

Add:
```cron
* * * * * cd /path/to/shakestravelapp && php artisan schedule:run >> /dev/null 2>&1
```

## SSL Certificate Setup (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Performance Optimization

1. **PHP Optimization**
Edit `/etc/php/8.2/fpm/php.ini`:
```ini
memory_limit = 512M
max_execution_time = 300
max_input_vars = 3000
upload_max_filesize = 50M
post_max_size = 50M
opcache.enable = 1
opcache.memory_consumption = 128
opcache.interned_strings_buffer = 8
opcache.max_accelerated_files = 4000
opcache.revalidate_freq = 2
opcache.fast_shutdown = 1
```

2. **Laravel Optimization**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

## Docker Deployment

1. **Using Docker Compose**
```bash
cp .env.example .env
# Edit .env with production values
docker-compose up -d
```

2. **Initialize Application**
```bash
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --force
docker-compose exec app php artisan optimize
```

## Monitoring and Logging

1. **Laravel Telescope (Development/Staging)**
```bash
php artisan telescope:install
php artisan migrate
```

2. **Log Rotation**
```bash
sudo nano /etc/logrotate.d/shakestravelapp
```

```
/path/to/shakestravelapp/storage/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        sudo systemctl reload nginx
    endscript
}
```

## Backup Strategy

1. **Database Backup Script**
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/shakestravelapp"
DB_NAME="shakestravelapp"
DB_USER="backup_user"
DB_PASSWORD="backup_password"

mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz

# Storage backup
tar -czf $BACKUP_DIR/storage_backup_$TIMESTAMP.tar.gz -C /path/to/shakestravelapp storage/app/public

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

2. **Automated Backup Cron**
```cron
0 2 * * * /path/to/backup-script.sh
```

## Security Checklist

- [ ] SSL certificate installed and configured
- [ ] Security headers configured in Nginx
- [ ] File permissions set correctly
- [ ] Database credentials secured
- [ ] API keys and secrets in environment variables
- [ ] Debug mode disabled in production
- [ ] Unnecessary files removed (.git, .env.example, etc.)
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] Input validation in place
- [ ] SQL injection protection (Eloquent ORM)
- [ ] XSS protection headers
- [ ] Regular security updates scheduled

## Troubleshooting

1. **Common Issues**
```bash
# Clear all caches
php artisan optimize:clear

# Fix storage permissions
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache

# Check logs
tail -f storage/logs/laravel.log
tail -f /var/log/nginx/shakestravelapp.error.log

# Queue not processing
sudo supervisorctl restart shakestravelapp-worker:*
```

2. **Performance Issues**
```bash
# Check database performance
php artisan db:monitor

# Monitor queues
php artisan queue:monitor redis:default

# Check Horizon dashboard
# Visit: https://your-domain.com/horizon
```

## Maintenance Mode

```bash
# Enable maintenance mode
php artisan down --refresh=15 --retry=60 --secret="your-secret-token"

# Disable maintenance mode
php artisan up
```

## Updates and Deployment

1. **Zero-downtime Deployment Script**
```bash
#!/bin/bash
cd /path/to/shakestravelapp

# Pull latest code
git pull origin main

# Install dependencies
composer install --optimize-autoloader --no-dev
npm ci && npm run build

# Clear caches and optimize
php artisan down
php artisan migrate --force
php artisan optimize
php artisan up

# Restart services
sudo supervisorctl restart shakestravelapp-worker:*
sudo systemctl reload nginx php8.2-fpm
```

This deployment guide ensures a secure, performant, and maintainable Laravel application deployment for ShakesTravel.