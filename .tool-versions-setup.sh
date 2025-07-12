#!/bin/bash
set -euo pipefail

# this script is intended to be run from Cloudflare Pages to bootstrap new builds
# ./.tool-versions-setup.sh && hugo
# SKIP_DEPENDENCY_INSTALL=1

ASDF_DIR=".asdf-local"

echo "➡️ Installing asdf into $ASDF_DIR"
if [[ ! -d "$ASDF_DIR" ]]; then
  git clone https://github.com/asdf-vm/asdf.git "$ASDF_DIR" --branch v0.13.1
fi

# Load asdf
. "$ASDF_DIR/asdf.sh"
. "$ASDF_DIR/completions/asdf.bash" || true

# Export paths for use in build
export PATH="$PWD/$ASDF_DIR/bin:$PWD/$ASDF_DIR/shims:$PATH"

which asdf
asdf version

echo "➡️ Installing plugins from .tool-versions"

# Extract tools and ensure plugins are added
cut -d' ' -f1 .tool-versions | while read -r plugin; do
  if ! asdf plugin list | grep -q "^$plugin$"; then
    echo "➕ Adding plugin $plugin"
    asdf plugin add "$plugin"
  fi
done

echo "➡️ Installing tools"
asdf install

echo "✅ Installed tool versions:"
asdf current
