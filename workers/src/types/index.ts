export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  UPLOADS: R2Bucket;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  RESEND_API_KEY: string;
  ENVIRONMENT: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: number;
  title: string;
  description: string;
  destination: string;
  duration_days: number;
  price_per_person: number;
  max_group_size: number;
  difficulty_level: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
  category: string;
  features: string; // JSON string
  images: string; // JSON array
  availability_start?: string;
  availability_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  trip_id: number;
  booking_date: string;
  group_size: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_intent_id?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface Accommodation {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  amenities: string; // JSON array
  images: string; // JSON array
  availability: string; // JSON object
  created_at: string;
  updated_at: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  exp: number;
  iat?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  difficulty?: string;
  duration?: number;
}