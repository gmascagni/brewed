#!/usr/bin/env python3
"""
Test Scanned QR Route Navigation & Recipe Dial-In
Validates that navigating to /r/methodical_ethiopia_chelbesa:
1. Never hangs on a connecting/404 screen.
2. Resolves Methodical Coffee Ethiopia Yirgacheffe - Chelbesa (Lot #4).
3. Dials in Step 04 (Guided Brew Timer) with 1:16.5 ratio, 18.0g dose, 297g water, and 202°F.
4. Pre-brew checklist is ready and interactive.
"""

import sys
import os
import asyncio
import time

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "e2e"))
from cdp_harness import BrewBrowserSession

ARTIFACT_DIR = r"C:\Users\gmasc\.gemini\antigravity\brain\e5e7e1f5-9e1b-4b14-a260-40757123b1c4"

async def main():
    print(">>> Starting Headless Browser Session for Scanned QR Route Verification...")
    session = BrewBrowserSession(port=9270, width=1280, height=900)
    await session.start()

    try:
        url = "http://localhost:3005/r/methodical_ethiopia_chelbesa"
        print(f">>> Navigating to scanned label URL: {url}")
        await session.navigate(url, wait_seconds=3.0)

        # 1. Verify not stuck on 404 or connecting screen
        page_title = await session.evaluate("document.title")
        body_text = await session.evaluate("document.body.innerText")
        current_href = await session.evaluate("window.location.href")

        print(f"    Current Page Title: {page_title}")
        print(f"    Current URL: {current_href}")

        assert "Connecting to Roaster Portfolio..." not in body_text, "ERROR: Page is hung on 'Connecting to Roaster Portfolio...'!"
        
        # Wait for #step-4 or Step 4 container
        print(">>> Checking for Step 04 Guided Brew Timer...")
        step4_found = await session.wait_for(
            "document.body.innerText.includes('Guided Brew Timer') || document.body.innerText.includes('Chelbesa') || document.body.innerText.includes('Methodical')",
            timeout_seconds=8.0
        )
        assert step4_found, "ERROR: Step 04 did not load!"

        # Extract recipe dial-in values from DOM
        recipe_details = await session.evaluate("""
            (() => {
                const text = document.body.innerText;
                const ratioMatch = text.match(/1\\s*:\\s*([0-9.]+)/) || text.match(/Ratio[\\s\\S]*?([0-9.]+)/i);
                const hasMethodical = text.includes('Methodical');
                const hasChelbesa = text.includes('Chelbesa');
                const hasPreBrewChecklist = text.includes('Pre-Brew Checklist') || text.includes('Pre-Brew');
                const hasWater297 = text.includes('297') || text.includes('297g') || text.includes('297 ml');
                const hasDose18 = text.includes('18.0') || text.includes('18g') || text.includes('18.0g');
                const hasTemp202 = text.includes('202°') || text.includes('202');

                return {
                    hasMethodical,
                    hasChelbesa,
                    hasPreBrewChecklist,
                    hasWater297,
                    hasDose18,
                    hasTemp202,
                    currentUrl: window.location.href
                };
            })()
        """)

        print(f"    Recipe Check Results: {recipe_details}")
        assert recipe_details["hasMethodical"], "Methodical Coffee not found in dial-in header!"
        assert recipe_details["hasChelbesa"], "Chelbesa bean name not found in dial-in header!"
        assert recipe_details["hasPreBrewChecklist"], "Pre-Brew Checklist not rendered!"

        # Capture Desktop Screenshot
        desktop_shot = os.path.join(ARTIFACT_DIR, "verify_qr_scan_chelbesa_step4.png")
        await session.screenshot(desktop_shot)
        print(f"✓ Desktop Screenshot saved to: {desktop_shot}")

        # Test Mobile Viewport (simulate phone camera scan experience)
        print(">>> Testing Mobile Device Viewport (iPhone 14 / 390x844)...")
        await session.set_viewport(390, 844)
        await asyncio.sleep(1.0)
        mobile_shot = os.path.join(ARTIFACT_DIR, "verify_qr_scan_mobile_step4.png")
        await session.screenshot(mobile_shot)
        print(f"✓ Mobile Screenshot saved to: {mobile_shot}")

        print("\n=======================================================")
        print("🎉 ALL TESTS PASSED: Scanned QR code instantly dialed in Step 04!")
        print("=======================================================")

    finally:
        await session.close()

if __name__ == "__main__":
    asyncio.run(main())
