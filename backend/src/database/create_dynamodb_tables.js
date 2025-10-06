#!/usr/bin/env node

/**
 * DynamoDB Table Creation Script
 *
 * This script creates the DynamoDB tables required for Shakes Travel user-generated content.
 *
 * Usage:
 *   node backend/src/database/create_dynamodb_tables.js
 *
 * Prerequisites:
 *   - AWS credentials configured (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
 *   - AWS region set in environment variables
 */

const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const tableDefinitions = require('./dynamodb_tables.json');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

async function tableExists(tableName) {
  try {
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    return response.TableNames.includes(tableName);
  } catch (error) {
    console.error('Error checking if table exists:', error);
    return false;
  }
}

async function createTable(tableDefinition) {
  try {
    const exists = await tableExists(tableDefinition.TableName);

    if (exists) {
      console.log(`✅ Table ${tableDefinition.TableName} already exists`);
      return;
    }

    console.log(`🔨 Creating table ${tableDefinition.TableName}...`);

    const command = new CreateTableCommand(tableDefinition);
    await client.send(command);

    console.log(`✅ Table ${tableDefinition.TableName} created successfully`);
  } catch (error) {
    console.error(`❌ Error creating table ${tableDefinition.TableName}:`, error.message);
    throw error;
  }
}

async function createAllTables() {
  console.log('🚀 Starting DynamoDB table creation...\n');
  console.log(`📍 Region: ${process.env.AWS_REGION || 'us-east-1'}\n`);

  try {
    for (const tableDefinition of tableDefinitions.tables) {
      await createTable(tableDefinition);
    }

    console.log('\n🎉 All tables created successfully!');
    console.log('\n📋 Created tables:');
    tableDefinitions.tables.forEach(table => {
      console.log(`   - ${table.TableName}`);
    });

    console.log('\n⏳ Note: Tables may take a few minutes to become fully active.');
    console.log('   You can check their status in the AWS Console or using AWS CLI.\n');
  } catch (error) {
    console.error('\n❌ Failed to create all tables:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createAllTables().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { createAllTables, createTable };
