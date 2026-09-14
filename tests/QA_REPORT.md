# Automated QA Test Execution Report
**Target Host:** `http://localhost:3005`  
**Execution Date:** `2026-09-13 21:28:34`  
**Total Cases:** `29` | **Passed:** `3` | **Failed:** `26`

| ID | Domain | Use Case Name | Status | Duration | Notes |
|---|---|---|---|---|---|
| `UC-1.1` | Header | Coffee / Tea Track Mode Switching | ❌ FAIL | 4.60s | Header does not show 'Shop Local Coffee' button |
| `UC-1.2` | Header | Audible Sound Engine Mute/Unmute Toggle | ❌ FAIL | 0.00s | Audible sound toggle button not found |
| `UC-1.3` | Header | Global Multi-Index Search Modal (Ctrl+K) | ❌ FAIL | 0.00s | Search button not found |
| `UC-1.4` | Header | Shop Local Specialty Roaster Radar | ❌ FAIL | 0.00s | Shop Local button not found |
| `UC-1.5` | Header | Roasters Header Navigation & Active State | ❌ FAIL | 0.00s | Header Roasters button not found |
| `UC-1.6` | Header | Brew News Header Trigger & Smooth Scroll | ❌ FAIL | 0.00s | Brew News button not found in header |
| `UC-2.1` | Brewing | Step 01 Method Selection & URL Update | ❌ FAIL | 4.61s | V60 Dripper method card not found on grid |
| `UC-2.2` | Brewing | Imperial (oz/°F) vs Metric (g/ml/°C) Toggle | ❌ FAIL | 0.00s | Unit system toggle button not found |
| `UC-2.3` | Brewing | Step 02 Precision Ratio Scaler Calculations | ❌ FAIL | 0.00s | Precision ratio calculator values missing: {'hasGrams': True, 'hasRatio': False} |
| `UC-2.4` | Brewing | Step 03 Grind Visual Guide & Burr Micron Specs | ❌ FAIL | 0.00s | Step 03 Grind Visual Guide did not mount |
| `UC-2.5` | Brewing | Step 04 Multi-Phase Countdown Timer & Controls | ❌ FAIL | 0.00s | Step 04 Multi-Phase Timer did not mount |
| `UC-3.1` | Roasters | Roaster Showcase Page (/roasters) Mounting | ❌ FAIL | 5.08s | Roaster showcase page /roasters failed to mount correctly: {'h1': "Hmmm… can't reach this page", 'hasRoasterPartnerTag': False} |
| `UC-3.2` | Roasters | Roaster Tab Switcher (Methodical, Onyx, B&W) | ❌ FAIL | 0.00s | Onyx roaster pill switcher not found |
| `UC-3.3` | Roasters | 60-Second Video Demo Walkthrough Modal | ❌ FAIL | 0.00s | Watch Video button not found on /roasters |
| `UC-3.4` | Roasters | Dial-In Recipe CTA Auto-Configuration | ❌ FAIL | 0.00s | Dial-In & Brew CTA button not found on roaster profile |
| `UC-3.5` | Roasters | Persistent Back Navigation to Brewing Station | ❌ FAIL | 4.54s | Brewing Station back button not found on /roasters |
| `UC-4.1` | Academy | Academy Library Catalog Default 16-Card Grid | ❌ FAIL | 3.04s | Academy button not found in header |
| `UC-4.2` | Academy | Category Filtering (Pour-Over, Espresso, etc.) | ❌ FAIL | 1.01s | Espresso category filtering returned 0 cards |
| `UC-4.3` | Academy | Masterclass Title & Creator Search Input | ✅ PASS | 1.53s | Verified |
| `UC-4.4` | Academy | Theater Player Mode YouTube Embed | ❌ FAIL | 1.52s | 'str' object has no attribute 'get' |
| `UC-4.5` | Academy | Quick Navigation Toggle Back to Full Library | ✅ PASS | 1.52s | Verified |
| `UC-5.1` | WaterLab | Water Chemistry Lab Modal & SCA Target Range | ❌ FAIL | 0.00s | Water Lab button not found in header |
| `UC-5.3` | WaterLab | Static Water Chemistry Guide Landing Routes | ❌ FAIL | 7.66s | Failed to load /guides/water-chemistry-gh-kh |
| `UC-6.1` | Scanner | Barcode Scanner Modal Frame & Video Target | ❌ FAIL | 3.06s | Scan Bag button not found in header |
| `UC-7.1` | Journal | Tasting Journal Modal & LocalStorage Integrity | ❌ FAIL | 0.00s | Journal button not found in header |
| `UC-8.1` | Recipes | Master Recipe Vault Modal & Recipes Explorer | ❌ FAIL | 0.00s | Recipe Vault button not found |
| `UC-9.1` | News | World Brew News & Rel Noopener Sec Audit | ❌ FAIL | 4.54s | World News element not found |
| `UC-10.1` | Viewports | 5-Point Responsive Viewport Inspection | ❌ FAIL | 1.02s | Header not visible at viewport Mobile SE (375x667) |
| `UC-10.2` | Console | Browser Console Zero Unhandled Error Check | ✅ PASS | 0.00s | Verified |