# Oracle Database Integration Guide

## Overview

This guide will help you set up and configure Oracle Database for the Shakes Travel user-generated content features.

## Prerequisites

1. **Oracle Database** (19c or higher recommended)
   - Oracle Database XE (Express Edition) - Free for development
   - Oracle Cloud Free Tier - Always free tier available
   - Local Oracle installation

2. **Oracle Instant Client**
   - Required for Node.js `oracledb` driver
   - Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html

## Step 1: Install Oracle Database

### Option A: Oracle Database XE (Recommended for Development)

1. Download Oracle Database XE from:
   ```
   https://www.oracle.com/database/technologies/xe-downloads.html
   ```

2. Install Oracle XE:
   - Windows: Run the installer exe
   - Linux: Use rpm or deb package
   - macOS: Use Docker (see Option C)

3. Note the connection details:
   - Host: `localhost`
   - Port: `1521` (default)
   - Service Name: `XEPDB1` (default pluggable database)
   - SYS password: (set during installation)

### Option B: Oracle Cloud Free Tier

1. Sign up for Oracle Cloud: https://www.oracle.com/cloud/free/
2. Create an Autonomous Database instance
3. Download the connection wallet
4. Note the connection string from the wallet's `tnsnames.ora`

### Option C: Docker (Easiest for Development)

```bash
# Pull Oracle XE image
docker pull container-registry.oracle.com/database/express:latest

# Run Oracle XE container
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -p 5500:5500 \
  -e ORACLE_PWD=YourStrongPassword \
  container-registry.oracle.com/database/express:latest

# Wait for database to be ready (check logs)
docker logs -f oracle-xe
```

## Step 2: Install Oracle Instant Client

### Windows

1. Download Instant Client Basic from Oracle website
2. Extract to `C:\oracle\instantclient_21_x`
3. Add to PATH:
   ```cmd
   setx PATH "%PATH%;C:\oracle\instantclient_21_x"
   ```

### Linux

```bash
# Download and install Instant Client
wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linux.x64-21.1.0.0.0.zip
unzip instantclient-basic-linux.x64-21.1.0.0.0.zip
sudo mv instantclient_21_1 /opt/oracle/
sudo sh -c "echo /opt/oracle/instantclient_21_1 > /etc/ld.so.conf.d/oracle-instantclient.conf"
sudo ldconfig
```

### macOS

```bash
# Install via Homebrew (if available) or download from Oracle
# Or use Docker (recommended)
```

## Step 3: Create Database User and Schema

1. Connect to Oracle as SYSTEM or SYS user:
   ```sql
   sqlplus system/YourPassword@localhost:1521/XEPDB1
   ```

2. Create application user:
   ```sql
   -- Create user
   CREATE USER shakes_travel IDENTIFIED BY "YourSecurePassword123";

   -- Grant permissions
   GRANT CONNECT, RESOURCE TO shakes_travel;
   GRANT CREATE SESSION TO shakes_travel;
   GRANT UNLIMITED TABLESPACE TO shakes_travel;

   -- Additional privileges
   GRANT CREATE TABLE TO shakes_travel;
   GRANT CREATE SEQUENCE TO shakes_travel;
   GRANT CREATE TRIGGER TO shakes_travel;
   GRANT CREATE VIEW TO shakes_travel;

   -- Exit
   EXIT;
   ```

3. Connect as the new user:
   ```sql
   sqlplus shakes_travel/YourSecurePassword123@localhost:1521/XEPDB1
   ```

## Step 4: Run Database Schema Script

1. Locate the schema file:
   ```
   backend/src/database/oracle_schema.sql
   ```

2. Execute the schema script:
   ```bash
   # Option 1: Using SQL*Plus
   sqlplus shakes_travel/YourSecurePassword123@localhost:1521/XEPDB1 @backend/src/database/oracle_schema.sql

   # Option 2: Using SQL Developer or any SQL client
   # - Open the oracle_schema.sql file
   # - Execute the entire script
   ```

3. Verify tables were created:
   ```sql
   SELECT table_name FROM user_tables;
   ```

   You should see:
   - USER_EXPERIENCES
   - EXPERIENCE_IMAGES
   - USER_ACCOMMODATIONS
   - ACCOMMODATION_IMAGES
   - USER_ARTICLES
   - ARTICLE_IMAGES

## Step 5: Configure Environment Variables

1. Open `backend/.env` file

2. Update Oracle Database credentials:
   ```env
   # Oracle Database Configuration
   ORACLE_USER=shakes_travel
   ORACLE_PASSWORD=YourSecurePassword123
   ORACLE_CONNECTION_STRING=localhost:1521/XEPDB1
   ORACLE_POOL_MIN=2
   ORACLE_POOL_MAX=10
   ORACLE_POOL_INCREMENT=1
   ORACLE_POOL_TIMEOUT=60
   ORACLE_QUEUE_MAX=500
   ORACLE_QUEUE_TIMEOUT=60000
   ```

3. For Oracle Cloud Autonomous Database:
   ```env
   ORACLE_USER=admin
   ORACLE_PASSWORD=YourCloudPassword
   ORACLE_CONNECTION_STRING=(description=(retry_count=20)...)  # From tnsnames.ora
   ```

## Step 6: Update Server Configuration

1. Open `backend/server.js`

2. Import and initialize Oracle DB:
   ```javascript
   const { initializeOracleDB } = require('./src/config/oracle');

   // In the connectDatabases() method, add:
   async connectDatabases() {
     try {
       // Existing MongoDB connection
       await this.connectMongoDB();

       // Add Oracle connection
       await initializeOracleDB();

       logger.info('✅ All databases connected');
     } catch (error) {
       logger.error('❌ Database connection failed:', error);
       throw error;
     }
   }
   ```

## Step 7: Test the Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Check the logs for:
   ```
   ✅ Oracle Database connection pool created successfully
   📊 Pool config: Min=2, Max=10
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```

## Step 8: Using the Oracle Models

The Oracle models are ready to use in your routes:

```javascript
const { ExperienceModel, AccommodationModel, ArticleModel } = require('./src/models/OracleUserContent');

// Create an experience
const experience = await ExperienceModel.create(userId, {
  title: 'Gorilla Trekking Adventure',
  description: 'Amazing gorilla experience...',
  location: 'Bwindi Impenetrable Forest',
  price: 600,
  category: 'gorilla-trekking'
});

// Find user's experiences
const userExperiences = await ExperienceModel.findByUserId(userId);

// Find approved experiences
const publicExperiences = await ExperienceModel.findApproved({ limit: 100 });
```

## Troubleshooting

### Error: DPI-1047: Cannot locate a 64-bit Oracle Client library

**Solution**: Oracle Instant Client is not installed or not in PATH.
- Download and install Oracle Instant Client
- Add to system PATH
- Restart your terminal/IDE

### Error: ORA-12541: TNS:no listener

**Solution**: Oracle Database is not running.
- Check if Oracle service is running
- For Docker: `docker start oracle-xe`
- For Windows: Check Services for OracleServiceXE

### Error: ORA-01017: invalid username/password

**Solution**: Check credentials in `.env` file
- Verify username and password
- Ensure user has necessary permissions

### Error: ORA-12514: TNS:listener does not currently know of service

**Solution**: Incorrect connection string
- Verify service name (XEPDB1 for XE)
- Check listener status: `lsnrctl status`

### Connection Pool Exhausted

**Solution**: Adjust pool settings in `.env`
```env
ORACLE_POOL_MAX=20  # Increase max connections
ORACLE_POOL_TIMEOUT=120  # Increase timeout
```

## Performance Tuning

### 1. Index Optimization

The schema includes indexes for common queries. Monitor slow queries:

```sql
-- Check execution plan
EXPLAIN PLAN FOR
SELECT * FROM user_experiences WHERE status = 'approved';

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

### 2. Connection Pooling

Adjust pool size based on your application load:
- Development: Min=2, Max=10
- Production: Min=5, Max=50

### 3. Query Optimization

- Use bind variables (already implemented)
- Fetch only required columns
- Limit result sets with FETCH FIRST

## Migration from MongoDB

If you want to migrate existing data from MongoDB to Oracle:

1. Export MongoDB data:
   ```bash
   mongoexport --db=shakestravel --collection=trips --out=trips.json
   ```

2. Create a migration script to transform and import to Oracle

## Next Steps

1. **Test the APIs**: Use Postman or curl to test the user content endpoints
2. **Monitor Performance**: Use Oracle Enterprise Manager or SQL Developer
3. **Set up Backups**: Configure regular database backups
4. **Enable Auditing**: Track data changes for compliance

## Resources

- Oracle Database Documentation: https://docs.oracle.com/en/database/
- Node.js oracledb Documentation: https://oracle.github.io/node-oracledb/
- Oracle SQL Developer: https://www.oracle.com/database/technologies/appdev/sqldeveloper-landing.html

## Support

For issues specific to Oracle Database integration, check:
1. Oracle Community Forums
2. GitHub Issues for node-oracledb
3. Stack Overflow (tag: oracle, node-oracledb)
