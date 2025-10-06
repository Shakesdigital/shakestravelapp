const oracledb = require('oracledb');
const logger = require('../utils/logger');

/**
 * Oracle Database Configuration
 *
 * This module handles Oracle Database connection pooling and query execution.
 *
 * Setup Requirements:
 * 1. Oracle Database Instance (19c+ recommended)
 * 2. Oracle Instant Client installed on the server
 * 3. Environment variables configured in .env
 */

// Oracle connection pool configuration
const oracleConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING, // e.g., "localhost:1521/XEPDB1"
  poolMin: parseInt(process.env.ORACLE_POOL_MIN) || 2,
  poolMax: parseInt(process.env.ORACLE_POOL_MAX) || 10,
  poolIncrement: parseInt(process.env.ORACLE_POOL_INCREMENT) || 1,
  poolTimeout: parseInt(process.env.ORACLE_POOL_TIMEOUT) || 60,
  queueMax: parseInt(process.env.ORACLE_QUEUE_MAX) || 500,
  queueTimeout: parseInt(process.env.ORACLE_QUEUE_TIMEOUT) || 60000
};

// Global connection pool
let pool = null;

/**
 * Initialize Oracle Database connection pool
 */
async function initializeOracleDB() {
  try {
    // Enable auto-commit by default
    oracledb.autoCommit = true;

    // Set fetch type mappings
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.fetchAsString = [oracledb.CLOB];
    oracledb.fetchAsBuffer = [oracledb.BLOB];

    // Create connection pool
    pool = await oracledb.createPool(oracleConfig);

    logger.info('✅ Oracle Database connection pool created successfully');
    logger.info(`📊 Pool config: Min=${oracleConfig.poolMin}, Max=${oracleConfig.poolMax}`);

    return pool;
  } catch (error) {
    logger.error('❌ Failed to create Oracle Database connection pool:', error);
    throw error;
  }
}

/**
 * Get a connection from the pool
 * @returns {Promise<oracledb.Connection>}
 */
async function getConnection() {
  try {
    if (!pool) {
      await initializeOracleDB();
    }
    return await pool.getConnection();
  } catch (error) {
    logger.error('❌ Failed to get Oracle connection from pool:', error);
    throw error;
  }
}

/**
 * Execute a SQL query
 * @param {string} sql - SQL query string
 * @param {Array|Object} binds - Bind parameters
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Query result
 */
async function execute(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (error) {
    logger.error('❌ Oracle query execution error:', error);
    logger.error('SQL:', sql);
    logger.error('Binds:', binds);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        logger.error('❌ Error closing Oracle connection:', error);
      }
    }
  }
}

/**
 * Execute a query and return multiple rows
 * @param {string} sql - SQL query string
 * @param {Array|Object} binds - Bind parameters
 * @returns {Promise<Array>} Array of rows
 */
async function executeMany(sql, binds = []) {
  const result = await execute(sql, binds, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    maxRows: 10000
  });
  return result.rows || [];
}

/**
 * Execute a query and return a single row
 * @param {string} sql - SQL query string
 * @param {Array|Object} binds - Bind parameters
 * @returns {Promise<Object|null>} Single row or null
 */
async function executeOne(sql, binds = []) {
  const result = await execute(sql, binds, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    maxRows: 1
  });
  return result.rows && result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Execute multiple SQL statements in a transaction
 * @param {Function} callback - Async function that receives connection
 * @returns {Promise<any>} Result of callback
 */
async function executeTransaction(callback) {
  let connection;
  try {
    connection = await getConnection();

    // Disable auto-commit for transaction
    const result = await callback(connection);

    // Commit transaction
    await connection.commit();
    logger.info('✅ Transaction committed successfully');

    return result;
  } catch (error) {
    logger.error('❌ Transaction error - rolling back:', error);
    if (connection) {
      try {
        await connection.rollback();
        logger.info('↩️ Transaction rolled back');
      } catch (rollbackError) {
        logger.error('❌ Error during rollback:', rollbackError);
      }
    }
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        logger.error('❌ Error closing connection:', error);
      }
    }
  }
}

/**
 * Insert data and return the generated ID
 * @param {string} sql - INSERT SQL statement
 * @param {Array|Object} binds - Bind parameters
 * @param {string} idColumn - Name of the ID column
 * @returns {Promise<number>} Generated ID
 */
async function insert(sql, binds = [], idColumn = 'ID') {
  const result = await execute(sql, binds, {
    autoCommit: true,
    outFormat: oracledb.OUT_FORMAT_OBJECT
  });
  return result.lastRowid || result.outBinds?.[idColumn] || null;
}

/**
 * Bulk insert multiple rows
 * @param {string} sql - INSERT SQL statement
 * @param {Array} bindsArray - Array of bind parameters
 * @returns {Promise<number>} Number of rows inserted
 */
async function insertMany(sql, bindsArray = []) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.executeMany(sql, bindsArray, {
      autoCommit: true,
      bindDefs: {}
    });
    return result.rowsAffected || 0;
  } catch (error) {
    logger.error('❌ Bulk insert error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        logger.error('❌ Error closing connection:', error);
      }
    }
  }
}

/**
 * Close the connection pool
 */
async function closePool() {
  try {
    if (pool) {
      await pool.close(10); // Wait 10 seconds for connections to close
      pool = null;
      logger.info('✅ Oracle Database connection pool closed');
    }
  } catch (error) {
    logger.error('❌ Error closing Oracle connection pool:', error);
    throw error;
  }
}

/**
 * Get pool statistics
 */
async function getPoolStats() {
  if (!pool) {
    return null;
  }
  return {
    connectionsInUse: pool.connectionsInUse,
    connectionsOpen: pool.connectionsOpen,
    poolMin: pool.poolMin,
    poolMax: pool.poolMax,
    poolIncrement: pool.poolIncrement,
    queueLength: pool.queueLength,
    queueTimeout: pool.queueTimeout
  };
}

/**
 * Health check for Oracle Database
 */
async function healthCheck() {
  try {
    const result = await executeOne('SELECT 1 AS health FROM DUAL');
    return result && result.HEALTH === 1;
  } catch (error) {
    logger.error('❌ Oracle health check failed:', error);
    return false;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

module.exports = {
  initializeOracleDB,
  getConnection,
  execute,
  executeMany,
  executeOne,
  executeTransaction,
  insert,
  insertMany,
  closePool,
  getPoolStats,
  healthCheck,
  oracledb // Export for constants like BIND_IN, BIND_OUT, etc.
};
