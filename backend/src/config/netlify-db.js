const { getStore } = require('@netlify/blobs');

/**
 * Netlify Blobs Database Configuration
 * Provides a simple database layer using Netlify Blobs for data persistence
 */

class NetlifyDatabase {
  constructor() {
    this.stores = {
      users: getStore('users'),
      trips: getStore('trips'),
      accommodations: getStore('accommodations'),
      bookings: getStore('bookings'),
      reviews: getStore('reviews'),
      payments: getStore('payments')
    };
    this.connected = false;
  }

  async connect() {
    try {
      // Test connection by attempting to access a store
      await this.stores.users.list({ prefix: 'test' });
      this.connected = true;
      console.log('✅ Connected to Netlify Blobs successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Netlify Blobs:', error.message);
      this.connected = false;
      return false;
    }
  }

  isConnected() {
    return this.connected;
  }

  getStore(storeName) {
    if (!this.stores[storeName]) {
      throw new Error(`Store "${storeName}" does not exist`);
    }
    return this.stores[storeName];
  }

  // Generic CRUD operations
  async create(storeName, id, data) {
    const store = this.getStore(storeName);
    const document = {
      ...data,
      _id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await store.setJSON(id, document);
    return document;
  }

  async findById(storeName, id) {
    const store = this.getStore(storeName);
    try {
      const document = await store.getJSON(id);
      return document;
    } catch (error) {
      if (error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  async findAll(storeName, options = {}) {
    const store = this.getStore(storeName);
    const { limit = 100, prefix = '' } = options;
    
    try {
      const { blobs } = await store.list({ limit, prefix });
      const documents = [];
      
      for (const blob of blobs) {
        try {
          const document = await store.getJSON(blob.key);
          documents.push(document);
        } catch (error) {
          console.warn(`Failed to retrieve document ${blob.key}:`, error.message);
        }
      }
      
      return documents;
    } catch (error) {
      console.error(`Error finding documents in ${storeName}:`, error.message);
      return [];
    }
  }

  async findByField(storeName, field, value, options = {}) {
    const documents = await this.findAll(storeName, options);
    return documents.filter(doc => doc[field] === value);
  }

  async update(storeName, id, updates) {
    const store = this.getStore(storeName);
    const existing = await this.findById(storeName, id);
    
    if (!existing) {
      throw new Error(`Document with id ${id} not found in ${storeName}`);
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await store.setJSON(id, updated);
    return updated;
  }

  async delete(storeName, id) {
    const store = this.getStore(storeName);
    const existing = await this.findById(storeName, id);
    
    if (!existing) {
      throw new Error(`Document with id ${id} not found in ${storeName}`);
    }

    await store.delete(id);
    return existing;
  }

  async deleteMany(storeName, filter = {}) {
    const documents = await this.findAll(storeName);
    let deleted = 0;

    for (const doc of documents) {
      let shouldDelete = true;
      
      // Simple filter matching
      for (const [key, value] of Object.entries(filter)) {
        if (doc[key] !== value) {
          shouldDelete = false;
          break;
        }
      }

      if (shouldDelete) {
        await this.delete(storeName, doc._id);
        deleted++;
      }
    }

    return deleted;
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async count(storeName) {
    const documents = await this.findAll(storeName);
    return documents.length;
  }

  async exists(storeName, id) {
    const document = await this.findById(storeName, id);
    return document !== null;
  }

  // Search functionality
  async search(storeName, searchTerm, fields = []) {
    const documents = await this.findAll(storeName);
    
    if (!searchTerm) return documents;

    return documents.filter(doc => {
      if (fields.length === 0) {
        // Search all string fields
        return Object.values(doc).some(value => 
          typeof value === 'string' && 
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Search specific fields
      return fields.some(field => {
        const value = doc[field];
        return typeof value === 'string' && 
               value.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }
}

// Create singleton instance
const netlifyDB = new NetlifyDatabase();

module.exports = {
  NetlifyDatabase,
  netlifyDB
};