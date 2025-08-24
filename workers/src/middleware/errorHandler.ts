import { Context } from 'hono';
import { Env } from '../types';

export async function errorHandler(err: Error, c: Context<{ Bindings: Env }>) {
  console.error('Unhandled error:', err);
  
  // Log error details in production
  if (c.env.ENVIRONMENT === 'production') {
    // You could integrate with external error reporting service here
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      url: c.req.url,
      method: c.req.method,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Return generic error response
  return c.json({
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'development' 
      ? err.message 
      : 'Something went wrong. Please try again later.',
    timestamp: new Date().toISOString(),
  }, 500);
}