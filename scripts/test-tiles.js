import https from 'https';

const tileUrls = [
  'https://tile.openstreetmap.org/12/1053/1640.png',
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/12/1640/1053',
  'https://a.tile.openstreetmap.fr/hot/12/1053/1640.png',
  'https://basemaps.cartocdn.com/rastertiles/voyager/12/1053/1640.png'
];

function testTile(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'TheBrewApp/1.0 (contact@thebrew.app)' } }, (res) => {
      resolve({ url, status: res.statusCode, contentType: res.headers['content-type'] });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function run() {
  for (const u of tileUrls) {
    const res = await testTile(u);
    console.log(res);
  }
}

run();
