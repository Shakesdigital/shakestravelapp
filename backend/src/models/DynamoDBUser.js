/**
 * DynamoDB User Model
 *
 * Handles user authentication and profile management using Amazon DynamoDB
 * Replaces MongoDB/Mongoose for fully serverless architecture
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  putItem,
  getItem,
  queryItems,
  updateItem,
  deleteItem,
  generateId
} = require('../config/dynamodb');

const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || 'ShakesTravel_Users';

class UserModel {
  /**
   * Create a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user object
   */
  static async create(userData) {
    const { email, password, firstName, lastName, role = 'user' } = userData;

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = generateId();
    const now = new Date().toISOString();

    const user = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role, // 'user', 'admin', 'moderator'
      isVerified: false,
      isActive: true,
      profile: {
        bio: '',
        phone: '',
        avatar: '',
        location: '',
        preferences: {}
      },
      statistics: {
        experiencesCreated: 0,
        accommodationsCreated: 0,
        articlesCreated: 0,
        reviewsGiven: 0,
        bookingsMade: 0
      },
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    };

    await putItem(USERS_TABLE, user);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find user by email (for login)
   * @param {string} email - User email address
   * @returns {Promise<Object|null>} User object or null
   */
  static async findByEmail(email) {
    try {
      const result = await queryItems(USERS_TABLE, {
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email.toLowerCase()
        }
      });

      return result.items && result.items.length > 0 ? result.items[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  static async findById(userId) {
    try {
      const user = await getItem(USERS_TABLE, { id: userId });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user object
   */
  static async update(userId, updates) {
    // Prevent updating sensitive fields
    const { id, email, passwordHash, createdAt, ...allowedUpdates } = updates;

    const updateData = {
      ...allowedUpdates,
      updatedAt: new Date().toISOString()
    };

    const updatedUser = await updateItem(USERS_TABLE, { id: userId }, updateData);

    // Return without password hash
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password to set
   * @returns {Promise<boolean>} Success status
   */
  static async updatePassword(userId, currentPassword, newPassword) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isMatch = await this.comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await updateItem(USERS_TABLE, { id: userId }, {
      passwordHash,
      updatedAt: new Date().toISOString()
    });

    return true;
  }

  /**
   * Update last login timestamp
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async updateLastLogin(userId) {
    await updateItem(USERS_TABLE, { id: userId }, {
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Verify user email
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user object
   */
  static async verifyEmail(userId) {
    return await this.update(userId, { isVerified: true });
  }

  /**
   * Deactivate user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user object
   */
  static async deactivate(userId) {
    return await this.update(userId, { isActive: false });
  }

  /**
   * Delete user account (hard delete)
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(userId) {
    try {
      await deleteItem(USERS_TABLE, { id: userId });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * Increment user statistics
   * @param {string} userId - User ID
   * @param {string} statField - Statistics field to increment
   * @returns {Promise<void>}
   */
  static async incrementStat(userId, statField) {
    const user = await this.findById(userId);
    if (!user) return;

    const statistics = user.statistics || {};
    statistics[statField] = (statistics[statField] || 0) + 1;

    await updateItem(USERS_TABLE, { id: userId }, {
      statistics,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Compare password with hash
   * @param {string} inputPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} Match status
   */
  static async comparePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  /**
   * Generate JWT access token
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} role - User role
   * @returns {string} JWT token
   */
  static generateAccessToken(userId, email, role) {
    return jwt.sign(
      {
        id: userId,
        email,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );
  }

  /**
   * Generate JWT refresh token
   * @param {string} userId - User ID
   * @returns {string} JWT refresh token
   */
  static generateRefreshToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
  }

  /**
   * Verify JWT access token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  /**
   * Verify JWT refresh token
   * @param {string} token - JWT refresh token
   * @returns {Object} Decoded token payload
   */
  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  /**
   * Get all users (admin only)
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of users
   */
  static async findAll(filters = {}) {
    try {
      const params = {
        TableName: USERS_TABLE
      };

      // Add filters if provided
      if (filters.role) {
        params.FilterExpression = 'role = :role';
        params.ExpressionAttributeValues = {
          ':role': filters.role
        };
      }

      const result = await queryItems(USERS_TABLE, params);

      // Remove password hashes from results
      const users = (result.items || []).map(user => {
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return users;
    } catch (error) {
      console.error('Error finding all users:', error);
      return [];
    }
  }

  /**
   * Search users by name or email
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching users
   */
  static async search(searchTerm) {
    // Note: DynamoDB doesn't support full-text search
    // This is a basic implementation - consider AWS CloudSearch or Elasticsearch for production
    const allUsers = await this.findAll();

    const term = searchTerm.toLowerCase();
    return allUsers.filter(user =>
      user.email.toLowerCase().includes(term) ||
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term)
    );
  }
}

module.exports = UserModel;
