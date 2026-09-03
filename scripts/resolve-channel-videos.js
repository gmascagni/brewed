import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
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

async function getChannelVideos(handle) {
  const pageHtml = await fetchUrl(`https://www.youtube.com/${handle}/videos`);
  const matches = [...pageHtml.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
  const uniqueIds = [...new Set(matches)];
  const verified = [];
  for (const id of uniqueIds) {
    const info = await checkVideo(id);
    if (info.success && info.title) {
      verified.push(info);
    }
  }
  return { handle, verified };
}

async function run() {
  const handles = [
    '@jameshoffmann',
    '@EuropeanCoffeeTrip',
    '@MeiLeaf',
    '@RanveerBrar',
    '@RedBlossomTea'
  ];

  for (const h of handles) {
    const res = await getChannelVideos(h);
    console.log(`\n======================================================`);
    console.log(`📺 Channel: ${h} (${res.verified.length} verified videos)`);
    console.log(`======================================================`);
    for (const v of res.verified) {
      console.log(`- '${v.id}': "${v.title}"`);
    }
  }
}

run();
