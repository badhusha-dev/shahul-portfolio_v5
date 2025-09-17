#!/bin/bash

# Script to check and fix public directory issues
echo "🔍 Checking public directory on server..."

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ Public directory not found!"
    echo "📁 Creating public directory structure..."
    
    mkdir -p public/icons public/cv public/images/blog public/images/projects
    
    # Create basic favicon.svg
    cat > public/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#3b82f6"/>
  <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="40" font-weight="bold">S</text>
</svg>
EOF
    
    # Create basic manifest.json
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
    
    # Create basic icon
    cat > public/icons/icon-192x192.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <circle cx="96" cy="96" r="80" fill="#3b82f6"/>
  <text x="96" y="120" text-anchor="middle" fill="white" font-family="Arial" font-size="80" font-weight="bold">S</text>
</svg>
EOF
    
    cp public/icons/icon-192x192.svg public/icons/icon-512x512.svg
    
    echo "✅ Created basic public directory structure"
else
    echo "✅ Public directory exists"
    
    # Check for required files
    missing_files=()
    
    if [ ! -f "public/favicon.svg" ]; then
        missing_files+=("favicon.svg")
    fi
    
    if [ ! -f "public/manifest.json" ]; then
        missing_files+=("manifest.json")
    fi
    
    if [ ! -d "public/icons" ]; then
        missing_files+=("icons directory")
    fi
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        echo "⚠️  Missing files: ${missing_files[*]}"
        echo "📝 You may need to pull the latest changes or create these files manually"
    else
        echo "✅ All required public files are present"
    fi
fi

echo ""
echo "📋 Next steps:"
echo "1. If files were missing, try: git pull origin master"
echo "2. Then run: ./deploy.sh deploy-server"
echo "3. Or run: ./deploy.sh cleanup-docker && ./deploy.sh deploy-server"
