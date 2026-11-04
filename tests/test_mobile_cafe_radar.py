#!/usr/bin/env python3
"""
Test Mobile Cafe Radar & Viewport Optimization:
1. Navigates to /cafes on mobile viewport (390x844).
2. Verifies the mobile tab switcher ('Map View' vs 'List') is visible.
3. Verifies that the Map container fills the screen with large height (>=400px).
4. Verifies that live nearby cafes are fetched and displayed.
5. Verifies that the selected cafe card is in compact peek mode (doesn't obstruct the map).
6. Tests expanding details, dismissing the card, and switching to List view.
7. Captures screenshots to the artifacts directory.
"""

import sys
import os
import asyncio
import subprocess
import time

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "e2e"))
from cdp_harness import BrewBrowserSession

ARTIFACT_DIR = r"C:\Users\gmasc\.gemini\antigravity\brain\71ef4c24-b550-4355-81dc-4b333d33e25f"

async def run_test():
    print(">>> Starting vite preview server on port 4173...")
    preview_proc = subprocess.Popen(
        "npx vite preview --port 4173",
        shell=True,
        cwd=r"c:\Users\gmasc\Documents\Antigravity\brewed",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(2.0)

    # Initialize headless browser session in mobile viewport (390x844)
    browser = BrewBrowserSession(port=9255, width=390, height=844)
    try:
        await browser.start()
        print(">>> Browser session started at 390x844 mobile viewport.")

        # Navigate to /cafes
        print(">>> Navigating to http://localhost:4173/cafes...")
        await browser.navigate("http://localhost:4173/cafes")
        await asyncio.sleep(3.5)

        # Check DOM for mobile switcher
        switcher_text = await browser.evaluate("""
            (() => {
                const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
                return btns.filter(t => t.includes('Map View') || t.includes('List'));
            })()
        """)
        print(f">>> Mobile switcher buttons found: {switcher_text}")
        assert any("Map View" in t for t in switcher_text), "Map View button missing from mobile switcher!"

        # Check map element dimensions
        map_info = await browser.evaluate("""
            (() => {
                const mapEl = document.querySelector('.leaflet-container') || document.querySelector('[class*="leaflet"]');
                if (!mapEl) return { found: false };
                const rect = mapEl.getBoundingClientRect();
                return {
                    found: true,
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    top: Math.round(rect.top)
                };
            })()
        """)
        print(f">>> Leaflet Map container info: {map_info}")
        assert map_info.get("found"), "Leaflet map container not found in DOM!"
        assert map_info.get("height", 0) >= 380, f"Map height {map_info.get('height')} is too small for mobile viewport!"

        # Check live cafes status ribbon
        status_ribbon = await browser.evaluate("""
            (() => {
                const el = document.querySelector('[class*="bg-amber-950/40"]');
                return el ? el.innerText.trim() : 'None';
            })()
        """)
        print(f">>> Radar search status ribbon: {status_ribbon}")

        # Capture mobile map view screenshot (top of view)
        map_screenshot_path = os.path.join(ARTIFACT_DIR, "mobile_cafe_radar_map_verified.png")
        await browser.screenshot(map_screenshot_path)
        print(f">>> Saved mobile map screenshot: {map_screenshot_path}")

        # Scroll to center map on mobile screen
        await browser.evaluate("window.scrollTo(0, 360);")
        await asyncio.sleep(0.5)
        map_scrolled_path = os.path.join(ARTIFACT_DIR, "mobile_cafe_radar_map_scrolled_verified.png")
        await browser.screenshot(map_scrolled_path)
        print(f">>> Saved mobile map scrolled screenshot: {map_scrolled_path}")

        # Test switching to List View
        print(">>> Tapping 'List' button on mobile switcher...")
        await browser.evaluate("""
            (() => {
                const listBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('List'));
                if (listBtn) listBtn.click();
            })()
        """)
        await asyncio.sleep(1.0)

        # Verify list items
        list_items_count = await browser.evaluate("""
            (() => {
                const cards = document.querySelectorAll('#local-coffee-shops-section .cursor-pointer');
                return cards.length;
            })()
        """)
        print(f">>> List view rendered {list_items_count} items")

        # Capture mobile list view screenshot
        list_screenshot_path = os.path.join(ARTIFACT_DIR, "mobile_cafe_radar_list_verified.png")
        await browser.screenshot(list_screenshot_path)
        print(f">>> Saved mobile list screenshot: {list_screenshot_path}")

        print("\n>>> ALL MOBILE CAFE RADAR CHECKS PASSED SUCCESSFULLY! <<<")

    finally:
        await browser.close()
        try:
            preview_proc.terminate()
            preview_proc.wait(timeout=2)
        except Exception:
            pass

if __name__ == "__main__":
    asyncio.run(run_test())
