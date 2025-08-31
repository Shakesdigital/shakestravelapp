# Claude Code Configuration

## Project: Shakes Travel App

### Auto-Deploy Configuration
- **Auto-commit enabled**: YES
- **Auto-push enabled**: YES
- **Live site**: https://main--shakestravel.netlify.app
- **Custom domain**: https://shakestravel.com (❌ 503 Service Unavailable - SSL renewal needed)

### Development Workflow
All changes made by Claude Code are automatically:
1. Added to git staging
2. Committed with descriptive messages
3. Pushed to GitHub main branch
4. Deployed via Netlify webhook

### Site Status
- ✅ Frontend: Working (use Netlify URL)
- ✅ Backend API: Working
- ✅ Authentication: Fixed - works on Netlify Identity
- ❌ Custom domain: 503 Service Unavailable (SSL certificate issues)

### Working URLs
- **Main site**: https://main--shakestravel.netlify.app
- **Login**: https://main--shakestravel.netlify.app/auth/login
- **Register**: https://main--shakestravel.netlify.app/auth/register

### Known Issues
- ❌ Custom domain `shakestravel.com` returns 503 due to SSL certificate problems
- ⚠️ Google OAuth needs to be enabled in Netlify Identity dashboard

### Important Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Dev: `npm run dev`

### Last Updated
Date: 2025-08-31
By: Claude Code
Status: Authentication 503 errors fixed on Netlify URL