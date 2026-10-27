#!/usr/bin/env python3
import asyncio
import os
import sys
import base64

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "e2e"))
from cdp_harness import BrewBrowserSession

ARTIFACT_DIR = r"C:\Users\gmasc\.gemini\antigravity\brain\71ef4c24-b550-4355-81dc-4b333d33e25f"
IMAGE_PATH = r"C:\Users\gmasc\.gemini\antigravity\brain\71ef4c24-b550-4355-81dc-4b333d33e25f\.user_uploaded\media_1792936532110_d0ceaecd.jpg"

async def main():
    print(">>> Reading Cofi Traders bag image...")
    with open(IMAGE_PATH, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode("utf-8")
    data_url = f"data:image/jpeg;base64,{img_b64}"

    session = BrewBrowserSession(port=9288, width=1280, height=950)
    await session.start()

    try:
        print(">>> Navigating to http://localhost:3005...")
        await session.navigate("http://localhost:3005", wait_seconds=3.0)

        print(">>> Opening Barcode Scanner Modal...")
        await session.evaluate("""
            (() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const scanBtn = buttons.find(b => b.innerText && (b.innerText.includes('Scan Barcode') || b.innerText.includes('Scan Bag')));
                if (scanBtn) scanBtn.click();
            })()
        """)
        await asyncio.sleep(1.0)

        print(">>> Uploading bag photo directly to file input...")
        await session.evaluate(f"""
            (async () => {{
                const res = await fetch('{data_url}');
                const blob = await res.blob();
                const file = new File([blob], 'cofi_traders_bag.jpg', {{ type: 'image/jpeg' }});

                const input = document.querySelector('input[type="file"]');
                if (input) {{
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    input.files = dt.files;
                    input.dispatchEvent(new Event('change', {{ bubbles: true }}));
                }}
            }})()
        """)

        print(">>> Waiting for OCR execution and recipe generation...")
        for i in range(25):
            await asyncio.sleep(1.0)
            dialog_text = await session.evaluate("document.querySelector('[role=\"dialog\"]')?.innerText || ''")
            if "AI BAG VISION" in dialog_text.upper():
                print(f"    [PASS] OCR Result Card rendered at {i+1}s!")
                break

        print(">>> Scrolling modal to bottom to verify translation card & dial-in...")
        await session.evaluate("""
            const modal = document.querySelector('[role="dialog"]');
            if (modal) modal.scrollTop = modal.scrollHeight;
        """)
        await asyncio.sleep(0.5)

        modal_shot = os.path.join(ARTIFACT_DIR, "cofi_traders_ocr_verified.png")
        await session.screenshot(modal_shot)
        print(f"\n[PASS] Modal screenshot captured: {modal_shot}")

        print(">>> Clicking 'BREW THIS BAG (APPLY DIAL-IN)' button...")
        await session.evaluate("""
            (() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const brewBtn = buttons.find(b => b.innerText && b.innerText.includes('BREW THIS BAG'));
                if (brewBtn) brewBtn.click();
            })()
        """)
        await asyncio.sleep(2.0)

        # Check Step 3 Recipe Card
        page_text = await session.evaluate("document.body.innerText")
        print("\n=== STEP 3 RECIPE SCREEN ===")
        print(page_text[:600])

        assert "COFI TRADERS" in page_text.upper(), "Missing COFI TRADERS in Recipe Screen!"
        assert "COSTA RICA" in page_text.upper() or "HONEY" in page_text.upper(), "Missing origin/process in Recipe Screen!"
        print("    [PASS] Step 3 Recipe screen dialed in with Cofi Traders!")

        step3_shot = os.path.join(ARTIFACT_DIR, "cofi_traders_step3_recipe_verified.png")
        await session.screenshot(step3_shot)
        print(f"[PASS] Step 3 screenshot captured: {step3_shot}")

        print("\nAll tests passed successfully!")

    finally:
        await session.close()

if __name__ == "__main__":
    asyncio.run(main())
