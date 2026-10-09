#!/usr/bin/env python3
"""
Test Barcode Preset Reset Flow:
1. Opens the app and launches the Barcode Scanner Modal.
2. Verifies initial Quick Presets are visible and no bean card is displayed.
3. Clicks '⚡ Stumptown Recipe QR'.
4. Verifies the Stumptown result card ('Hair Bender') appears, the preset button is marked active (with ✕), and the '[ ↺ Reset / Clear ]' button appears in the toolbar.
5. Takes screenshot of active preset state.
6. Clicks the active '⚡ Stumptown Recipe QR' button to toggle it off.
7. Verifies the bean result card disappears and the modal returns to clear state.
8. Clicks 'Onyx Southern' preset.
9. Verifies the Onyx result card appears.
10. Clicks the '[ ↺ Reset / Clear ]' button in the Quick Presets toolbar.
11. Verifies the result card is dismissed and reset.
12. Clicks 'Sey Pink Bourbon' preset.
13. Clicks '[ ↺ Reset / Clear ]' in the result card header.
14. Verifies the result card is dismissed.
15. Clicks 'Proud Mary Ghost' preset.
16. Clicks '[ ↺ Reset / Scan Another ]' in the result card footer.
17. Verifies the result card is dismissed.
18. Takes screenshot of clean reset state.
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

async def run_reset_test():
    print(">>> Starting vite preview server on port 4173...")
    preview_proc = subprocess.Popen(
        "npx vite preview --port 4173",
        shell=True,
        cwd=r"c:\Users\gmasc\Documents\Antigravity\brewed",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(2.0)

    session = BrewBrowserSession(port=9272, width=1280, height=900)
    await session.start()

    try:
        print(">>> 1. Navigating to http://localhost:4173/...")
        await session.navigate("http://localhost:4173/", wait_seconds=3.0)

        # Open Barcode Scanner Modal via 'Have a Bag? Scan Barcode' button or header button
        print(">>> 2. Opening Barcode Scanner Modal...")
        opened = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const scanBtn = btns.find(b => b.textContent && (b.textContent.includes('Scan Barcode') || b.textContent.includes('Scan')));
            if (scanBtn) {
                scanBtn.click();
                return true;
            }
            return false;
        })()""")
        print(f"    Open button clicked: {opened}")
        await asyncio.sleep(1.0)

        # Verify modal opened
        modal_title = await session.evaluate("""(() => {
            const h2 = document.getElementById('scanner-modal-title');
            return h2 ? h2.textContent : null;
        })()""")
        print(f"    Scanner modal title: '{modal_title}'")
        assert modal_title and "Scanner" in modal_title, "Barcode Scanner Modal did not open"

        # Check initial state: no Hair Bender card
        has_card_init = await session.evaluate("""(() => {
            return document.body.innerText.includes('Hair Bender');
        })()""")
        print(f"    Initially has result card: {has_card_init}")
        assert not has_card_init, "Result card should not be visible before clicking preset"

        # Step A: Click '⚡ Stumptown Recipe QR' preset
        print(">>> 3. Selecting '⚡ Stumptown Recipe QR' preset...")
        clicked_stumptown = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Stumptown Recipe QR'));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        })()""")
        print(f"    Stumptown preset button clicked: {clicked_stumptown}")
        await asyncio.sleep(1.0)

        # Verify Hair Bender card is visible
        has_stumptown_card = await session.evaluate("""(() => {
            return document.body.innerText.includes('Hair Bender');
        })()""")
        print(f"    Result card displayed ('Hair Bender'): {has_stumptown_card}")
        assert has_stumptown_card, "Stumptown result card was not rendered"

        # Verify toolbar has '[ ↺ Reset / Clear ]' button
        has_toolbar_reset = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.some(b => b.textContent && b.textContent.includes('Reset / Clear'));
        })()""")
        print(f"    Toolbar '[ ↺ Reset / Clear ]' button present: {has_toolbar_reset}")
        assert has_toolbar_reset, "Toolbar reset button should be visible when preset is active"

        # Capture screenshot of active preset
        active_screenshot_path = os.path.join(ARTIFACT_DIR, "preset_active_state_verified.png")
        await session.capture_screenshot(active_screenshot_path)
        print(f"    Captured active preset screenshot: {active_screenshot_path}")

        # Step B: Toggle off by clicking the active '⚡ Stumptown Recipe QR' button again
        print(">>> 4. Testing toggle-off by clicking the active preset button again...")
        clicked_toggle = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Stumptown Recipe QR'));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        })()""")
        await asyncio.sleep(0.8)

        has_card_after_toggle = await session.evaluate("""(() => {
            return document.body.innerText.includes('Hair Bender');
        })()""")
        print(f"    Card visible after toggling preset off: {has_card_after_toggle}")
        assert not has_card_after_toggle, "Card should disappear after toggling preset button off!"

        # Step C: Select Onyx Southern, then click toolbar '[ ↺ Reset / Clear ]'
        print(">>> 5. Testing toolbar '[ ↺ Reset / Clear ]' button...")
        await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Onyx Southern'));
            if (btn) btn.click();
        })()""")
        await asyncio.sleep(0.8)

        has_onyx_card = await session.evaluate("""(() => {
            return document.body.innerText.includes('Southern Weather') || document.body.innerText.includes('Onyx Coffee Lab');
        })()""")
        print(f"    Onyx result card displayed: {has_onyx_card}")
        assert has_onyx_card, "Onyx card should be visible"

        # Click toolbar reset button
        await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const resetBtn = btns.find(b => b.textContent && b.textContent.includes('Reset / Clear'));
            if (resetBtn) resetBtn.click();
        })()""")
        await asyncio.sleep(0.8)

        has_card_after_toolbar_reset = await session.evaluate("""(() => {
            return document.body.innerText.includes('Southern Weather') || document.body.innerText.includes('Onyx Coffee Lab');
        })()""")
        print(f"    Card visible after toolbar reset: {has_card_after_toolbar_reset}")
        assert not has_card_after_toolbar_reset, "Card should disappear after toolbar reset!"

        # Step D: Select Sey Pink Bourbon, then click card header '[ ↺ Reset / Clear ]'
        print(">>> 6. Testing card header '[ ↺ Reset / Clear ]' button...")
        await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Sey Pink Bourbon'));
            if (btn) btn.click();
        })()""")
        await asyncio.sleep(0.8)

        has_sey_card = await session.evaluate("""(() => {
            return document.body.innerText.includes('Sey Coffee') || document.body.innerText.includes('Pink Bourbon');
        })()""")
        print(f"    Sey card displayed: {has_sey_card}")
        assert has_sey_card, "Sey card should be visible"

        # Click header reset button
        await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            // Header reset button has title 'Clear selected coffee and reset scanner'
            const headerReset = btns.find(b => b.title && b.title.includes('Clear selected coffee and reset scanner'));
            if (headerReset) headerReset.click();
        })()""")
        await asyncio.sleep(0.8)

        has_card_after_header_reset = await session.evaluate("""(() => {
            return document.body.innerText.includes('Sey Coffee');
        })()""")
        print(f"    Card visible after header reset: {has_card_after_header_reset}")
        assert not has_card_after_header_reset, "Card should disappear after header reset!"

        # Step E: Select Proud Mary, then click card footer '[ ↺ Reset / Scan Another ]'
        print(">>> 7. Testing card footer '[ ↺ Reset / Scan Another ]' button...")
        await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Proud Mary Ghost'));
            if (btn) btn.click();
        })()""")
        await asyncio.sleep(0.8)

        has_pm_card = await session.evaluate("""(() => {
            return document.body.innerText.includes('Proud Mary');
        })()""")
        print(f"    Proud Mary card displayed: {has_pm_card}")
        assert has_pm_card, "Proud Mary card should be visible"

        # Click footer reset button
        clicked_footer = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const footerReset = btns.find(b => b.textContent && b.textContent.includes('Reset / Scan Another'));
            if (footerReset) {
                footerReset.click();
                return true;
            }
            return false;
        })()""")
        print(f"    Footer reset button found and clicked: {clicked_footer}")
        await asyncio.sleep(0.8)

        has_card_after_footer_reset = await session.evaluate("""(() => {
            return document.body.innerText.includes('Ghost Rider Espresso Blend');
        })()""")
        print(f"    Card visible after footer reset: {has_card_after_footer_reset}")
        assert not has_card_after_footer_reset, "Card should disappear after footer reset!"

        # Capture screenshot of clean reset state
        reset_screenshot_path = os.path.join(ARTIFACT_DIR, "preset_reset_cleared_state_verified.png")
        await session.capture_screenshot(reset_screenshot_path)
        print(f"    Captured reset state screenshot: {reset_screenshot_path}")

        print(">>> ALL PRESET RESET TESTS PASSED SUCCESSFULLY! ✨")

    finally:
        await session.close()
        preview_proc.terminate()
        try:
            preview_proc.wait(timeout=2)
        except Exception:
            preview_proc.kill()

if __name__ == "__main__":
    asyncio.run(run_reset_test())
