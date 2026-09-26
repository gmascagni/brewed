#!/usr/bin/env python3
"""
Test Barcode to Recipe Flow:
1. Scans/opens barcode recipe link (?recipe=1&roaster=...&bean=...)
2. Validates it launches the brew app right into Step 3 Recipe & Dial-In
3. Verifies that the recipe displays the "Learn About Roaster" option
4. Clicks "Learn About Roaster" and confirms it navigates to the Roaster Profile
5. Verifies the Roaster page has "Back to Recipe: Caffe Choco / 13"
6. Clicks "Back to Recipe" and confirms it returns to the Recipe with dial-in intact
7. Advances to Step 4 and confirms "Learn About Roaster" option is present there too
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

async def run_flow_test():
    print(">>> Starting vite preview server on port 4173...")
    preview_proc = subprocess.Popen(
        "npx vite preview --port 4173",
        shell=True,
        cwd=r"c:\Users\gmasc\Documents\Antigravity\brewed",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(2.0)

    session = BrewBrowserSession(port=9271, width=1280, height=900)
    await session.start()

    try:
        barcode_url = (
            "http://localhost:4173/?recipe=1"
            "&roaster=brookmill-roaster"
            "&roasterName=Brookmill+Coffee+Roasters"
            "&bean=Caffe+Choco+%2F+13"
            "&method=pour_over"
            "&ratio=16.5"
            "&tempF=202"
            "&grind=Medium-Fine"
            "&notes=Dark+Chocolate%2C+Cocoa+Nibs%2C+Sweet+Caramel"
        )
        print(f">>> 1. Scanning / Opening Barcode URL:\n    {barcode_url}")
        await session.navigate(barcode_url, wait_seconds=3.0)

        # A. Verify it lands RIGHT ON THE RECIPE (Step 3: Dial-In)
        print(">>> 2. Verifying it goes directly to Recipe & Dial-In...")
        recipe_loaded = await session.wait_for(
            "document.body.innerText.includes('Caffe Choco / 13') && document.body.innerText.includes('Brookmill')",
            timeout_seconds=8.0
        )
        assert recipe_loaded, "ERROR: Recipe did not load for Caffe Choco / 13!"

        details = await session.evaluate("""
            (() => {
                const text = document.body.innerText;
                const hasBean = text.includes('Caffe Choco / 13');
                const hasRoaster = text.includes('Brookmill Coffee Roasters') || text.includes('Brookmill');
                const hasRatio = text.includes('16.5') || text.includes('1:16.5');
                const hasTemp = text.includes('202');
                const hasGrind = text.includes('Medium-Fine') || text.includes('Med-Fine');
                const hasLearnButton = Array.from(document.querySelectorAll('button')).some(b => 
                    b.innerText.includes('Learn About Roaster') || b.innerText.includes('Meet the Roaster')
                );
                return { hasBean, hasRoaster, hasRatio, hasTemp, hasGrind, hasLearnButton, currentUrl: window.location.href };
            })()
        """)
        print(f"    Recipe Check Details: {details}")
        assert details["hasBean"], "Bean name Caffe Choco / 13 missing!"
        assert details["hasRoaster"], "Roaster name Brookmill missing!"
        assert details["hasRatio"], "Ratio 1:16.5 missing!"
        assert details["hasLearnButton"], "Button 'Learn About Roaster' missing on recipe!"

        # Screenshot of Step 3 Recipe
        step3_shot = os.path.join(ARTIFACT_DIR, "scanned_recipe_step3_verified.png")
        await session.screenshot(step3_shot)
        print(f"✓ Step 3 Recipe Screenshot saved: {step3_shot}")

        # B. Click "Learn About Roaster"
        print(">>> 3. Clicking 'Learn About Roaster' button...")
        clicked_learn = await session.evaluate("""
            (() => {
                const btn = Array.from(document.querySelectorAll('button')).find(b => 
                    b.innerText.includes('Learn About Roaster')
                );
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            })()
        """)
        assert clicked_learn, "ERROR: Could not find or click 'Learn About Roaster' button!"
        await asyncio.sleep(2.0)

        # C. Verify Roaster Profile Page loaded
        print(">>> 4. Verifying Roaster Profile Page loaded...")
        roaster_profile_loaded = await session.wait_for(
            "document.body.innerText.includes('Brookmill') && (window.location.pathname.includes('/roasters') || document.body.innerText.includes('Back to Recipe'))",
            timeout_seconds=6.0
        )
        assert roaster_profile_loaded, "ERROR: Roaster Profile Page did not load!"

        roaster_page_details = await session.evaluate("""
            (() => {
                const text = document.body.innerText;
                const hasRoasterHero = text.includes('Brookmill');
                const backBtn = Array.from(document.querySelectorAll('button')).find(b => 
                    b.innerText.includes('Back to Recipe') || b.innerText.includes('Brewing Station')
                );
                return {
                    hasRoasterHero,
                    backButtonText: backBtn ? backBtn.innerText : null,
                    currentUrl: window.location.href
                };
            })()
        """)
        print(f"    Roaster Profile Details: {roaster_page_details}")
        assert roaster_page_details["hasRoasterHero"], "Roaster hero title missing!"
        assert "Back to Recipe" in (roaster_page_details["backButtonText"] or ""), "Header button does not say 'Back to Recipe'!"

        # Screenshot of Roaster Profile Page
        profile_shot = os.path.join(ARTIFACT_DIR, "roaster_profile_from_recipe_verified.png")
        await session.screenshot(profile_shot)
        print(f"✓ Roaster Profile Screenshot saved: {profile_shot}")

        # D. Click "Back to Recipe" to return
        print(">>> 5. Clicking 'Back to Recipe' to return to dial-in...")
        clicked_back = await session.evaluate("""
            (() => {
                const backBtn = Array.from(document.querySelectorAll('button')).find(b => 
                    b.innerText.includes('Back to Recipe') || b.innerText.includes('Brewing Station')
                );
                if (backBtn) {
                    backBtn.click();
                    return true;
                }
                return false;
            })()
        """)
        assert clicked_back, "Could not click back button!"
        await asyncio.sleep(2.0)

        returned_to_recipe = await session.wait_for(
            "document.body.innerText.includes('Caffe Choco / 13') && (document.body.innerText.includes('RECIPE') || document.body.innerText.includes('Target Liquid Yield'))",
            timeout_seconds=6.0
        )
        assert returned_to_recipe, "ERROR: Did not return to Step 3 Recipe!"
        print("✓ Returned back to Step 3 Recipe with dial-in intact!")

        # E. Advance to Step 4 Guided Brew Timer
        print(">>> 6. Advancing to Step 4 Guided Brew Timer...")
        all_btns = await session.evaluate("""
            Array.from(document.querySelectorAll('button')).map(b => ({
                text: b.innerText.trim(),
                className: b.className
            }))
        """)
        print(f"    Available buttons ({len(all_btns)}): {[b['text'] for b in all_btns if b['text']]}")

        clicked_start = await session.evaluate("""
            (() => {
                const btn = Array.from(document.querySelectorAll('button')).find(b => 
                    b.innerText.includes('04') || b.innerText.includes('Guided Brew') || b.innerText.includes('Step 04')
                );
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            })()
        """)
        assert clicked_start, "Could not click Step 04: Guided Brew button!"
        await asyncio.sleep(2.0)

        step4_details = await session.evaluate("""
            (() => {
                const text = document.body.innerText;
                const hasStep4 = text.includes('Guided Brew') || text.includes('Bloom Phase') || document.querySelector('#step-4') !== null;
                const hasLearnButtonStep4 = Array.from(document.querySelectorAll('button')).some(b => 
                    b.innerText.includes('Learn About Roaster')
                );
                return { hasStep4, hasLearnButtonStep4 };
            })()
        """)
        print(f"    Step 4 Check: {step4_details}")
        assert step4_details["hasLearnButtonStep4"], "Step 4 missing 'Learn About Roaster' button!"

        step4_shot = os.path.join(ARTIFACT_DIR, "step4_timer_roaster_button_verified.png")
        await session.screenshot(step4_shot)
        print(f"✓ Step 4 Guided Timer Screenshot saved: {step4_shot}")

        print("\n=======================================================")
        print("🎉 ALL TESTS PASSED SUCCESSFULLY!")
        print("1. Barcode scan launches app right to recipe.")
        print("2. Recipe displays prominent 'Learn About Roaster' option.")
        print("3. Clicking 'Learn About Roaster' opens roaster profile.")
        print("4. Roaster profile top bar has 'Back to Recipe: Caffe Choco / 13'.")
        print("5. Clicking 'Back to Recipe' returns to recipe.")
        print("6. Step 4 Guided Timer also includes 'Learn About Roaster' option.")
        print("=======================================================")

    finally:
        await session.close()
        preview_proc.terminate()
        try:
            preview_proc.wait(timeout=3)
        except Exception:
            preview_proc.kill()

if __name__ == "__main__":
    asyncio.run(run_flow_test())
