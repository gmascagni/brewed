import https from 'https';

const allTestVideos = [
  // COFFEE
  { id: 'mc_classic_pourover_v60', methodId: 'classic_pour_over', embedId: 'AI4ynXzkSQo', title: 'James Hoffmann: The Ultimate Pour Over Technique' },
  { id: 'mc_classic_pourover_beans', methodId: 'classic_pour_over', embedId: 'O9YnLFrM7Fs', title: "A Beginner's Guide To Buying Coffee Beans" },
  { id: 'mc_pourover_v60_better', methodId: 'pour_over', embedId: '1oB1oDrDkHM', title: 'James Hoffmann: A Better 1-Cup V60 Technique' },
  { id: 'mc_pourover_v60_ultimate', methodId: 'pour_over', embedId: 'AI4ynXzkSQo', title: 'James Hoffmann: The Ultimate V60 Technique (SCA 1:16 Ratio)' },
  { id: 'mc_pourover_beans', methodId: 'pour_over', embedId: 'O9YnLFrM7Fs', title: "A Beginner's Guide To Buying Coffee Beans" },
  { id: 'mc_chemex_hoffmann', methodId: 'chemex', embedId: 'ikt-X5x7yoc', title: 'James Hoffmann: The Chemex' },
  { id: 'mc_chemex_beans', methodId: 'chemex', embedId: 'O9YnLFrM7Fs', title: "A Beginner's Guide To Buying Coffee Beans" },
  { id: 'mc_frenchpress_hoffmann', methodId: 'french_press', embedId: 'st571DYYTR8', title: 'James Hoffmann: The Ultimate French Press Technique' },
  { id: 'mc_frenchpress_beans', methodId: 'french_press', embedId: 'O9YnLFrM7Fs', title: "A Beginner's Guide To Buying Coffee Beans" },
  { id: 'mc_moka_pot_hoffmann', methodId: 'moka_pot', embedId: 'BfDLoIvb0w4', title: 'James Hoffmann: The Ultimate Moka Pot Technique' },
  { id: 'mc_moka_pot_beans', methodId: 'moka_pot', embedId: 'O9YnLFrM7Fs', title: "A Beginner's Guide To Buying Coffee Beans" },
  { id: 'mc_aeropress_hoffmann', methodId: 'aeropress', embedId: 'j6VlT_jUVPc', title: 'James Hoffmann: The Ultimate AeroPress Technique' },
  { id: 'mc_espresso_dialin', methodId: 'espresso', embedId: 'lFwJF-_SUr0', title: 'James Hoffmann: How I Dial-In Espresso' },
  { id: 'mc_coldbrew_hoffmann', methodId: 'cold_brew', embedId: 'AB0QLjroFss', title: 'James Hoffmann: Everything I Learned About Cold Brew Coffee' },
  { id: 'mc_siphon_hoffmann', methodId: 'siphon', embedId: 'mvmRtPGR4C4', title: 'James Hoffmann: The Coffee Siphon (Vacuum Pot)' },
  { id: 'mc_drip_avoidbad', methodId: 'drip_brewer', embedId: 'mMwscUNKbPk', title: 'James Hoffmann: How To Avoid A Bad Brew' },

  // TEA
  { id: 'mc_gongfu_steps', methodId: 'oolong_tea', embedId: 'vxYWCijfZn0', title: 'The 14 Steps of Gong Fu Tea (Walkthrough Guide)' },
  { id: 'mc_gongfu_teaware', methodId: 'oolong_tea', embedId: 'Ia4oup1v4tU', title: 'Gong Fu Tea Teaware 101' },
  { id: 'mc_green_explained', methodId: 'green_tea', embedId: 'nOUSfwF5Z3U', title: 'Chinese Green Tea Explained: 11 Famous Teas' },
  { id: 'mc_steamed_green', methodId: 'green_tea', embedId: '1S8PRIvqV60', title: "China's Famous Steamed Green Tea Tasting" },
  { id: 'mc_white_silverneedle', methodId: 'white_tea', embedId: '74kotpiKUo0', title: 'Silver Needle White Tea Masterclass' },
  { id: 'mc_white_baimudan', methodId: 'white_tea', embedId: '6cHTJcTnaHo', title: 'Bai Mu Dan (White Peony) Steeping Guide' },
  { id: 'mc_chai_ranveer', methodId: 'chai_masala', embedId: 'ptrblJdZT6I', title: 'Authentic Indian Masala Chai & Spices' },
  { id: 'mc_chai_caffeinefree', methodId: 'chai_masala', embedId: 'U-UI9iqANMc', title: 'Botanical Spiced Chai Decoction' },
  { id: 'mc_english_assam', methodId: 'english_breakfast', embedId: '9FaPoLb4iSs', title: 'Formosa Red Assam & Full-Bodied Black Tea' },
  { id: 'mc_black_dianhong', methodId: 'english_breakfast', embedId: 'tV7lANeLAeE', title: 'Yunnan Dianhong Black Tea Masterclass' },
  { id: 'mc_darjeeling_elevation', methodId: 'darjeeling_tea', embedId: 'KfobDIwdhio', title: 'How High Elevation Impacts First & Second Flush Teas' },
  { id: 'mc_ceylon_origin', methodId: 'ceylon_tea', embedId: 'PHpq2tc-VKk', title: 'High-Grown Red Leaf & Oxidation Dynamics' },
  { id: 'mc_earl_grey_scented', methodId: 'earl_grey', embedId: 'IWQJLn5ABRk', title: 'Scented Black Teas & Essential Bergamot Oils' },
  { id: 'mc_matcha_guide', methodId: 'matcha_tea', embedId: 'MWzqidSeEy0', title: 'Matcha Whisking, Latte Prep & Frothing Guide' },
  { id: 'mc_matcha_genmai', methodId: 'matcha_tea', embedId: 'DqtigeEKI2Y', title: 'Genmai Matcha Ceremonial Whisking Guide' },
  { id: 'mc_turmeric_tisane', methodId: 'turmeric_tea', embedId: 'RiBKUy_rEVQ', title: 'Botanical Herbal Tisane & Wellness Decoction Guide' },
];

function check(item) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${item.embedId}&format=json`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const j = JSON.parse(data);
            resolve({ ...item, success: true, actualTitle: j.title, author: j.author_name });
          } catch(e) {
            resolve({ ...item, success: true });
          }
        } else {
          resolve({ ...item, success: false, status: res.statusCode });
        }
      });
    }).on('error', err => resolve({ ...item, success: false, error: err.message }));
  });
}

async function run() {
  console.log("Checking all 32 curated masterclasses against live YouTube oEmbed API...\n");
  let pass = 0;
  let fail = 0;
  for (const item of allTestVideos) {
    const res = await check(item);
    if (res.success) {
      pass++;
      console.log(`✅ [${res.methodId}] "${res.title}"`);
      console.log(`   -> YT Title: "${res.actualTitle}" | Channel: ${res.author}\n`);
    } else {
      fail++;
      console.log(`❌ [${res.methodId}] "${res.title}" -> FAILED (${res.status})\n`);
    }
  }
  console.log(`Summary: ${pass} PASSED, ${fail} FAILED`);
}

run();
