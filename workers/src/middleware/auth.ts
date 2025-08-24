import { Context, Next } from 'hono';
import { verify } from '@tsndr/cloudflare-worker-jwt';
import { Env, JWTPayload } from '../types';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ 
      error: 'Unauthorized',
      message: 'Authorization token required'
    }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const isValid = await verify(token, c.env.JWT_SECRET);
    
    if (!isValid) {
      return c.json({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      }, 401);
    }
    
    // Decode token to get user info
    const [, payload] = token.split('.');
    const decodedPayload: JWTPayload = JSON.parse(atob(payload));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      return c.json({ 
        error: 'Unauthorized',
        message: 'Token has expired'
      }, 401);
    }
    
    // Attach user info to context
    c.set('userId', decodedPayload.userId);
    c.set('userEmail', decodedPayload.email);
    
    await next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return c.json({ 
      error: 'Unauthorized',
      message: 'Token verification failed'
    }, 401);
  }
}