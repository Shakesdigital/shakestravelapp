const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  BatchWriteCommand
} = require('@aws-sdk/lib-dynamodb');
const { logger } = require('../utils/logger');

/**
 * DynamoDB Configuration
 *
 * This module handles AWS DynamoDB connection and operations.
 *
 * Setup Requirements:
 * 1. AWS Account (Free tier includes 25GB storage, 25 WCU, 25 RCU)
 * 2. AWS credentials configured (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
 * 3. DynamoDB tables created
 */

// DynamoDB Client Configuration
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || process.env.DYNAMODB_REGION || 'us-east-1',
  credentials: (process.env.AWS_ACCESS_KEY_ID || process.env.DYNAMODB_ACCESS_KEY_ID) ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.DYNAMODB_SECRET_ACCESS_KEY
  } : undefined, // Use default credential provider chain if not specified
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined // For local DynamoDB
});

// Document Client for easier operations
const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false
  },
  unmarshallOptions: {
    wrapNumbers: false
  }
});

// Table names
const TABLES = {
  EXPERIENCES: process.env.DYNAMODB_EXPERIENCES_TABLE || 'ShakesTravel_Experiences',
  ACCOMMODATIONS: process.env.DYNAMODB_ACCOMMODATIONS_TABLE || 'ShakesTravel_Accommodations',
  ARTICLES: process.env.DYNAMODB_ARTICLES_TABLE || 'ShakesTravel_Articles'
};

/**
 * Initialize DynamoDB connection
 */
async function initializeDynamoDB() {
  try {
    logger.info('🔌 Connecting to DynamoDB...', {
      region: process.env.AWS_REGION || 'us-east-1',
      tables: TABLES
    });

    // Test connection by listing tables (optional check)
    // In production, you might skip this to reduce API calls
    logger.info('✅ DynamoDB client initialized successfully');
    logger.info(`📊 Using tables: ${Object.values(TABLES).join(', ')}`);

    return true;
  } catch (error) {
    logger.error('❌ Failed to initialize DynamoDB:', error);
    throw error;
  }
}

/**
 * Put item into table
 * @param {string} tableName - DynamoDB table name
 * @param {Object} item - Item to put
 */
async function putItem(tableName, item) {
  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: item
    });
    await docClient.send(command);
    return item;
  } catch (error) {
    logger.error(`❌ Error putting item in ${tableName}:`, error);
    throw error;
  }
}

/**
 * Get item from table
 * @param {string} tableName - DynamoDB table name
 * @param {Object} key - Primary key
 */
async function getItem(tableName, key) {
  try {
    const command = new GetCommand({
      TableName: tableName,
      Key: key
    });
    const response = await docClient.send(command);
    return response.Item || null;
  } catch (error) {
    logger.error(`❌ Error getting item from ${tableName}:`, error);
    throw error;
  }
}

/**
 * Query items from table
 * @param {string} tableName - DynamoDB table name
 * @param {Object} params - Query parameters
 */
async function queryItems(tableName, params) {
  try {
    const command = new QueryCommand({
      TableName: tableName,
      ...params
    });
    const response = await docClient.send(command);
    return {
      items: response.Items || [],
      lastEvaluatedKey: response.LastEvaluatedKey,
      count: response.Count
    };
  } catch (error) {
    logger.error(`❌ Error querying ${tableName}:`, error);
    throw error;
  }
}

/**
 * Scan items from table
 * @param {string} tableName - DynamoDB table name
 * @param {Object} params - Scan parameters
 */
async function scanItems(tableName, params = {}) {
  try {
    const command = new ScanCommand({
      TableName: tableName,
      ...params
    });
    const response = await docClient.send(command);
    return {
      items: response.Items || [],
      lastEvaluatedKey: response.LastEvaluatedKey,
      count: response.Count
    };
  } catch (error) {
    logger.error(`❌ Error scanning ${tableName}:`, error);
    throw error;
  }
}

/**
 * Update item in table
 * @param {string} tableName - DynamoDB table name
 * @param {Object} key - Primary key
 * @param {Object} updates - Updates to apply
 */
async function updateItem(tableName, key, updates) {
  try {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((attr, index) => {
      const placeholder = `#attr${index}`;
      const valuePlaceholder = `:val${index}`;
      updateExpression.push(`${placeholder} = ${valuePlaceholder}`);
      expressionAttributeNames[placeholder] = attr;
      expressionAttributeValues[valuePlaceholder] = updates[attr];
    });

    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    logger.error(`❌ Error updating item in ${tableName}:`, error);
    throw error;
  }
}

/**
 * Delete item from table
 * @param {string} tableName - DynamoDB table name
 * @param {Object} key - Primary key
 */
async function deleteItem(tableName, key) {
  try {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key
    });
    await docClient.send(command);
    return true;
  } catch (error) {
    logger.error(`❌ Error deleting item from ${tableName}:`, error);
    throw error;
  }
}

/**
 * Batch write items
 * @param {string} tableName - DynamoDB table name
 * @param {Array} items - Items to write
 */
async function batchWriteItems(tableName, items) {
  try {
    const putRequests = items.map(item => ({
      PutRequest: { Item: item }
    }));

    // DynamoDB batch write accepts max 25 items at a time
    const batches = [];
    for (let i = 0; i < putRequests.length; i += 25) {
      batches.push(putRequests.slice(i, i + 25));
    }

    for (const batch of batches) {
      const command = new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch
        }
      });
      await docClient.send(command);
    }

    return true;
  } catch (error) {
    logger.error(`❌ Error batch writing to ${tableName}:`, error);
    throw error;
  }
}

/**
 * Query items with pagination
 * @param {string} tableName - DynamoDB table name
 * @param {Object} params - Query parameters
 * @param {number} limit - Max items to return
 */
async function queryWithPagination(tableName, params, limit = 100) {
  const items = [];
  let lastEvaluatedKey = null;

  do {
    const queryParams = {
      ...params,
      Limit: Math.min(limit - items.length, 100),
      ExclusiveStartKey: lastEvaluatedKey
    };

    const result = await queryItems(tableName, queryParams);
    items.push(...result.items);
    lastEvaluatedKey = result.lastEvaluatedKey;

  } while (lastEvaluatedKey && items.length < limit);

  return items;
}

/**
 * Scan items with pagination
 * @param {string} tableName - DynamoDB table name
 * @param {Object} params - Scan parameters
 * @param {number} limit - Max items to return
 */
async function scanWithPagination(tableName, params = {}, limit = 100) {
  const items = [];
  let lastEvaluatedKey = null;

  do {
    const scanParams = {
      ...params,
      Limit: Math.min(limit - items.length, 100),
      ExclusiveStartKey: lastEvaluatedKey
    };

    const result = await scanItems(tableName, scanParams);
    items.push(...result.items);
    lastEvaluatedKey = result.lastEvaluatedKey;

  } while (lastEvaluatedKey && items.length < limit);

  return items;
}

/**
 * Health check for DynamoDB
 */
async function healthCheck() {
  try {
    // Simple test - try to get a non-existent item
    await getItem(TABLES.EXPERIENCES, { id: 'health-check-test' });
    return true;
  } catch (error) {
    logger.error('❌ DynamoDB health check failed:', error);
    return false;
  }
}

/**
 * Generate unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current timestamp
 */
function getCurrentTimestamp() {
  return new Date().toISOString();
}

module.exports = {
  initializeDynamoDB,
  putItem,
  getItem,
  queryItems,
  scanItems,
  updateItem,
  deleteItem,
  batchWriteItems,
  queryWithPagination,
  scanWithPagination,
  healthCheck,
  generateId,
  getCurrentTimestamp,
  TABLES,
  docClient,
  dynamoDBClient
};
