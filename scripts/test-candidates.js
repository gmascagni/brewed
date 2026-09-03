import https from 'https';

const candidateIds = [
  '0-X76d_M6q8', // The Guide to Brewing Tea - Mei Leaf
  'O2p0e-D9_z0', // James Hoffmann
  'g66vP_m951o', // James Hoffmann
  '3mP9J02D2-s', // James Hoffmann
  't218zT62D9c', // Earl Grey
  'c6R9n0z9s5U', // Starbucks
];

function check(id) {
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
          resolve({ id, success: false, status: res.statusCode });
        }
      });
    }).on('error', err => resolve({ id, success: false, error: err.message }));
  });
}

async function run() {
  for (const id of candidateIds) {
    const res = await check(id);
    if (res.success) {
      console.log(`✅ '${id}' -> "${res.title}" by ${res.author}`);
    } else {
      console.log(`❌ '${id}' -> failed (${res.status})`);
    }
  }
}

run();
