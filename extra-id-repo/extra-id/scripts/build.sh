#!/usr/bin/env bash
# Сборка: ./scripts/build.sh  ->  dist/extra-id-chrome-<ver>.zip и dist/extra-id-firefox-<ver>.zip
set -euo pipefail
cd "$(dirname "$0")/.."
VER=$(python3 -c "import json;print(json.load(open('manifests/manifest.chrome.json'))['version'])")
VER_FF=$(python3 -c "import json;print(json.load(open('manifests/manifest.firefox.json'))['version'])")
[ "$VER" = "$VER_FF" ] || { echo "Версии манифестов не совпадают: $VER vs $VER_FF"; exit 1; }
rm -rf dist && mkdir -p dist
for T in chrome firefox; do
  B="dist/build-$T"; mkdir -p "$B"
  cp -R src/. "$B/"
  cp "manifests/manifest.$T.json" "$B/manifest.json"
  (cd "$B" && zip -q -r -X "../extra-id-$T-$VER.zip" . -x '.*')
  rm -rf "$B"
done
ls -l dist
