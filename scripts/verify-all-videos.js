import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read brewData.js content
const brewDataPath = path.resolve(__dirname, '../src/data/brewData.js');
const fileContent = fs.readFileSync(brewDataPath, 'utf8');

// Extract MASTERCLASSES array from brewData.js
const masterclassMatch = fileContent.match(/export const MASTERCLASSES = (\[[\s\S]*?\n\]);/);
if (!masterclassMatch) {
  console.error("❌ Could not find MASTERCLASSES array in brewData.js");
  process.exit(1);
}

// Safely evaluate MASTERCLASSES
const MASTERCLASSES = eval(masterclassMatch[1]);
console.log(`\n🔍 Found ${MASTERCLASSES.length} total masterclass video items in dataset.\n`);

function checkYouTubeVideo(video) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.embedId}&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({
              success: true,
              id: video.id,
              methodId: video.methodId,
              title: video.title,
              embedId: video.embedId,
              youtubeTitle: json.title,
              author: json.author_name,
              statusCode: res.statusCode
            });
          } catch (e) {
            resolve({ success: true, id: video.id, methodId: video.methodId, title: video.title, embedId: video.embedId, statusCode: res.statusCode });
          }
        } else {
          resolve({
            success: false,
            id: video.id,
            methodId: video.methodId,
            title: video.title,
            embedId: video.embedId,
            statusCode: res.statusCode,
            error: data
          });
        }
      });
    }).on('error', (err) => {
      resolve({ success: false, id: video.id, methodId: video.methodId, title: video.title, embedId: video.embedId, error: err.message });
    });
  });
}

async function run() {
  console.log("================================================================================");
  console.log("        VERIFYING ALL YOUTUBE MASTERCLASS VIDEOS IN THE BREW APP                ");
  console.log("================================================================================\n");

  let passCount = 0;
  let failCount = 0;

  for (const video of MASTERCLASSES) {
    const result = await checkYouTubeVideo(video);
    if (result.success) {
      passCount++;
      console.log(`✅ [${video.track.toUpperCase()}] [${video.methodId}] "${video.title}"`);
      console.log(`   -> YouTube ID: ${video.embedId} | Channel: "${result.author || 'N/A'}" | YT Title: "${result.youtubeTitle || 'N/A'}"\n`);
    } else {
      failCount++;
      console.log(`❌ [${video.track.toUpperCase()}] [${video.methodId}] "${video.title}"`);
      console.log(`   -> FAILED! YouTube ID: ${video.embedId} | HTTP Status: ${result.statusCode} | ${result.error || ''}\n`);
    }
  }

  console.log("================================================================================");
  console.log(`📊 TOTAL SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${MASTERCLASSES.length} videos`);
  console.log("================================================================================\n");
}

run();
