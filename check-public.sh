#!/bin/bash

# Script to check and fix public directory issues
echo "🔍 Checking public directory on server..."

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ Public directory not found!"
    echo "📁 Creating public directory structure..."
    
    mkdir -p public/icons public/cv public/images/blog public/images/projects
else
    echo "✅ Public directory exists"
fi

# Create basic favicon.svg if it doesn't exist
if [ ! -f "public/favicon.svg" ]; then
    echo "📝 Creating basic favicon.svg..."
    cat > public/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#3b82f6"/>
  <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="40" font-weight="bold">S</text>
</svg>
EOF
fi

# Create basic manifest.json if it doesn't exist
if [ ! -f "public/manifest.json" ]; then
    echo "📝 Creating basic manifest.json..."
    cat > public/manifest.json << 'EOF'
{
  "name": "Shahul Portfolio",
  "short_name": "Portfolio",
  "description": "Shahul Hameed's Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "icons/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "icons/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}
EOF
fi

# Create basic icon if it doesn't exist
if [ ! -f "public/icons/icon-192x192.svg" ]; then
    echo "📝 Creating basic icons..."
    cat > public/icons/icon-192x192.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <circle cx="96" cy="96" r="80" fill="#3b82f6"/>
  <text x="96" y="120" text-anchor="middle" fill="white" font-family="Arial" font-size="80" font-weight="bold">S</text>
</svg>
EOF
    cp public/icons/icon-192x192.svg public/icons/icon-512x512.svg
fi

echo "✅ Public directory setup completed"

echo ""
echo "📋 Next steps:"
echo "1. If files were missing, try: git pull origin master"
echo "2. Then run: ./deploy.sh deploy-server"
echo "3. Or run: ./deploy.sh cleanup-docker && ./deploy.sh deploy-server"
