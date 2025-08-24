import { Env } from '../types';

export class DatabaseService {
  constructor(private env: Env) {}

  // Execute SQL query with parameters
  async query(sql: string, params: any[] = []) {
    try {
      const stmt = this.env.DB.prepare(sql);
      if (params.length > 0) {
        return await stmt.bind(...params).all();
      }
      return await stmt.all();
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database operation failed');
    }
  }

  // Execute single query and return first result
  async queryFirst(sql: string, params: any[] = []) {
    try {
      const stmt = this.env.DB.prepare(sql);
      if (params.length > 0) {
        return await stmt.bind(...params).first();
      }
      return await stmt.first();
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database operation failed');
    }
  }

  // Execute query and return execution info
  async execute(sql: string, params: any[] = []) {
    try {
      const stmt = this.env.DB.prepare(sql);
      if (params.length > 0) {
        return await stmt.bind(...params).run();
      }
      return await stmt.run();
    } catch (error) {
      console.error('Database execution error:', error);
      throw new Error('Database operation failed');
    }
  }

  // Transaction support
  async transaction(operations: Array<{ sql: string; params?: any[] }>) {
    try {
      const stmts = operations.map(op => {
        const stmt = this.env.DB.prepare(op.sql);
        return op.params ? stmt.bind(...op.params) : stmt;
      });
      
      return await this.env.DB.batch(stmts);
    } catch (error) {
      console.error('Database transaction error:', error);
      throw new Error('Database transaction failed');
    }
  }
}