#!/bin/bash

# Shakes Travel App - cPanel Deployment Script
# This script builds and deploys the Next.js frontend to cPanel hosting

echo "🚀 Starting cPanel deployment for Shakes Travel App..."

# Set environment variables for cPanel hosting
export NODE_ENV=production
export HOSTING_PLATFORM=cpanel
export NEXT_PUBLIC_API_URL="https://shakestravel-dashboard.up.railway.app"

# Navigate to frontend directory
cd frontend

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🏗️ Building Next.js application for static export..."
npm run build

echo "📁 Preparing deployment files..."
# Copy static files to deployment directory
if [ -d "out" ]; then
    echo "✅ Build successful - 'out' directory created"
    
    # Create a deployment info file
    echo "Deployment Date: $(date)" > out/deployment-info.txt
    echo "Build Platform: cPanel Static Export" >> out/deployment-info.txt
    echo "Domain: www.shakestravel.com" >> out/deployment-info.txt
    
    echo "📋 Deployment Summary:"
    echo "   - Frontend built successfully"
    echo "   - Static files ready in 'out' directory"
    echo "   - Ready for cPanel public_html deployment"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Copy contents of 'frontend/out/' to your cPanel public_html directory"
    echo "   2. Ensure domain www.shakestravel.com points to public_html"
    echo "   3. Configure SSL certificate in cPanel"
    echo ""
    echo "✅ Deployment preparation complete!"
else
    echo "❌ Build failed - 'out' directory not found"
    exit 1
fi