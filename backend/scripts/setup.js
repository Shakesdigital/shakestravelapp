#!/usr/bin/env node

/**
 * Setup Script for Shakes Travel Backend
 * 
 * This script helps set up the development environment:
 * - Checks system requirements
 * - Validates environment configuration
 * - Tests database connection
 * - Creates necessary directories
 * - Provides setup guidance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

class SetupValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  log(type, message) {
    const timestamp = new Date().toISOString();
    const prefix = {
      error: '❌',
      warning: '⚠️ ',
      success: '✅',
      info: 'ℹ️ '
    }[type] || 'ℹ️ ';
    
    console.log(`${prefix} ${message}`);
    
    if (type === 'error') this.errors.push(message);
    if (type === 'warning') this.warnings.push(message);
    if (type === 'success') this.success.push(message);
  }

  async checkSystemRequirements() {
    this.log('info', 'Checking system requirements...');

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      this.log('success', `Node.js version: ${nodeVersion} ✓`);
    } else {
      this.log('error', `Node.js version ${nodeVersion} is not supported. Please upgrade to Node.js 18 or higher.`);
    }

    // Check npm version
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      const npmMajor = parseInt(npmVersion.split('.')[0]);
      
      if (npmMajor >= 9) {
        this.log('success', `npm version: ${npmVersion} ✓`);
      } else {
        this.log('warning', `npm version ${npmVersion} is older than recommended (9.0.0+)`);
      }
    } catch (error) {
      this.log('error', 'npm is not installed or not accessible');
    }

    // Check if MongoDB is accessible
    try {
      execSync('mongosh --version', { encoding: 'utf8', stdio: 'ignore' });
      this.log('success', 'MongoDB CLI (mongosh) is available ✓');
    } catch (error) {
      this.log('warning', 'MongoDB CLI (mongosh) not found. Install MongoDB or use Docker.');
    }

    // Check if Redis is accessible (optional)
    try {
      execSync('redis-cli --version', { encoding: 'utf8', stdio: 'ignore' });
      this.log('success', 'Redis CLI is available ✓');
    } catch (error) {
      this.log('info', 'Redis CLI not found (optional for caching)');
    }
  }

  checkProjectStructure() {
    this.log('info', 'Checking project structure...');

    const requiredDirs = [
      'src',
      'src/config',
      'src/controllers',
      'src/middleware',
      'src/models',
      'src/routes',
      'src/services',
      'src/utils',
      'src/validators',
      'scripts',
      'tests'
    ];

    const requiredFiles = [
      'package.json',
      'server.js',
      '.gitignore'
    ];

    // Check directories
    requiredDirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        this.log('success', `Directory exists: ${dir}`);
      } else {
        this.log('warning', `Creating directory: ${dir}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    // Check files
    requiredFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        this.log('success', `File exists: ${file}`);
      } else {
        this.log('error', `Required file missing: ${file}`);
      }
    });

    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      this.log('success', 'Created logs directory');
    }
  }

  checkEnvironmentConfiguration() {
    this.log('info', 'Checking environment configuration...');

    const envFile = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envFile)) {
      this.log('error', '.env file not found. Copy .env.example to .env and configure it.');
      return;
    }

    const requiredEnvVars = [
      'NODE_ENV',
      'PORT',
      'MONGODB_URI',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET'
    ];

    const optionalEnvVars = [
      'REDIS_URL',
      'STRIPE_SECRET_KEY',
      'CLOUDINARY_CLOUD_NAME',
      'GOOGLE_MAPS_API_KEY',
      'EMAIL_HOST',
      'EMAIL_USER'
    ];

    // Check required environment variables
    requiredEnvVars.forEach(varName => {
      if (process.env[varName]) {
        if (varName.includes('SECRET') && process.env[varName].length < 32) {
          this.log('warning', `${varName} should be at least 32 characters long for security`);
        } else {
          this.log('success', `Environment variable set: ${varName}`);
        }
      } else {
        this.log('error', `Required environment variable missing: ${varName}`);
      }
    });

    // Check optional environment variables
    optionalEnvVars.forEach(varName => {
      if (process.env[varName]) {
        this.log('success', `Optional environment variable set: ${varName}`);
      } else {
        this.log('info', `Optional environment variable not set: ${varName}`);
      }
    });

    // Validate specific configurations
    if (process.env.MONGODB_URI) {
      if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
        this.log('error', 'MONGODB_URI should start with mongodb:// or mongodb+srv://');
      }
    }

    if (process.env.PORT) {
      const port = parseInt(process.env.PORT);
      if (isNaN(port) || port < 1000 || port > 65535) {
        this.log('error', 'PORT should be a number between 1000 and 65535');
      }
    }
  }

  async testDatabaseConnection() {
    this.log('info', 'Testing database connection...');

    if (!process.env.MONGODB_URI) {
      this.log('error', 'Cannot test database connection: MONGODB_URI not set');
      return;
    }

    try {
      const mongoose = require('mongoose');
      
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });

      this.log('success', 'Database connection successful ✓');
      
      // Test basic operation
      const testCollection = mongoose.connection.db.collection('test');
      await testCollection.insertOne({ test: true, timestamp: new Date() });
      await testCollection.deleteOne({ test: true });
      
      this.log('success', 'Database operations test successful ✓');
      
      await mongoose.disconnect();
      
    } catch (error) {
      this.log('error', `Database connection failed: ${error.message}`);
      
      if (error.message.includes('ECONNREFUSED')) {
        this.log('info', 'Is MongoDB running? Try: mongod --dbpath /data/db');
      }
      
      if (error.message.includes('authentication failed')) {
        this.log('info', 'Check MongoDB credentials in MONGODB_URI');
      }
    }
  }

  checkDependencies() {
    this.log('info', 'Checking dependencies...');

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      this.log('error', 'package.json not found');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
      this.log('error', 'node_modules directory not found. Run: npm install');
      return;
    }

    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    
    this.log('success', `Found ${dependencies.length} production dependencies`);
    this.log('success', `Found ${devDependencies.length} development dependencies`);

    // Check for key dependencies
    const keyDeps = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'helmet'];
    const missingDeps = keyDeps.filter(dep => !dependencies.includes(dep));
    
    if (missingDeps.length === 0) {
      this.log('success', 'All key dependencies are present ✓');
    } else {
      this.log('error', `Missing key dependencies: ${missingDeps.join(', ')}`);
    }
  }

  generateSetupSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('           SETUP VALIDATION SUMMARY');
    console.log('='.repeat(60));

    if (this.success.length > 0) {
      console.log('\n✅ SUCCESSFUL CHECKS:');
      this.success.forEach(item => console.log(`   • ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(item => console.log(`   • ${item}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS TO FIX:');
      this.errors.forEach(item => console.log(`   • ${item}`));
    }

    console.log('\n' + '='.repeat(60));

    if (this.errors.length === 0) {
      console.log('🎉 SETUP COMPLETE! Your environment is ready.');
      console.log('\nNext steps:');
      console.log('1. npm run dev     # Start development server');
      console.log('2. Visit http://localhost:5000/api/health');
      console.log('3. Check logs in logs/ directory');
    } else {
      console.log('🔧 SETUP INCOMPLETE! Please fix the errors above.');
      console.log('\nCommon solutions:');
      console.log('1. Copy .env file: cp .env .env.local');
      console.log('2. Install dependencies: npm install');
      console.log('3. Start MongoDB: mongod --dbpath /data/db');
      console.log('4. Update environment variables in .env');
    }

    console.log('\n📚 Documentation: README.md');
    console.log('🆘 Support: Check troubleshooting section in README.md\n');
  }

  async run() {
    console.log('🚀 Shakes Travel Backend Setup Validator\n');

    await this.checkSystemRequirements();
    this.checkProjectStructure();
    this.checkDependencies();
    this.checkEnvironmentConfiguration();
    await this.testDatabaseConnection();
    
    this.generateSetupSummary();
    
    return this.errors.length === 0;
  }
}

// Run setup validation if this file is executed directly
if (require.main === module) {
  const validator = new SetupValidator();
  validator.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('💥 Setup validation failed:', error);
    process.exit(1);
  });
}

module.exports = SetupValidator;