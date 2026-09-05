# Core Engineering Guidelines: Honesty, Transparency, and No Fake Data

## 1. Absolute Honesty & Zero "Theater" Implementations
- **No Mock or Theater Scripts**: Never write scripts or functions that only print console messages pretending to perform work (e.g., crawlers that do not make HTTP requests, or background jobs that do not execute real logic). If a task requires external data or a backend service, write the real implementation or state plainly what is missing.
- **Real Execution**: All tools, crawlers, and APIs must execute genuine operations, parse real data, handle errors honestly, and write authentic results.

## 2. No Fabricated or Placeholder Data
- **No Fake Personas or Invented Stats**: Never invent fake user profiles, fake social handles (@barista_clara), fake engagement metrics (reviews, saves, follower counts), or fake streak counters.
- **Genuine User State**: When there is no active user account, present a clean, transparent guest state. Compute all statistics, streaks, and achievements dynamically from actual user activity.
- **Real Asset Links**: Never use broken placeholder paths (`'/'`, dummy image URLs, or generic homepage links when direct article or product links are expected). Use real direct URLs (e.g., direct Amazon ASIN product detail URLs `https://www.amazon.com/dp/${asin}/?tag=...` instead of search query URLs).

## 3. Truthful & Transparent UI Labeling
- **No Overpromising**: Never label UI features with terms like "Daily Auto-Scan Active", "Live Sync", or fake countdown timers unless an actual, verified automated process is in place.
- **Honest Disclosures**: Clearly state how features work (e.g., "Curated via RSS", "Stored on-device in your browser's local storage", "Updated periodically").
- **Authentic Sourcing**: Always link directly to original articles, cite real publications, and display authentic publication dates.
