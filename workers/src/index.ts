import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { logger } from 'hono/logger';

import { authRoutes } from './routes/auth';
import { tripsRoutes } from './routes/trips';
import { bookingsRoutes } from './routes/bookings';
import { paymentsRoutes } from './routes/payments';
import { accommodationsRoutes } from './routes/accommodations';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());

// CORS configuration
app.use('/*', cors({
  origin: [
    'https://www.shakestravel.com',
    'https://shakestravel.com',
    'http://localhost:3000', // Development
  ],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Health check endpoint
app.get('/', (c) => {
  return c.json({ 
    status: 'healthy',
    service: 'ShakesTravel API',
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/trips', tripsRoutes);
app.route('/api/accommodations', accommodationsRoutes);

// Protected routes (require authentication)
app.use('/api/bookings/*', authMiddleware);
app.use('/api/payments/*', authMiddleware);

app.route('/api/bookings', bookingsRoutes);
app.route('/api/payments', paymentsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: 'Not Found',
    message: `Route ${c.req.method} ${c.req.path} not found`,
    timestamp: new Date().toISOString()
  }, 404);
});

// Global error handler
app.onError(errorHandler);

export default app;