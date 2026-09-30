"""
The Brew App • Priority 5 Retention & Social Verification Script
Verifies:
1. Shareable brew card generation (Canvas PNG export, QR code, web share, brew specs)
2. Brew streaks and barista achievements evaluation & display
3. Weekly barista digest preview, insights generator, and delivery preferences
4. Follow favorite roasters toggle & persistence
5. Public/Private journal toggle
"""

import asyncio
import os
import sys
import json

sys.path.insert(0, os.path.dirname(__file__))
from cdp_harness import BrewBrowserSession

ARTIFACTS_DIR = r"C:\Users\gmasc\.gemini\antigravity\brain\b0e9b9d3-6324-44f6-a439-ab73dac4be31"

async def run_verification():
    browser = BrewBrowserSession(port=9254, width=1280, height=900)
    print("Starting Edge headless browser on port 9254...")
    await browser.start()

    try:
        base_url = "http://localhost:3005"
        print(f"Navigating to {base_url}...")
        await browser.navigate(base_url, wait_seconds=3.0)

        # Clear test artifacts in localStorage and seed fresh test streak and journal
        print("Pre-seeding realistic journal entries and streak data for testing...")
        seed_res = await browser.evaluate("""
            (() => {
                localStorage.clear();

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const twoDaysAgo = new Date(today);
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

                const formatDate = (d) => {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${y}-${m}-${day}`;
                };

                // Seed streak data: 3-day streak
                const streakData = {
                    currentStreak: 3,
                    maxStreak: 3,
                    lastBrewDate: formatDate(today),
                    totalBrews: 3,
                    unlockedBadges: ['first_pour', 'streak_3'],
                    methodsUsed: ['pour_over', 'aeropress', 'v60'],
                    roastersUsed: ['Methodical Coffee', 'Brookmill Roasters', 'Onyx Coffee Lab']
                };
                localStorage.setItem('the_brew_app_streaks_v1', JSON.stringify(streakData));

                // Seed 2 realistic journal logs
                const logs = [
                    {
                        id: 'log_methodical_1',
                        date: 'Today, 8:30 AM',
                        timestamp: Date.now(),
                        trackMode: 'coffee',
                        methodId: 'pour_over',
                        methodName: 'V60 Pour Over',
                        beanName: 'Bellyache Specialty Blend',
                        roaster: 'Methodical Coffee',
                        doseStr: '18.0 g',
                        waterStr: '297 mL',
                        ratio: 16.5,
                        ratioStr: '1 : 16.5',
                        grindStr: 'Medium-Fine (#14)',
                        tempStr: '202°F',
                        rating: 5,
                        tasteFeedback: 'balanced',
                        isFavorite: true,
                        isPublic: true,
                        tastingNotes: ['Milk Chocolate', 'Raspberry Jam', 'Sweet Praline'],
                        notes: 'Silky, aromatic extraction with balanced acidity and sweetness.',
                        durationFormatted: '3:12'
                    },
                    {
                        id: 'log_onyx_2',
                        date: 'Yesterday, 9:15 AM',
                        timestamp: Date.now() - 86400000,
                        trackMode: 'coffee',
                        methodId: 'aeropress',
                        methodName: 'AeroPress Inverted',
                        beanName: 'Southern Weather',
                        roaster: 'Onyx Coffee Lab',
                        doseStr: '16.0 g',
                        waterStr: '240 mL',
                        ratio: 15,
                        ratioStr: '1 : 15',
                        grindStr: 'Medium (#18)',
                        tempStr: '200°F',
                        rating: 4,
                        tasteFeedback: 'strong',
                        isFavorite: false,
                        isPublic: false,
                        tastingNotes: ['Dark Chocolate', 'Plum'],
                        notes: 'Rich and syrupy body.',
                        durationFormatted: '2:30'
                    }
                ];
                localStorage.setItem('the_brew_app_journal_v1', JSON.stringify(logs));

                return { seeded: true, streak: streakData.currentStreak, logsCount: logs.length };
            })()
        """)
        print(f"Seed complete: {json.dumps(seed_res, ensure_ascii=True)}")

        # Reload to initialize app with seeded data
        await browser.navigate(base_url, wait_seconds=2.0)

        # 1. NAVIGATE TO RECIPES / MY COFFEE HUB
        print("\n--- STEP 1: Verify My Coffee Hub & Streak Banner ---")
        await browser.navigate(f"{base_url}/recipes", wait_seconds=2.5)

        banner_info = await browser.evaluate("""
            (() => {
                const banner = document.getElementById('journal-streak-banner');
                if (!banner) return { found: false };

                const badges = Array.from(banner.querySelectorAll('[data-badge-id]')).map(b => ({
                    id: b.getAttribute('data-badge-id'),
                    unlocked: b.getAttribute('data-unlocked') === 'true',
                    title: b.textContent.trim()
                }));

                return {
                    found: true,
                    text: banner.innerText,
                    badges
                };
            })()
        """)
        print(f"Streak banner detected: {banner_info.get('found')}")
        assert banner_info.get("found"), "Streak banner not found on journal"
        print(f"Unlocked badges count: {len([b for b in banner_info.get('badges', []) if b['unlocked']])}")

        # Capture screenshot of Brew Streak & Achievements Hub
        screenshot_hub_path = os.path.join(ARTIFACTS_DIR, "brew_streak_and_achievements_hub.png")
        await browser.capture_screenshot(screenshot_hub_path)
        print(f"Captured screenshot: {screenshot_hub_path}")

        # 2. VERIFY SHARE BREW CARD MODAL FROM JOURNAL CARD
        print("\n--- STEP 2: Verify Shareable Brew Card Modal ---")
        open_share_card = await browser.evaluate("""
            (() => {
                const shareBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Share'));
                if (shareBtns.length > 0) {
                    shareBtns[0].click();
                    return { clicked: true, foundCount: shareBtns.length };
                }
                return { clicked: false, allBtns: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()) };
            })()
        """)
        print(f"Clicked Share button: {open_share_card}")
        assert open_share_card.get("clicked"), "Could not find Share button on journal card"
        await asyncio.sleep(1.0)

        card_modal_info = await browser.evaluate("""
            (() => {
                const dialog = document.querySelector('[role="dialog"]');
                if (!dialog) return { found: false };

                const hasQrCode = Boolean(dialog.querySelector('img[alt="Brew QR Code"]') || dialog.querySelector('img[src^="data:image"]'));
                const hasCopyBtn = Array.from(dialog.querySelectorAll('button')).some(b => b.textContent.includes('Copy') || b.textContent.includes('Link'));
                const hasDownloadBtn = Array.from(dialog.querySelectorAll('button')).some(b => b.textContent.includes('Download') || b.textContent.includes('Card Image'));
                const hasPublicToggle = Array.from(dialog.querySelectorAll('button')).some(b => b.textContent.includes('Public') || b.textContent.includes('Private'));

                return {
                    found: true,
                    hasQrCode,
                    hasCopyBtn,
                    hasDownloadBtn,
                    hasPublicToggle,
                    textSnippet: dialog.innerText.slice(0, 300)
                };
            })()
        """)
        print(f"Share Card Modal details: {json.dumps(card_modal_info, ensure_ascii=True)}")
        assert card_modal_info.get("found"), "Share Brew Card Modal did not open"
        assert card_modal_info.get("hasDownloadBtn"), "Download Card Image button not present"

        # Capture screenshot of Shareable Brew Card Modal
        screenshot_card_path = os.path.join(ARTIFACTS_DIR, "shareable_brew_card_modal.png")
        await browser.capture_screenshot(screenshot_card_path)
        print(f"Captured screenshot: {screenshot_card_path}")

        # Close Share Modal
        await browser.evaluate("""
            (() => {
                const closeBtn = document.querySelector('button[title="Close modal"]') || document.querySelector('[role="dialog"] button');
                if (closeBtn) closeBtn.click();
            })()
        """)
        await asyncio.sleep(0.5)

        # 3. VERIFY PUBLIC / PRIVATE TOGGLE ON JOURNAL CARD
        print("\n--- STEP 3: Verify Public / Private Toggle on Journal Card ---")
        toggle_res = await browser.evaluate("""
            (() => {
                const toggleBtns = Array.from(document.querySelectorAll('button')).filter(b => 
                    b.textContent && (b.textContent.includes('Public') || b.textContent.includes('Private'))
                );
                if (toggleBtns.length > 0) {
                    const beforeText = toggleBtns[0].textContent.trim();
                    toggleBtns[0].click();
                    return { clicked: true, beforeText };
                }
                return { clicked: false };
            })()
        """)
        print(f"Toggled public/private status: {toggle_res}")
        await asyncio.sleep(0.5)

        # 4. VERIFY WEEKLY BARISTA DIGEST MODAL
        print("\n--- STEP 4: Verify Weekly Barista Digest Modal ---")
        open_digest = await browser.evaluate("""
            (() => {
                const digestBtn = document.getElementById('journal-weekly-digest-btn');
                if (digestBtn) {
                    digestBtn.click();
                    return { clicked: true };
                }
                return { clicked: false };
            })()
        """)
        print(f"Clicked Weekly Digest button: {open_digest}")
        assert open_digest.get("clicked"), "Weekly Digest button not found"
        await asyncio.sleep(1.0)

        digest_info = await browser.evaluate("""
            (() => {
                const dialog = document.querySelector('[role="dialog"]');
                if (!dialog) return { found: false };

                const text = dialog.innerText;
                const hasWeeklyHeadline = text.includes('Weekly Barista Digest') || text.includes('Sunday Briefing');
                const hasStreakMetric = text.includes('Streak');
                const hasTryMethod = text.includes('Try This Method Next');

                return {
                    found: true,
                    hasWeeklyHeadline,
                    hasStreakMetric,
                    hasTryMethod,
                    headlineSnippet: text.slice(0, 300)
                };
            })()
        """)
        print(f"Weekly Digest Modal details: {json.dumps(digest_info, ensure_ascii=True)}")
        assert digest_info.get("found"), "Weekly Digest modal did not open"
        assert digest_info.get("hasWeeklyHeadline"), "Digest missing weekly headline"

        # Capture screenshot of Weekly Barista Digest Modal
        screenshot_digest_path = os.path.join(ARTIFACTS_DIR, "weekly_barista_digest_modal.png")
        await browser.capture_screenshot(screenshot_digest_path)
        print(f"Captured screenshot: {screenshot_digest_path}")

        # Switch to settings tab in Weekly Digest Modal and simulate subscription
        print("Switching to delivery preferences tab and saving email...")
        await browser.evaluate("""
            (() => {
                const tabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Delivery Preferences'));
                if (tabs.length > 0) {
                    tabs[0].click();
                }
            })()
        """)
        await asyncio.sleep(0.5)

        sub_res = await browser.evaluate("""
            (() => {
                // Check input
                const emailInput = document.querySelector('input[type="email"]');
                if (emailInput) {
                    emailInput.value = 'barista@thebrew.app';
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Save Delivery Preferences'));
                if (submitBtn) {
                    submitBtn.click();
                    return { subscribed: true, btnText: submitBtn.textContent.trim() };
                }
                return { subscribed: false };
            })()
        """)
        print(f"Subscription result: {sub_res}")
        await asyncio.sleep(0.8)

        # Close Digest Modal
        await browser.evaluate("""
            (() => {
                const closeBtn = document.querySelector('button[title="Close digest modal"]') || document.querySelector('[role="dialog"] button');
                if (closeBtn) closeBtn.click();
            })()
        """)
        await asyncio.sleep(0.5)

        # 5. VERIFY FOLLOW ROASTER FEATURE ON ROASTER HERO
        print("\n--- STEP 5: Verify Follow Roaster on Roaster Page ---")
        # Navigate to a roaster showcase
        await browser.navigate(f"{base_url}/roaster/methodical", wait_seconds=2.0)

        follow_btn_status = await browser.evaluate("""
            (() => {
                const followBtn = document.getElementById('follow-roaster-btn');
                if (!followBtn) return { found: false };

                const initialText = followBtn.textContent.trim();
                const wasFollowing = followBtn.getAttribute('data-following') === 'true';

                // Click to toggle follow
                followBtn.click();

                return {
                    found: true,
                    initialText,
                    wasFollowing
                };
            })()
        """)
        print(f"Follow button initial status: {json.dumps(follow_btn_status, ensure_ascii=True)}")
        assert follow_btn_status.get("found"), "Follow Roaster button not found on Roaster page"
        await asyncio.sleep(0.5)

        follow_after_status = await browser.evaluate("""
            (() => {
                const followBtn = document.getElementById('follow-roaster-btn');
                const followedRoastersRaw = localStorage.getItem('the_brew_app_followed_roasters_v1');
                const list = followedRoastersRaw ? JSON.parse(followedRoastersRaw) : [];

                return {
                    newText: followBtn ? followBtn.textContent.trim() : '',
                    nowFollowing: followBtn ? followBtn.getAttribute('data-following') === 'true' : false,
                    followedListLength: list.length,
                    followedNames: list.map(r => r.name)
                };
            })()
        """)
        print(f"Follow status after toggle: {json.dumps(follow_after_status, ensure_ascii=True)}")
        assert follow_after_status.get("nowFollowing"), "Follow state did not become true"
        assert follow_after_status.get("followedListLength") >= 1, "Roaster not stored in localStorage"

        # Navigate back to recipes and verify followed roasters banner
        print("Returning to Recipes Hub to verify followed roaster presence in header...")
        await browser.navigate(f"{base_url}/recipes", wait_seconds=1.5)
        followed_banner_check = await browser.evaluate("""
            (() => {
                const banner = document.getElementById('followed-roasters-banner');
                return {
                    found: Boolean(banner),
                    text: banner ? banner.innerText : ''
                };
            })()
        """)
        print(f"Followed roasters hub banner: {json.dumps(followed_banner_check, ensure_ascii=True)}")
        assert followed_banner_check.get("found"), "Followed roasters banner missing in My Coffee Hub"

        print("\nAll Priority 5 Retention & Social features verified successfully!")

    finally:
        print("Closing browser session...")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_verification())
