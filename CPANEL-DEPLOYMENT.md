# cPanel Deployment Guide for Shakes Travel

## 🚀 Quick Deployment Steps

### Files Ready for Upload
The static build files are located in:
```
frontend/out/
```

### Complete Deployment Process

#### 1. Clear cPanel public_html
- Login to cPanel
- Go to Files → File Manager
- Navigate to public_html
- **Delete ALL existing files**

#### 2. Upload Static Files
Upload ALL contents from `frontend/out/` to `public_html`:
- index.html (main homepage)
- .htaccess (URL routing configuration)
- _next/ (static assets folder)
- admin/ (admin pages)
- auth/ (authentication pages)
- All other HTML files and folders

#### 3. Set File Permissions
- Files: 644 (readable by all)
- Folders: 755 (executable by all)

#### 4. Test Website
Visit: https://www.shakestravel.com

## ✅ What This Fixes
- Resolves 503 Service Unavailable error
- Enables proper client-side routing
- Sets up API proxy to Netlify backend
- Optimizes performance with compression
- Adds security headers

## 📁 Key Files Included
- **index.html**: Homepage (122KB)
- **.htaccess**: Server configuration (2.7KB)
- **_next/**: Optimized assets and JavaScript
- **404.html**: Error page
- **All page routes**: Pre-built static HTML

## 🔧 Build Information
- Next.js version: 15.4.6
- Build output: Static export
- Total files: ~100 static pages
- Asset optimization: Enabled
- Image optimization: Disabled for shared hosting

## 🆘 Troubleshooting
If 503 error persists:
1. Verify all files uploaded to public_html (not in subfolder)
2. Check .htaccess file exists and has correct content
3. Ensure file permissions are correct
4. Clear browser cache (Ctrl+Shift+R)
5. Check cPanel error logs

## 📞 Support
The static files replace the need for Node.js server-side rendering,
making the app compatible with standard shared hosting environments.