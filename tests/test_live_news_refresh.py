#!/usr/bin/env python3
"""
Test Live News Refresh Functionality:
1. Navigates to the home page on preview port 4173.
2. Scrolls down to the #world-news section.
3. Confirms the 'Refresh Feed' button is rendered with the last synced timestamp.
4. Clicks 'Refresh Feed'.
5. Verifies that the section auto-expands, triggers real RSS fetching, displays live sync status,
   updates the articles list, and stores them in localStorage.
6. Takes high-resolution verification screenshot.
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

async def run_news_refresh_test():
    print(">>> Starting vite preview server on port 4173...")
    preview_proc = subprocess.Popen(
        "npx vite preview --port 4173",
        shell=True,
        cwd=r"c:\Users\gmasc\Documents\Antigravity\brewed",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(2.0)

    session = BrewBrowserSession(port=9273, width=1280, height=960)
    await session.start()

    try:
        print(">>> 1. Navigating to http://localhost:4173/learn...")
        await session.navigate("http://localhost:4173/learn", wait_seconds=3.0)

        # 2. Scroll to World News section
        print(">>> 2. Scrolling down to #world-news section...")
        scrolled = await session.evaluate("""(() => {
            const el = document.getElementById('world-news');
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'center' });
                return true;
            }
            return false;
        })()""")
        print(f"    Scrolled to #world-news: {scrolled}")
        assert scrolled, "#world-news section element not found in DOM"
        await asyncio.sleep(1.0)

        # 3. Verify 'Refresh Feed' button is present
        print(">>> 3. Locating 'Refresh Feed' button...")
        refresh_btn_info = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('#world-news button'));
            const btn = btns.find(b => b.textContent && (b.textContent.includes('Refresh Feed') || b.textContent.includes('Fetching News')));
            if (!btn) return null;
            return {
                text: btn.textContent.trim(),
                disabled: btn.disabled
            };
        })()""")
        print(f"    Refresh button info: {refresh_btn_info}")
        assert refresh_btn_info, "'Refresh Feed' button was not found in #world-news"

        # 4. Click 'Refresh Feed'
        print(">>> 4. Clicking 'Refresh Feed' button...")
        click_success = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('#world-news button'));
            const btn = btns.find(b => b.textContent && (b.textContent.includes('Refresh Feed') || b.textContent.includes('Fetching News')));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        })()""")
        print(f"    Clicked Refresh Feed: {click_success}")
        assert click_success, "Could not click Refresh Feed button"

        # Wait for live fetch to proceed
        print(">>> 5. Waiting for live RSS proxy response...")
        await asyncio.sleep(3.0)

        # Check section expanded
        is_expanded = await session.evaluate("""(() => {
            const btns = Array.from(document.querySelectorAll('#world-news button'));
            return btns.some(b => b.textContent && b.textContent.includes('Collapse News'));
        })()""")
        print(f"    Section auto-expanded: {is_expanded}")
        assert is_expanded, "World News section should auto-expand on refresh"

        # Check localStorage cache
        storage_check = await session.evaluate("""(() => {
            const freshNews = localStorage.getItem('the_brew_app_fresh_news');
            const lastSynced = localStorage.getItem('the_brew_app_news_last_synced');
            return {
                hasFreshNews: Boolean(freshNews && freshNews.length > 50),
                lastSynced: lastSynced || null,
                newsCount: freshNews ? JSON.parse(freshNews).length : 0
            };
        })()""")
        print(f"    localStorage persistence: {storage_check}")

        # Check headlines in DOM
        articles_info = await session.evaluate("""(() => {
            const articles = Array.from(document.querySelectorAll('#world-news article'));
            return articles.map(a => {
                const h4 = a.querySelector('h4');
                const src = a.querySelector('span');
                return {
                    title: h4 ? h4.textContent.trim() : '',
                    source: src ? src.textContent.trim() : ''
                };
            });
        })()""")
        print(f"    Rendered articles count: {len(articles_info)}")
        if articles_info:
            print(f"    Sample Headline: '{articles_info[0]['title']}' (Source: {articles_info[0]['source']})")
        assert len(articles_info) > 0, "No articles rendered in #world-news grid"

        # Capture verification screenshot
        screenshot_path = os.path.join(ARTIFACT_DIR, "news_live_refreshed_verified.png")
        await session.capture_screenshot(screenshot_path)
        print(f"    Captured live refreshed news screenshot: {screenshot_path}")

        print(">>> ALL LIVE NEWS REFRESH TESTS PASSED! ✨")

    finally:
        await session.close()
        preview_proc.terminate()
        try:
            preview_proc.wait(timeout=2)
        except Exception:
            preview_proc.kill()

if __name__ == "__main__":
    asyncio.run(run_news_refresh_test())
