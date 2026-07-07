# PWA Plan — Personal Finance Tracker

## Top-Level Overview

Convert the existing Personal Finance Tracker from a plain HTML/JS web app into a **Progressive Web App (PWA)**. The goal is for the app to:

- Continue working in any desktop/mobile browser exactly as today
- Be installable on Android (Chrome → "Add to Home Screen" → full-screen app)
- Be installable on iOS (Safari → Share → "Add to Home Screen" → full-screen app)
- Work fully **offline** after first load (no internet required)

No framework changes, no code duplication. The same `index.html`, `css/`, `js/`, and `lib/` files serve all three surfaces. Only additive files and small metadata changes are needed.

---

## Sub-Tasks

---

### Sub-Task 1 — App Icons

**Intent**  
PWAs require icon assets in specific sizes for Android home screen, iOS splash screen, and browser install prompts. These must exist before the manifest can reference them.

**Expected Outcomes**
- An `icons/` folder exists at the project root
- Contains icons at sizes: 192×192 and 512×512 (PNG, required by Android/Chrome)
- Contains a 180×180 icon (PNG, required by iOS Safari `apple-touch-icon`)
- Contains a 16×16 and 32×32 favicon (PNG, for browser tab)

**Todo List**
- [ ] Create `icons/` directory at project root
- [ ] Generate or place `icon-16.png` (16×16)
- [ ] Generate or place `icon-32.png` (32×32)
- [ ] Generate or place `icon-180.png` (180×180) — used as Apple Touch Icon
- [ ] Generate or place `icon-192.png` (192×192) — required by Android Chrome install
- [ ] Generate or place `icon-512.png` (512×512) — required for Android splash / maskable

**Relevant Context**
- Icons should use the app's theme colour `#2563eb` (defined in `css/styles.css` as `--primary-color`)
- The app title is "Personal Finance Tracker" with a 💰 motif
- Icons can be simple solid-colour PNGs with a ₹ or wallet symbol — they do not need to be elaborate

**Status:** `[x] done`

---

### Sub-Task 2 — Web App Manifest

**Intent**  
The `manifest.json` file tells the browser and OS how to present the app when installed: its name, icons, theme colour, display mode, and start URL. This is the core PWA metadata file.

**Expected Outcomes**
- `manifest.json` exists at the project root
- References all icons from Sub-Task 1
- Sets `display: standalone` so the app opens full-screen without browser chrome
- Sets correct `theme_color` and `background_color` matching the app's palette
- `index.html` links to the manifest and includes all required Apple/Android meta tags

**Todo List**
- [ ] Create `manifest.json` with fields: `name`, `short_name`, `description`, `start_url`, `display`, `background_color`, `theme_color`, `icons`
- [ ] Add `<link rel="manifest">` to `index.html` `<head>`
- [ ] Add `<meta name="theme-color">` to `index.html` `<head>`
- [ ] Add `<meta name="apple-mobile-web-app-capable" content="yes">` to `index.html`
- [ ] Add `<meta name="apple-mobile-web-app-status-bar-style">` to `index.html`
- [ ] Add `<meta name="apple-mobile-web-app-title">` to `index.html`
- [ ] Add `<link rel="apple-touch-icon">` pointing to `icons/icon-180.png`

**Relevant Context**
- `index.html` already has `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — no change needed there
- Theme colour is `#2563eb`, background colour is `#f9fafb` (from `--bg-color` in `css/styles.css`)
- `start_url` should be `./index.html` (relative, so it works when opened as a local file or from a server)

**Status:** `[x] done`

---

### Sub-Task 3 — Service Worker (Offline Support)

**Intent**  
A service worker is a background script that intercepts network requests and serves cached responses. This enables the app to load and function with no internet connection after the first visit — critical for a finance tracker that stores data locally.

**Expected Outcomes**
- `sw.js` exists at the project root
- On first install, it caches all app assets: `index.html`, `css/styles.css`, `js/*.js`, `lib/xlsx.full.min.js`, and all icons
- On subsequent loads, assets are served from cache (cache-first strategy)
- When new assets are available (cache version bump), the old cache is cleared
- `index.html` registers the service worker on load

**Todo List**
- [ ] Create `sw.js` at project root with a named cache version (e.g. `finance-tracker-v1`)
- [ ] In the `install` event: pre-cache all static assets
- [ ] In the `activate` event: delete old caches whose name does not match current version
- [ ] In the `fetch` event: respond from cache if available, otherwise fetch from network (cache-first)
- [ ] In `index.html`, add an inline `<script>` at the bottom that registers `sw.js` if `serviceWorker` is supported in the browser

**Relevant Context**
- Assets to pre-cache: `./`, `./index.html`, `./css/styles.css`, `./js/app.js`, `./js/utils.js`, `./js/storage.js`, `./js/excel.js`, `./lib/xlsx.full.min.js`, and all icons
- The service worker must be at the project root (same level as `index.html`) to control the full page scope
- `localStorage` (used by `js/storage.js`) is unaffected by service workers — data will persist as before
- Excel import/export uses `lib/xlsx.full.min.js` — this must be in the pre-cache list so it works offline

**Status:** `[x] done`

---

### Sub-Task 4 — Mobile UI Polish

**Intent**  
When running as an installed PWA in standalone mode on Android/iOS, certain browser-specific affordances disappear (address bar, back button). The UI must be touch-friendly, readable, and fully usable on small screens without relying on browser chrome.

**Expected Outcomes**
- Tap targets (buttons, form inputs, selects) are at least 44×44px on mobile
- The transaction table switches to a **card layout** on screens ≤ 600px wide (avoids horizontal scrolling)
- The sticky header remains usable on mobile
- Filters collapse gracefully on small screens
- No content is clipped or requires horizontal scrolling on a 375px-wide screen (iPhone SE / small Android)

**Todo List**
- [ ] In `css/styles.css`: ensure all `input`, `select`, and `button` elements have `min-height: 44px` inside the `@media (max-width: 600px)` block
- [ ] In `css/styles.css`: add a `.transaction-card` style for mobile card layout (replaces table rows)
- [ ] In `css/styles.css`: hide `#transactionsTable` and show `.transaction-cards-list` at ≤ 600px; hide `.transaction-cards-list` and show `#transactionsTable` at > 600px
- [ ] In `js/app.js` → `renderTransactions()`: render both the `<tbody>` rows (desktop) and a `<div class="transaction-cards-list">` (mobile) in parallel, letting CSS control which is visible
- [ ] In `css/styles.css`: adjust `body` padding to `env(safe-area-inset-*)` for iPhone notch/home-bar clearance
- [ ] Verify the backup banner, modal, and notifications are readable at 375px width

**Relevant Context**
- `renderTransactions()` is in `js/app.js` lines 342–377 — this is the only function that needs to change
- The `#transactionsTable` and its `tbody#transactionsBody` already exist in `index.html` lines 167–185
- A sibling `<div id="transactionCards">` needs to be added to `index.html` after the `table-container` div
- Existing `@media (max-width: 768px)` and `@media (max-width: 480px)` blocks in `css/styles.css` (lines 603–679) are the right place to extend

**Status:** `[x] done`

---

## Implementation Order

Sub-tasks must be done in order — the manifest (Sub-Task 2) references icons (Sub-Task 1), and the service worker (Sub-Task 3) caches icons. Sub-Task 4 is independent and can be done last.

```
Sub-Task 1 (Icons) → Sub-Task 2 (Manifest) → Sub-Task 3 (Service Worker) → Sub-Task 4 (Mobile UI)
```

## Testing Checklist (after all sub-tasks complete)

- [ ] Open `index.html` in Chrome desktop — app loads and works as before
- [ ] Open via a local HTTP server (`npx serve .`) — Chrome shows install prompt in address bar
- [ ] Install on Android Chrome — opens full-screen, works offline after first load
- [ ] Open on iOS Safari — "Add to Home Screen" option available, opens full-screen
- [ ] Resize browser to 375px width — card layout appears, no horizontal scroll
- [ ] Add a transaction while offline — data saves to localStorage successfully
