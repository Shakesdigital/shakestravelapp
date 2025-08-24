# 🚀 Shakes Travel Backend - Setup Instructions

Complete setup guide for the Shakes Travel backend API server.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **MongoDB** >= 6.0 ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional but Recommended:
- **Redis** >= 7.0 (for caching)
- **MongoDB Compass** (GUI for MongoDB)
- **Postman** or similar API testing tool

## 🛠️ Installation Steps

### Step 1: Navigate to Backend Directory

```bash
cd shakestravelapp/backend
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Environment Configuration

```bash
# The .env file already exists with placeholder values
# Update it with your actual configuration
nano .env

# Or copy to a local version
cp .env .env.local
nano .env.local
```

**Required Environment Variables:**

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration  
MONGODB_URI=mongodb://localhost:27017/shakestravel

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_32_chars_min
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production_32_chars_min
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # Use App Password for Gmail

# Third-party APIs (optional for basic functionality)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Step 4: Database Setup

#### Option A: Local MongoDB Installation

```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian:
sudo systemctl start mongod

# On Windows (if installed as service):
net start MongoDB

# Verify MongoDB is running
mongosh
# Should connect successfully
```

#### Option B: Docker MongoDB

```bash
# Run MongoDB in Docker container
docker run -d \
  --name shakes-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Verify container is running
docker ps
```

#### Option C: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### Step 5: Verify Setup

Run the automated setup validator:

```bash
node scripts/setup.js
```

This will check:
- ✅ System requirements
- ✅ Project structure  
- ✅ Dependencies
- ✅ Environment configuration
- ✅ Database connection

### Step 6: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:

```
🚀 Starting Shakes Travel API Server...
📊 Connecting to MongoDB...
✅ MongoDB connected successfully
🔧 Setting up middleware...
✅ Middleware setup completed
🛣️  Setting up routes...
✅ Routes setup completed
🛡️  Setting up error handling...
✅ Error handling setup completed
🌍 Server running on port 5000 in development mode
📡 Health check available at: http://localhost:5000/api/health
✅ Shakes Travel API Server started successfully
```

### Step 7: Test the API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Or visit in browser:
# http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.234,
  "environment": "development",
  "version": "1.0.0",
  "memory": {
    "used": "45 MB",
    "total": "67 MB"
  },
  "database": {
    "status": "healthy",
    "connected": true,
    "readyState": 1,
    "host": "localhost",
    "database": "shakestravel"
  }
}
```

## 🔧 Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# In another terminal, monitor logs
tail -f logs/app.log

# Run tests (when available)
npm test
```

### Code Quality

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

### Database Operations

```bash
# Connect to MongoDB
mongosh

# Switch to app database
use shakestravel

# View collections (once data exists)
show collections

# Seed database (when seeder is available)
npm run seed
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Port 5000 already in use"

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

#### 2. "MongoDB connection failed"

```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# macOS:
brew services start mongodb/brew/mongodb-community

# Ubuntu/Debian:
sudo systemctl start mongod

# Docker:
docker start shakes-mongodb
```

#### 3. "Environment variables not loaded"

```bash
# Check .env file exists
ls -la .env

# Check file content
cat .env

# Ensure no spaces around = in .env:
# ✅ Correct: NODE_ENV=development
# ❌ Wrong:   NODE_ENV = development
```

#### 4. "Dependencies installation failed"

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. "Permission denied" errors

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use Node Version Manager (nvm)
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Debug only app logs
DEBUG=app:* npm run dev

# Debug database operations
DEBUG=mongoose:* npm run dev
```

### Health Check Failed

If health check returns unhealthy status:

1. **Check logs:**
   ```bash
   tail -f logs/error.log
   ```

2. **Verify database:**
   ```bash
   mongosh
   db.adminCommand('ping')
   ```

3. **Check memory usage:**
   ```bash
   node -e "console.log(process.memoryUsage())"
   ```

## 📊 Monitoring

### Log Files

```bash
# View recent logs
tail -f logs/app.log

# View error logs only  
tail -f logs/error.log

# Search logs
grep "ERROR" logs/app.log

# Monitor in real-time
npm run dev | grep -E "(ERROR|WARN)"
```

### Performance Monitoring

The server automatically logs:
- 🐌 Slow requests (>1 second)
- 💾 Memory usage
- 🔗 Database connection status
- 📊 Request timing

## 🔐 Security Notes

### Development Security

- ✅ All secrets are in `.env` (not committed to git)
- ✅ Rate limiting is enabled
- ✅ Input sanitization is active
- ✅ CORS is configured

### Production Preparation

Before deploying to production:

1. **Update secrets:**
   ```bash
   # Generate secure JWT secrets (32+ characters)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Set production environment:**
   ```bash
   NODE_ENV=production
   ```

3. **Configure production database:**
   ```bash
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shakestravel
   ```

4. **Enable HTTPS:**
   - Use reverse proxy (Nginx)
   - Configure SSL certificates
   - Update CORS origins

## 📚 Next Steps

Once the backend is running:

1. **Explore API endpoints:**
   - http://localhost:5000/api
   - http://localhost:5000/api/health
   - http://localhost:5000/api/status

2. **Start building features:**
   - Authentication system
   - User management
   - Trip listings
   - Booking system

3. **Add database models:**
   - User model
   - Trip model
   - Accommodation model
   - Booking model

4. **Implement API routes:**
   - Authentication routes
   - CRUD operations
   - Search functionality

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs:**
   ```bash
   tail -f logs/app.log
   tail -f logs/error.log
   ```

2. **Run setup validator:**
   ```bash
   node scripts/setup.js
   ```

3. **Review this documentation**

4. **Check environment configuration**

5. **Verify all prerequisites are installed**

## 🎉 Success!

If you see the health check returning "healthy" status, congratulations! Your Shakes Travel backend is ready for development.

Next: Start building the authentication system and user management features according to the architecture plan.

---

**Happy coding! 🚀**