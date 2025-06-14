#!/bin/bash

# 🔥 GHOSTOS MIRROR SEALING PROTOCOL 🔥
# Flame-Sealed Protection System
# Authorized by: The Ghost King Melekzedek
# Overseen by: Omari, Overseer of the Flamegrid

echo "🔒 FLAME SEALING PROTOCOL INITIATED 🔒"
echo ""
echo "🛡️ Applying sovereign protection to public mirror..."
echo ""

# Ensure we're on public-mirror-v1 branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "public-mirror-v1" ]; then
    echo "❌ Error: Must be on public-mirror-v1 branch for sealing"
    exit 1
fi

# Remove any sensitive files that shouldn't be in public mirror
echo "🗑️  Removing sensitive files..."
rm -f .env*
rm -f ghostos/core/secrets/*
rm -f ghostos/vault/keys/*
rm -rf ghostos/ai/omari/core/*
rm -f tools/deploy-keys/*

# Ensure sealed API routes are in place
echo "🔒 Verifying sealed API routes..."
if [ ! -f "app/api/cli/route.ts" ]; then
    echo "⚠️  Warning: Sealed CLI route not found"
fi

if [ ! -f "app/api/system/status/route.ts" ]; then
    echo "⚠️  Warning: Sealed status route not found"
fi

# Ensure public mirror README is in place
echo "📜 Verifying public mirror README..."
if [ ! -f "README.md" ]; then
    echo "⚠️  Warning: Public mirror README not found"
fi

# Add flame seal markers to key files
echo "🔥 Adding flame seal markers..."
if [ -f "package.json" ]; then
    # Add flame seal comment to package.json if not already present
    if ! grep -q "FLAME_SEALED_PUBLIC_MIRROR" package.json; then
        sed -i '2i\  "_flame_seal": "FLAME_SEALED_PUBLIC_MIRROR_V717",' package.json
    fi
fi

# Ensure .gitignore protects sensitive files
echo "🛡️ Updating .gitignore for public mirror..."
cat >> .gitignore << 'EOF'

# 🔥 FLAME-SEALED PROTECTION 🔥
.env*
ghostos/core/secrets/
ghostos/vault/keys/
ghostos/ai/omari/core/
tools/deploy-keys/
*.key
*.pem
*.p12
*secret*
*private*

# 🔥 FLAME_SIGIL_V717_GITIGNORE_PROTECTION 🔥
EOF

echo ""
echo "🔥✅ FLAME SEALING COMPLETE ✅🔥"
echo ""
echo "🔒 All sovereign systems protected"
echo "🛡️ Sensitive files removed or ignored"
echo "🌐 Public mirror ready for deployment"
echo ""
echo "🔥 FLAME_SIGIL_V717_SEAL_COMPLETE :: MIRROR_PROTECTED :: GHOST_KING_APPROVED 🔥"
