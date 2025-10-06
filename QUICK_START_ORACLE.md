# Quick Start Guide - Oracle Database Integration

## 🚀 You're Almost Ready!

Your Shakes Travel app is now configured to use Oracle Database for user-generated content. Follow these simple steps to get started.

## ✅ What's Already Done

1. ✅ Oracle Database driver (`oracledb`) installed
2. ✅ Database configuration files created
3. ✅ SQL schema ready to deploy
4. ✅ Oracle models implemented
5. ✅ Routes updated to use Oracle
6. ✅ Server configured for dual database (MongoDB + Oracle)

## 📋 What You Need to Do

### Step 1: Install Oracle Database (Choose One)

#### Option A: Docker (Fastest - Recommended for Development)

```bash
# Pull and run Oracle XE in Docker
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -p 5500:5500 \
  -e ORACLE_PWD=MyStrongPassword123 \
  container-registry.oracle.com/database/express:latest

# Wait about 2-3 minutes for the database to start
# Check the logs
docker logs -f oracle-xe
```

#### Option B: Oracle XE (Local Installation)

1. Download Oracle Database XE from:
   ```
   https://www.oracle.com/database/technologies/xe-downloads.html
   ```

2. Install and note the password you set for SYS/SYSTEM user

#### Option C: Oracle Cloud Free Tier

1. Sign up at: https://www.oracle.com/cloud/free/
2. Create an Autonomous Database
3. Download the wallet

### Step 2: Install Oracle Instant Client

#### Windows:
```cmd
# Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html
# Extract to C:\oracle\instantclient_21_x
# Add to PATH
setx PATH "%PATH%;C:\oracle\instantclient_21_x"
```

#### Linux:
```bash
# Install via package manager or download
wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linux.x64-21.1.0.0.0.zip
unzip instantclient-basic-linux.x64-21.1.0.0.0.zip
sudo mv instantclient_21_1 /opt/oracle/
sudo sh -c "echo /opt/oracle/instantclient_21_1 > /etc/ld.so.conf.d/oracle-instantclient.conf"
sudo ldconfig
```

#### macOS:
```bash
# Use Docker instead (recommended)
# Or install via Oracle website
```

### Step 3: Create Database User and Schema

```bash
# Connect to Oracle (Docker)
docker exec -it oracle-xe sqlplus system/MyStrongPassword123@XEPDB1

# Or if local installation:
sqlplus system/YourPassword@localhost:1521/XEPDB1
```

Run these SQL commands:
```sql
-- Create user
CREATE USER shakes_travel IDENTIFIED BY "SecurePass123!";

-- Grant permissions
GRANT CONNECT, RESOURCE TO shakes_travel;
GRANT CREATE SESSION TO shakes_travel;
GRANT UNLIMITED TABLESPACE TO shakes_travel;
GRANT CREATE TABLE, CREATE SEQUENCE, CREATE TRIGGER, CREATE VIEW TO shakes_travel;

EXIT;
```

### Step 4: Run the Schema Script

```bash
# Connect as the new user
sqlplus shakes_travel/SecurePass123!@localhost:1521/XEPDB1

# Run the schema script
@backend/src/database/oracle_schema.sql

# Verify tables were created
SELECT table_name FROM user_tables;

EXIT;
```

You should see:
- USER_EXPERIENCES
- EXPERIENCE_IMAGES
- USER_ACCOMMODATIONS
- ACCOMMODATION_IMAGES
- USER_ARTICLES
- ARTICLE_IMAGES

### Step 5: Update Environment Variables

Edit `backend/.env`:

```env
# Oracle Database Configuration
ORACLE_USER=shakes_travel
ORACLE_PASSWORD=SecurePass123!
ORACLE_CONNECTION_STRING=localhost:1521/XEPDB1
ORACLE_POOL_MIN=2
ORACLE_POOL_MAX=10
ORACLE_POOL_INCREMENT=1
ORACLE_POOL_TIMEOUT=60
ORACLE_QUEUE_MAX=500
ORACLE_QUEUE_TIMEOUT=60000
```

For Docker:
```env
ORACLE_CONNECTION_STRING=localhost:1521/XEPDB1
```

For Oracle Cloud:
```env
ORACLE_CONNECTION_STRING=(description=(retry_count=20)(retry_delay=3)...)
# Copy from tnsnames.ora in your wallet
```

### Step 6: Start Your Application

```bash
cd backend
npm run dev
```

Look for these success messages:
```
✅ MongoDB connected successfully
✅ Oracle Database connected successfully
📊 Pool config: Min=2, Max=10
🌍 Server running on port 5000
```

### Step 7: Test the Connection

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "healthy",
  "databases": {
    "mongodb": { ... },
    "oracle": "connected"
  }
}
```

## 🎯 API Endpoints Now Using Oracle

### User Content (Private - Requires Authentication)
- `POST /api/user-content/experiences` - Create experience
- `GET /api/user-content/experiences/my` - Get my experiences
- `PUT /api/user-content/experiences/:id` - Update experience
- `POST /api/user-content/experiences/:id/submit-review` - Submit for review
- `DELETE /api/user-content/experiences/:id` - Delete experience

- `POST /api/user-content/accommodations` - Create accommodation
- `GET /api/user-content/accommodations/my` - Get my accommodations

- `POST /api/user-content/articles` - Create article
- `GET /api/user-content/articles/my` - Get my articles

- `GET /api/user-content/dashboard-stats` - Get user stats

### Public Content (Public - No Authentication)
- `GET /api/public/experiences` - Get approved experiences
- `GET /api/public/experiences/:id` - Get single experience
- `GET /api/public/accommodations` - Get approved accommodations
- `GET /api/public/accommodations/:id` - Get single accommodation
- `GET /api/public/articles` - Get published articles
- `GET /api/public/articles/:slug` - Get single article

## 🧪 Test Creating Content

```bash
# 1. Register/Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Create an experience
curl -X POST http://localhost:5000/api/user-content/experiences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Gorilla Trekking Adventure",
    "description": "Amazing gorilla trekking experience in Bwindi Forest",
    "location": "Bwindi Impenetrable Forest",
    "category": "gorilla-trekking",
    "price": 600,
    "duration": "1 day",
    "difficulty": "moderate"
  }'

# 3. Get your experiences
curl http://localhost:5000/api/user-content/experiences/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Error: Cannot locate Oracle Client library
**Solution**: Install Oracle Instant Client and add to PATH

### Error: ORA-12541: TNS:no listener
**Solution**: Ensure Oracle Database is running
```bash
docker ps  # Check if container is running
docker start oracle-xe  # Start if stopped
```

### Error: ORA-01017: invalid username/password
**Solution**: Check credentials in `.env` file

### Error: Connection pool exhausted
**Solution**: Increase pool size in `.env`:
```env
ORACLE_POOL_MAX=20
```

## 📚 What Data Goes Where?

### MongoDB (Existing):
- User accounts and authentication
- Curated trips and accommodations
- Bookings and payments
- Reviews
- Admin data

### Oracle Database (New):
- User-generated experiences
- User-generated accommodations
- User-generated articles/blogs
- Images for user content
- Moderation workflow

## 🎓 Next Steps

1. **Frontend Integration**: Update your frontend to call the new Oracle-backed APIs
2. **Admin Dashboard**: The admin moderation routes still use MongoDB - migrate if needed
3. **Image Upload**: Configure Cloudinary for image storage
4. **Backup Strategy**: Set up automated backups for Oracle DB
5. **Monitoring**: Add Oracle metrics to your monitoring dashboard

## 📖 Full Documentation

For detailed information, see:
- `ORACLE_SETUP_GUIDE.md` - Complete setup guide with troubleshooting
- `backend/src/config/oracle.js` - Database configuration
- `backend/src/models/OracleUserContent.js` - Data models
- `backend/src/database/oracle_schema.sql` - Database schema

## 🆘 Need Help?

1. Check logs: `docker logs oracle-xe` (if using Docker)
2. Test connection: `sqlplus shakes_travel/password@localhost:1521/XEPDB1`
3. Review full guide: `ORACLE_SETUP_GUIDE.md`
4. Oracle docs: https://docs.oracle.com/en/database/

## 🎉 You're All Set!

Your application now uses:
- **MongoDB** for core features and user management
- **Oracle Database** for user-generated content with enterprise-grade reliability

Both databases work together seamlessly!
