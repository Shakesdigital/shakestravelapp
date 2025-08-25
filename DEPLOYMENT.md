# 🚀 Deployment Guide

## Auto-Deployment Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status.svg)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

## 🔄 Automatic Deployments

### Frontend (Netlify)
- **Triggers**: Every push to `main` branch
- **Build Time**: ~2-5 minutes
- **Live URL**: https://YOUR_SITE.netlify.app

### Backend (Render)
- **Triggers**: Every push to `main` branch
- **Build Time**: ~3-7 minutes  
- **Live URL**: https://shakestravel-backend.onrender.com

## 🎯 Deployment Process

1. **Make Changes** → Edit code locally
2. **Commit & Push** → `git add . && git commit -m "your message" && git push`
3. **Auto-Deploy** → Netlify & Render automatically deploy
4. **Live in Minutes** → Changes appear on live site

## 📊 Monitoring

- **Netlify Dashboard**: Monitor frontend deployments
- **Render Dashboard**: Monitor backend deployments
- **GitHub Actions**: View build logs and status

## 🔧 Manual Deploy (if needed)

### Force Netlify Redeploy:
```bash
# Trigger deployment without changes
git commit --allow-empty -m "trigger deploy"
git push origin main
```

### Local Testing:
```bash
# Frontend
cd frontend
npm run dev

# Backend  
cd backend
npm run dev
```

## 🚨 Troubleshooting

- **Build Fails**: Check GitHub Actions logs
- **Site Down**: Check Netlify/Render dashboards
- **API Errors**: Verify environment variables
- **Slow Loading**: Check if Render backend is sleeping (free tier)