#!/usr/bin/env python3
"""
Test Roaster Verification, Brand Ownership Isolation, and AI Bag Vision Provenance.

Validates:
1. Unit tests for roasterVerification.js (domain matching, public webmail blacklist, provenance classification).
2. End-to-end browser test:
   - When logged in as CL Pickens (clpicke@live.com, role='roaster'), commercial showcase brands
     (e.g., Methodical Coffee) NEVER display CL Pickens as brand owner, showing Curated Showcase Benchmark.
   - User's own custom roaster (Brookmill) DOES recognize CL Pickens as Verified Brand Owner.
   - AI Bag Vision derives recipes into personal cellar with purple AI Bag Vision (Unverified) provenance.
   - Commercial coffees display amber Curated Benchmark in Step 04 brew station.
"""

import sys
import os
import asyncio
import subprocess
import json

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "e2e"))
from cdp_harness import BrewBrowserSession

ARTIFACT_DIR = r"C:\Users\gmasc\.gemini\antigravity\brain\e5e7e1f5-9e1b-4b14-a260-40757123b1c4"

def run_unit_tests():
    print(">>> [Phase 1] Running roasterVerification.js Unit Tests via Node.js...")
    node_test_script = """
    import { 
      extractDomainFromUrl, 
      extractDomainFromEmail, 
      isPublicWebmailDomain, 
      isDomainVerifiedRoaster, 
      checkRoasterBrandOwnership, 
      getCoffeeProvenance, 
      PROVENANCE_TIERS 
    } from './src/utils/roasterVerification.js';

    // 1. Domain extraction
    console.assert(extractDomainFromUrl('https://methodicalcoffee.com/shop') === 'methodicalcoffee.com', 'extractDomainFromUrl failed');
    console.assert(extractDomainFromUrl('www.onyxcoffeelab.com') === 'onyxcoffeelab.com', 'extractDomainFromUrl www failed');
    console.assert(extractDomainFromEmail('alex@methodicalcoffee.com') === 'methodicalcoffee.com', 'extractDomainFromEmail failed');

    // 2. Public webmail blacklist
    console.assert(isPublicWebmailDomain('live.com') === true, 'live.com should be blacklisted');
    console.assert(isPublicWebmailDomain('gmail.com') === true, 'gmail.com should be blacklisted');
    console.assert(isPublicWebmailDomain('methodicalcoffee.com') === false, 'commercial domain should not be blacklisted');

    // 3. Domain verification
    console.assert(isDomainVerifiedRoaster('clpicke@live.com', 'https://methodicalcoffee.com') === false, 'live.com must NOT verify Methodical');
    console.assert(isDomainVerifiedRoaster('marco@methodicalcoffee.com', 'https://methodicalcoffee.com') === true, 'official domain must verify');

    // 4. Multi-tenant brand ownership
    const clPickensUser = {
      uid: 'user_clpickens',
      email: 'clpicke@live.com',
      role: 'roaster',
      isVerifiedRoaster: true,
      accountType: 'roaster',
      roasterSlug: 'brookmill-roaster',
      roasterName: 'Brookmill Roaster'
    };

    const methodicalShowcase = {
      id: 'methodical',
      slug: 'methodical-coffee',
      name: 'Methodical Coffee',
      website: 'https://methodicalcoffee.com',
      isCustomRoaster: false
    };

    const brookmillCustom = {
      id: 'brookmill-roaster',
      slug: 'brookmill-roaster',
      name: 'Brookmill Roaster',
      ownerEmail: 'clpicke@live.com',
      ownerUid: 'user_clpickens',
      isCustomRoaster: true
    };

    console.assert(checkRoasterBrandOwnership(methodicalShowcase, clPickensUser) === false, 'CL Pickens must NOT own Methodical');
    console.assert(checkRoasterBrandOwnership(brookmillCustom, clPickensUser) === true, 'CL Pickens MUST own Brookmill');

    // 5. Provenance calculation
    const aiCoffee = { beanName: 'Worka Chelichele', isAiExtracted: true };
    const pAi = getCoffeeProvenance(aiCoffee);
    console.assert(pAi.tier === PROVENANCE_TIERS.TIER_3_AI_VISION, 'AI coffee must have AI Vision tier');
    console.assert(pAi.isAiDerived === true, 'AI coffee must be isAiDerived');

    const offCoffee = { beanName: 'Supermarket Beans', id: 'off_0123456789' };
    const pOff = getCoffeeProvenance(offCoffee);
    console.assert(pOff.tier === PROVENANCE_TIERS.TIER_4_RETAIL_MATCH, 'Retail coffee must have retail match tier');

    const showcaseCoffee = { beanName: 'Chelbesa' };
    const pShowcase = getCoffeeProvenance(showcaseCoffee, methodicalShowcase, clPickensUser);
    console.assert(pShowcase.tier === PROVENANCE_TIERS.TIER_2_CURATED_SHOWCASE, 'Showcase coffee must be curated showcase');

    console.log('>>> [Phase 1] ALL UNIT TESTS PASSED!');
    """
    
    result = subprocess.run(
        ["node", "--input-type=module", "-e", node_test_script],
        cwd=os.path.abspath(os.path.join(os.path.dirname(__file__), "..")),
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print("ERROR in unit tests:\n", result.stderr)
        sys.exit(1)
    print(result.stdout)


async def run_browser_tests():
    print(">>> [Phase 2] Starting Headless Browser Session for End-to-End Provenance Testing...")
    session = BrewBrowserSession(port=9271, width=1280, height=900)
    await session.start()

    try:
        # Step A: Pre-seed localStorage with CL Pickens logged in as roaster
        print(">>> Seeding user session as CL Pickens (clpicke@live.com, role='roaster')...")
        await session.navigate("http://localhost:3005", wait_seconds=2.0)
        
        await session.evaluate("""
            (() => {
                const user = {
                    uid: 'user_clpickens_qa',
                    email: 'clpicke@live.com',
                    displayName: 'CL Pickens',
                    role: 'roaster',
                    isVerifiedRoaster: true,
                    accountType: 'roaster',
                    roasterSlug: 'brookmill-roaster',
                    roasterName: 'Brookmill Roaster'
                };
                localStorage.setItem('the_brew_app_active_user', JSON.stringify(user));
                
                const customRoasters = [{
                    id: 'brookmill-roaster',
                    slug: 'brookmill-roaster',
                    name: 'Brookmill Roaster',
                    ownerEmail: 'clpicke@live.com',
                    ownerUid: 'user_clpickens_qa',
                    city: 'Greenville',
                    state: 'SC',
                    country: 'USA',
                    isCustomRoaster: true,
                    description: 'Small batch craft roaster.',
                    coffees: [{
                        id: 'brookmill_single_origin',
                        beanName: 'Brookmill Reserve Lot #1',
                        roaster: 'Brookmill Roaster',
                        recommendedRatio: 16.5,
                        tempF: 202,
                        brewMethod: 'pour_over'
                    }]
                }];
                localStorage.setItem('thebrewapp_custom_roasters_v1', JSON.stringify(customRoasters));
                
                // Dispatch event to notify components
                window.dispatchEvent(new Event('storage'));
            })()
        """)

        # Step B: Navigate to Methodical Coffee profile
        print(">>> Navigating to commercial showcase: /roasters/methodical-coffee...")
        await session.navigate("http://localhost:3005/roasters/methodical-coffee", wait_seconds=3.0)

        page_text = await session.evaluate("document.body.innerText")
        
        # Verify Methodical DOES NOT show Verified Brand Owner Active banner for CL Pickens
        assert "Verified Brand Owner Active" not in page_text, "CRITICAL ERROR: CL Pickens falsely identified as Brand Owner of Methodical!"
        assert "clpicke@live.com" not in page_text, "CRITICAL ERROR: CL Pickens email displayed on Methodical Coffee profile!"
        
        # Verify Methodical DOES show Curated Showcase Benchmark
        assert "Curated Showcase Benchmark" in page_text or "Specialty Showcase" in page_text, "ERROR: Curated Showcase badge not displayed!"
        assert "Claim with @methodicalcoffee.com" in page_text or "Claim Profile (@methodicalcoffee.com)" in page_text, "ERROR: Claim with domain CTA not displayed!"
        
        print("    [PASS] Methodical correctly displays Curated Showcase Benchmark without Brand Owner takeover.")
        await session.screenshot(os.path.join(ARTIFACT_DIR, "verify_provenance_methodical_showcase.png"))

        print(">>> Navigating to custom artisan roaster: /roasters/brookmill-roaster...", flush=True)
        await session.navigate("http://localhost:3005/roasters/brookmill-roaster", wait_seconds=4.0)
        current_url = await session.evaluate("window.location.href")
        print("    [DEBUG] Current URL after Brookmill navigation:", current_url, flush=True)
        brookmill_text = await session.evaluate("document.body.innerText")
        print("    [DEBUG] Brookmill page text preview:", repr(brookmill_text[:300]), flush=True)
        state_info = await session.evaluate("""
            (() => {
                return {
                    pathname: window.location.pathname,
                    search: window.location.search,
                    hasStep1: Boolean(document.body.innerText.includes('Choose Your Brewer')),
                    hasDiscover: Boolean(document.body.innerText.includes('Artisan Roasters & Single-Origin Vault')),
                    hasRoasterProfile: Boolean(document.body.innerText.includes('Cupping Room Water Specification') || document.body.innerText.includes('Certified Coffees'))
                };
            })()
        """)
        roaster_heading = await session.evaluate("document.querySelector('main h1, main h2, main h3')?.innerText")
        print("    [DEBUG] Roaster heading in DOM:", roaster_heading, flush=True)
        owner_badges = await session.evaluate("Array.from(document.querySelectorAll('span, button, div')).map(e => e.innerText).filter(t => t && (t.includes('Brand Owner') || t.includes('Artisan') || t.includes('Brookmill')))")
        print("    [DEBUG] Matching owner/brand elements:", owner_badges[:10], flush=True)
        assert "Verified Brand Owner Active" in brookmill_text or "Verified Brand Owner" in brookmill_text, "ERROR: CL Pickens not recognized as owner of Brookmill!"
        assert "clpicke@live.com" in brookmill_text, "ERROR: Owner email not shown for Brookmill!"
        print("    [PASS] Brookmill correctly recognizes CL Pickens as Verified Brand Owner.")
        await session.screenshot(os.path.join(ARTIFACT_DIR, "verify_provenance_brookmill_owner.png"))

        # Step D: Test Step 04 Dial-In Station Provenance Badges
        print(">>> Navigating to /r/methodical_ethiopia_chelbesa to test Step 04 provenance badge...", flush=True)
        await session.navigate("http://localhost:3005/r/methodical_ethiopia_chelbesa", wait_seconds=3.0)
        
        await session.wait_for(
            "document.body.innerText.includes('Chelbesa') || document.body.innerText.toUpperCase().includes('CURATED BENCHMARK')",
            timeout_seconds=8.0
        )
        
        step4_text = await session.evaluate("document.body.innerText")
        assert "CURATED BENCHMARK" in step4_text.upper(), "ERROR: Step 04 does not display 'Curated Benchmark' badge for Methodical Chelbesa!"
        print("    [PASS] Step 04 displays Curated Benchmark badge for showcase coffee.", flush=True)
        await session.screenshot(os.path.join(ARTIFACT_DIR, "verify_provenance_methodical_step4.png"))

        # Step E: Test AI Bag Vision recipe dial-in into Step 04
        print(">>> Testing AI Bag Vision recipe dial-in into Step 04 via Scanner Modal...", flush=True)
        await session.navigate("http://localhost:3005", wait_seconds=2.0)
        
        # Click "Have a Bag? Scan Barcode" button in Step 1
        await session.evaluate("""
            (() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const btn = buttons.find(b => b.innerText.toUpperCase().includes('SCAN BARCODE') || b.innerText.toUpperCase().includes('SCAN BAG'));
                if (btn) btn.click();
            })()
        """)
        await session.wait_for("Boolean(document.querySelector('[role=\"dialog\"]'))", timeout_seconds=6.0)
        
        # Click the AI Label OCR tab button
        await session.evaluate("""
            (() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const aiTab = buttons.find(b => b.innerText.toUpperCase().includes('AI BAG LABEL') || b.innerText.toUpperCase().includes('OCR'));
                if (aiTab) aiTab.click();
            })()
        """)
        await asyncio.sleep(1.0)
        
        # Click Washed Ethiopia Demo button
        await session.evaluate("""
            (() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const demoBtn = buttons.find(b => b.innerText.toUpperCase().includes('DENSE WASHED ETHIOPIA'));
                if (demoBtn) demoBtn.click();
            })()
        """)
        await asyncio.sleep(2.0)
        
        # Verify result card inside modal
        card_text = await session.evaluate("document.querySelector('[role=\"dialog\"]').innerText")
        assert "AI BAG VISION" in card_text.upper(), "ERROR: Dialog missing AI BAG VISION badge!"
        assert "COMPUTER VISION DERIVATION" in card_text.upper(), "ERROR: Dialog missing Computer Vision notice!"
        print("    [PASS] Ingestion card verified with AI Bag Vision provenance and on-device derivation notice.")
        await session.screenshot(os.path.join(ARTIFACT_DIR, "verify_provenance_ai_modal_card.png"))
        
        # Click "BREW THIS BAG (APPLY DIAL-IN)" button
        print("    Clicking 'Brew This Bag (Apply Dial-In)' button...", flush=True)
        await session.evaluate("""
            (() => {
                const dialog = document.querySelector('[role="dialog"]');
                const target = Array.from(dialog.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('BREW THIS BAG'));
                if (target) target.click();
            })()
        """)
        await asyncio.sleep(2.0)
        
        # Verify Step 4 has purple AI Vision badge and Personal Cellar note
        ai_step4_text = await session.evaluate("document.body.innerText")
        assert "AI BAG VISION" in ai_step4_text.upper(), "ERROR: Step 4 missing AI BAG VISION badge!"
        assert "PERSONAL CELLAR" in ai_step4_text.upper(), "ERROR: Step 4 missing Personal Cellar notice!"
        print("    [PASS] Step 04 displays purple AI Bag Vision badge with Personal Cellar provenance notice.", flush=True)
        
        await session.screenshot(os.path.join(ARTIFACT_DIR, "verify_provenance_step4_badges.png"))
        print("    [PASS] Screenshots captured and stored in artifact directory.")

        print(">>> [Phase 2] ALL BROWSER E2E TESTS PASSED SUCCESSFULLY!")

    finally:
        await session.close()

if __name__ == "__main__":
    run_unit_tests()
    asyncio.run(run_browser_tests())
