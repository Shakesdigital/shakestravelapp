#!/usr/bin/env node

/**
 * Local Development Startup Script
 * 
 * Starts the Shakes Travel backend without Docker
 * Provides instructions for setting up MongoDB and Redis locally
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Starting Shakes Travel Backend Locally');
console.log('=' .repeat(50));

// Check if MongoDB and Redis are running
function checkService(command, name, port) {
  return new Promise((resolve) => {
    const child = spawn(command, { shell: true, stdio: 'ignore' });
    child.on('close', (code) => {
      resolve(code === 0);
    });
    child.on('error', () => {
      resolve(false);
    });
  });
}

async function checkDependencies() {
  console.log('🔍 Checking system dependencies...\n');
  
  // Check Node.js
  try {
    const nodeVersion = process.version;
    console.log(`✅ Node.js: ${nodeVersion}`);
  } catch (error) {
    console.log('❌ Node.js: Not found');
    return false;
  }

  // Check if MongoDB is accessible
  const mongoRunning = await checkService('mongosh --eval "db.runCommand(\'ping\')" --quiet', 'MongoDB', 27017);
  if (mongoRunning) {
    console.log('✅ MongoDB: Running on port 27017');
  } else {
    console.log('❌ MongoDB: Not running or not accessible');
    console.log('   Install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('   Or use MongoDB Atlas: https://www.mongodb.com/atlas');
  }

  // Check if Redis is accessible  
  const redisRunning = await checkService('redis-cli ping', 'Redis', 6379);
  if (redisRunning) {
    console.log('✅ Redis: Running on port 6379');
  } else {
    console.log('❌ Redis: Not running or not accessible');
    console.log('   Install Redis: https://redis.io/download');
    console.log('   Windows: https://github.com/microsoftarchive/redis/releases');
  }

  return true;
}

function updateEnvForLocal() {
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update for local development
  envContent = envContent.replace(
    'MONGODB_URI=mongodb://shakestravel:password123@mongodb:27017/shakestravel?authSource=shakestravel',
    'MONGODB_URI=mongodb://localhost:27017/shakestravel'
  );
  
  envContent = envContent.replace(
    'REDIS_HOST=redis',
    'REDIS_HOST=localhost'
  );
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env for local development');
}

function createQuickStartScript() {
  const quickStart = `#!/bin/bash

# Quick Start Script for Local Development
echo "🚀 Starting Shakes Travel Backend..."

# Set environment
export NODE_ENV=development
export PORT=5000

# Start the server
npm run dev
`;

  fs.writeFileSync(path.join(__dirname, 'quick-start.sh'), quickStart, { mode: 0o755 });
  console.log('✅ Created quick-start script');
}

async function startServer() {
  console.log('\n🚀 Starting Shakes Travel API Server...');
  
  const serverPath = path.join(__dirname, '..', 'server.js');
  
  // Set environment variables
  process.env.NODE_ENV = 'development';
  process.env.PORT = '5000';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/shakestravel';
  process.env.REDIS_HOST = 'localhost';
  
  // Start the server
  try {
    require(serverPath);
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Make sure MongoDB is running: mongod');
    console.log('2. Make sure Redis is running: redis-server');
    console.log('3. Check your .env file configuration');
    console.log('4. Run: npm install');
  }
}

async function main() {
  await checkDependencies();
  
  console.log('\n⚙️  Setting up local configuration...');
  updateEnvForLocal();
  createQuickStartScript();
  
  console.log('\n📋 Manual Setup Instructions:');
  console.log('');
  console.log('1. Install MongoDB:');
  console.log('   - Download: https://www.mongodb.com/try/download/community');
  console.log('   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
  console.log('');
  console.log('2. Install Redis:');
  console.log('   - Windows: https://github.com/microsoftarchive/redis/releases');
  console.log('   - Or use Redis Cloud: https://redis.com/try-free/');
  console.log('');
  console.log('3. Start services:');
  console.log('   MongoDB: mongod');
  console.log('   Redis: redis-server');
  console.log('');
  console.log('4. Start the backend:');
  console.log('   npm run dev');
  console.log('   or: node server.js');
  console.log('');
  console.log('🌐 Once running, access:');
  console.log('   API: http://localhost:5000');
  console.log('   Health: http://localhost:5000/api/health');
  console.log('   Status: http://localhost:5000/api/status');
  console.log('');
  console.log('💡 Alternative: Use Docker');
  console.log('   1. Install Docker Desktop');
  console.log('   2. Run: docker-compose up -d');
  console.log('   3. All services start automatically');
  
  // Attempt to start server if this script is run directly
  if (process.argv.includes('--start')) {
    await startServer();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkDependencies, updateEnvForLocal, startServer };