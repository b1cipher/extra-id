# Extra ID

Browser extension (Chrome / Firefox, Manifest V3): disposable profiles, temporary mail, form autofill.

- Privacy policy: see `docs/index.html` (published via GitHub Pages)
- Source: `src/` (shared by both browsers)
- Manifests: `manifests/manifest.chrome.json`, `manifests/manifest.firefox.json`

## Build

```bash
./scripts/build.sh
```

Produces `dist/extra-id-chrome-<version>.zip` and `dist/extra-id-firefox-<version>.zip`.
There is no bundler or minifier: the zip contains the source as-is.

## Run locally

- Chrome: `chrome://extensions` → Developer mode → Load unpacked → pick an unzipped Chrome build.
- Firefox: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → pick `manifest.json` of an unzipped Firefox build.
