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
Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 4. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 5. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 6. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 7. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.