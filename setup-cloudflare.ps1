Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ShakesTravel Cloudflare Setup Script" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to workers directory
Set-Location "C:\Users\TECH DEAL\Desktop\shakestravelapp\workers"

Write-Host "Step 1: Checking authentication..." -ForegroundColor Yellow
$authResult = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Not authenticated with Cloudflare" -ForegroundColor Red
    Write-Host "Please run: wrangler login" -ForegroundColor Red
    Write-Host "Then run this script again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating D1 databases..." -ForegroundColor Yellow
Write-Host "Creating production database..." -ForegroundColor Green
wrangler d1 create shakestravel-production

Write-Host "Creating staging database..." -ForegroundColor Green  
wrangler d1 create shakestravel-staging

Write-Host ""
Write-Host "Step 3: Creating KV namespaces..." -ForegroundColor Yellow
Write-Host "Creating SESSIONS namespace..." -ForegroundColor Green
wrangler kv:namespace create "SESSIONS" --preview
wrangler kv:namespace create "SESSIONS"

Write-Host ""
Write-Host "Step 4: Creating R2 buckets..." -ForegroundColor Yellow
Write-Host "Creating uploads buckets..." -ForegroundColor Green
wrangler r2 bucket create shakestravel-uploads
wrangler r2 bucket create shakestravel-uploads-staging

Write-Host ""
Write-Host "Step 5: Initializing database schema..." -ForegroundColor Yellow
Write-Host "Setting up production database..." -ForegroundColor Green
wrangler d1 execute shakestravel-production --file="../database/schema.sql"

Write-Host "Setting up staging database..." -ForegroundColor Green
wrangler d1 execute shakestravel-staging --file="../database/schema.sql"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update wrangler.toml files with the resource IDs shown above" -ForegroundColor White
Write-Host "2. Set environment secrets using: wrangler secret put [SECRET_NAME]" -ForegroundColor White  
Write-Host "3. Test deployment with: wrangler deploy" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"