# 🚀 AWS Deployment Guide - Shakes Travel Backend

This guide provides step-by-step instructions to deploy your Shakes Travel backend API to AWS using the **free tier** services.

## 📋 Table of Contents

- [AWS Free Tier Overview](#aws-free-tier-overview)
- [Prerequisites](#prerequisites)
- [Option 1: Elastic Beanstalk Deployment (Recommended)](#option-1-elastic-beanstalk-deployment-recommended)
- [Option 2: AWS Lambda Serverless Deployment](#option-2-aws-lambda-serverless-deployment)
- [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Testing Your Deployment](#testing-your-deployment)
- [Monitoring and Logs](#monitoring-and-logs)
- [Troubleshooting](#troubleshooting)

## 🆓 AWS Free Tier Overview

AWS provides generous free tier limits perfect for your travel website:

- **EC2**: 750 hours/month of t2.micro instances (12 months)
- **Elastic Beanstalk**: Free platform (you only pay for underlying resources)
- **Lambda**: 1M free requests/month + 400,000 GB-seconds compute time
- **API Gateway**: 1M API calls/month (12 months)
- **CloudWatch**: Basic monitoring included
- **Route 53**: $0.50/month per hosted zone

## 📦 Prerequisites

### 1. Install AWS CLI
```bash
# Windows (using chocolatey)
choco install awscli

# macOS
brew install awscli

# Linux
sudo apt-get install awscli
```

### 2. Configure AWS Credentials
```bash
aws configure
```
Enter your:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: `us-east-1`
- Default output format: `json`

### 3. Install EB CLI (for Elastic Beanstalk)
```bash
pip install awsebcli --upgrade --user
```

## 🌟 Option 1: Elastic Beanstalk Deployment (Recommended)

Elastic Beanstalk is perfect for Node.js applications with automatic scaling, monitoring, and easy updates.

### Step 1: Deploy Using Script

**Windows:**
```cmd
cd backend
scripts\deploy-aws.bat
```

**Linux/macOS:**
```bash
cd backend
chmod +x scripts/deploy-aws.sh
./scripts/deploy-aws.sh
```

### Step 2: Manual Deployment (Alternative)

```bash
cd backend

# Initialize Elastic Beanstalk
eb init shakes-travel-backend --region us-east-1 --platform "Node.js 18 running on 64bit Amazon Linux 2"

# Create environment (first time only)
eb create shakes-travel-prod --instance_types t3.micro --cname shakes-travel-api

# For subsequent deployments
eb deploy shakes-travel-prod
```

### Step 3: Configure Environment Variables

1. Go to [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Select your application: `shakes-travel-backend`
3. Click on your environment: `shakes-travel-prod`
4. Go to **Configuration** → **Software**
5. Add environment properties:

```
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shakestravel
JWT_SECRET=your-super-secure-jwt-secret-32-chars-min
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-32-chars-min
CORS_ORIGIN=https://shakestravelapp.netlify.app
```

### Step 4: Access Your API

Your API will be available at:
- **Main URL**: `https://shakes-travel-api.us-east-1.elasticbeanstalk.com`
- **Health Check**: `https://shakes-travel-api.us-east-1.elasticbeanstalk.com/api/health`
- **API Docs**: `https://shakes-travel-api.us-east-1.elasticbeanstalk.com/api`

## ⚡ Option 2: AWS Lambda Serverless Deployment

AWS Lambda is perfect for serverless architecture with pay-per-request pricing.

### Step 1: Install Serverless Framework

```bash
npm install -g serverless
cd backend/lambda
npm install
```

### Step 2: Configure Environment Variables

Create `.env.aws` file:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shakestravel
JWT_SECRET=your-super-secure-jwt-secret-32-chars-min
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-32-chars-min
CORS_ORIGIN=https://shakestravelapp.netlify.app
```

### Step 3: Deploy to Lambda

```bash
cd backend/lambda
serverless deploy
```

### Step 4: Access Your API

After deployment, you'll get:
- **API Gateway URL**: `https://your-api-id.execute-api.us-east-1.amazonaws.com/prod`
- **Health Check**: `https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/health`

## 🗄️ Database Setup (MongoDB Atlas)

Since AWS DocumentDB isn't in the free tier, we'll use MongoDB Atlas (free tier available):

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a new cluster (M0 Sandbox - FREE)

### Step 2: Configure Database
1. **Database Access**: Create user with read/write permissions
2. **Network Access**: Add IP addresses (0.0.0.0/0 for development)
3. **Get Connection String**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/shakestravel?retryWrites=true&w=majority
   ```

### Step 3: Seed Database
```bash
# Set MongoDB URI in environment
export MONGODB_URI="your-connection-string"

# Run seeding script
cd backend
npm run seed
```

## ⚙️ Environment Variables Configuration

### Required Variables:
- `NODE_ENV=production`
- `PORT=8080` (Elastic Beanstalk) or `PORT=3000` (Lambda)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secure random string (32+ characters)
- `JWT_REFRESH_SECRET` - Different secure random string
- `CORS_ORIGIN` - Your frontend domain

### Optional Variables:
```env
# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🧪 Testing Your Deployment

### Test Health Endpoint
```bash
curl https://your-api-url.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 125.67,
  "environment": "production",
  "database": {
    "status": "connected",
    "name": "shakestravel"
  }
}
```

### Test API Endpoints
```bash
# Get trips
curl https://your-api-url.com/api/trips

# Search functionality  
curl "https://your-api-url.com/api/search/general?q=bwindi"

# User registration
curl -X POST https://your-api-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📊 Monitoring and Logs

### Elastic Beanstalk:
- **Logs**: AWS Console → Elastic Beanstalk → Environment → Logs
- **Monitoring**: Built-in CloudWatch integration
- **Health**: Dashboard shows application health

### Lambda:
- **Logs**: AWS Console → CloudWatch → Log Groups → `/aws/lambda/your-function`
- **Monitoring**: Lambda console shows invocations, duration, errors
- **X-Ray**: Enable for detailed request tracing

### Custom Monitoring
```bash
# View logs
eb logs shakes-travel-prod --all

# Follow logs in real-time
eb logs shakes-travel-prod --all --follow
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. **"Application not responding"**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check application logs: `eb logs --all`

#### 2. **CORS errors**
- Verify `CORS_ORIGIN` includes your frontend domain
- Check frontend is using correct API URL

#### 3. **Database connection failed**
- Verify MongoDB Atlas network access allows your IP
- Check connection string format
- Ensure database user has correct permissions

#### 4. **Health check failing**
- Verify `/api/health` endpoint is accessible
- Check application is listening on correct port (8080 for EB)

### Debug Commands:
```bash
# Check EB environment status
eb status

# View recent events
eb events

# SSH into instance (for debugging)
eb ssh

# Check environment variables
eb printenv
```

## 🔄 Updates and Maintenance

### Deploy Updates:
```bash
# Elastic Beanstalk
eb deploy

# Lambda
cd backend/lambda
serverless deploy
```

### Environment Management:
```bash
# Create staging environment
eb create shakes-travel-staging --instance_types t3.micro

# Swap environments (blue-green deployment)
eb swap shakes-travel-prod shakes-travel-staging
```

## 💰 Cost Optimization

### Free Tier Limits:
- Keep within 750 hours/month EC2 (one t2.micro instance)
- Monitor Lambda invocations (1M free/month)
- Use MongoDB Atlas M0 (512MB free)
- Monitor data transfer (1GB/month free)

### Tips:
1. **Scale down during off-hours**: Use EB configuration
2. **Monitor usage**: AWS Billing Dashboard
3. **Use caching**: Implement Redis for frequently accessed data
4. **Optimize images**: Use CloudFront CDN for static assets

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Database seeded with sample data  
- [ ] Health endpoint responding
- [ ] CORS configured for frontend domain
- [ ] SSL certificate configured (automatic with EB)
- [ ] Monitoring and logging enabled
- [ ] Backup strategy for database
- [ ] Error tracking configured (e.g., Sentry)

## 📞 Support

For deployment issues:
- Check AWS documentation
- Review CloudWatch logs
- AWS Support (Developer plan recommended)
- GitHub Issues for application-specific problems

Your Shakes Travel backend is now ready for production on AWS! 🎉