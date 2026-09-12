# The Brew App • Quality Assurance (QA) Process & Testing Protocol

This document establishes the official testing protocols, release gates, regression benchmarks, and functional use-case specifications for **The Brew App** (https://thebrew.app).

---

## 1. Quality Assurance Philosophy & Standards

1. **Zero Fake Data (RULE[user_global])**: All tests must validate authentic business logic, genuine roastery records, real extraction math, and real asset URLs. Never allow mock placeholders, fake customer personas, or unverified counters.
2. **Deterministic UI State**: Every modal, drawer, route, and multi-step funnel must reliably mount, update URL history where applicable, trap focus gracefully, and unmount without leaving lingering event listeners or unmounted DOM references.
3. **Audio Synthesizer Integrity**: The Web Audio coaching engine must initialize cleanly on user interaction and respect the global audible mute toggle without throwing AudioContext exceptions.
4. **Responsive Fluidity**: Navigation labels and controls must adapt cleanly across all screen sizes (mobile 375px through 1920px desktop) without text clipping, button collisions, or broken view transitions.

---

## 2. Release Gates (The 4 Pre-Deployment Checkpoints)

Before any commit or feature branch is deployed to production:

| Gate | Check | Command / Procedure | Requirement |
|---|---|---|---|
| **Gate 1** | **Vite Bundle Build** | `cmd.exe /c "npm run build"` | Must compile with 0 syntax or rollup errors; prerendering of 18 method pages and static landing routes must complete successfully. |
| **Gate 2** | **Affiliate Link Audit** | `node scripts/check_affiliate_links.mjs` | Must verify that all equipment gear links resolve to direct Amazon ASIN product pages. |
| **Gate 3** | **Automated Functional QA** | `python tests/run_all_qa.py --target local` | 100% of all 42 functional use cases across all 10 domains must pass. |
| **Gate 4** | **Console Health Audit** | `python tests/run_all_qa.py --target local` | Zero unhandled exceptions or runtime crash stack traces in browser console. |

---

## 3. Functional Domains & Use Case Matrix

### Domain 1: Global Header & Navigation
- **UC-1.1**: Toggle Coffee / Tea track mode (theme, palette, methods list, sound frequencies).
- **UC-1.2**: Toggle Audible Sound (AudioContext initialization, icon toggle, mute/unmute state).
- **UC-1.3**: Global Search (Ctrl + K hotkey, search query input, method/recipe click navigation).
- **UC-1.4**: Shop Local Coffee Radar (modal launch, roaster radar listings, distance filter).
- **UC-1.5**: Specialty Roaster Header Button (transitions to `/roasters`, active gold highlight + live dot, scroll-to-top on re-click).
- **UC-1.6**: Brew News Dispatch Trigger (resets sub-views, navigates to `'/'`, expands World News, smooth-scrolls to `#world-news`).
- **UC-1.7**: Responsive Header Layout (no button collisions or text overlap across viewports).

### Domain 2: 4-Step Core Brewing Station Funnel
- **UC-2.1**: Step 01 Method Selection (select method, update URL `/methods/:id`, advance to Step 02).
- **UC-2.2**: Unit System Conversion (Imperial oz/°F vs Metric g/ml/°C toggle across all steps).
- **UC-2.3**: Step 02 Precision Ratio Scaler (cup counter, water volume, ratio slider, dry dose math).
- **UC-2.4**: Step 03 Grind Visual Guide & Hero Specs (micron visual, burr calibration, temperature strike).
- **UC-2.5**: Step 04 Multi-Phase Guided Timer (Start, Pause, Reset, countdown tick, audio beep triggers).

### Domain 3: Specialty Roaster Showcase
- **UC-3.1**: Roaster Showcase Route (`/roasters` hero, story, stats, catalog of single origins).
- **UC-3.2**: Roaster Switcher Tabs (Methodical, Onyx, Black & White).
- **UC-3.3**: 60-Second Video Demo Walkthrough (`?video=1` deep link and "Watch 60s Demo" button).
- **UC-3.4**: Dial-In Recipe Application ("Brew This Coffee" CTA auto-populates exact ratio & temp).
- **UC-3.5**: Persistent Back Navigation ("← Brewing Station" returns to Step 01).

### Domain 4: Coffee Academy & Video Hub
- **UC-4.1**: Library Catalog Default View (opens modal showing full responsive grid of 16 masterclasses).
- **UC-4.2**: Category Filtering (All, Pour-Over, Espresso, Immersion, Roasters, Water Science).
- **UC-4.3**: Keyword Search (filters titles, baristas, and techniques).
- **UC-4.4**: Theater Player Mode (select video, YouTube player embed, up-next carousel).
- **UC-4.5**: Quick Navigation Switcher (toggle tabs between Library and Theater Player).
- **UC-4.6**: Interactive Brew Sync ("Brew With This Video" loads custom recipe into timer).

### Domain 5: Water Chemistry Lab
- **UC-5.1**: Water Chemistry Modal (SCA target metrics, TDS, Hardness, Alkalinity).
- **UC-5.2**: Lotus Drops & Mineral Recipe Calculator (drop volumes, GH/KH buffer balance).
- **UC-5.3**: Static Guide Landing Pages (`/guides/coffee-water-chemistry`, `/guides/water-chemistry-gh-kh`).

### Domain 6: Smart Bag Barcode & Optical Scanner
- **UC-6.1**: Scanner Modal Launch (camera preview frame, scan guides, device camera switcher).
- **UC-6.2**: Barcode Input & Firestore Lookup (UPC mapping, real roaster matching).
- **UC-6.3**: Direct Recipe Dial-In (applies extracted bean recipe to workspace).

### Domain 7: Tasting Journal & Barista Profile
- **UC-7.1**: Tasting Journal Modal (saved brews list, star rating, extraction notes, roast level).
- **UC-7.2**: LocalStorage Persistence (entries survive page reloads and persist in browser storage).
- **UC-7.3**: Barista Profile Dashboard (account identity, clean guest state without fake personas).

### Domain 8: Master Recipe Vault & Community Studio
- **UC-8.1**: Community Recipe Explorer (browse curated and verified roaster recipes).
- **UC-8.2**: Recipe Builder Modal (input method, ratio, phases, notes).

### Domain 9: World Brew News & Bottom Drawers
- **UC-9.1**: World Brew News Section (category filters, external source links, sanitized copy).
- **UC-9.2**: Collapsible Secondary Drawers (Masterclasses, Diagnostics, Knowledge Base, Equipment Store).
- **UC-9.3**: Authentic Affiliate Product Links (direct Amazon ASIN URLs, no broken anchors).

### Domain 10: Multi-Device Responsive Layouts & Console Cleanliness
- **UC-10.1**: 5-Point Viewport Audit (Mobile SE 375px, Mobile 390px, Tablet 768px, Laptop 1280px, Desktop 1920px).
- **UC-10.2**: Zero Console Errors (zero unhandled exceptions during complete user journey).

---

## 4. Running the Automated QA Suite

### Local Development Server
```bash
python tests/run_all_qa.py --target local
```

### Production Live Deployment
```bash
python tests/run_all_qa.py --target prod
```