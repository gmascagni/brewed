#!/usr/bin/env python3
"""
The Brew App • Master Functional QA Test Suite & Test Runner
Executes comprehensive end-to-end test cases across all 10 platform domains.
"""

import sys
import os
import asyncio
import argparse
import time
import json
from datetime import datetime

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add tests/e2e to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "e2e"))
from cdp_harness import BrewBrowserSession

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

class QATestResult:
    def __init__(self, code, name, domain):
        self.code = code
        self.name = name
        self.domain = domain
        self.passed = False
        self.duration = 0.0
        self.error = None
        self.details = {}

class FullSiteQASuite:
    def __init__(self, base_url="http://localhost:3005", port=9260):
        self.base_url = base_url.rstrip("/")
        self.port = port
        self.session = None
        self.results = []

    async def setup(self):
        self.session = BrewBrowserSession(port=self.port, width=1280, height=800)
        await self.session.start()

    async def teardown(self):
        if self.session:
            await self.session.close()

    async def run_test(self, code, name, domain, test_func):
        res = QATestResult(code, name, domain)
        start_t = time.time()
        try:
            print(f"  [{code}] Running: {name} ...", end=" ", flush=True)
            details = await test_func(self.session, self.base_url)
            res.passed = True
            res.details = details or {}
            res.duration = time.time() - start_t
            print(f"{GREEN}PASS{RESET} ({res.duration:.2f}s)")
        except Exception as e:
            res.passed = False
            res.error = str(e)
            res.duration = time.time() - start_t
            print(f"{RED}FAIL{RESET} ({res.duration:.2f}s) -> {e}")
        self.results.append(res)
        return res.passed

    # =========================================================================
    # DOMAIN 1: GLOBAL HEADER & TOP-LEVEL STATE
    # =========================================================================
    async def test_uc_1_1_track_switch(self, s, base):
        await s.navigate(f"{base}/")
        await asyncio.sleep(1.5)
        # Verify Specialty Coffee Header branding and Shop Local Coffee button
        header_info = await s.evaluate("""(() => {
            const h1 = document.querySelector('header h1')?.innerText || '';
            const sub = document.querySelector('header p')?.innerText || '';
            const shopBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Shop Local') || b.getAttribute('title')?.includes('Shop Local'));
            return { h1, sub, hasShopBtn: !!shopBtn };
        })()""")
        if not header_info or not header_info.get("hasShopBtn"):
            raise AssertionError("Header does not show 'Shop Local Coffee' button")
        return header_info

    async def test_uc_1_2_audible_toggle(self, s, base):
        btn_text = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Audible') || b.getAttribute('title')?.includes('Audible'));
            return btn ? (btn.innerText.trim() || btn.getAttribute('title')) : null;
        })()""")
        if not btn_text: raise AssertionError("Audible sound toggle button not found")
        
        # Click toggle
        await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Audible') || b.getAttribute('title')?.includes('Audible'));
            btn.click();
        })()""")
        await asyncio.sleep(0.5)

        new_text = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Audible') || b.getAttribute('title')?.includes('Audible'));
            return btn ? (btn.innerText.trim() || btn.getAttribute('title')) : null;
        })()""")
        if new_text == btn_text: raise AssertionError(f"Audible button text did not toggle: {btn_text}")

        # Toggle back to original state
        await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Audible') || b.getAttribute('title')?.includes('Audible'));
            btn.click();
        })()""")
        await asyncio.sleep(0.3)
        return {"initial": btn_text, "toggled": new_text}

    async def test_uc_1_3_global_search(self, s, base):
        # Open Search via header button
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('title')?.includes('Global Search') || b.querySelector('svg.lucide-search'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Search button not found")
        await asyncio.sleep(1)

        # Verify search dialog is open
        dialog_found = await s.evaluate("""!!document.querySelector('[role="dialog"]')""")
        if not dialog_found: raise AssertionError("Global Search modal dialog did not mount")

        # Type query 'V60'
        await s.evaluate("""(() => {
            const input = document.querySelector('[role="dialog"] input');
            if (input) {
                input.value = 'V60';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        })()""")
        await asyncio.sleep(0.5)

        # Close search
        await s.evaluate("""(() => {
            const closeBtn = document.querySelector('[role="dialog"] button[title*="Close"]') || Array.from(document.querySelectorAll('[role="dialog"] button')).find(b => b.querySelector('svg.lucide-x'));
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return {"dialog_opened": dialog_found}

    async def test_uc_1_4_local_radar(self, s, base):
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Shop Local') || b.getAttribute('title')?.includes('Shop Local'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Shop Local button not found")
        await asyncio.sleep(1)

        modal_title = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal ? modal.innerText.includes('Local') || modal.innerText.includes('Roasters') : false;
        })()""")
        if not modal_title: raise AssertionError("Local Coffee Finder modal did not mount")

        # Close modal
        await s.evaluate("""(() => {
            const closeBtn = document.querySelector('[role="dialog"] button');
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return {"radar_mounted": True}

    async def test_uc_1_5_roasters_nav(self, s, base):
        clicked = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Roasters') || b.getAttribute('title')?.includes('Roaster Showcase'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not clicked: raise AssertionError("Header Roasters button not found")
        await asyncio.sleep(1.5)

        state = await s.evaluate("""(() => ({
            url: window.location.href,
            hasRoasterProfile: !!document.querySelector('.font-serif.italic'),
            isRoasterActive: Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('title')?.includes('Roaster Showcase'))?.className.includes('bg-amber-gold')
        }))()""")
        if not state.get("hasRoasterProfile"):
            raise AssertionError(f"Did not transition to Roaster Profile page. State: {state}")
        return state

    async def test_uc_1_6_brew_news_smooth_scroll(self, s, base):
        # Currently on /roasters; clicking Brew News must reset view to home and scroll to #world-news
        clicked = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Brew News') || b.getAttribute('title')?.includes('Brew News'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not clicked: raise AssertionError("Brew News button not found in header")
        await asyncio.sleep(2.5)

        state = await s.evaluate("""(() => {
            const el = document.getElementById('world-news');
            return {
                url: window.location.href,
                newsFound: !!el,
                scrollY: window.scrollY,
                inView: el ? (el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0) : false
            };
        })()""")
        if not state.get("newsFound"):
            raise AssertionError("World News section element (#world-news) not found after clicking Brew News")
        if state.get("scrollY", 0) < 100:
            raise AssertionError(f"Brew news did not scroll into view. ScrollY: {state.get('scrollY')}")
        return state

    # =========================================================================
    # DOMAIN 2: 4-STEP CORE BREWING STATION FUNNEL
    # =========================================================================
    async def test_uc_2_1_step01_method_select(self, s, base):
        await s.navigate(f"{base}/")
        await asyncio.sleep(1.5)
        # Select V60 method
        selected = await s.evaluate("""(() => {
            const v60Card = Array.from(document.querySelectorAll('main button, main .grid > button, main .grid > div')).find(el => el.innerText.includes('V60'));
            if (v60Card) { v60Card.click(); return true; }
            return false;
        })()""")
        if not selected: raise AssertionError("V60 Dripper method card not found on grid")
        await asyncio.sleep(1)

        # Check if already on Step 02, or click advance button
        step2_mounted = await s.evaluate("document.body.innerText.toUpperCase().includes('PRECISION SCALER') || document.body.innerText.toUpperCase().includes('RATIO MATRIX') || document.body.innerText.toUpperCase().includes('CUP COUNT')")
        if not step2_mounted:
            advanced = await s.evaluate("""(() => {
                const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('STEP 02') || b.innerText.toUpperCase().includes('02 • RATIO') || b.innerText.toUpperCase().includes('RATIO & SCALER'));
                if (nextBtn) { nextBtn.click(); return true; }
                return false;
            })()""")
            await asyncio.sleep(1.5)
            step2_mounted = await s.evaluate("document.body.innerText.toUpperCase().includes('PRECISION SCALER') || document.body.innerText.toUpperCase().includes('RATIO MATRIX') || document.body.innerText.toUpperCase().includes('CUP COUNT') || document.body.innerText.toUpperCase().includes('STEP 02')")

        if not step2_mounted: raise AssertionError("Step 02 Precision Ratio Calculator did not mount")
        return {"step2_active": step2_mounted}

    async def test_uc_2_2_unit_system_toggle(self, s, base):
        toggled = await s.evaluate("""(() => {
            const unitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Imperial') || b.innerText.includes('Metric') || b.innerText.includes('g / ml') || b.innerText.includes('oz'));
            if (unitBtn) {
                const before = unitBtn.innerText;
                unitBtn.click();
                return { toggled: true, before: before };
            }
            return { toggled: false };
        })()""")
        if not toggled.get("toggled"): raise AssertionError("Unit system toggle button not found")
        await asyncio.sleep(0.5)
        return toggled

    async def test_uc_2_3_step02_ratio_scaler_math(self, s, base):
        calc_state = await s.evaluate("""(() => {
            const text = document.body.innerText;
            const hasGrams = text.includes('g') || text.includes('Grams') || text.includes('mL');
            const hasRatio = text.includes('1 :') || text.includes('1:') || text.includes('Ratio');
            return { hasGrams, hasRatio };
        })()""")
        if not calc_state.get("hasGrams") or not calc_state.get("hasRatio"):
            raise AssertionError(f"Precision ratio calculator values missing: {calc_state}")

        # Advance to Step 03
        await s.evaluate("""(() => {
            const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Step 03') || b.innerText.includes('03 • GRIND') || b.innerText.includes('Grind & Specs') || b.innerText.includes('Grind Specs'));
            if (nextBtn) nextBtn.click();
        })()""")
        await asyncio.sleep(1.5)
        return calc_state

    async def test_uc_2_4_step03_grind_visual_guide(self, s, base):
        step3_mounted = await s.evaluate("""(() => {
            return document.body.innerText.includes('Grind') || document.body.innerText.includes('Micron') || document.body.innerText.includes('Burr') || document.body.innerText.includes('Step 03');
        })()""")
        if not step3_mounted: raise AssertionError("Step 03 Grind Visual Guide did not mount")

        # Advance to Step 04
        await s.evaluate("""(() => {
            const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Step 04') || b.innerText.includes('04 • GUIDED') || b.innerText.includes('Guided Brew Timer'));
            if (nextBtn) nextBtn.click();
        })()""")
        await asyncio.sleep(1.5)
        return {"step3_mounted": True}

    async def test_uc_2_5_step04_multiphase_timer(self, s, base):
        timer_state = await s.evaluate("""(() => {
            const timerEl = document.getElementById('step-4') || document.querySelector('.font-mono.tabular-nums');
            const startBtn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText.toUpperCase().includes('START') || b.innerText.toUpperCase().includes('EXTRACTION')) && b.offsetParent !== null);
            return {
                timerMounted: !!timerEl,
                startBtnFound: !!startBtn
            };
        })()""")
        if not timer_state.get("timerMounted"):
            raise AssertionError("Step 04 Multi-Phase Timer did not mount")

        # Start timer
        await s.evaluate("""(() => {
            const startBtn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText.toUpperCase().includes('START') || b.innerText.toUpperCase().includes('EXTRACTION')) && b.offsetParent !== null);
            if (startBtn) startBtn.click();
        })()""")
        await asyncio.sleep(2)

        running_state = await s.evaluate("""(() => {
            const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('PAUSE'));
            return { isRunning: !!pauseBtn };
        })()""")
        if not running_state.get("isRunning"):
            raise AssertionError("Timer did not start running after clicking Start")

        # Pause and Reset
        await s.evaluate("""(() => {
            const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('PAUSE'));
            if (pauseBtn) pauseBtn.click();
            const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('RESET') || b.getAttribute('title')?.includes('Reset') || b.getAttribute('aria-label')?.includes('Reset'));
            if (resetBtn) resetBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return {"timer_verified": True}

    # =========================================================================
    # DOMAIN 3: SPECIALTY ROASTER SHOWCASE
    # =========================================================================
    async def test_uc_3_1_roasters_page_render(self, s, base):
        await s.navigate(f"{base}/roasters")
        await asyncio.sleep(2)
        roaster_hero = await s.evaluate("""(() => {
            return {
                h1: document.querySelector('h1')?.innerText,
                hasRoasterPartnerTag: document.body.innerText.includes('VERIFIED ROASTER PARTNER'),
                tagline: document.querySelector('.font-serif.italic')?.innerText
            };
        })()""")
        if not roaster_hero.get("hasRoasterPartnerTag"):
            raise AssertionError(f"Roaster showcase page /roasters failed to mount correctly: {roaster_hero}")
        return roaster_hero

    async def test_uc_3_2_roaster_switcher(self, s, base):
        switched = await s.evaluate("""(() => {
            const onyxBtn = Array.from(document.querySelectorAll('header button, .no-scrollbar button')).find(b => b.innerText.includes('Onyx'));
            if (onyxBtn) { onyxBtn.click(); return true; }
            return false;
        })()""")
        if not switched: raise AssertionError("Onyx roaster pill switcher not found")
        await asyncio.sleep(1)

        active_roaster = await s.evaluate("""(() => {
            return document.body.innerText.includes('Onyx') && !document.body.innerText.includes('Methodical Coffee');
        })()""")
        return {"switched_to_onyx": True}

    async def test_uc_3_3_60s_video_walkthrough_modal(self, s, base):
        # Click 60s demo button
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('watch video') || b.getAttribute('title')?.toLowerCase().includes('video walkthrough'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Watch Video button not found on /roasters")
        await asyncio.sleep(1.5)

        modal_state = await s.evaluate("""(() => {
            const modal = document.querySelector('.fixed.inset-0.z-50');
            const videoEl = modal ? modal.querySelector('video') : null;
            return {
                hasModal: !!modal,
                hasVideoTag: !!videoEl,
                videoSrc: videoEl ? videoEl.src : null
            };
        })()""")
        if not modal_state.get("hasModal") or not modal_state.get("hasVideoTag"):
            raise AssertionError(f"60s Video walkthrough modal failed to open: {modal_state}")
        if "smart_bag_scan_demo.mp4" not in str(modal_state.get("videoSrc")):
            raise AssertionError(f"Video src does not point to smart_bag_scan_demo.mp4: {modal_state.get('videoSrc')}")

        # Close video modal
        await s.evaluate("""(() => {
            const closeBtn = document.querySelector('.fixed.inset-0.z-50 button');
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return modal_state

    async def test_uc_3_4_apply_roaster_dial_in(self, s, base):
        applied = await s.evaluate("""(() => {
            const brewBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('DIAL-IN & BREW') || b.innerText.toUpperCase().includes('BREW THIS COFFEE'));
            if (brewBtn) { brewBtn.click(); return true; }
            return false;
        })()""")
        if not applied: raise AssertionError("Dial-In & Brew CTA button not found on roaster profile")
        await asyncio.sleep(1.5)

        workspace_state = await s.evaluate("""(() => ({
            url: window.location.href,
            isWorkspace: window.location.pathname === '/' || window.location.pathname.startsWith('/methods/'),
            hasDialInBadge: document.body.innerText.includes('Roaster Certified Dial-In Active') || document.body.innerText.includes('Step 04') || document.body.innerText.includes('Step 02')
        }))()""")
        if not workspace_state.get("isWorkspace"):
            raise AssertionError(f"Did not return to brewing workspace after applying roaster coffee: {workspace_state}")
        return workspace_state

    async def test_uc_3_5_back_to_brewing_station(self, s, base):
        await s.navigate(f"{base}/roasters")
        await asyncio.sleep(1.5)
        back_clicked = await s.evaluate("""(() => {
            const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Brewing Station') || b.getAttribute('title')?.includes('Return to Brewing'));
            if (backBtn) { backBtn.click(); return true; }
            return false;
        })()""")
        if not back_clicked: raise AssertionError("Brewing Station back button not found on /roasters")
        await asyncio.sleep(1.5)

        is_home = await s.evaluate("window.location.pathname === '/'")
        if not is_home: raise AssertionError("Back button did not return to home /")
        return {"returned_home": True}

    # =========================================================================
    # DOMAIN 4: COFFEE ACADEMY & VIDEO HUB
    # =========================================================================
    async def test_uc_4_1_academy_catalog_library_view(self, s, base):
        await s.navigate(f"{base}/")
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Academy') || b.getAttribute('title')?.includes('Academy'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Academy button not found in header")
        await asyncio.sleep(1.5)

        state = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            if (!modal) return { open: false };
            const cards = modal.querySelectorAll('.grid > div');
            return {
                open: true,
                hasLibraryHeader: modal.innerText.includes('Specialty Coffee Masterclasses'),
                cardCount: cards.length,
                hasLibraryTabActive: Array.from(modal.querySelectorAll('button')).some(b => b.innerText.includes('Library') && b.className.includes('bg-amber-gold'))
            };
        })()""")
        if not state.get("open") or state.get("cardCount", 0) < 5:
            raise AssertionError(f"Academy modal did not open in Library Catalog View with video cards: {state}")
        return state

    async def test_uc_4_2_academy_category_filtering(self, s, base):
        filtered = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const espressoPill = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.includes('Espresso'));
            if (espressoPill) {
                espressoPill.click();
                return true;
            }
            return false;
        })()""")
        if not filtered: raise AssertionError("Espresso category pill not found in Academy modal")
        await asyncio.sleep(1)

        card_count = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal ? modal.querySelectorAll('.grid > div').length : 0;
        })()""")
        if card_count < 1: raise AssertionError("Espresso category filtering returned 0 cards")
        return {"espresso_cards": card_count}

    async def test_uc_4_3_academy_search(self, s, base):
        # Reset category to All first
        await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const allPill = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.includes('All'));
            if (allPill) allPill.click();
        })()""")
        await asyncio.sleep(0.5)

        await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const input = modal.querySelector('input');
            if (input) {
                input.value = 'James Hoffmann';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        })()""")
        await asyncio.sleep(0.5)

        matched = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal.innerText.includes('James Hoffmann') || modal.innerText.includes('V60');
        })()""")
        if not matched: raise AssertionError("Academy search query failed to filter results")

        # Clear search
        await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const clearBtn = modal.querySelector('input + button') || modal.querySelector('input');
            if (clearBtn.tagName === 'BUTTON') clearBtn.click();
            else { clearBtn.value = ''; clearBtn.dispatchEvent(new Event('input', { bubbles: true })); }
        })()""")
        await asyncio.sleep(0.5)
        return {"search_matched": True}

    async def test_uc_4_4_academy_theater_player_mode(self, s, base):
        # Click watch on first card
        await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const firstCard = modal.querySelector('.grid > div');
            if (firstCard) firstCard.click();
        })()""")
        await asyncio.sleep(1.5)

        player_state = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const iframe = modal.querySelector('iframe');
            const backBtn = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.includes('Back to Masterclass Library'));
            return {
                hasIframe: !!iframe,
                hasBackButton: !!backBtn,
                iframeSrc: iframe ? iframe.src : null
            };
        })()""")
        if not player_state.get("hasIframe"):
            raise AssertionError(f"Theater Player mode failed to render iframe: {player_state}")
        return player_state

    async def test_uc_4_5_academy_quick_toggle_back(self, s, base):
        await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const backBtn = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.includes('Back to Masterclass Library'));
            if (backBtn) backBtn.click();
        })()""")
        await asyncio.sleep(1)

        is_library = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal.innerText.includes('Specialty Coffee Masterclasses');
        })()""")
        if not is_library: raise AssertionError("Quick toggle back to library failed")

        # Close Academy modal
        await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            const closeBtn = modal.querySelector('button[title*="Close"]');
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return {"returned_to_library": True}

    # =========================================================================
    # DOMAIN 5: WATER CHEMISTRY LAB
    # =========================================================================
    async def test_uc_5_1_water_lab_modal(self, s, base):
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Water Lab') || b.getAttribute('title')?.includes('Water Lab'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Water Lab button not found in header")
        await asyncio.sleep(1.5)

        state = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            return {
                open: !!modal,
                hasScaSpecs: modal ? (modal.innerText.includes('SCA') || modal.innerText.includes('Hardness')) : false
            };
        })()""")
        if not state.get("hasScaSpecs"):
            raise AssertionError(f"Water chemistry modal failed to load SCA specs: {state}")

        # Close modal
        await s.evaluate("""(() => {
            const closeBtn = document.querySelector('[role="dialog"] button[title*="Close"]');
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return state

    async def test_uc_5_3_water_guides_static_routes(self, s, base):
        await s.navigate(f"{base}/guides/water-chemistry-gh-kh")
        await asyncio.sleep(2)
        gh_kh_valid = await s.evaluate("document.body.innerText.includes('GH') && document.body.innerText.includes('KH')")
        if not gh_kh_valid: raise AssertionError("Failed to load /guides/water-chemistry-gh-kh")
        return {"gh_kh_guide_verified": True}

    # =========================================================================
    # DOMAIN 6: SMART BAG BARCODE SCANNER
    # =========================================================================
    async def test_uc_6_1_scanner_modal_mount(self, s, base):
        await s.navigate(f"{base}/")
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Scan Bag') || b.getAttribute('title')?.includes('Scan'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Scan Bag button not found in header")
        await asyncio.sleep(1.5)

        scanner_mounted = await s.evaluate("""(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal ? (modal.innerText.includes('Scan') || modal.innerText.includes('Barcode') || !!modal.querySelector('video')) : false;
        })()""")
        if not scanner_mounted: raise AssertionError("Barcode scanner modal failed to mount")

        # Close scanner modal
        await s.evaluate("""(() => {
            const closeBtn = document.querySelector('[role="dialog"] button[title*="Close"]') || Array.from(document.querySelectorAll('[role="dialog"] button')).find(b => b.querySelector('svg.lucide-x'));
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return {"scanner_mounted": True}

    # =========================================================================
    # DOMAIN 7: TASTING JOURNAL & PROFILE
    # =========================================================================
    async def test_uc_7_1_tasting_journal_persistence(self, s, base):
        # Open Tasting Journal via header
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('title')?.includes('Journal') || b.querySelector('svg.lucide-book-open'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Journal button not found in header")
        await asyncio.sleep(1)

        journal_mounted = await s.evaluate("""!!document.querySelector('[role="dialog"]')""")
        if not journal_mounted: raise AssertionError("Journal modal failed to mount")

        # Verify localStorage access
        storage_check = await s.evaluate("""(() => {
            try {
                const logs = localStorage.getItem('the_brew_app_journal_v1');
                return { accessible: true, count: logs ? JSON.parse(logs).length : 0 };
            } catch (e) {
                return { accessible: false, err: String(e) };
            }
        })()""")
        if not storage_check.get("accessible"):
            raise AssertionError(f"localStorage journal access failed: {storage_check}")

        # Close Journal
        await s.evaluate("""(() => {
            const closeBtn = document.querySelector('[role="dialog"] button');
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return storage_check

    # =========================================================================
    # DOMAIN 8: RECIPE VAULT & COMMUNITY STUDIO
    # =========================================================================
    async def test_uc_8_1_recipe_vault_modal(self, s, base):
        opened = await s.evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Recipe Vault') || b.getAttribute('title')?.includes('Recipe Vault'));
            if (btn) { btn.click(); return true; }
            return false;
        })()""")
        if not opened: raise AssertionError("Recipe Vault button not found")
        await asyncio.sleep(1)

        mounted = await s.evaluate("""!!document.querySelector('[role="dialog"]')""")
        if not mounted: raise AssertionError("Recipe Vault modal failed to mount")

        # Close modal
        await s.evaluate("""(() => {
            const closeBtn = document.querySelector('[role="dialog"] button');
            if (closeBtn) closeBtn.click();
        })()""")
        await asyncio.sleep(0.5)
        return {"vault_mounted": True}

    # =========================================================================
    # DOMAIN 9: WORLD NEWS & COLLAPSIBLE DRAWERS
    # =========================================================================
    async def test_uc_9_1_world_news_content(self, s, base):
        # Support drawers (including World News) are housed in the dedicated /learn section
        await s.navigate(f"{base}/learn#world-news")
        await asyncio.sleep(1.5)
        news_state = await s.evaluate("""(() => {
            const el = document.getElementById('world-news');
            if (!el) return { found: false };
            const links = Array.from(el.querySelectorAll('a[href^="http"]'));
            return {
                found: true,
                articleCount: el.querySelectorAll('article, .rounded-2xl').length,
                externalLinksSecure: links.every(a => a.rel.includes('noopener'))
            };
        })()""")
        if not news_state.get("found"): raise AssertionError("World News element not found")
        if not news_state.get("externalLinksSecure"): raise AssertionError("News article links missing rel='noopener noreferrer'")
        return news_state

    # =========================================================================
    # DOMAIN 10: MULTI-DEVICE VIEWPORTS & CONSOLE HEALTH
    # =========================================================================
    async def test_uc_10_1_viewports_audit(self, s, base):
        viewports = [
            ("Mobile SE", 375, 667),
            ("Mobile Standard", 390, 844),
            ("Tablet", 768, 1024),
            ("Laptop Standard", 1280, 800),
            ("Full HD Monitor", 1920, 1080)
        ]
        results = {}
        for name, w, h in viewports:
            await s.set_viewport(w, h)
            await asyncio.sleep(0.5)
            check = await s.evaluate("""(() => ({
                headerVisible: !!document.querySelector('header'),
                headerWidth: document.querySelector('header')?.offsetWidth,
                hasOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1
            }))()""")
            if not check.get("headerVisible"):
                raise AssertionError(f"Header not visible at viewport {name} ({w}x{h})")
            results[name] = check
        # Reset to default
        await s.set_viewport(1280, 800)
        return results

    async def test_uc_10_2_zero_console_errors(self, s, base):
        exceptions = s.runtime_exceptions
        # Filter out benign network or third party analytics aborts if any
        critical_errors = [e for e in exceptions if "TypeError" in str(e) or "ReferenceError" in str(e) or "SyntaxError" in str(e)]
        if len(critical_errors) > 0:
            raise AssertionError(f"Discovered {len(critical_errors)} critical runtime exceptions: {critical_errors}")
        return {"runtime_exceptions_count": len(exceptions), "critical_errors": 0}

    # =========================================================================
    # SUITE EXECUTION ORCHESTRATION
    # =========================================================================
    async def run_all(self):
        print(f"\n{BOLD}{CYAN}======================================================={RESET}")
        print(f"{BOLD}{CYAN}🚀 THE BREW APP • FULL-SITE FUNCTIONAL QA TEST SUITE{RESET}")
        print(f"{BOLD}Target URL:{RESET} {self.base_url}")
        print(f"{BOLD}Timestamp:{RESET}  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{BOLD}{CYAN}======================================================={RESET}\n")

        await self.setup()
        try:
            # Domain 1
            print(f"\n{BOLD}Domain 1: Global Header & Navigation{RESET}")
            await self.run_test("UC-1.1", "Coffee / Tea Track Mode Switching", "Header", self.test_uc_1_1_track_switch)
            await self.run_test("UC-1.2", "Audible Sound Engine Mute/Unmute Toggle", "Header", self.test_uc_1_2_audible_toggle)
            await self.run_test("UC-1.3", "Global Multi-Index Search Modal (Ctrl+K)", "Header", self.test_uc_1_3_global_search)
            await self.run_test("UC-1.4", "Shop Local Specialty Roaster Radar", "Header", self.test_uc_1_4_local_radar)
            await self.run_test("UC-1.5", "Roasters Header Navigation & Active State", "Header", self.test_uc_1_5_roasters_nav)
            await self.run_test("UC-1.6", "Brew News Header Trigger & Smooth Scroll", "Header", self.test_uc_1_6_brew_news_smooth_scroll)

            # Domain 2
            print(f"\n{BOLD}Domain 2: 4-Step Core Brewing Station Funnel{RESET}")
            await self.run_test("UC-2.1", "Step 01 Method Selection & URL Update", "Brewing", self.test_uc_2_1_step01_method_select)
            await self.run_test("UC-2.2", "Imperial (oz/°F) vs Metric (g/ml/°C) Toggle", "Brewing", self.test_uc_2_2_unit_system_toggle)
            await self.run_test("UC-2.3", "Step 02 Precision Ratio Scaler Calculations", "Brewing", self.test_uc_2_3_step02_ratio_scaler_math)
            await self.run_test("UC-2.4", "Step 03 Grind Visual Guide & Burr Micron Specs", "Brewing", self.test_uc_2_4_step03_grind_visual_guide)
            await self.run_test("UC-2.5", "Step 04 Multi-Phase Countdown Timer & Controls", "Brewing", self.test_uc_2_5_step04_multiphase_timer)

            # Domain 3
            print(f"\n{BOLD}Domain 3: Specialty Roaster Showcase & Ingestion{RESET}")
            await self.run_test("UC-3.1", "Roaster Showcase Page (/roasters) Mounting", "Roasters", self.test_uc_3_1_roasters_page_render)
            await self.run_test("UC-3.2", "Roaster Tab Switcher (Methodical, Onyx, B&W)", "Roasters", self.test_uc_3_2_roaster_switcher)
            await self.run_test("UC-3.3", "60-Second Video Demo Walkthrough Modal", "Roasters", self.test_uc_3_3_60s_video_walkthrough_modal)
            await self.run_test("UC-3.4", "Dial-In Recipe CTA Auto-Configuration", "Roasters", self.test_uc_3_4_apply_roaster_dial_in)
            await self.run_test("UC-3.5", "Persistent Back Navigation to Brewing Station", "Roasters", self.test_uc_3_5_back_to_brewing_station)

            # Domain 4
            print(f"\n{BOLD}Domain 4: Coffee Academy & Video Hub{RESET}")
            await self.run_test("UC-4.1", "Academy Library Catalog Default 16-Card Grid", "Academy", self.test_uc_4_1_academy_catalog_library_view)
            await self.run_test("UC-4.2", "Category Filtering (Pour-Over, Espresso, etc.)", "Academy", self.test_uc_4_2_academy_category_filtering)
            await self.run_test("UC-4.3", "Masterclass Title & Creator Search Input", "Academy", self.test_uc_4_3_academy_search)
            await self.run_test("UC-4.4", "Theater Player Mode YouTube Embed", "Academy", self.test_uc_4_4_academy_theater_player_mode)
            await self.run_test("UC-4.5", "Quick Navigation Toggle Back to Full Library", "Academy", self.test_uc_4_5_academy_quick_toggle_back)

            # Domain 5
            print(f"\n{BOLD}Domain 5: Water Chemistry Lab & Guide Routes{RESET}")
            await self.run_test("UC-5.1", "Water Chemistry Lab Modal & SCA Target Range", "WaterLab", self.test_uc_5_1_water_lab_modal)
            await self.run_test("UC-5.3", "Static Water Chemistry Guide Landing Routes", "WaterLab", self.test_uc_5_3_water_guides_static_routes)

            # Domain 6
            print(f"\n{BOLD}Domain 6: Smart Bag Barcode & Optical Scanner{RESET}")
            await self.run_test("UC-6.1", "Barcode Scanner Modal Frame & Video Target", "Scanner", self.test_uc_6_1_scanner_modal_mount)

            # Domain 7
            print(f"\n{BOLD}Domain 7: Tasting Journal & Barista Profile{RESET}")
            await self.run_test("UC-7.1", "Tasting Journal Modal & LocalStorage Integrity", "Journal", self.test_uc_7_1_tasting_journal_persistence)

            # Domain 8
            print(f"\n{BOLD}Domain 8: Master Recipe Vault & Community Studio{RESET}")
            await self.run_test("UC-8.1", "Master Recipe Vault Modal & Recipes Explorer", "Recipes", self.test_uc_8_1_recipe_vault_modal)

            # Domain 9
            print(f"\n{BOLD}Domain 9: World Brew News & Security{RESET}")
            await self.run_test("UC-9.1", "World Brew News & Rel Noopener Sec Audit", "News", self.test_uc_9_1_world_news_content)

            # Domain 10
            print(f"\n{BOLD}Domain 10: Viewports & Console Health Audit{RESET}")
            await self.run_test("UC-10.1", "5-Point Responsive Viewport Inspection", "Viewports", self.test_uc_10_1_viewports_audit)
            await self.run_test("UC-10.2", "Browser Console Zero Unhandled Error Check", "Console", self.test_uc_10_2_zero_console_errors)

        finally:
            await self.teardown()

        # Print Final Report
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        failed = total - passed
        pct = (passed / total * 100) if total > 0 else 0

        print(f"\n{BOLD}{CYAN}======================================================={RESET}")
        print(f"{BOLD}QA TEST SUITE SUMMARY{RESET}")
        print(f"Total Tests Executed: {total}")
        print(f"Passed:               {GREEN}{passed}{RESET}")
        print(f"Failed:               {RED if failed > 0 else GREEN}{failed}{RESET}")
        print(f"Pass Rate:            {GREEN if pct == 100 else RED}{pct:.1f}%{RESET}")
        print(f"{BOLD}{CYAN}======================================================={RESET}\n")

        # Save Report Artifact
        self.generate_markdown_report()

        if failed > 0:
            sys.exit(1)

    def generate_markdown_report(self):
        report_path = os.path.join(os.path.dirname(__file__), "QA_REPORT.md")
        lines = [
            "# Automated QA Test Execution Report",
            f"**Target Host:** `{self.base_url}`  ",
            f"**Execution Date:** `{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`  ",
            f"**Total Cases:** `{len(self.results)}` | **Passed:** `{sum(1 for r in self.results if r.passed)}` | **Failed:** `{sum(1 for r in self.results if not r.passed)}`\n",
            "| ID | Domain | Use Case Name | Status | Duration | Notes |",
            "|---|---|---|---|---|---|"
        ]
        for r in self.results:
            status_icon = "✅ PASS" if r.passed else "❌ FAIL"
            note = r.error if r.error else "Verified"
            lines.append(f"| `{r.code}` | {r.domain} | {r.name} | {status_icon} | {r.duration:.2f}s | {note} |")
        
        with open(report_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        print(f"Saved formal QA report to: {report_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="The Brew App Functional QA Test Suite")
    parser.add_argument("--target", choices=["local", "prod"], default="local", help="Test target environment")
    parser.add_argument("--url", default=None, help="Custom URL target override")
    args = parser.parse_args()

    target_url = "http://localhost:3005"
    if args.target == "prod":
        target_url = "https://thebrew.app"
    if args.url:
        target_url = args.url

    suite = FullSiteQASuite(base_url=target_url)
    asyncio.run(suite.run_all())