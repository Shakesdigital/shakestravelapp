# Deployment Guide - Shakes Travel

## Overview

Shakes Travel is deployed on Netlify with automatic deployments from the main branch.

## Deployment Configuration

### Platform
- **Provider**: Netlify
- **Build Time**: 2-3 minutes
- **Live URL**: https://main--shakestravel.netlify.app
- **Custom Domain**: https://shakestravel.com

### Build Settings

```yaml
# Build Command
cd frontend && npm run build

# Publish Directory
frontend/.next

# Node Version
18.x
```

## Deployment Process

### Automatic Deployment (Default)

1. Make changes to the code
2. Commit changes:
   ```bash
   git add .
   git commit -m "feat: your descriptive message"
   ```
3. Push to main branch:
   ```bash
   git push origin main
   ```
4. Netlify automatically detects push and starts building
5. Site is live in 2-3 minutes

### Manual Deployment

```bash
# Trigger deployment without code changes
git commit --allow-empty -m "trigger deploy"
git push origin main
```

## Local Testing

```bash
# Development server
cd frontend
npm run dev
# Visit http://localhost:3000

# Production build test
cd frontend
npm run build
npm start
```

## Environment Variables

Configure in Netlify Dashboard → Site Settings → Environment Variables:

```bash
NETLIFY_IDENTITY_URL=your-site-identity-url
NEXT_PUBLIC_SITE_URL=https://shakestravel.com
```

## Custom Domain Setup

1. Netlify Dashboard → Domain Settings
2. Add custom domain: `shakestravel.com`
3. Configure DNS records
4. SSL certificate auto-provisioned

## Troubleshooting

### Build Failures
- Check Netlify build logs
- Verify Node version (18.x required)
- Clear cache: `netlify build --clear-cache`

### Site Not Updating
- Clear browser cache
- Check Netlify deploy log for errors
- Trigger manual deploy

### Custom Domain 503 Error
- Check SSL certificate status
- Verify DNS configuration
- Contact Netlify support if persists

## Rollback

1. Netlify Dashboard → Deploys
2. Find last working deployment
3. Click "Publish deploy"

## Monitoring

- **Build Status**: Netlify Dashboard → Deploys
- **Performance**: Lighthouse scores in dashboard
- **Uptime**: 99.9% guaranteed by Netlify

---

Last Updated: 2025-10-11