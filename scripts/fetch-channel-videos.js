import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function getChannelVideos(handle) {
  const pageHtml = await fetchUrl(`https://www.youtube.com/${handle}/videos`);
  const channelIdMatch = pageHtml.match(/"channelId":"(UC[a-zA-Z0-9_-]+)"/);
  if (!channelIdMatch) {
    // Try matching videoIds directly from page
    const videoMatches = [...pageHtml.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
    const titleMatches = [...pageHtml.matchAll(/"title":\{"runs":\[\{"text":"([^"]+)"/g)].map(m => m[1]);
    return { handle, videos: videoMatches.map((id, i) => ({ id, title: titleMatches[i] || '' })) };
  }
  const channelId = channelIdMatch[1];
  const feedXml = await fetchUrl(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  const entries = [...feedXml.matchAll(/<entry>[\s\S]*?<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<\/entry>/g)];
  return {
    handle,
    channelId,
    videos: entries.map(e => ({ id: e[1], title: e[2] }))
  };
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
    console.log(`\n📺 Channel: ${h} (Found ${res.videos.length} videos)`);
    for (const v of res.videos.slice(0, 15)) {
      console.log(`   - '${v.id}': "${v.title}"`);
    }
  }
}

run();
