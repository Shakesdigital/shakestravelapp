#!/bin/bash

# Shakes Travel Backend - AWS Deployment Script
# This script deploys the backend to AWS Elastic Beanstalk

set -e

echo "🚀 Starting AWS Elastic Beanstalk deployment..."

# Configuration
APP_NAME="shakes-travel-backend"
ENV_NAME="shakes-travel-prod"
REGION="us-east-1"
PLATFORM="64bit Amazon Linux 2 v5.8.4 running Node.js 18"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Installing..."
    pip install awsebcli --upgrade --user
fi

# Verify AWS credentials
echo "🔐 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials verified"

# Create application if it doesn't exist
echo "🏗️  Creating/updating Elastic Beanstalk application..."
aws elasticbeanstalk create-application \
    --application-name $APP_NAME \
    --description "Shakes Travel Backend API" \
    --region $REGION 2>/dev/null || echo "Application already exists"

# Initialize EB in current directory
if [ ! -f .elasticbeanstalk/config.yml ]; then
    echo "🔧 Initializing Elastic Beanstalk..."
    eb init $APP_NAME --region $REGION --platform "$PLATFORM"
fi

# Create environment if it doesn't exist
echo "🌍 Creating/updating environment..."
if ! aws elasticbeanstalk describe-environments \
    --application-name $APP_NAME \
    --environment-names $ENV_NAME \
    --region $REGION &> /dev/null; then
    
    echo "Creating new environment..."
    eb create $ENV_NAME --instance_types t3.micro --cname shakes-travel-api
else
    echo "Environment exists, deploying update..."
    eb deploy $ENV_NAME
fi

echo "✅ Deployment completed!"
echo "🌐 Your API will be available at: http://shakes-travel-api.${REGION}.elasticbeanstalk.com"
echo "🏥 Health check: http://shakes-travel-api.${REGION}.elasticbeanstalk.com/api/health"

echo ""
echo "⚠️  Don't forget to set environment variables in AWS console:"
echo "  - MONGODB_URI"
echo "  - JWT_SECRET"
echo "  - JWT_REFRESH_SECRET"
echo "  - CORS_ORIGIN"
echo ""
echo "📖 Visit AWS Elastic Beanstalk console to configure environment variables:"
echo "   https://console.aws.amazon.com/elasticbeanstalk/"