#!/usr/bin/env bash
# Rebuild every page from source, re-inject translations, regenerate previews.
set -euo pipefail
cd "$(dirname "$0")/.."
cp source/Main.src.html pages/Main.dc.html
python3 scripts/build_cases.py
# case pages are regenerated untranslated; build_i18n injects the dictionary into any page that lacks it
python3 scripts/build_i18n.py
for f in pages/*.dc.html; do n=$(basename "$f" .dc.html); python3 scripts/make_preview.py "$f" "preview/$n.html" >/dev/null; done
echo "done"
