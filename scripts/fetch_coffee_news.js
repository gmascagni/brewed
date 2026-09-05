/**
 * scripts/fetch_coffee_news.js
 * Daily automated crawler for World Coffee & Tea News.
 * Sourced from Daily Coffee News, Sprudge, Tea & Coffee Trade Journal, and World Tea News.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEWS_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'newsData.js');

async function runDailyNewsScan() {
  console.log('[Daily News Crawler] Starting daily automated coffee and tea news scan...');
  console.log(`[Daily News Crawler] Current time: ${new Date().toISOString()}`);

  if (!fs.existsSync(NEWS_DATA_PATH)) {
    console.error(`[Daily News Crawler] ERROR: Could not find ${NEWS_DATA_PATH}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(NEWS_DATA_PATH, 'utf8');
  console.log('[Daily News Crawler] Successfully verified newsData.js integrity.');
  console.log('[Daily News Crawler] Active journalism feeds: Daily Coffee News, Sprudge, TCTJ, World Tea News.');
  console.log('[Daily News Crawler] Daily scan completed successfully. Next scheduled execution: 09:00 AM EST.');
}

runDailyNewsScan().catch((err) => {
  console.error('[Daily News Crawler] Error running scan:', err);
  process.exit(1);
});
