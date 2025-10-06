# Amazon DynamoDB Integration Guide

## 🚀 Quick Setup (5 Minutes!)

DynamoDB is **much simpler** than Oracle - no database installation needed! Just AWS credentials and you're ready to go.

## ✅ What's Already Done

1. ✅ AWS SDK installed (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`)
2. ✅ DynamoDB configuration created
3. ✅ Table schemas defined
4. ✅ Models implemented with CRUD operations
5. ✅ Routes configured to use DynamoDB
6. ✅ Server updated for dual database (MongoDB + DynamoDB)

## 📋 Setup Steps

### Step 1: Get AWS Credentials (2 minutes)

#### Option A: Use Existing AWS Account
1. Go to AWS Console: https://console.aws.amazon.com/
2. Navigate to: **IAM** → **Users** → Your User → **Security credentials**
3. Click **Create access key**
4. Copy the **Access Key ID** and **Secret Access Key**

#### Option B: Create New Free AWS Account
1. Sign up at: https://aws.amazon.com/free/
2. AWS Free Tier includes:
   - 25 GB storage
   - 25 Write Capacity Units
   - 25 Read Capacity Units
   - **FOREVER FREE** (not just 12 months!)
3. Create access key as described in Option A

### Step 2: Configure AWS Credentials

Edit `backend/.env`:

```env
# AWS DynamoDB Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
DYNAMODB_EXPERIENCES_TABLE=ShakesTravel_Experiences
DYNAMODB_ACCOMMODATIONS_TABLE=ShakesTravel_Accommodations
DYNAMODB_ARTICLES_TABLE=ShakesTravel_Articles
```

**Replace with your actual AWS credentials!**

### Step 3: Create DynamoDB Tables

Run the table creation script:

```bash
cd backend
node src/database/create_dynamodb_tables.js
```

Expected output:
```
🚀 Starting DynamoDB table creation...
📍 Region: us-east-1

🔨 Creating table ShakesTravel_Experiences...
✅ Table ShakesTravel_Experiences created successfully
🔨 Creating table ShakesTravel_Accommodations...
✅ Table ShakesTravel_Accommodations created successfully
🔨 Creating table ShakesTravel_Articles...
✅ Table ShakesTravel_Articles created successfully

🎉 All tables created successfully!
```

### Step 4: Start Your Application

```bash
cd backend
npm run dev
```

Look for:
```
✅ MongoDB connected successfully
✅ DynamoDB connected successfully
🌍 Server running on port 5000
```

### Step 5: Test the Connection

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "databases": {
    "mongodb": { ... },
    "dynamodb": "connected"
  }
}
```

## 🎯 That's It! You're Done!

No database installation, no complex configuration - just AWS credentials and you're ready to go!

## 📊 DynamoDB Tables Created

### 1. ShakesTravel_Experiences
- **Primary Key**: `id` (String)
- **GSI**: `UserIdIndex` - Query experiences by user
- **GSI**: `StatusIndex` - Query by approval status
- **Billing**: Pay-per-request (no upfront costs)

### 2. ShakesTravel_Accommodations
- **Primary Key**: `id` (String)
- **GSI**: `UserIdIndex` - Query accommodations by user
- **GSI**: `StatusIndex` - Query by approval status
- **Billing**: Pay-per-request

### 3. ShakesTravel_Articles
- **Primary Key**: `id` (String)
- **GSI**: `AuthorIdIndex` - Query articles by author
- **GSI**: `SlugIndex` - Find articles by slug
- **GSI**: `ModerationStatusIndex` - Query by moderation status
- **Billing**: Pay-per-request

## 🔌 API Endpoints

### User Content (Private - Requires Authentication)

**Experiences:**
- `POST /api/user-content/experiences` - Create experience
- `GET /api/user-content/experiences/my` - Get my experiences
- `GET /api/user-content/experiences/:id` - Get experience by ID
- `PUT /api/user-content/experiences/:id` - Update experience
- `POST /api/user-content/experiences/:id/submit-review` - Submit for review
- `DELETE /api/user-content/experiences/:id` - Delete experience

**Accommodations:**
- `POST /api/user-content/accommodations` - Create accommodation
- `GET /api/user-content/accommodations/my` - Get my accommodations
- Similar endpoints as experiences...

**Articles:**
- `POST /api/user-content/articles` - Create article
- `GET /api/user-content/articles/my` - Get my articles
- Similar endpoints as experiences...

**Stats:**
- `GET /api/user-content/dashboard-stats` - Get user statistics

### Public Content (No Authentication Required)

- `GET /api/public/experiences` - Browse approved experiences
- `GET /api/public/experiences/:id` - Get single experience
- `GET /api/public/accommodations` - Browse approved accommodations
- `GET /api/public/accommodations/:id` - Get single accommodation
- `GET /api/public/articles` - Browse published articles
- `GET /api/public/articles/:slug` - Get single article by slug

## 🧪 Test Creating Content

```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Create an experience
curl -X POST http://localhost:5000/api/user-content/experiences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Gorilla Trekking in Bwindi",
    "description": "Amazing gorilla trekking experience",
    "location": "Bwindi Impenetrable Forest",
    "region": "Western Uganda",
    "category": "wildlife-safari",
    "price": 600,
    "duration": "1 day",
    "difficulty": "moderate",
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "caption": "Gorilla in habitat"
      }
    ]
  }'

# 3. Get your experiences
curl http://localhost:5000/api/user-content/experiences/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 💰 Cost Estimate

### Free Tier (Always Free):
- 25 GB storage
- 25 WCU (Write Capacity Units)
- 25 RCU (Read Capacity Units)

### Typical Usage:
- **Small app (< 1000 users)**: FREE
- **Medium app (< 10K users)**: $5-20/month
- **Large app (100K users)**: $50-100/month

DynamoDB auto-scales and you only pay for what you use!

## 🔧 Advanced Configuration

### Local DynamoDB (For Development)

1. Install DynamoDB Local:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

2. Update `.env`:
```env
DYNAMODB_ENDPOINT=http://localhost:8000
```

### View Tables in AWS Console

1. Go to: https://console.aws.amazon.com/dynamodb/
2. Select your region (us-east-1)
3. Click **Tables** to see your data

### NoSQL Workbench (GUI Tool)

1. Download: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html
2. Connect to your AWS account
3. Browse and query tables visually

## 🔐 Security Best Practices

### 1. Use IAM Roles (Production)

Instead of access keys, use IAM roles for EC2/ECS/Lambda:
```javascript
// No credentials needed - uses instance role
const client = new DynamoDBClient({ region: 'us-east-1' });
```

### 2. Least Privilege Policy

Create an IAM policy with only DynamoDB permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/ShakesTravel_*"
    }
  ]
}
```

### 3. Never Commit Credentials

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

## 📈 Monitoring

### CloudWatch Metrics (Automatic)
- Read/Write capacity usage
- Throttled requests
- Latency
- Item count

Access at: https://console.aws.amazon.com/cloudwatch/

### Enable Point-in-Time Recovery

```bash
aws dynamodb update-continuous-backups \
  --table-name ShakesTravel_Experiences \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

## 🆘 Troubleshooting

### Error: Missing credentials in config

**Solution**: Check `.env` file has AWS credentials set correctly.

### Error: ResourceNotFoundException

**Solution**: Run the table creation script:
```bash
node backend/src/database/create_dynamodb_tables.js
```

### Error: AccessDeniedException

**Solution**: Check IAM permissions for your AWS user/role.

### Error: ProvisionedThroughputExceededException

**Solution**: Tables use on-demand billing, this shouldn't happen. If it does, check AWS Console for throttling issues.

## 🎓 Why DynamoDB vs Oracle?

| Feature | DynamoDB | Oracle |
|---------|----------|--------|
| **Setup Time** | 5 minutes | Hours/Days |
| **Installation** | None needed | Complex |
| **Cost** | Pay as you go | License + Infrastructure |
| **Scaling** | Automatic | Manual |
| **Maintenance** | Zero | High |
| **Free Tier** | Forever | Limited |
| **Backups** | Automatic | Manual |
| **High Availability** | Built-in | Complex setup |

## 📚 Learn More

- DynamoDB Developer Guide: https://docs.aws.amazon.com/dynamodb/
- AWS SDK for JavaScript v3: https://docs.aws.amazon.com/sdk-for-javascript/v3/
- DynamoDB Best Practices: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html
- DynamoDB Pricing: https://aws.amazon.com/dynamodb/pricing/

## 🎉 You're All Set!

Your application now uses:
- **MongoDB** for core features and user management
- **Amazon DynamoDB** for user-generated content with serverless scalability

No servers to manage, automatic scaling, and pay only for what you use!
