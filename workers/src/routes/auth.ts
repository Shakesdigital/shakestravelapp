import { Hono } from 'hono';
import { sign } from '@tsndr/cloudflare-worker-jwt';
import { DatabaseService } from '../lib/database';
import { hashPassword, verifyPassword } from '../lib/crypto';
import { Env, User, ApiResponse } from '../types';

export const authRoutes = new Hono<{ Bindings: Env }>();

// Register endpoint
authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName, phone, agreeToTerms, agreeToPrivacy } = body;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Email, password, first name, and last name are required' 
      }, 400);
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'You must agree to terms of service and privacy policy' 
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Please provide a valid email address' 
      }, 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Password must be at least 8 characters long' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    // Check if user already exists
    const existingUser = await db.queryFirst(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    if (existingUser) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'An account with this email already exists' 
      }, 400);
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const result = await db.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone || null,
        false,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );
    
    if (!result.success) {
      throw new Error('Failed to create user');
    }
    
    // Generate JWT
    const token = await sign(
      { 
        userId: result.meta.last_row_id,
        email: email.toLowerCase(),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      c.env.JWT_SECRET
    );
    
    return c.json<ApiResponse>({ 
      success: true,
      data: {
        token,
        user: { 
          id: result.meta.last_row_id,
          email: email.toLowerCase(),
          firstName,
          lastName,
          phone,
          emailVerified: false
        }
      },
      message: 'Registration successful'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Registration failed. Please try again.' 
    }, 500);
  }
});

// Login endpoint
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Email and password are required' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    // Find user
    const user = await db.queryFirst(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    ) as User;
    
    if (!user) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Invalid email or password' 
      }, 401);
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Invalid email or password' 
      }, 401);
    }
    
    // Generate JWT
    const token = await sign(
      { 
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      },
      c.env.JWT_SECRET
    );
    
    return c.json<ApiResponse>({ 
      success: true,
      data: {
        token,
        user: { 
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          profileImage: user.profile_image,
          emailVerified: user.email_verified
        }
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Login failed. Please try again.' 
    }, 500);
  }
});

// Get user profile (protected)
authRoutes.get('/me', async (c) => {
  try {
    const userId = c.get('userId');
    
    if (!userId) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'User not authenticated' 
      }, 401);
    }
    
    const db = new DatabaseService(c.env);
    
    const user = await db.queryFirst(
      'SELECT id, email, first_name, last_name, phone, profile_image, email_verified, created_at FROM users WHERE id = ?',
      [userId]
    ) as User;
    
    if (!user) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'User not found' 
      }, 404);
    }
    
    return c.json<ApiResponse>({ 
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          profileImage: user.profile_image,
          emailVerified: user.email_verified,
          createdAt: user.created_at
        }
      }
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch profile' 
    }, 500);
  }
});

// Logout endpoint (invalidate token - optional with KV storage)
authRoutes.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      // Store token in KV to blacklist it
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const expiresAt = decodedPayload.exp * 1000; // Convert to milliseconds
      
      await c.env.SESSIONS.put(`blacklist:${token}`, 'true', {
        expirationTtl: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      });
    }
    
    return c.json<ApiResponse>({ 
      success: true,
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Logout failed' 
    }, 500);
  }
});