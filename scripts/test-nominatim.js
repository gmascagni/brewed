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

async function testNominatimUS() {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('30004, USA')}&limit=1`;
  const res = await fetchJson(url);
  console.log("Nominatim US Zip:", res.data);
}

testNominatimUS();
