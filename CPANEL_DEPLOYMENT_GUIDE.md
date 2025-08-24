# cPanel Deployment Guide - Shakes Travel App

This guide will help you deploy your Shakes Travel App to cPanel hosting with the domain www.shakestravel.com.

## 🚀 Quick Deployment Steps

### 1. Build the Application Locally

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm ci

# Build for cPanel deployment
npm run build:cpanel
```

### 2. Upload to cPanel

1. **Access cPanel File Manager**
2. **Navigate to public_html directory**
3. **Upload all contents from `frontend/out/` folder**
4. **Ensure .htaccess file is included**

### 3. Domain Configuration

1. **In cPanel, go to Subdomains or Addon Domains**
2. **Ensure www.shakestravel.com points to public_html**
3. **Enable SSL certificate for the domain**

## 📁 File Structure After Deployment

```
public_html/
├── _next/                 # Next.js static assets
├── images/               # Your images
├── brand_assets/         # Brand assets
├── .htaccess            # Apache configuration
├── index.html           # Homepage
├── about.html           # About page
├── accommodations.html  # Accommodations page
└── ...                  # Other pages
```

## 🔧 Configuration Details

### Environment Variables
The app is configured with production environment variables:
- `NODE_ENV=production`
- `HOSTING_PLATFORM=cpanel`
- `NEXT_PUBLIC_API_URL=https://shakestravel-dashboard.up.railway.app`

### Features Enabled
- ✅ Static site generation
- ✅ SEO optimization
- ✅ Image optimization
- ✅ HTTPS redirect
- ✅ www subdomain enforcement
- ✅ Security headers
- ✅ File compression
- ✅ Browser caching

## 🌐 Domain Setup

### DNS Configuration
Ensure your domain registrar has these DNS records:

```
Type: A
Name: @
Value: [Your cPanel server IP]

Type: CNAME
Name: www
Value: shakestravel.com
```

### SSL Certificate
1. In cPanel, go to **SSL/TLS**
2. Click **Let's Encrypt** (if available)
3. Add certificate for both `shakestravel.com` and `www.shakestravel.com`

## 🔄 Update Process

When you make changes to your app:

1. **Pull latest changes** in cPanel Git
2. **Rebuild locally**: `npm run build:cpanel`
3. **Upload new files** from `out/` folder to public_html
4. **Clear browser cache** to see changes

## 📊 Backend API

Your frontend is configured to use the Railway backend:
- **API URL**: https://shakestravel-dashboard.up.railway.app
- **Ensure your Railway backend is running**
- **Configure CORS** to allow requests from www.shakestravel.com

## 🐛 Troubleshooting

### Common Issues

1. **404 Errors**: Ensure .htaccess file is uploaded and enabled
2. **Images not loading**: Check file paths and permissions
3. **API not working**: Verify backend URL and CORS settings
4. **SSL issues**: Force HTTPS redirect in .htaccess

### Performance Optimization

1. **Enable compression** in cPanel
2. **Set up CloudFlare** for CDN (optional)
3. **Monitor loading times** with Google PageSpeed Insights

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Verify all files are uploaded correctly
3. Test individual pages manually
4. Contact your hosting provider for server-specific issues

---

**Your Shakes Travel App is now ready for production on www.shakestravel.com!** 🎉