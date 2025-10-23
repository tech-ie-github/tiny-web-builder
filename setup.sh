#!/bin/bash

# Tiny Web Builder - Setup Script
# This script sets up the local development environment using Miniflare

set -e

echo "🚀 Setting up Tiny Web Builder development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 18+ and try again."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is required but not installed. Please install pnpm 8+ and try again."
    exit 1
fi

if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler is required but not installed. Please install Wrangler 4+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared package
echo "🔨 Building shared package..."
pnpm --filter @tiny-web-builder/shared build

# Create local D1 database (using wrangler dev which creates local resources)
echo "🗄️ Setting up local D1 database..."
echo "Note: D1 database will be created automatically when running wrangler dev"

# Apply database schema (this will work when wrangler dev is running)
echo "📊 Database schema will be applied when API worker starts"

# Create local KV namespace (using wrangler dev which creates local resources)
echo "💾 Setting up local KV namespace..."
echo "Note: KV namespace will be created automatically when running wrangler dev"

echo ""
echo "✅ Setup complete! Your local development environment is ready."
echo ""
echo "🚀 To start development servers, run:"
echo "   pnpm dev"
echo ""
echo "📱 Access points:"
echo "   • Editor: http://localhost:5173/"
echo "   • Preview (draft): http://localhost:4321/preview/default"
echo "   • Published site: http://localhost:4321/default"
echo "   • API: http://localhost:8787/api/"
echo ""
echo "💡 All data is stored locally in .wrangler/state/ directory"
echo "   No production Cloudflare resources are accessed during development."
echo ""
echo "📝 First-time setup notes:"
echo "   • The API worker will automatically create the D1 database and KV namespace"
echo "   • Initial data will be seeded when the API worker starts"
echo "   • All development uses Miniflare (local Cloudflare simulation)"
