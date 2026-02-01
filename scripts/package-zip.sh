#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Parse args
SKIP_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    *) echo "Unknown option: $arg"; exit 1 ;;
  esac
done

# Read version from extension/package.json
VERSION=$(node -p "require('$PROJECT_DIR/extension/package.json').version")
ZIP_NAME="Dear-Neighbors-v${VERSION}.zip"
STAGE_DIR="$PROJECT_DIR/.zip-stage"

echo "==> Packaging Dear Neighbors v${VERSION} (zip)"

# Build
if [ "$SKIP_BUILD" = false ]; then
  echo "==> Installing dependencies and building..."
  cd "$PROJECT_DIR/extension"
  npm ci
  npm run build
else
  echo "==> Skipping build (--skip-build)"
fi

# Verify dist exists
if [ ! -d "$PROJECT_DIR/extension/dist" ]; then
  echo "Error: extension/dist/ directory not found. Run npm run build first."
  exit 1
fi

# Clean previous staging
rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR/Dear Neighbors/extension"

# Copy built extension
cp -R "$PROJECT_DIR/extension/dist/." "$STAGE_DIR/Dear Neighbors/extension/"

# Generate INSTALL.txt
cat > "$STAGE_DIR/Dear Neighbors/INSTALL.txt" <<'EOF'
Dear Neighbors — Installation Guide
=====================================

1. Open Google Chrome (or Brave)
2. Go to chrome://extensions
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the "extension" folder from this Dear Neighbors folder
6. Done! Open a new tab to see your neighborhood dashboard

Getting started:
- Pin the extension in Chrome's toolbar (puzzle icon → pin Dear Neighbors)
- Click the gear icon to pick your country, city, and neighborhood
- Browse community links or share your own (sign-in required)
- Click the pinned icon on any page to quickly share it with neighbors
EOF

# Remove old zip if present
rm -f "$PROJECT_DIR/$ZIP_NAME"

# Create zip
echo "==> Creating $ZIP_NAME..."
cd "$STAGE_DIR"
zip -r "$PROJECT_DIR/$ZIP_NAME" "Dear Neighbors"

# Cleanup staging
rm -rf "$STAGE_DIR"

echo "==> Done: $PROJECT_DIR/$ZIP_NAME"
