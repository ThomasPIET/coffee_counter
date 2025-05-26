#!/bin/bash

# Coffee Counter Deployment Script

set -e

echo "🚀 Starting Coffee Counter deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Validate required variables
if [ -z "$DOMAIN" ] || [ -z "$APP_KEY" ]; then
    echo "❌ Required environment variables missing. Please check DOMAIN and APP_KEY in .env"
    exit 1
fi

echo "📦 Building Docker image..."
docker-compose build --no-cache

echo "🏗️ Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "🔍 Running Laravel setup..."
docker-compose exec coffee-counter php artisan key:generate --force
docker-compose exec coffee-counter php artisan migrate --force
docker-compose exec coffee-counter php artisan config:cache
docker-compose exec coffee-counter php artisan route:cache
docker-compose exec coffee-counter php artisan view:cache

echo "✅ Deployment completed!"
#echo "🌐 Your application should be available at: https://$DOMAIN"
#echo "📊 Traefik dashboard: https://traefik.$DOMAIN"

echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart app: docker-compose restart coffee-counter"
echo "  Update app: docker-compose pull && docker-compose up -d"
