@echo off
echo.
echo ========================================
echo   ShakesTravel Cloudflare Setup Script
echo ========================================
echo.

REM Change to workers directory
cd /d "C:\Users\TECH DEAL\Desktop\shakestravelapp\workers"

echo Step 1: Checking authentication...
wrangler whoami
if %ERRORLEVEL% neq 0 (
    echo ERROR: Not authenticated with Cloudflare
    echo Please run: wrangler login
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating D1 databases...
wrangler d1 create shakestravel-production
wrangler d1 create shakestravel-staging

echo.
echo Step 3: Creating KV namespaces...
wrangler kv:namespace create "SESSIONS" --preview
wrangler kv:namespace create "SESSIONS"

echo.
echo Step 4: Creating R2 buckets...
wrangler r2 bucket create shakestravel-uploads
wrangler r2 bucket create shakestravel-uploads-staging

echo.
echo Step 5: Initializing database schema...
wrangler d1 execute shakestravel-production --file="../database/schema.sql"
wrangler d1 execute shakestravel-staging --file="../database/schema.sql"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update wrangler.toml files with the resource IDs shown above
echo 2. Set environment secrets using: wrangler secret put [SECRET_NAME]
echo 3. Test deployment with: wrangler deploy
echo.
pause