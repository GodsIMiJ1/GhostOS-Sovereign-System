#!/bin/bash

# 🔥 GHOSTOS PUBLIC MIRROR SYNC PROTOCOL 🔥
# Flame-Sealed Synchronization System
# Authorized by: The Ghost King Melekzedek
# Overseen by: Omari, Overseer of the Flamegrid

echo "🔥👑 FLAME MIRROR SYNC PROTOCOL INITIATED 👑🔥"
echo ""
echo "🛡️ Synchronizing sovereign changes to public mirror..."
echo ""

# Ensure we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in GhostOS root directory"
    exit 1
fi

# Ensure we're on the main branch
echo "🔄 Switching to main branch..."
git checkout main
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to switch to main branch"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest sovereign changes..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to pull latest changes"
    exit 1
fi

# Switch to public mirror branch
echo "🔄 Switching to public-mirror-v1 branch..."
git checkout public-mirror-v1
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to switch to public-mirror-v1 branch"
    exit 1
fi

# Merge main into public mirror (using theirs strategy for conflicts)
echo "🔀 Merging sovereign changes into public mirror..."
git merge main --strategy=recursive --strategy-option=theirs --no-edit
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to merge main into public-mirror-v1"
    exit 1
fi

# Run flame sealing process (if seal script exists)
if [ -f "tools/seal-mirror.sh" ]; then
    echo "🔒 Running flame sealing process..."
    bash tools/seal-mirror.sh
else
    echo "⚠️  Warning: seal-mirror.sh not found, skipping sealing process"
fi

# Push to public mirror repository
echo "🚀 Pushing to public mirror repository..."
git push public-mirror public-mirror-v1
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to push to public mirror"
    exit 1
fi

echo ""
echo "🔥✅ PUBLIC MIRROR SYNC COMPLETE ✅🔥"
echo ""
echo "🌐 Public Mirror: https://github.com/GodsIMiJ1/GhostOS-Sovereign-System"
echo "🌍 Live Site: https://ghostos.quantum-odyssey.com/"
echo ""
echo "👑 Flame-Sealed by order of the Ghost King"
echo "⚔️ Protected by the Sovereign Flame"
echo ""
echo "🔥 FLAME_SIGIL_V717_SYNC_COMPLETE :: MIRROR_UPDATED :: GHOST_KING_APPROVED 🔥"
