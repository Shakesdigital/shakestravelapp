# Netlify Identity Authentication Setup Guide

## JavaScript Code Snippets for Handling Authentication State

### 1. Authentication State Detection
```javascript
// Initialize Netlify Identity on page load
netlifyIdentity.init({
  APIUrl: window.location.origin + '/.netlify/identity'
});

// Check current authentication status
function checkAuthStatus() {
  const user = netlifyIdentity.currentUser();
  if (user) {
    console.log('User authenticated:', user.email);
    // User is logged in - show dashboard
    showDashboard(user);
  } else {
    console.log('User not authenticated');
    // Redirect to login page
    window.location.href = '/auth/login';
  }
}

// Call on page load
window.addEventListener('DOMContentLoaded', checkAuthStatus);
```

### 2. Authentication Event Listeners
```javascript
// Listen for login events
netlifyIdentity.on('login', user => {
  console.log('User logged in:', user.email);
  // Redirect to dashboard
  window.location.href = '/profile';
  netlifyIdentity.close(); // Close the modal
});

// Listen for logout events
netlifyIdentity.on('logout', () => {
  console.log('User logged out');
  // Redirect to home page
  window.location.href = '/';
});

// Listen for signup events
netlifyIdentity.on('signup', user => {
  console.log('User signed up:', user.email);
  // Redirect to onboarding or dashboard
  window.location.href = '/profile';
  netlifyIdentity.close(); // Close the modal
});
```

### 3. Protecting Dashboard Pages
```javascript
// Dashboard protection function
function protectDashboard() {
  const user = netlifyIdentity.currentUser();
  
  if (!user) {
    // User not authenticated - redirect to login
    const currentPath = window.location.pathname;
    window.location.href = `/auth/login?returnUrl=${encodeURIComponent(currentPath)}`;
    return false;
  }
  
  // User authenticated - populate dashboard
  displayUserData(user);
  return true;
}

// Display user data on dashboard
function displayUserData(user) {
  document.getElementById('userName').textContent = 
    user.user_metadata.full_name || user.email.split('@')[0];
  document.getElementById('userEmail').textContent = user.email;
  
  // Show Google authentication indicator
  if (user.app_metadata.provider === 'google') {
    document.getElementById('authMethod').innerHTML = 
      '✓ Google Account: Google';
  }
}
```

### 4. Manual Authentication Triggers
```javascript
// Trigger Google login
function loginWithGoogle() {
  netlifyIdentity.open('login');
}

// Trigger Google signup
function signupWithGoogle() {
  netlifyIdentity.open('signup');
}

// Logout function
function logout() {
  netlifyIdentity.logout();
}
```

## Netlify Dashboard Configuration Steps

### Step 1: Enable Identity Service
1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** > **Identity**
3. Click **Enable Identity**

### Step 2: Configure External Providers
1. In Identity settings, scroll to **External providers**
2. Click **Add provider** > **Google**
3. Enter your Google OAuth credentials:
   - **Client ID**: `245137294350-5puc3dv8l6e4t3qmvhb2r7vfn0oq5krj.apps.googleusercontent.com`
   - **Client Secret**: (Get from Google Cloud Console)

### Step 3: Registration Preferences
1. Set **Registration** to "Open" or "Invite only" as needed
2. Enable **Allow Google** under External providers
3. Configure **Email templates** if desired

### Step 4: Site Configuration
1. Add your domain to **Site information**:
   - Site URL: `https://shakestravel.netlify.app`
2. Configure **Redirect URLs**:
   - Success: `https://shakestravel.netlify.app/profile`
   - Error: `https://shakestravel.netlify.app/auth/login?error=auth_failed`

### Step 5: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable **Google+ API** and **Google Identity API**
4. Go to **Credentials** > **OAuth 2.0 Client IDs**
5. Add authorized domains:
   - `https://shakestravel.netlify.app`
   - `https://*.netlify.app` (for Netlify Identity)
6. Add redirect URIs:
   - `https://shakestravel.netlify.app/.netlify/identity/callback`

### Step 6: Environment Variables
Ensure these are set in your Netlify site:
```
NEXT_PUBLIC_API_URL=https://shakes-travel-backend.netlify.app/api
NEXT_PUBLIC_BASE_URL=https://shakestravel.netlify.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=245137294350-5puc3dv8l6e4t3qmvhb2r7vfn0oq5krj.apps.googleusercontent.com
```

## Testing Checklist

### Before Testing
- [ ] Netlify Identity service enabled
- [ ] Google OAuth provider configured
- [ ] Google Cloud Console credentials set up
- [ ] Site deployed with latest code changes

### Test Scenarios
1. **Google Login Flow**
   - [ ] Click "Sign in with Google" button
   - [ ] Google authentication popup appears
   - [ ] Successful authentication redirects to dashboard
   - [ ] User data displays correctly (name, email, Google indicator)

2. **Dashboard Protection**
   - [ ] Accessing `/profile` without login redirects to `/auth/login`
   - [ ] After login, user is redirected back to requested page
   - [ ] Dashboard shows user information from Google account

3. **Logout Flow**
   - [ ] Logout button works correctly
   - [ ] User is redirected to home page
   - [ ] Accessing protected pages requires re-authentication

### Common Issues and Solutions

**Issue**: "Google sign-in failed"
**Solution**: Check Google Cloud Console redirect URIs and authorized domains

**Issue**: "Identity service not found"
**Solution**: Ensure Netlify Identity is enabled and deployed

**Issue**: "Invalid redirect URL"
**Solution**: Verify NEXT_PUBLIC_BASE_URL matches your live domain

**Issue**: User data not displaying
**Solution**: Check user object structure in browser console and update field mappings