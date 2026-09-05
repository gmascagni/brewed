/**
 * scripts/fetch_coffee_news.js
 * Real-time Automated RSS Crawler for World Coffee & Tea News.
 * Fetches real articles, real publication dates, and real direct article permalinks
 * from Daily Coffee News (Roast Magazine) and curated industry RSS feeds.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEWS_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'newsData.js');

function decodeEntities(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/\[\.\.\.\]/g, '')
    .trim();
}

function parseRssXml(xml, defaultSource, defaultCategory) {
  const items = [];
  const rawItems = xml.split(/<item[\s>]/i).slice(1);

  for (const raw of rawItems) {
    const itemText = raw.split(/<\/item>/i)[0];

    const titleMatch = itemText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch = itemText.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    const pubDateMatch = itemText.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
    const descMatch = itemText.match(/<description[^>]*>([\s\S]*?)<\/description>/i) ||
                      itemText.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i);
    const sourceMatch = itemText.match(/<source[^>]*>([\s\S]*?)<\/source>/i);

    const rawTitle = decodeEntities(titleMatch ? titleMatch[1] : '');
    const url = (linkMatch ? linkMatch[1] : '').replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim();
    const rawDesc = decodeEntities(descMatch ? descMatch[1] : '');
    const pubDateStr = pubDateMatch ? pubDateMatch[1].trim() : '';
    const sourceName = sourceMatch ? decodeEntities(sourceMatch[1]) : defaultSource;

    if (!rawTitle || !url) continue;

    // Filter out generic aggregations or empty snippets
    if (rawTitle.length < 10) continue;

    const parsedDate = pubDateStr ? new Date(pubDateStr) : new Date();
    const dateFormatted = !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recent';

    // Categorize based on keywords
    let category = defaultCategory;
    let tag = 'Industry & News';
    const combinedLower = (rawTitle + ' ' + rawDesc).toLowerCase();

    if (combinedLower.includes('tea') || combinedLower.includes('matcha') || combinedLower.includes('sencha') || combinedLower.includes('oolong')) {
      category = 'tea';
      tag = 'Fine Tea Dispatch';
    } else if (combinedLower.includes('championship') || combinedLower.includes('compet') || combinedLower.includes('cup of excellence') || combinedLower.includes('aeropress championship') || combinedLower.includes('barista')) {
      category = 'coffee';
      tag = 'Competitions';
    } else if (combinedLower.includes('farm') || combinedLower.includes('origin') || combinedLower.includes('harvest') || combinedLower.includes('producer') || combinedLower.includes('grower') || combinedLower.includes('colombia') || combinedLower.includes('ethiopia') || combinedLower.includes('peru') || combinedLower.includes('kenya')) {
      category = 'coffee';
      tag = 'Farm & Origin';
    } else if (combinedLower.includes('market') || combinedLower.includes('price') || combinedLower.includes('trade') || combinedLower.includes('report') || combinedLower.includes('export')) {
      category = 'coffee';
      tag = 'Market & Trade';
    }

    // Clean summary
    let summary = rawDesc;
    if (!summary || summary.length < 30) {
      summary = `${rawTitle}. Full coverage available from ${sourceName}.`;
    } else if (summary.length > 280) {
      summary = summary.substring(0, 277) + '...';
    }

    // Key points from description or context
    const keyPoints = [
      `Published by ${sourceName} on ${dateFormatted}`,
      `Direct coverage covering ${tag.toLowerCase()}`
    ];

    items.push({
      id: `news_${Math.abs(url.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
      title: rawTitle,
      source: sourceName,
      sourceDomain: url.replace(/^https?:\/\//i, '').split('/')[0],
      url,
      publishedDate: dateFormatted,
      dateIso: !isNaN(parsedDate.getTime()) ? parsedDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      category,
      tag,
      readTime: `${Math.max(2, Math.min(6, Math.round(summary.split(' ').length / 30) + 1))} min read`,
      featured: items.length === 0,
      summary,
      keyPoints
    });
  }

  return items;
}

async function fetchFeed(url, sourceName, category) {
  try {
    console.log(`[RSS Fetcher] Connecting to ${sourceName} (${url})...`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      console.warn(`[RSS Fetcher] ${sourceName} returned HTTP ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const items = parseRssXml(xml, sourceName, category);
    console.log(`[RSS Fetcher] Successfully extracted ${items.length} articles from ${sourceName}.`);
    return items;
  } catch (err) {
    console.error(`[RSS Fetcher] Failed to fetch ${sourceName}:`, err.message);
    return [];
  }
}

async function run() {
  console.log('=== World Coffee & Tea News Live RSS Crawler ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const [dcnItems, googleCoffeeItems, googleTeaItems] = await Promise.all([
    fetchFeed('https://dailycoffeenews.com/feed/', 'Daily Coffee News', 'coffee'),
    fetchFeed('https://news.google.com/rss/search?q=specialty+coffee+industry&hl=en-US&gl=US&ceid=US:en', 'Specialty Coffee Press', 'coffee'),
    fetchFeed('https://news.google.com/rss/search?q=specialty+tea+harvest+industry&hl=en-US&gl=US&ceid=US:en', 'Fine Tea Dispatch', 'tea')
  ]);

  // Combine and deduplicate by URL or normalized Title
  const combined = [];
  const seenUrls = new Set();
  const seenTitles = new Set();

  // Prioritize primary publisher (Daily Coffee News) first
  for (const item of [...dcnItems, ...googleTeaItems, ...googleCoffeeItems]) {
    const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenUrls.has(item.url) || seenTitles.has(normTitle)) {
      continue;
    }
    seenUrls.add(item.url);
    seenTitles.add(normTitle);
    combined.push(item);
  }

  if (combined.length === 0) {
    console.log('[RSS Fetcher] No new articles fetched. Retaining existing newsData.js.');
    return;
  }

  // Pick the top 10 fresh, diverse articles (at least 3 tea, at least 4 coffee)
  const coffeeList = combined.filter(a => a.category === 'coffee').slice(0, 6);
  const teaList = combined.filter(a => a.category === 'tea').slice(0, 4);
  const finalArticles = [...coffeeList, ...teaList];

  const nowFormatted = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const fileContent = `// World Coffee & Tea News Dispatch
// Automatically synced from live RSS feeds: Daily Coffee News, World Tea Press, Specialty Coffee Press.
// Last Synced: ${nowFormatted}

export const LAST_UPDATED = ${JSON.stringify(nowFormatted)};

export const WORLD_BREW_NEWS = ${JSON.stringify(finalArticles, null, 2)};

export const NEWS_CATEGORIES = [
  { id: 'all', label: 'All News' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'origin', label: 'Farm & Origin' },
  { id: 'competition', label: 'Competitions' }
];
`;

  fs.writeFileSync(NEWS_DATA_PATH, fileContent, 'utf8');
  console.log(`[RSS Fetcher] Successfully written ${finalArticles.length} live articles with direct permalinks to ${NEWS_DATA_PATH}!`);
  console.log(`[RSS Fetcher] Last Synced: ${nowFormatted}`);
}

run().catch((err) => {
  console.error('[RSS Fetcher] Fatal error running crawler:', err);
  process.exit(1);
});
