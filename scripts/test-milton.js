import https from 'https';

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'TheBrewApp/1.0 (contact@thebrew.app)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, error: e.message, raw: data.slice(0, 200) });
        }
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function testMiltonCafes() {
  const lat = 34.1117;
  const lng = -84.3154;
  const radius = 8000; // ~5 miles
  const query = `[out:json][timeout:15];(node["amenity"="cafe"](around:${radius},${lat},${lng});node["shop"="coffee"](around:${radius},${lat},${lng});way["amenity"="cafe"](around:${radius},${lat},${lng});way["shop"="coffee"](around:${radius},${lat},${lng}););out center 40;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  const res = await fetchJson(url);
  console.log("Status:", res.status);
  if (res.data && res.data.elements) {
    console.log(`Found ${res.data.elements.length} real coffee shops around 30004:`);
    res.data.elements.forEach((el, idx) => {
      const tags = el.tags || {};
      const elLat = el.lat || (el.center && el.center.lat);
      const elLng = el.lon || (el.center && el.center.lon);
      console.log(`${idx+1}. ${tags.name || 'Coffee Shop'} | ${tags['addr:street'] || tags['addr:city'] || ''} | (${elLat}, ${elLng})`);
    });
  }
}

testMiltonCafes();
