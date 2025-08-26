@echo off
REM Shakes Travel Backend - AWS Deployment Script for Windows
REM This script deploys the backend to AWS Elastic Beanstalk

echo 🚀 Starting AWS Elastic Beanstalk deployment...

REM Configuration
set APP_NAME=shakes-travel-backend
set ENV_NAME=shakes-travel-prod
set REGION=us-east-1
set PLATFORM=64bit Amazon Linux 2 v5.8.4 running Node.js 18

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS CLI not found. Please install AWS CLI first.
    echo Visit: https://aws.amazon.com/cli/
    exit /b 1
)

REM Check if EB CLI is installed
eb --version >nul 2>&1
if errorlevel 1 (
    echo ❌ EB CLI not found. Installing...
    pip install awsebcli --upgrade --user
)

REM Verify AWS credentials
echo 🔐 Checking AWS credentials...
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS credentials not configured. Please run 'aws configure' first.
    exit /b 1
)

echo ✅ AWS credentials verified

REM Create application if it doesn't exist
echo 🏗️  Creating/updating Elastic Beanstalk application...
aws elasticbeanstalk create-application --application-name %APP_NAME% --description "Shakes Travel Backend API" --region %REGION% 2>nul || echo Application already exists

REM Initialize EB in current directory
if not exist .elasticbeanstalk\config.yml (
    echo 🔧 Initializing Elastic Beanstalk...
    eb init %APP_NAME% --region %REGION% --platform "%PLATFORM%"
)

REM Create or deploy to environment
echo 🌍 Creating/updating environment...
aws elasticbeanstalk describe-environments --application-name %APP_NAME% --environment-names %ENV_NAME% --region %REGION% >nul 2>&1
if errorlevel 1 (
    echo Creating new environment...
    eb create %ENV_NAME% --instance_types t3.micro --cname shakes-travel-api
) else (
    echo Environment exists, deploying update...
    eb deploy %ENV_NAME%
)

echo ✅ Deployment completed!
echo 🌐 Your API will be available at: http://shakes-travel-api.%REGION%.elasticbeanstalk.com
echo 🏥 Health check: http://shakes-travel-api.%REGION%.elasticbeanstalk.com/api/health

echo.
echo ⚠️  Don't forget to set environment variables in AWS console:
echo   - MONGODB_URI
echo   - JWT_SECRET
echo   - JWT_REFRESH_SECRET
echo   - CORS_ORIGIN
echo.
echo 📖 Visit AWS Elastic Beanstalk console to configure environment variables:
echo    https://console.aws.amazon.com/elasticbeanstalk/

pause