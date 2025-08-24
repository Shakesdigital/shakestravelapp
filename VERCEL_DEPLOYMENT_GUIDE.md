# Vercel Deployment Guide - Shakes Travel App

Complete guide to deploy your Shakes Travel App on Vercel with the custom domain www.shakestravel.com.

## 🚀 **Quick Deployment Steps**

### **Step 1: Deploy to Vercel**
1. **Visit [vercel.com](https://vercel.com)** and login with your Gmail account
2. **Click "New Project"**
3. **Import Repository**: Select `Shakesdigital/shakestravelapp`
4. **Configure Project**:
   - **Project Name**: `shakestravel-app`
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`

### **Step 2: Environment Variables**
Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Required
NEXT_PUBLIC_API_URL=https://shakestravel-dashboard.up.railway.app
NEXT_TELEMETRY_DISABLED=1

# Optional (add your actual API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

### **Step 3: Add Custom Domain**
1. **Go to Project Settings → Domains**
2. **Add Domain**: `www.shakestravel.com`
3. **Add Domain**: `shakestravel.com` (for redirect)
4. **Set Primary**: Make `www.shakestravel.com` the primary domain

### **Step 4: DNS Configuration**
Update your domain registrar's DNS settings:

```bash
# For www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com

# For root domain  
Type: A
Name: @ (or root)
Value: 76.76.19.61
```

## 🛠️ **Features Configured**

### **Performance Optimizations**
- ✅ **Next.js 15** with Turbopack for fast builds
- ✅ **Image optimization** with Vercel's built-in system
- ✅ **Global CDN** for worldwide fast loading
- ✅ **Automatic compression** and minification
- ✅ **Package optimization** for smaller bundles

### **Security Features**
- ✅ **HTTPS enforcement** (automatic SSL)
- ✅ **Security headers** (XSS, CSRF protection)
- ✅ **Content Security Policy**
- ✅ **Frame protection** against clickjacking

### **SEO & Analytics Ready**
- ✅ **Meta tags** optimized for search engines
- ✅ **Open Graph** tags for social sharing
- ✅ **Structured data** for rich snippets
- ✅ **Sitemap** generation ready

## 🔄 **Auto-Deployment Workflow**

Every time you push to your `main` branch on GitHub:
1. **Vercel detects** the push automatically
2. **Builds** the Next.js application
3. **Deploys** to global CDN
4. **Updates** your live website
5. **Sends notification** of deployment status

## 🌍 **Your Live URLs**

After deployment, your site will be available at:
- **Primary**: https://www.shakestravel.com
- **Vercel URL**: https://shakestravel-app.vercel.app
- **Redirects**: http://shakestravel.com → https://www.shakestravel.com

## 📊 **Backend Integration**

Your frontend is configured to connect to:
- **API URL**: https://shakestravel-dashboard.up.railway.app
- **Ensure Railway backend is running**
- **CORS configured** for www.shakestravel.com

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript/ESLint errors

2. **Domain Not Working**:
   - Verify DNS records are correct
   - Wait 24-48 hours for full propagation
   - Check domain isn't parked elsewhere

3. **API Connection Issues**:
   - Verify Railway backend is running
   - Check environment variables in Vercel
   - Ensure CORS is properly configured

### **Performance Monitoring**
- **Vercel Analytics**: Built-in performance insights
- **Web Vitals**: Core performance metrics
- **Real User Monitoring**: Actual user experience data

## 🚀 **Advanced Features**

### **Preview Deployments**
- Every PR gets a unique preview URL
- Test changes before merging to main
- Share with team for review

### **Edge Functions** (Future Enhancement)
- API routes run at the edge
- Faster response times globally
- Serverless architecture

### **A/B Testing** (Future Enhancement)  
- Split traffic between versions
- Test different features
- Data-driven decisions

## 📈 **Post-Deployment Checklist**

- [ ] **SSL Certificate** active and valid
- [ ] **Custom domain** resolving correctly
- [ ] **All pages loading** without errors
- [ ] **API connection** working
- [ ] **Images optimized** and loading fast
- [ ] **Mobile responsiveness** verified
- [ ] **SEO meta tags** in place
- [ ] **Analytics** configured (if needed)

---

## 🎉 **Congratulations!**

Your Shakes Travel App is now live on Vercel with:
- ⚡ **Lightning-fast performance**
- 🔒 **Enterprise-grade security**
- 🌍 **Global CDN distribution**
- 🔄 **Automatic deployments**
- 📱 **Mobile-optimized experience**

**Your professional travel website is ready to welcome visitors at www.shakestravel.com!**