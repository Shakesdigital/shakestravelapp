import { Hono } from 'hono';
import { DatabaseService } from '../lib/database';
import { Env, Trip, ApiResponse, SearchFilters } from '../types';

export const tripsRoutes = new Hono<{ Bindings: Env }>();

// Get all trips with filtering and search
tripsRoutes.get('/', async (c) => {
  try {
    const url = new URL(c.req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '12'), 50); // Max 50 per page
    const offset = (page - 1) * limit;
    
    // Search and filter parameters
    const search = url.searchParams.get('search') || '';
    const destination = url.searchParams.get('destination') || '';
    const category = url.searchParams.get('category') || '';
    const difficulty = url.searchParams.get('difficulty') || '';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const sortBy = url.searchParams.get('sortBy') || 'created_at';
    const sortOrder = url.searchParams.get('sortOrder') || 'DESC';

    const db = new DatabaseService(c.env);
    
    // Build WHERE clause
    let whereConditions = ['is_active = ?'];
    let queryParams = [true];
    
    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ? OR destination LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (destination) {
      whereConditions.push('destination LIKE ?');
      queryParams.push(`%${destination}%`);
    }
    
    if (category) {
      whereConditions.push('category = ?');
      queryParams.push(category);
    }
    
    if (difficulty) {
      whereConditions.push('difficulty_level = ?');
      queryParams.push(difficulty);
    }
    
    if (minPrice) {
      whereConditions.push('price_per_person >= ?');
      queryParams.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      whereConditions.push('price_per_person <= ?');
      queryParams.push(parseFloat(maxPrice));
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Validate sort column
    const validSortColumns = ['created_at', 'title', 'price_per_person', 'duration_days', 'destination'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Get trips with pagination
    const tripsQuery = `
      SELECT id, title, description, destination, duration_days, price_per_person, 
             max_group_size, difficulty_level, category, features, images, 
             availability_start, availability_end, created_at
      FROM trips 
      WHERE ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `SELECT COUNT(*) as total FROM trips WHERE ${whereClause}`;
    
    const [tripsResult, countResult] = await Promise.all([
      db.query(tripsQuery, [...queryParams, limit, offset]),
      db.queryFirst(countQuery, queryParams)
    ]);
    
    const trips = tripsResult.results?.map((trip: any) => ({
      ...trip,
      features: trip.features ? JSON.parse(trip.features) : [],
      images: trip.images ? JSON.parse(trip.images) : []
    }));
    
    const totalCount = (countResult as any)?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    return c.json<ApiResponse>({
      success: true,
      data: {
        trips,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get trips error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch trips' 
    }, 500);
  }
});

// Get single trip by ID
tripsRoutes.get('/:id', async (c) => {
  try {
    const tripId = parseInt(c.req.param('id'));
    
    if (!tripId || tripId < 1) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Invalid trip ID' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    const trip = await db.queryFirst(
      `SELECT t.*, u.first_name as host_first_name, u.last_name as host_last_name
       FROM trips t 
       LEFT JOIN users u ON t.host_id = u.id
       WHERE t.id = ? AND t.is_active = ?`,
      [tripId, true]
    );
    
    if (!trip) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Trip not found' 
      }, 404);
    }
    
    // Get trip reviews
    const reviews = await db.query(
      `SELECT r.*, u.first_name, u.last_name, u.profile_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.trip_id = ?
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [tripId]
    );
    
    const tripData = {
      ...trip,
      features: trip.features ? JSON.parse(trip.features) : [],
      images: trip.images ? JSON.parse(trip.images) : [],
      host: trip.host_first_name ? {
        firstName: trip.host_first_name,
        lastName: trip.host_last_name
      } : null,
      reviews: reviews.results || []
    };
    
    // Remove redundant host fields
    delete tripData.host_first_name;
    delete tripData.host_last_name;
    
    return c.json<ApiResponse>({
      success: true,
      data: { trip: tripData }
    });
    
  } catch (error) {
    console.error('Get trip error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch trip' 
    }, 500);
  }
});

// Get featured trips
tripsRoutes.get('/featured/list', async (c) => {
  try {
    const db = new DatabaseService(c.env);
    
    // Get top-rated and popular trips
    const featuredTrips = await db.query(
      `SELECT t.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
       FROM trips t
       LEFT JOIN reviews r ON t.id = r.trip_id
       WHERE t.is_active = ?
       GROUP BY t.id
       ORDER BY avg_rating DESC, review_count DESC
       LIMIT 6`,
      [true]
    );
    
    const trips = featuredTrips.results?.map((trip: any) => ({
      ...trip,
      features: trip.features ? JSON.parse(trip.features) : [],
      images: trip.images ? JSON.parse(trip.images) : [],
      avgRating: trip.avg_rating ? parseFloat(trip.avg_rating).toFixed(1) : null,
      reviewCount: trip.review_count || 0
    }));
    
    return c.json<ApiResponse>({
      success: true,
      data: { trips }
    });
    
  } catch (error) {
    console.error('Get featured trips error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch featured trips' 
    }, 500);
  }
});

// Get trip categories
tripsRoutes.get('/categories/list', async (c) => {
  try {
    const db = new DatabaseService(c.env);
    
    const categories = await db.query(
      `SELECT category, COUNT(*) as count
       FROM trips
       WHERE is_active = ?
       GROUP BY category
       ORDER BY count DESC`,
      [true]
    );
    
    return c.json<ApiResponse>({
      success: true,
      data: { categories: categories.results || [] }
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch categories' 
    }, 500);
  }
});

// Search suggestions
tripsRoutes.get('/search/suggestions', async (c) => {
  try {
    const query = c.req.query('q') || '';
    
    if (query.length < 2) {
      return c.json<ApiResponse>({
        success: true,
        data: { suggestions: [] }
      });
    }
    
    const db = new DatabaseService(c.env);
    
    const suggestions = await db.query(
      `SELECT DISTINCT destination as value, 'destination' as type
       FROM trips
       WHERE destination LIKE ? AND is_active = ?
       UNION
       SELECT DISTINCT title as value, 'trip' as type
       FROM trips
       WHERE title LIKE ? AND is_active = ?
       LIMIT 8`,
      [`%${query}%`, true, `%${query}%`, true]
    );
    
    return c.json<ApiResponse>({
      success: true,
      data: { suggestions: suggestions.results || [] }
    });
    
  } catch (error) {
    console.error('Search suggestions error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch suggestions' 
    }, 500);
  }
});