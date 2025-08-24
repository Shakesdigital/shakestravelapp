import { Hono } from 'hono';
import { DatabaseService } from '../lib/database';
import { Env, ApiResponse } from '../types';

export const accommodationsRoutes = new Hono<{ Bindings: Env }>();

// Get all accommodations with filtering
accommodationsRoutes.get('/', async (c) => {
  try {
    const url = new URL(c.req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '12'), 50);
    const offset = (page - 1) * limit;
    
    const location = url.searchParams.get('location') || '';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const maxGuests = url.searchParams.get('maxGuests');
    const sortBy = url.searchParams.get('sortBy') || 'created_at';
    
    const db = new DatabaseService(c.env);
    
    let whereConditions = ['is_active = ?'];
    let queryParams = [true];
    
    if (location) {
      whereConditions.push('location LIKE ?');
      queryParams.push(`%${location}%`);
    }
    
    if (minPrice) {
      whereConditions.push('price_per_night >= ?');
      queryParams.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      whereConditions.push('price_per_night <= ?');
      queryParams.push(parseFloat(maxPrice));
    }
    
    if (maxGuests) {
      whereConditions.push('max_guests >= ?');
      queryParams.push(parseInt(maxGuests));
    }
    
    const whereClause = whereConditions.join(' AND ');
    const validSortColumns = ['created_at', 'name', 'price_per_night', 'rating'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    
    const accommodationsQuery = `
      SELECT id, name, description, location, price_per_night, max_guests, 
             amenities, images, rating, total_reviews, created_at
      FROM accommodations 
      WHERE ${whereClause}
      ORDER BY ${sortColumn} DESC
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `SELECT COUNT(*) as total FROM accommodations WHERE ${whereClause}`;
    
    const [accommodationsResult, countResult] = await Promise.all([
      db.query(accommodationsQuery, [...queryParams, limit, offset]),
      db.queryFirst(countQuery, queryParams)
    ]);
    
    const accommodations = accommodationsResult.results?.map((accommodation: any) => ({
      ...accommodation,
      amenities: accommodation.amenities ? JSON.parse(accommodation.amenities) : [],
      images: accommodation.images ? JSON.parse(accommodation.images) : []
    }));
    
    const totalCount = (countResult as any)?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    return c.json<ApiResponse>({
      success: true,
      data: {
        accommodations,
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
    console.error('Get accommodations error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch accommodations' 
    }, 500);
  }
});

// Get single accommodation by ID
accommodationsRoutes.get('/:id', async (c) => {
  try {
    const accommodationId = parseInt(c.req.param('id'));
    
    if (!accommodationId || accommodationId < 1) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Invalid accommodation ID' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    const accommodation = await db.queryFirst(
      `SELECT a.*, u.first_name as host_first_name, u.last_name as host_last_name
       FROM accommodations a 
       LEFT JOIN users u ON a.host_id = u.id
       WHERE a.id = ? AND a.is_active = ?`,
      [accommodationId, true]
    );
    
    if (!accommodation) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Accommodation not found' 
      }, 404);
    }
    
    // Get accommodation reviews
    const reviews = await db.query(
      `SELECT r.*, u.first_name, u.last_name, u.profile_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.accommodation_id = ?
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [accommodationId]
    );
    
    const accommodationData = {
      ...accommodation,
      amenities: accommodation.amenities ? JSON.parse(accommodation.amenities) : [],
      images: accommodation.images ? JSON.parse(accommodation.images) : [],
      availability: accommodation.availability ? JSON.parse(accommodation.availability) : {},
      host: accommodation.host_first_name ? {
        firstName: accommodation.host_first_name,
        lastName: accommodation.host_last_name
      } : null,
      reviews: reviews.results || []
    };
    
    delete accommodationData.host_first_name;
    delete accommodationData.host_last_name;
    
    return c.json<ApiResponse>({
      success: true,
      data: { accommodation: accommodationData }
    });
    
  } catch (error) {
    console.error('Get accommodation error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch accommodation' 
    }, 500);
  }
});