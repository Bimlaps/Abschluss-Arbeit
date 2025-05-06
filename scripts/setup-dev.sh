#!/bin/bash

# 247Vitrine Development Setup Script

echo "🚀 Setting up 247Vitrine development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build shared packages
echo "🔨 Building shared packages..."
yarn workspace @247vitrine/config build
yarn workspace @247vitrine/types build
yarn workspace @247vitrine/utils build
yarn workspace @247vitrine/ui-components build

# Create .env files if they don't exist
echo "🔧 Setting up environment files..."

if [ ! -f services/auth-service/.env ]; then
  cp services/auth-service/.env.example services/auth-service/.env
  echo "✅ Created auth-service .env file"
fi

if [ ! -f services/builder-service/.env ]; then
  cp services/builder-service/.env.example services/builder-service/.env
  echo "✅ Created builder-service .env file"
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB status..."
if command -v docker &> /dev/null; then
  if ! docker ps | grep -q "mongo"; then
    echo "🚀 Starting MongoDB container..."
    docker run -d -p 27017:27017 --name 247vitrine-mongodb mongo:latest
  else
    echo "✅ MongoDB is already running"
  fi
else
  echo "⚠️ Docker not found. Please make sure MongoDB is running on port 27017"
fi

echo "✨ Setup complete! You can now start the development servers:"
echo "📝 To start all services: yarn dev"
echo "📝 To start individual services:"
echo "   - Auth Service: yarn workspace @247vitrine/auth-service dev"
echo "   - Builder Service: yarn workspace @247vitrine/builder-service dev"
echo "   - Customer Portal: yarn workspace @247vitrine/customer-portal dev"
