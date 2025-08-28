# Netlify Identity with Google OAuth Setup Guide

This guide will help you configure Google OAuth authentication using Netlify Identity for your Shakes Travel website.

## 🚀 Quick Setup Overview

1. **Google Cloud Console Setup**
2. **Netlify Identity Configuration**
3. **Deploy and Test**

---

## 📋 Step 1: Google Cloud Console Setup

### 1.1 Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API:
   - Navigate to **APIs & Services** > **Library**
   - Search for "Google+ API" 
   - Click **Enable**

### 1.2 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure the OAuth consent screen if prompted:
   - Application type: **External**
   - App name: **Shakes Travel**
   - User support email: Your email
   - Developer contact: Your email
4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: **Shakes Travel Netlify Identity**
   - **Authorized JavaScript origins**:
     ```
     https://YOUR_SITE_NAME.netlify.app
     ```
   - **Authorized redirect URIs**:
     ```
     https://YOUR_SITE_NAME.netlify.app/.netlify/identity/callback
     ```

### 1.3 Save Credentials
- Copy the **Client ID** and **Client Secret**
- You'll need these for Netlify configuration

---

## 🌐 Step 2: Netlify Dashboard Configuration

### 2.1 Enable Identity Service

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Identity**
3. Click **Enable Identity**

### 2.2 Configure Identity Settings

#### Registration Settings:
- **Registration preferences**: Open (or Invite only if you prefer)
- **Confirm users**: Email confirmation (recommended)

#### External Providers:
1. Click **Settings and usage** > **External providers**
2. Click **Add provider** > **Google**
3. Configure Google provider:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
   - **Scopes**: `email profile`

#### Site Settings:
1. **Site URL**: Set to your production URL (https://yoursite.netlify.app)
2. **Confirmation template**: Customize if needed
3. **Recovery template**: Customize if needed

### 2.3 Configure Identity Widget

In **Identity** > **Settings**:
- **Autoconfirm users**: Enable if you want to skip email confirmation
- **Allow signups**: Enable
- **Git Gateway**: Enable if you plan to use GitLab/GitHub integration

---

## 🔧 Step 3: Environment Variables

### Required Environment Variables in Netlify:

Go to **Site settings** > **Environment variables** and add:

```bash
# These are handled automatically by Netlify Identity
NETLIFY_SITE_ID=your_site_id
```

### Frontend Environment (.env.production):

```bash
# Your production API URL (already configured)
NEXT_PUBLIC_API_URL=https://shakes-travel-backend.netlify.app/api

# Site URL for Netlify Identity
NEXT_PUBLIC_SITE_URL=https://YOUR_SITE_NAME.netlify.app
```

---

## 📁 Step 4: File Structure

Your project now includes:

```
frontend/
├── src/
│   ├── contexts/
│   │   └── NetlifyIdentityContext.tsx    # Netlify Identity provider
│   ├── components/
│   │   └── NetlifyAuthButton.tsx         # Auth buttons
│   └── app/
│       └── auth/
│           ├── netlify-login/
│           │   └── page.tsx              # Login page
│           └── netlify-register/
│               └── page.tsx              # Registration page
├── netlify.toml                          # Netlify configuration
└── package.json                          # Updated dependencies
```

---

## 🚀 Step 5: Deploy and Test

### 5.1 Deploy to Netlify

```bash
git add .
git commit -m "Add Netlify Identity with Google OAuth"
git push origin main
```

### 5.2 Test Authentication

1. Visit your live site: `https://YOUR_SITE_NAME.netlify.app`
2. Navigate to `/auth/netlify-login`
3. Click "Sign in with Netlify Identity"
4. Test both:
   - Email/password registration
   - Google OAuth sign-in

---

## 🎯 Usage Examples

### Access Current User:

```tsx
import { useNetlifyIdentity } from '@/contexts/NetlifyIdentityContext';

function ProfileComponent() {
  const { user, isLoggedIn, logout } = useNetlifyIdentity();

  if (!isLoggedIn) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.user_metadata?.full_name || user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes:

```tsx
import { useNetlifyIdentity } from '@/contexts/NetlifyIdentityContext';

function ProtectedPage() {
  const { isLoggedIn, loading } = useNetlifyIdentity();

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Access denied</div>;

  return <div>Protected content</div>;
}
```

---

## 🔍 Troubleshooting

### Common Issues:

1. **Google OAuth not working**:
   - Check redirect URIs in Google Cloud Console
   - Verify Client ID/Secret in Netlify
   - Ensure site URL is correct

2. **Identity widget not loading**:
   - Check browser console for errors
   - Verify site URL in Netlify settings
   - Ensure Identity is enabled

3. **Users not confirmed**:
   - Check email settings in Netlify Identity
   - Enable autoconfirm if needed
   - Check spam folder for confirmation emails

### Debug Mode:

Add this to your component for debugging:

```tsx
const { user } = useNetlifyIdentity();
console.log('Current user:', user);
```

---

## 🌟 Benefits of Netlify Identity

✅ **No backend required** - Fully managed authentication  
✅ **Google OAuth built-in** - Easy social login  
✅ **Email confirmation** - Built-in user verification  
✅ **User management** - Dashboard for managing users  
✅ **JWTs included** - Secure token-based authentication  
✅ **Works on live site only** - Production-ready security  

---

## 🔗 Quick Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Your Netlify Dashboard](https://app.netlify.com/)
- [Netlify Identity Docs](https://docs.netlify.com/visitor-access/identity/)
- [Live Authentication Pages](https://YOUR_SITE_NAME.netlify.app/auth/netlify-login)

---

## 📝 Next Steps

After setup:

1. ✅ Enable Identity in Netlify Dashboard
2. ✅ Configure Google OAuth credentials  
3. ✅ Deploy the updated code
4. ✅ Test authentication flow
5. ✅ Customize user experience
6. ✅ Add protected routes as needed

Your authentication system will be fully functional on the live site!