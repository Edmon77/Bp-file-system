#!/bin/bash

# Configuration
REPO_URL="https://github.com/Edmon77/intern"
APP_DIR="/home/deploy/intern"
PM2_API_NAME="api"
PM2_WEB_NAME="web"

# Navigate to app directory
cd $APP_DIR || { echo "Directory $APP_DIR not found"; exit 1; }

# Pull latest code
echo "Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Generate Prisma client
echo "Generating Prisma client..."
cd packages/database
npx prisma generate
cd ../..

# Restart apps with PM2
echo "Restarting apps with PM2..."
pm2 restart $PM2_API_NAME || pm2 start dist/apps/api/src/main.js --name $PM2_API_NAME
pm2 restart $PM2_WEB_NAME || pm2 start npm --name $PM2_WEB_NAME -- start -- -p 3001

echo "Deployment complete!"
