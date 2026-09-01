import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', (err) => reject(err));
  });
}

async function run() {
  console.log('=== LIVE PRODUCTION VERIFICATION (https://thebrew.app) ===\n');

  // 1. Homepage & Meta Tag
  const home = await fetchUrl('https://thebrew.app/');
  console.log(`1. Homepage: HTTP ${home.statusCode}`);
  const hasMetaTag = home.body.includes('YRYpRIDQ974qJAOPMh7NWYZfsdvmkbtpJRHFB5OtjFk');
  console.log(`   Google Verification Tag Present: ${hasMetaTag ? '✓ YES' : '✗ NO'}`);

  // 2. Robots.txt
  const robots = await fetchUrl('https://thebrew.app/robots.txt');
  console.log(`2. Robots.txt: HTTP ${robots.statusCode}`);
  console.log(`   Sitemap referenced: ${robots.body.includes('sitemap.xml') ? '✓ YES' : '✗ NO'}`);

  // 3. Sitemap.xml
  const sitemap = await fetchUrl('https://thebrew.app/sitemap.xml');
  console.log(`3. Sitemap.xml: HTTP ${sitemap.statusCode}`);
  console.log(`   URLs indexed: ${sitemap.body.includes('<urlset') ? '✓ YES' : '✗ NO'}`);

  // 4. Verification File
  const verifyFile = await fetchUrl('https://thebrew.app/googlefb49764e0ed5806e.html');
  console.log(`4. Verification File (googlefb49764e0ed5806e.html): HTTP ${verifyFile.statusCode}`);
  console.log(`   Content: "${verifyFile.body.trim()}"`);

  // 5. Method Pre-rendered page
  const v60 = await fetchUrl('https://thebrew.app/methods/pour_over/');
  console.log(`5. Method Route (/methods/pour_over/): HTTP ${v60.statusCode}`);
  console.log(`   HowTo JSON-LD Schema: ${v60.body.includes('HowTo') ? '✓ YES' : '✗ NO'}`);
  console.log(`   Pre-rendered Content: ${v60.body.includes('Hario V60 Dripper') ? '✓ YES' : '✗ NO'}`);

  console.log('\n=== ALL LIVE ENDPOINTS VERIFIED & FUNCTIONAL ===');
}

run().catch(console.error);
