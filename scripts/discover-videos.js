import https from 'https';

const searchQueries = [
  { methodId: 'chemex', q: 'James Hoffmann The Chemex' },
  { methodId: 'espresso', q: 'James Hoffmann How I Dial In Espresso' },
  { methodId: 'drip_brewer', q: 'James Hoffmann Filter Coffee Machine' },
  { methodId: 'french_press', q: 'James Hoffmann Ultimate French Press' },
  { methodId: 'moka_pot', q: 'James Hoffmann Ultimate Moka Pot' },
  { methodId: 'aeropress', q: 'James Hoffmann Ultimate Aeropress' },
  { methodId: 'cold_brew', q: 'James Hoffmann Cold Brew Coffee' },
  { methodId: 'siphon', q: 'James Hoffmann Coffee Siphon Vacuum Pot' },
  { methodId: 'green_tea', q: 'How to brew green tea sencha' },
  { methodId: 'matcha_tea', q: 'How to whisk matcha tea' },
  { methodId: 'oolong_tea', q: 'Gong fu oolong tea brewing' },
  { methodId: 'darjeeling_tea', q: 'How to brew Darjeeling tea' },
  { methodId: 'english_breakfast', q: 'How to brew English Breakfast tea' },
  { methodId: 'earl_grey', q: 'How to brew Earl Grey tea' },
  { methodId: 'ceylon_tea', q: 'How to brew Ceylon tea' },
  { methodId: 'white_tea', q: 'How to brew white tea silver needle' },
  { methodId: 'turmeric_tea', q: 'How to make turmeric tea' },
  { methodId: 'chai_masala', q: 'Ranveer Brar Masala Chai' },
];

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function checkVideo(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const j = JSON.parse(data);
            resolve({ id, success: true, title: j.title, author: j.author_name });
          } catch(e) {
            resolve({ id, success: true });
          }
        } else {
          resolve({ id, success: false });
        }
      });
    }).on('error', () => resolve({ id, success: false }));
  });
}

async function findVideoForQuery(item) {
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(item.q + ' site:youtube.com/watch')}`;
  const html = await fetchHtml(searchUrl);
  const matches = [...html.matchAll(/v=([a-zA-Z0-9_-]{11})/g)].map(m => m[1]);
  const uniqueIds = [...new Set(matches)];

  for (const id of uniqueIds) {
    const check = await checkVideo(id);
    if (check.success) {
      console.log(`✅ FOUND [${item.methodId}]: '${id}' -> "${check.title}" by ${check.author}`);
      return { methodId: item.methodId, embedId: id, title: check.title, author: check.author };
    }
  }

  console.log(`⚠️ NO ID FOUND FOR [${item.methodId}]`);
  return null;
}

async function run() {
  console.log("Searching for verified working YouTube videos for all methods...\n");
  const results = [];
  for (const item of searchQueries) {
    const res = await findVideoForQuery(item);
    if (res) results.push(res);
  }
  console.log("\nResults count:", results.length);
}

run();
