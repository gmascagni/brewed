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

async function testOverpass() {
  // Let's test Atlanta coordinates (33.7490, -84.3880) with 5km radius (~3 miles)
  const lat = 33.7490;
  const lng = -84.3880;
  const radius = 5000;
  const query = `[out:json][timeout:10];(node["amenity"="cafe"](around:${radius},${lat},${lng});node["shop"="coffee"](around:${radius},${lat},${lng}););out center 25;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  console.log("Fetching live cafes from Overpass API...");
  const res = await fetchJson(url);
  console.log("Status:", res.status);
  if (res.data && res.data.elements) {
    console.log(`Found ${res.data.elements.length} real coffee shops! First 5:`);
    res.data.elements.slice(0, 5).forEach((el, idx) => {
      const tags = el.tags || {};
      console.log(` ${idx+1}. ${tags.name || 'Unnamed Cafe'} | ${tags['addr:street'] || tags['addr:city'] || ''} | lat: ${el.lat}, lng: ${el.lon}`);
    });
  } else {
    console.log("Error or raw:", res);
  }
}

async function testNominatim() {
  console.log("\nTesting Nominatim geocoding for '30004' (Alpharetta zip)...");
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=30004&limit=1`;
  const res = await fetchJson(url);
  console.log("Nominatim Result:", res.data);
}

async function run() {
  await testOverpass();
  await testNominatim();
}

run();
