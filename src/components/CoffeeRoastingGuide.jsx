import React, { useState, useMemo } from 'react';
import {
  Flame,
  Thermometer,
  Activity,
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Home,
  Wind,
  Scale,
  Compass,
  ChevronRight,
  Info,
  Zap,
  Coffee,
  Eye,
  Volume2,
  TrendingDown
} from 'lucide-react';

// ============================================================================
// 1. GREEN BEAN ANATOMY & FRUIT LAYERS
// ============================================================================
const CHERRY_LAYERS = [
  {
    id: 'exocarp',
    layerNumber: '01 • Outer Layer',
    name: 'Exocarp (Cherry Skin)',
    thickness: '~0.5 mm',
    color: '#9E2A2B',
    bgLight: '#FDF2F2',
    borderLight: '#F5C2C2',
    summary: 'The protective outer skin of the coffee fruit. Starts green and ripens to deep crimson, yellow, orange, or pink depending on the botanical varietal (e.g., Red Bourbon vs. Yellow Bourbon).',
    roastImpact: 'Removed during processing, though in Natural (Dry) processed coffees, the intact skin dries onto the fruit, infusing berry/wine esters into the seed before hulling.'
  },
  {
    id: 'mesocarp',
    layerNumber: '02 • Sugar Layer',
    name: 'Mesocarp (Mucilage & Pulp)',
    thickness: '~1.5 – 2.0 mm',
    color: '#D97706',
    bgLight: '#FFFBEB',
    borderLight: '#FDE68A',
    summary: 'A sticky, honey-like hydrogel rich in pectins, simple sugars (glucose, fructose), and organic acids. This is the primary fuel source for microbial fermentation during processing.',
    roastImpact: 'Honey and Natural coffees retain higher simple sugars from mucilage diffusion—making the green beans more heat-sensitive in the drum and prone to scorching if charged too hot!'
  },
  {
    id: 'endocarp',
    layerNumber: '03 • Hull Layer',
    name: 'Endocarp (Parchment / Pergamino)',
    thickness: '~0.3 mm',
    color: '#B45309',
    bgLight: '#FAF0E6',
    borderLight: '#ECD4BD',
    summary: 'A tough, fibrous cellulose coat enclosing each seed. Coffee is dried and rested in parchment for 30–60 days ("reposo") at 10.5%–11.5% moisture before export milling.',
    roastImpact: 'Mechanically hulled off prior to export (except in Indonesia "Giling Basah" wet-hulled Sumatras, where hulling at 35% moisture creates the classic bluish-green bean and earthy body).'
  },
  {
    id: 'spermoderm',
    layerNumber: '04 • Chaff Coat',
    name: 'Spermoderm (Silverskin / Chaff)',
    thickness: '< 0.05 mm',
    color: '#78716C',
    bgLight: '#F5F5F4',
    borderLight: '#E7E5E4',
    summary: 'A whisper-thin, translucent papery membrane clinging tightly to the bean and tucked deep inside the center crease (cleft).',
    roastImpact: 'As the bean expands during drying and First Crack, silverskin detaches as dry "chaff." Strong airflow is essential to evacuate chaff from the roaster before it ignites and imparts smoky flavors.'
  },
  {
    id: 'endosperm',
    layerNumber: '05 • The Core Seed',
    name: 'Endosperm (The Green Coffee Bean)',
    thickness: '8 – 12 mm Core',
    color: '#2F663C',
    bgLight: '#EBF3ED',
    borderLight: '#C8E0CD',
    summary: 'A dense honeycomb matrix of ~1 million microscopic cellulose cells per bean. Traps 10–12% bound water, 6–9% sucrose, 15–17% lipids, amino acids, trigonelline, and chlorogenic acids (CGA).',
    roastImpact: 'Every cell functions as a microscopic pressure cooker during roasting: heat turns bound water into steam, driving Maillard browning and caramelization until First Crack.'
  }
];

// ============================================================================
// 2. THE 5 THERMAL PHASES OF A COFFEE ROAST
// ============================================================================
const ROAST_PHASES = [
  {
    step: '01',
    id: 'charge_tp',
    name: 'Charge & Turning Point (TP)',
    timeWindow: '0:00 – 1:30',
    tempRangeF: '400°F drop → ~195°F',
    tempRangeC: '204°C drop → ~90°C',
    thermodynamics: 'Endothermic (Heat Absorption)',
    beanColor: '#5B7A59',
    beanLabel: 'Jade Green',
    aroma: 'Raw green pea, fresh grass',
    whatHappens: 'Room-temperature green beans are dropped ("charged") into the pre-heated roasting drum. The cold thermal mass of the beans rapidly cools the temperature probe until the beans and drum reach thermal equilibrium at the "Turning Point" (around 1:15–1:40), after which Bean Temperature (BT) begins climbing.',
    roasterAction: 'Match Charge Temp to bean density: Dense high-altitude washed beans (Ethiopia/Kenya SHB) take a higher charge (400°F–420°F); delicate low-density naturals or decafs need a gentler charge (365°F–385°F) to prevent tipping/scorching.'
  },
  {
    step: '02',
    id: 'drying',
    name: 'Drying Phase (Green to Yellow)',
    timeWindow: '1:30 – 4:30',
    tempRangeF: '195°F → 300°F',
    tempRangeC: '90°C → 150°C',
    thermodynamics: 'Strongly Endothermic',
    beanColor: '#C5B358',
    beanLabel: 'Pale Straw Yellow',
    aroma: 'Cut hay, steamed basmati rice',
    whatHappens: 'Nearly 70–80% of the energy added during this phase goes toward evaporating free moisture (from ~11% down to ~5%). Chlorophyll degrades, shifting the bean color from green to pale yellow, while internal steam pressure begins building inside the cellulose walls.',
    roasterAction: 'Apply strong, steady early heat momentum ("soak" followed by high gas). If drying takes too long (>5:30), enzymatic vibrancy is lost; if rushed (<3:30), the outer shell dries while the core remains raw ("wet core"), leading to astringent grassy notes.'
  },
  {
    step: '03',
    id: 'maillard',
    name: 'Maillard & Caramelization (Browning)',
    timeWindow: '4:30 – 7:45',
    tempRangeF: '300°F → 385°F',
    tempRangeC: '150°C → 196°C',
    thermodynamics: 'Endothermic (Slowing RoR)',
    beanColor: '#B57C3E',
    beanLabel: 'Cinnamon / Tan',
    aroma: 'Toasted sourdough bread, malt, hazelnut',
    whatHappens: 'At 300°F (150°C), amino acids react with reducing sugars in the Maillard reaction, forming melanoidins (which build mouthfeel, body, and syrupy viscosity) and hundreds of aromatic furans, pyrazines, and pyrroles. Above 338°F (170°C), sucrose begins thermal pyrolysis (caramelization), turning bittersweet and golden.',
    roasterAction: 'Step down gas incrementally as the bean approaches First Crack while increasing airflow slightly to sweep away moisture vapor and peeling chaff. Lengthening Maillard increases body and chocolate sweetness; shortening it highlights bright fruit acidity.'
  },
  {
    step: '04',
    id: 'first_crack',
    name: 'First Crack (1C) — The Steam Pop',
    timeWindow: '7:45 – 9:00',
    tempRangeF: '385°F → 402°F',
    tempRangeC: '196°C → 205°C',
    thermodynamics: 'Exothermic Burst + Flash Evaporation',
    beanColor: '#8B5A2B',
    beanLabel: 'Light-Medium Brown',
    aroma: 'Bright citrus, stone fruit, caramel',
    whatHappens: 'Internal steam and CO₂ pressure reach ~25 atmospheres, fracturing the cellulose cell walls with an audible popcorn-like "CRACK!" The bean doubles in volume, smooths out surface wrinkles, and vents a rush of cool water vapor onto the temperature probe.',
    roasterAction: 'CRITICAL RoR DANGER ZONE! Because escaping steam cools the bean surface, an unprepared roaster will experience an "RoR Crash" (stalling extraction and baking the coffee). Anticipate 1C ~30–45 seconds early so thermal momentum carries cleanly through the crack.'
  },
  {
    step: '05',
    id: 'development',
    name: 'Development Phase (DTR) & Drop',
    timeWindow: '9:00 – 10:15 (Drop)',
    tempRangeF: '402°F → 415°F–445°F',
    tempRangeC: '205°C → 213°C–229°C',
    thermodynamics: 'Exothermic / Pyrolysis',
    beanColor: '#4A2C11',
    beanLabel: 'Medium to Dark Roast',
    aroma: 'Caramelized sugar, cocoa, roasted almond',
    whatHappens: 'After First Crack starts, every second rapidly degrades organic acids (citric/malic) while developing soluble sweetness and body. If pushed past ~435°F (224°C), Second Crack (2C) begins—fracturing the woody cellulose matrix and pushing interior oils to the surface.',
    roasterAction: 'Monitor Development Time Ratio (DTR = time after 1C ÷ total time). Drop into the cooling tray at target temp/color and quench to room temperature in under 3–4 minutes so internal residual heat doesn’t "bake" the delicate aromatics!'
  }
];

// ============================================================================
// 3. INTERACTIVE RoR (RATE OF RISE) PROFILES FOR SVG CHART
// ============================================================================
const ROR_PROFILES = {
  ideal: {
    id: 'ideal',
    badge: '✅ GOLD STANDARD PROFILE',
    title: 'Smooth Declining RoR (Scott Rao Curve)',
    dtr: '17.8% DTR',
    totalTime: '9:30',
    dropTemp: '408°F (209°C)',
    cupResult: 'Vibrant floral aromatics, syrupy stone-fruit sweetness, crisp acidity, zero roasty bitterness.',
    explanation: 'After peaking around 2:30 (34°F/min), the Rate of Rise descends in a clean, uninterrupted diagonal line all the way to the drop (9°F/min). Gas was stepped down proactively at 300°F, 345°F, and 375°F so First Crack neither crashed nor flicked.',
    btPoints: [
      [0, 405], [1.2, 192], [2.5, 255], [4.0, 305], [5.5, 348], [7.0, 382], [7.8, 392], [8.6, 401], [9.5, 408]
    ],
    rorPoints: [
      [1.2, 0], [2.5, 34], [4.0, 28], [5.5, 22], [7.0, 16], [7.8, 13], [8.6, 11], [9.5, 8.5]
    ],
    color: '#2F663C',
    accentBg: '#EBF3ED',
    accentBorder: '#C8E0CD'
  },
  crash: {
    id: 'crash',
    badge: '⚠️ DEFECT 01: THE RoR CRASH',
    title: 'First Crack Stall ("Baked" Coffee)',
    dtr: '19.5% DTR',
    totalTime: '10:15',
    dropTemp: '407°F (208°C)',
    cupResult: 'Flat, hollow, papery, cardboard-like flavor. Acidity feels muted and sweetness disappears despite a light drop temperature.',
    explanation: 'Too much heat early on caused the roaster to panic and cut the gas right at First Crack (7:45). Combined with the endothermic steam release of 1C, RoR plummeted from 20°F/min down to 2°F/min—stalling chemical progression and "baking" the beans.',
    btPoints: [
      [0, 410], [1.2, 195], [2.5, 265], [4.0, 318], [5.5, 360], [7.0, 388], [7.8, 396], [9.0, 400], [10.2, 407]
    ],
    rorPoints: [
      [1.2, 0], [2.5, 38], [4.0, 31], [5.5, 25], [7.0, 19], [7.8, 14], [8.7, 2.5], [10.2, 3.0]
    ],
    color: '#D97706',
    accentBg: '#FFFBEB',
    accentBorder: '#FDE68A'
  },
  flick: {
    id: 'flick',
    badge: '🔥 DEFECT 02: CRASH & FLICK',
    title: 'Late RoR Spike ("Scorched / Roasty")',
    dtr: '21.0% DTR',
    totalTime: '10:00',
    dropTemp: '416°F (213°C)',
    cupResult: 'Acrid, smoky, burnt-toast finish masking the origin fruit notes—even though the bean looks medium-light on the outside.',
    explanation: 'After seeing the RoR dip at First Crack, the roaster cranked the burner back up—or failed to reduce gas once all moisture escaped after 1C. With no moisture left inside the bean to absorb heat, RoR spiked upward from 6°F/min to 18°F/min ("The Flick"), charring the outer cell walls.',
    btPoints: [
      [0, 405], [1.2, 192], [2.5, 255], [4.0, 308], [5.5, 352], [7.0, 385], [7.8, 393], [8.5, 398], [10.0, 416]
    ],
    rorPoints: [
      [1.2, 0], [2.5, 35], [4.0, 27], [5.5, 21], [7.0, 15], [7.8, 6.5], [8.8, 14], [10.0, 18.5]
    ],
    color: '#DC2626',
    accentBg: '#FEF2F2',
    accentBorder: '#FECACA'
  }
};

// ============================================================================
// 4. ROAST LEVEL SPECTRUM & BREWING ADJUSTMENTS
// ============================================================================
const ROAST_SPECTRUM = [
  {
    id: 'light',
    name: 'Light Roast (Cinnamon / New England)',
    dropTemp: '395°F – 405°F (201°C – 207°C)',
    agtron: 'Agtron 75 – 65',
    weightLoss: '11.5% – 13.5%',
    dtrRange: '12% – 16% (Dropped right at end of 1st Crack)',
    beanColor: '#A47148',
    surface: 'Matte, dry, dense, tightly closed center cut with light silverskin remaining',
    chemistry: 'Maximum retention of chlorogenic, citric, and malic acids. High density and low cell porosity make it harder for water to penetrate.',
    flavorProfile: 'Jasmine, bergamot, lemon verbena, peach, raspberry, vibrant tea-like clarity.',
    brewAdjustment: {
      temp: '205°F – 210°F (96°C – 99°C)',
      grind: 'Finer than medium to increase surface area',
      ratio: '1:16.5 to 1:17 (more water drives higher extraction yield)',
      reason: 'Dense, non-porous cell walls require high thermal energy and longer contact time to extract sweetness and balance high acidity.'
    }
  },
  {
    id: 'medium_light',
    name: 'Medium-Light (City Roast)',
    dropTemp: '406°F – 415°F (208°C – 213°C)',
    agtron: 'Agtron 64 – 55',
    weightLoss: '13.5% – 15.0%',
    dtrRange: '16% – 19% (45–75s past 1st Crack start)',
    beanColor: '#7F4F24',
    surface: 'Smooth, dry matte finish, expanded volume, even warm chestnut tone',
    chemistry: 'The "Sweet Spot" for modern specialty coffee: peak sucrose caramelization balanced against complex fruit acids before cellulose breakdown begins.',
    flavorProfile: 'Red apple, milk chocolate, honeycomb, ripe plum, dulce de leche.',
    brewAdjustment: {
      temp: '200°F – 205°F (93°C – 96°C)',
      grind: 'Medium-Fine (standard V60 / drip baseline)',
      ratio: '1:16 (The Golden Specialty Benchmark)',
      reason: 'Balanced porosity extracts cleanly at 202°F without pulling astringent tannins.'
    }
  },
  {
    id: 'medium',
    name: 'Medium Roast (Full City)',
    dropTemp: '416°F – 430°F (213°C – 221°C)',
    agtron: 'Agtron 54 – 45',
    weightLoss: '15.0% – 17.0%',
    dtrRange: '19% – 23% (Dropped on the verge of 2nd Crack)',
    beanColor: '#582F0E',
    surface: 'Dry with occasional microscopic oil sheen droplets; well-expanded',
    chemistry: 'Citric and malic acids degrade by ~50%; melanoidins and bittersweet caramel compounds dominate, yielding heavy syrupy body.',
    flavorProfile: 'Bakers chocolate, roasted hazelnut, brown sugar, toasted almond, graham cracker.',
    brewAdjustment: {
      temp: '195°F – 200°F (90°C – 93°C)',
      grind: 'Medium (slightly coarser than light roast)',
      ratio: '1:15 to 1:15.5',
      reason: 'Higher cell porosity releases solubles rapidly; slightly cooler water preserves chocolate sweetness without harshness.'
    }
  },
  {
    id: 'dark',
    name: 'Medium-Dark to Dark (Vienna / French)',
    dropTemp: '435°F – 455°F (224°C – 235°C)',
    agtron: 'Agtron 44 – 30',
    weightLoss: '17.5% – 21.0%',
    dtrRange: '24% – 30% (Into rolling 2nd Crack)',
    beanColor: '#2B1707',
    surface: 'Glossy lipid oils on the surface; brittle, fragile honeycomb structure',
    chemistry: 'Second Crack fractures internal cell walls. Origin terroir characteristics are largely replaced by roast pyrolysis compounds (guaiacol, phenylindanes).',
    flavorProfile: 'Dark 85% cacao, molasses, charred oak, clove, smoky espresso crema.',
    brewAdjustment: {
      temp: '185°F – 192°F (85°C – 89°C)',
      grind: 'Coarse to Medium-Coarse',
      ratio: '1:13 to 1:14 (Shorter ratio, faster drawdown)',
      reason: 'Brittle, ultra-porous beans dissolve almost instantly. Boiling water will over-extract bitter ash—drop water to 188°F for velvety, sweet dark cocoa!'
    }
  }
];

// ============================================================================
// 5. DIY HOME ROASTING METHODS
// ============================================================================
const DIY_METHODS = [
  {
    id: 'popcorn',
    name: 'Hot Air Popcorn Popper',
    cost: '$20 – $40',
    batchSize: '75g – 90g green beans',
    roastTime: '5:30 – 7:30 mins',
    heatTransfer: '100% Convection (Fluid Bed Air)',
    difficulty: 'Beginner Friendly (Best $25 Entry)',
    badge: '🏆 BEST BUDGET STARTER',
    equipmentNeeded: 'Side-vented hot air popper (e.g., Nostalgia or West Bend Air Crazy—avoid bottom-mesh vents), wooden spoon handle, 2 metal colanders, kitchen scale.',
    howItWorks: 'Side-angled air vents swirl the green beans in a vortex of hot air ("fluid bed"), roasting every bean evenly while automatically blowing loose chaff out the top chute!',
    proTip: 'Because stock poppers run slightly hot, plug it into a heavy-duty extension cord or briefly pulse/stir with a wooden dowel during the first 2 minutes so First Crack happens around 5:00–6:00 instead of 3:00.'
  },
  {
    id: 'skillet',
    name: 'Cast Iron Skillet / Whirley Pop',
    cost: '$0 – $35',
    batchSize: '100g – 200g green beans',
    roastTime: '8:00 – 11:00 mins',
    heatTransfer: '80% Conduction + 20% Radiation',
    difficulty: 'Hands-On Tactile Craft',
    badge: '🍳 ZERO GEAR REQUIRED',
    equipmentNeeded: 'Heavy cast iron skillet, stainless steel whisk (or stove-top Whirley Pop popcorn crank pot), infrared thermometer, stove hood fan.',
    howItWorks: 'Pre-heat the dry cast iron skillet to ~425°F (218°C) on medium heat. Pour in green beans and whisk continuously (never stop moving them for more than 2 seconds!) until First Crack.',
    proTip: 'A stovetop Whirley Pop popcorn maker with a hand crank and lid is the secret weapon of home skillet roasters—it keeps heat trapped like a drum roaster while stirring every bean continuously.'
  },
  {
    id: 'dedicated',
    name: 'Dedicated Home Roasters (FreshRoast / Behmor)',
    cost: '$250 – $650',
    batchSize: '120g – 400g green beans',
    roastTime: '8:00 – 12:00 mins',
    heatTransfer: 'Fluid Bed Convection or Quartz Drum',
    difficulty: 'Intermediate Enthusiast',
    badge: '⚡ FULL FAN & HEAT CONTROL',
    equipmentNeeded: 'FreshRoast SR800 (fluid bed with 9 fan & 9 heat levels + built-in chaff basket) or Behmor 2000AB Plus (rotating wire drum with smoke suppression).',
    howItWorks: 'Allows true RoR management: start with high fan speed to agitate heavy wet green beans, then gradually lower fan speed as beans lose weight and expand, while stepping down heater power before First Crack.',
    proTip: 'Add the glass extension tube on the FreshRoast SR800 to improve bean movement and add a Mastech digital thermometer probe to log live Bean Temp and RoR every 30 seconds!'
  },
  {
    id: 'prosumer',
    name: 'Artisan Telemetry Roasters (Bullet / Kaleido)',
    cost: '$1,500 – $3,500',
    batchSize: '300g – 1,000g (1 kg)',
    roastTime: '8:30 – 11:00 mins',
    heatTransfer: '70% Convection + 30% Induction Drum',
    difficulty: 'Advanced / Micro-Roaster',
    badge: '💻 LIVE ARTISAN RoR CURVES',
    equipmentNeeded: 'Aillio Bullet R1 V2, Kaleido Sniper M2/M6, or Huky 500 + USB laptop running free open-source Artisan Scope software.',
    howItWorks: 'Infrared or dual-thermocouple probes feed real-time Bean Temp (BT), Drum Temp (ET), and Rate of Rise (RoR) straight to your screen at 1-second intervals—identical to a commercial 15kg Loring or Probat.',
    proTip: 'Use Artisan’s "Background Profile" feature to overlay your best golden-cup roast curve on screen and match your gas/airflow adjustments to trace the exact same RoR slope.'
  }
];

const DIY_CHECKLIST = [
  {
    minute: 'Prep (Before Heat)',
    title: 'Weigh Green Beans & Set Up Cooling Station',
    detail: 'Weigh 100g–150g of specialty green Arabica beans. Remove any broken or black "quaker" defect beans. Place two metal mesh colanders next to a fan or window—once First Crack finishes, you only have seconds to dump and cool!'
  },
  {
    minute: '0:00 – 1:30',
    title: 'Preheat & Charge (The Green Phase)',
    detail: 'Preheat your roaster/pan to ~400°F (204°C). Add beans and begin constant agitation. Beans will smell grassy like raw snow peas and absorb heat rapidly.'
  },
  {
    minute: '1:30 – 4:30',
    title: 'Yellowing & Steam Evaporation',
    detail: 'Beans shift from jade green to pale yellow. You will smell warm straw, hay, and steamed basmati rice as internal water evaporates. Chaff (silverskin) begins peeling from the center crease.'
  },
  {
    minute: '4:30 – 7:30',
    title: 'Maillard Browning (Toast & Caramel Aroma)',
    detail: 'Beans turn cinnamon-tan and expand noticeably. The grassy smell transforms into warm toasted bread, malt, and baking cookies. Slightly reduce heat by ~15–20% so you don’t race into First Crack too fast.'
  },
  {
    minute: '7:30 – 9:00',
    title: 'First Crack! (Listen for the Popcorn Snaps)',
    detail: 'At ~388°F (198°C), you will hear distinct, sharp snapping sounds like popcorn popping! Start a timer at the very first pop. Lower heat slightly so the roast coasts smoothly without scorching.'
  },
  {
    minute: '9:00 – 10:00',
    title: 'Drop & Rapid 3-Minute Cool-Down',
    detail: 'For a sweet filter/pour-over roast, dump the beans 60 to 90 seconds after First Crack starts (~15%–18% DTR). Pour beans back and forth between two metal colanders in front of a cool fan until completely cool to the touch (< 4 mins).'
  },
  {
    minute: 'Days 1 – 7',
    title: 'CO₂ Degassing Rest (Don’t Brew Immediately!)',
    detail: 'Freshly roasted beans are packed with trapped CO₂ gas that repels brewing water and tastes metallic/hollow on Day 1. Store in a one-way valve bag or vented jar: rest 4–7 days for Pour-Over, or 10–14 days for Espresso!'
  }
];

export default function CoffeeRoastingGuide({ onOpenWaterLab, onSelectMethodToBrew }) {
  const [activePillar, setActivePillar] = useState('ror'); // 'anatomy' | 'phases' | 'ror' | 'spectrum' | 'diy'
  const [selectedLayerId, setSelectedLayerId] = useState('endosperm');
  const [selectedPhaseId, setSelectedPhaseId] = useState('first_crack');
  const [selectedRorKey, setSelectedRorKey] = useState('ideal');
  const [selectedRoastLevelId, setSelectedRoastLevelId] = useState('medium_light');
  const [selectedDiyMethodId, setSelectedDiyMethodId] = useState('popcorn');

  // Interactive DIY Batch & DTR Calculator State
  const [greenWeightG, setGreenWeightG] = useState(150);
  const [totalRoastSec, setTotalRoastSec] = useState(570); // 9m 30s
  const [firstCrackSec, setFirstCrackSec] = useState(465); // 7m 45s
  const [checkedSteps, setCheckedSteps] = useState({});

  const selectedLayer = CHERRY_LAYERS.find((l) => l.id === selectedLayerId) || CHERRY_LAYERS[4];
  const selectedPhase = ROAST_PHASES.find((p) => p.id === selectedPhaseId) || ROAST_PHASES[3];
  const activeRorProfile = ROR_PROFILES[selectedRorKey] || ROR_PROFILES.ideal;
  const selectedRoastLevel = ROAST_SPECTRUM.find((r) => r.id === selectedRoastLevelId) || ROAST_SPECTRUM[1];
  const selectedDiyMethod = DIY_METHODS.find((m) => m.id === selectedDiyMethodId) || DIY_METHODS[0];

  // Computed DTR & Batch Yield
  const calcStats = useMemo(() => {
    const devSec = Math.max(0, totalRoastSec - firstCrackSec);
    const dtrPct = totalRoastSec > 0 ? (devSec / totalRoastSec) * 100 : 0;

    // Estimate moisture/organic weight loss based on DTR
    const lossPct = Math.min(21, Math.max(11, 11.5 + (dtrPct - 10) * 0.42));
    const roastedYieldG = Math.round(greenWeightG * (1 - lossPct / 100));

    let dtrStatus = {
      label: 'Sweet Spot (Specialty Filter / Balanced)',
      color: 'text-[#2F663C]',
      bg: 'bg-[#EBF3ED]',
      border: 'border-[#C8E0CD]',
      advice: 'Ideal 15%–20% development ratio! Expect vibrant origin clarity, caramelized sugar sweetness, and clean finish.'
    };
    if (dtrPct < 13) {
      dtrStatus = {
        label: 'Under-Developed (<13% DTR)',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        advice: 'Very short development after First Crack. Risk of grassy, hay-like, or sour/vegetal core if heat transfer wasn’t high.'
      };
    } else if (dtrPct > 24) {
      dtrStatus = {
        label: 'Extended Development (>24% DTR)',
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        advice: 'Heavy roast character! Organic fruit acids are mostly broken down in favor of dark bittersweet cocoa and smoky body.'
      };
    } else if (dtrPct > 20) {
      dtrStatus = {
        label: 'Espresso / Medium Comfort Zone (20%–24% DTR)',
        color: 'text-[#A8622D]',
        bg: 'bg-[#FAF0E6]',
        border: 'border-[#ECD4BD]',
        advice: 'Great solubility for espresso and immersion brews—tamed acidity with rich chocolate and nut body.'
      };
    }

    const formatTime = (sec) => {
      const m = Math.floor(sec / 60);
      const s = Math.round(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return {
      devSec,
      devFormatted: formatTime(devSec),
      totalFormatted: formatTime(totalRoastSec),
      fcFormatted: formatTime(firstCrackSec),
      dtrPct: dtrPct.toFixed(1),
      lossPct: lossPct.toFixed(1),
      roastedYieldG,
      dtrStatus
    };
  }, [greenWeightG, totalRoastSec, firstCrackSec]);

  const toggleChecklistStep = (idx) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Helper to convert [min, tempF] and [min, ror] to SVG coordinates (width: 680, height: 280)
  const svgPaths = useMemo(() => {
    const W = 680;
    const H = 260;
    const padL = 48;
    const padR = 48;
    const padT = 24;
    const padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const xForMin = (min) => padL + (min / 10.5) * plotW;
    // BT range: 150°F to 450°F
    const yForBt = (temp) => padT + plotH - ((temp - 150) / 300) * plotH;
    // RoR range: 0 to 42 °F/min
    const yForRor = (ror) => padT + plotH - (ror / 42) * plotH;

    const btCoords = activeRorProfile.btPoints.map(([m, t]) => [xForMin(m), yForBt(t)]);
    const rorCoords = activeRorProfile.rorPoints.map(([m, r]) => [xForMin(m), yForRor(r)]);

    const toPath = (pts) =>
      pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

    return {
      W,
      H,
      padL,
      padR,
      padT,
      padB,
      xForMin,
      yForBt,
      yForRor,
      btPath: toPath(btCoords),
      rorPath: toPath(rorCoords),
      btCoords,
      rorCoords
    };
  }, [activeRorProfile]);

  const PILLARS = [
    { id: 'ror', label: '📈 Rate of Rise (RoR) Lab', shortLabel: 'RoR Lab' },
    { id: 'phases', label: '🔥 5 Roasting Phases', shortLabel: '5 Phases' },
    { id: 'anatomy', label: '🍒 Bean & Cherry Anatomy', shortLabel: 'Bean Anatomy' },
    { id: 'spectrum', label: '🎨 Roast Spectrum & Brewing', shortLabel: 'Roast Levels' },
    { id: 'diy', label: '🏠 DIY Home Roasting Guide', shortLabel: 'DIY At Home' }
  ];

  return (
    <section
      id="coffee-roasting-science-section"
      className="rounded-3xl border border-[#ECE6DC] bg-white shadow-card overflow-hidden scroll-mt-28 transition-all"
    >
      {/* Top Banner Header */}
      <div className="p-5 sm:p-8 bg-gradient-to-br from-[#1C140E] via-[#261A11] to-[#140E0A] text-[#FAF7F2] border-b border-[#A66E38]/30 relative overflow-hidden">
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A66E38]/25 border border-[#D2A06E]/40 text-[#E8AF72] font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-[#E8AF72]" />
            <span>Roasting Thermodynamics & Green Bean Masterclass</span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-2.5">
            From Green Seed to Roasted Cup: Rate of Rise (RoR), Maillard & DIY Home Roasting
          </h3>

          <p className="text-xs sm:text-sm md:text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
            Understand what actually happens inside a coffee bean at 400°F. Explore the 5 cellular layers of a coffee cherry, the 5 thermal stages of a roast, how master roasters control <strong className="text-[#E8AF72]">Rate of Rise (RoR)</strong> to prevent baked or scorched flavors, and how to roast your own green beans at home.
          </p>
        </div>

        {/* Interactive Pillar Tab Selector (Mobile-Friendly Horizontal Scroll) */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PILLARS.map((tab) => {
            const isActive = activePillar === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePillar(tab.id)}
                className={`px-3.5 sm:px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 mobile-touch-target ${
                  isActive
                    ? 'bg-[#E8AF72] text-[#140E0A] shadow-lg scale-[1.02]'
                    : 'bg-white/10 text-stone-200 hover:bg-white/20 border border-white/15'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-6 md:p-8 bg-[#FAF7F2]">

        {/* =================================================================== */}
        {/* PILLAR 1: RATE OF RISE (RoR) INTERACTIVE SIMULATOR & SCIENCE       */}
        {/* =================================================================== */}
        {activePillar === 'ror' && (
          <div className="space-y-6 animate-fade-in">
            {/* Intro Explanation Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#ECE6DC]">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#A8622D]">
                    THE #1 METRIC IN MODERN SPECIALTY ROASTING
                  </span>
                  <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F] mt-0.5">
                    What is Rate of Rise (RoR) & Why Does It Matter?
                  </h4>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] font-mono text-xs font-bold shrink-0">
                  Formula: RoR = Δ Bean Temp (°F) per 60 Seconds
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs sm:text-sm text-[#574C45] leading-relaxed">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                  <div className="font-bold text-[#14110F] flex items-center gap-2 mb-1.5">
                    <Activity className="w-4 h-4 text-[#A8622D]" />
                    <span>1. The Roaster’s Speedometer</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    If <strong>Bean Temperature (BT)</strong> tells you where the coffee is right now (e.g. 380°F), <strong>Rate of Rise (RoR)</strong> tells you <em>how fast</em> it is heating up (e.g. +15°F per minute). It gives the roaster predictive foresight 30–60 seconds ahead of time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                  <div className="font-bold text-[#14110F] flex items-center gap-2 mb-1.5">
                    <TrendingDown className="w-4 h-4 text-[#2F663C]" />
                    <span>2. The Golden Rule: Smooth Decline</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Pioneered by coffee scientist <strong>Scott Rao</strong>: after peaking early in the drying phase (~2:30), your RoR curve should descend smoothly and monotonically all the way to the end of the roast—as the temperature differential between drum and bean narrows.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                  <div className="font-bold text-[#14110F] flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>3. Crashing vs. Flicking at 1st Crack</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    At <strong>First Crack (~388°F)</strong>, beans vent a burst of steam that rapidly cools the surface. If RoR plummets ("Crash"), the coffee tastes <strong>baked and papery</strong>. If you panic-add gas and RoR spikes up ("Flick"), it tastes <strong>ashy and scorched</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive RoR Profile Switcher & Telemetry Chart */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#14110F]">
                    Interactive Roast Telemetry & RoR Curve Analyzer
                  </h4>
                  <p className="text-xs text-[#766A62]">
                    Tap a roast curve below to inspect how Bean Temp (BT) and Rate of Rise (RoR) behave across a 10-minute roast:
                  </p>
                </div>

                {/* 3 Profile Toggle Buttons */}
                <div className="flex flex-wrap gap-2">
                  {Object.values(ROR_PROFILES).map((prof) => {
                    const isSelected = selectedRorKey === prof.id;
                    return (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => setSelectedRorKey(prof.id)}
                        className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer mobile-touch-target ${
                          isSelected
                            ? 'bg-[#14110F] text-white border-[#14110F] shadow-sm'
                            : 'bg-[#FAF7F2] text-[#574C45] border-[#ECE6DC] hover:border-[#C88A4B]'
                        }`}
                      >
                        {prof.id === 'ideal' && '✅ Ideal Declining RoR'}
                        {prof.id === 'crash' && '⚠️ RoR Crash (Baked)'}
                        {prof.id === 'flick' && '🔥 RoR Flick (Scorched)'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SVG Dual-Axis Roast Curve Visualizer */}
              <div className="rounded-2xl bg-[#14110E] p-3 sm:p-5 border border-[#A66E38]/30 text-white overflow-x-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <span className="w-3 h-1 rounded bg-amber-400 inline-block" />
                      Bean Temp (BT °F)
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <span className="w-3 h-1 rounded bg-emerald-400 inline-block" />
                      Rate of Rise (RoR °F/min)
                    </span>
                  </div>
                  <div className="text-stone-300">
                    Total: <strong className="text-white">{activeRorProfile.totalTime}</strong> • Drop: <strong className="text-amber-300">{activeRorProfile.dropTemp}</strong> • <strong className="text-emerald-300">{activeRorProfile.dtr}</strong>
                  </div>
                </div>

                <svg
                  viewBox={`0 0 ${svgPaths.W} ${svgPaths.H}`}
                  className="w-full h-auto min-w-[520px] select-none"
                  role="img"
                  aria-label={`Roast curve showing ${activeRorProfile.title}`}
                >
                  {/* Horizontal Grid Lines */}
                  {[200, 250, 300, 350, 400].map((temp) => {
                    const y = svgPaths.yForBt(temp);
                    return (
                      <g key={temp}>
                        <line
                          x1={svgPaths.padL}
                          y1={y}
                          x2={svgPaths.W - svgPaths.padR}
                          y2={y}
                          stroke="rgba(255,255,255,0.08)"
                          strokeDasharray="4 4"
                        />
                        <text x={svgPaths.padL - 8} y={y + 4} textAnchor="end" fill="#A89F91" fontSize="10" fontFamily="monospace">
                          {temp}°F
                        </text>
                      </g>
                    );
                  })}

                  {/* Right Axis Labels for RoR */}
                  {[0, 10, 20, 30, 40].map((ror) => {
                    const y = svgPaths.yForRor(ror);
                    return (
                      <text
                        key={ror}
                        x={svgPaths.W - svgPaths.padR + 8}
                        y={y + 4}
                        textAnchor="start"
                        fill="#6EE7B7"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {ror}°/m
                      </text>
                    );
                  })}

                  {/* Vertical Phase Dividers: Drying (4:00), First Crack (7:45) */}
                  {[
                    { min: 1.2, label: 'TP (1:12)', color: '#93C5FD' },
                    { min: 4.0, label: 'Yellow / Maillard (4:00)', color: '#FCD34D' },
                    { min: 7.8, label: 'First Crack (7:48)', color: '#F97316' }
                  ].map((marker) => {
                    const x = svgPaths.xForMin(marker.min);
                    return (
                      <g key={marker.label}>
                        <line
                          x1={x}
                          y1={svgPaths.padT}
                          x2={x}
                          y2={svgPaths.H - svgPaths.padB}
                          stroke={marker.color}
                          strokeOpacity="0.35"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={x + 4}
                          y={svgPaths.padT + 12}
                          fill={marker.color}
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {marker.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Time Axis Labels (Minutes) */}
                  {[0, 2, 4, 6, 8, 10].map((min) => {
                    const x = svgPaths.xForMin(min);
                    return (
                      <text
                        key={min}
                        x={x}
                        y={svgPaths.H - 10}
                        textAnchor="middle"
                        fill="#A89F91"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {min}:00
                      </text>
                    );
                  })}

                  {/* Bean Temperature (BT) Curve */}
                  <path
                    d={svgPaths.btPath}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Rate of Rise (RoR) Curve */}
                  <path
                    d={svgPaths.rorPath}
                    fill="none"
                    stroke={selectedRorKey === 'ideal' ? '#34D399' : selectedRorKey === 'crash' ? '#F59E0B' : '#F87171'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Nodes on RoR Curve */}
                  {svgPaths.rorCoords.map(([x, y], idx) => (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#14110E"
                      stroke={selectedRorKey === 'ideal' ? '#34D399' : selectedRorKey === 'crash' ? '#F59E0B' : '#F87171'}
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>
              </div>

              {/* Diagnosis Callout Box */}
              <div
                className="p-4 sm:p-5 rounded-2xl border transition-all"
                style={{
                  backgroundColor: activeRorProfile.accentBg,
                  borderColor: activeRorProfile.accentBorder
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold uppercase border"
                      style={{ color: activeRorProfile.color, borderColor: activeRorProfile.accentBorder, backgroundColor: '#FFFFFF' }}
                    >
                      {activeRorProfile.badge}
                    </span>
                    <h5 className="font-editorial text-lg font-bold text-[#14110F]">
                      {activeRorProfile.title}
                    </h5>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#2A2421] leading-relaxed mb-2.5">
                  <strong>Thermodynamic Analysis:</strong> {activeRorProfile.explanation}
                </p>
                <div className="text-xs font-mono font-bold text-[#14110F] bg-white/80 p-3 rounded-xl border border-black/10">
                  ☕ In the Cup: <span className="font-sans font-normal text-[#574C45]">{activeRorProfile.cupResult}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PILLAR 2: THE 5 THERMAL PHASES OF COFFEE ROASTING                  */}
        {/* =================================================================== */}
        {activePillar === 'phases' && (
          <div className="space-y-6 animate-fade-in">
            {/* Horizontal Step Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ROAST_PHASES.map((phase) => {
                const isSelected = phase.id === selectedPhase.id;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#14110F] text-white border-[#14110F] shadow-md scale-[1.01]'
                        : 'bg-white text-[#14110F] border-[#ECE6DC] hover:border-[#C88A4B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-[#E8AF72] text-[#14110F]' : 'bg-[#FAF0E6] text-[#A8622D]'
                      }`}>
                        STAGE {phase.step}
                      </span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/40 shadow-xs shrink-0"
                        style={{ backgroundColor: phase.beanColor }}
                        title={`Bean color: ${phase.beanLabel}`}
                      />
                    </div>
                    <div className="font-sans font-bold text-xs leading-snug">
                      {phase.name}
                    </div>
                    <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-stone-300' : 'text-[#766A62]'}`}>
                      {phase.timeWindow}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Phase Deep-Dive Card */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#ECE6DC]">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-mono font-extrabold text-lg shadow-md shrink-0 border-2 border-white"
                    style={{ backgroundColor: selectedPhase.beanColor }}
                  >
                    {selectedPhase.step}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#A8622D]">
                      {selectedPhase.thermodynamics} • {selectedPhase.beanLabel}
                    </span>
                    <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                      {selectedPhase.name}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] font-bold text-[#14110F]">
                    ⏱️ {selectedPhase.timeWindow}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#FAF0E6] border border-[#ECD4BD] font-bold text-[#A25A24]">
                    🌡️ {selectedPhase.tempRangeF} ({selectedPhase.tempRangeC})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#A8622D] flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>Physical & Chemical Reactions</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2A2421] leading-relaxed">
                    {selectedPhase.whatHappens}
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#766A62]">
                    <strong className="text-[#14110F]">Trier Aroma Cue:</strong> {selectedPhase.aroma}
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF3ED]/60 border border-[#C8E0CD] space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#2F663C] flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Roaster Gas & Airflow Control</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#14110F] leading-relaxed">
                    {selectedPhase.roasterAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PILLAR 3: COFFEE CHERRY & GREEN BEAN ANATOMY                       */}
        {/* =================================================================== */}
        {activePillar === 'anatomy' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: 5 Concentric Cherry Layers Selector */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#766A62] mb-2">
                  Tap a Layer (Outside → Inside Seed):
                </div>
                {CHERRY_LAYERS.map((layer) => {
                  const isSelected = layer.id === selectedLayer.id;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#14110F] ring-2 ring-[#C88A4B]/30 shadow-md'
                          : 'bg-white/80 border-[#ECE6DC] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-4 h-10 rounded-full shrink-0"
                          style={{ backgroundColor: layer.color }}
                        />
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#766A62] block">
                            {layer.layerNumber}
                          </span>
                          <span className="font-sans font-bold text-xs sm:text-sm text-[#14110F]">
                            {layer.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-[#766A62] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#ECE6DC]">
                        {layer.thickness}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Layer Detail & Green Bean Chemistry Matrix */}
              <div className="lg:col-span-7 space-y-4">
                <div
                  className="p-5 sm:p-6 rounded-2xl border shadow-xs space-y-4"
                  style={{
                    backgroundColor: selectedLayer.bgLight,
                    borderColor: selectedLayer.borderLight
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white border"
                      style={{ color: selectedLayer.color, borderColor: selectedLayer.borderLight }}
                    >
                      {selectedLayer.layerNumber} • {selectedLayer.thickness}
                    </span>
                  </div>

                  <h4 className="font-editorial text-2xl font-bold text-[#14110F]">
                    {selectedLayer.name}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#2A2421] leading-relaxed">
                    <strong>Botanical Function:</strong> {selectedLayer.summary}
                  </p>

                  <div className="p-4 rounded-xl bg-white/90 border border-black/10 text-xs sm:text-sm text-[#14110F] leading-relaxed">
                    <strong>🔥 Impact on Roasting & Flavor:</strong> {selectedLayer.roastImpact}
                  </div>
                </div>

                {/* Green Bean Pre-Roast Chemical Composition Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs">
                  <h5 className="font-editorial text-lg font-bold text-[#14110F] mb-3">
                    What’s Inside a Raw Green Arabica Bean Before Roasting?
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                      <div className="font-mono font-bold text-[#A8622D]">50% Cellulose</div>
                      <div className="text-[11px] text-[#766A62] mt-0.5">Structural fiber walls that trap steam for First Crack.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                      <div className="font-mono font-bold text-[#2F663C]">10.5–12% Water</div>
                      <div className="text-[11px] text-[#766A62] mt-0.5">Essential heat conductor & steam pressure driver.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                      <div className="font-mono font-bold text-[#A8622D]">6–9% Sucrose</div>
                      <div className="text-[11px] text-[#766A62] mt-0.5">Caramelizes above 338°F into sweetness & organic acids.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                      <div className="font-mono font-bold text-[#A8622D]">15–17% Lipids</div>
                      <div className="text-[11px] text-[#766A62] mt-0.5">Coffee oils that carry volatile aroma and creamy mouthfeel.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                      <div className="font-mono font-bold text-[#A8622D]">6–8% CGA Acids</div>
                      <div className="text-[11px] text-[#766A62] mt-0.5">Chlorogenic acids; break down into quinic/caffeic bitterness in dark roasts.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
                      <div className="font-mono font-bold text-[#A8622D]">1% Trigonelline</div>
                      <div className="text-[11px] text-[#766A62] mt-0.5">Degrades above 375°F into B3 niacin and savory pyrazines.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PILLAR 4: ROAST LEVEL SPECTRUM & BREWING ADJUSTMENTS               */}
        {/* =================================================================== */}
        {activePillar === 'spectrum' && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 Roast Level Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ROAST_SPECTRUM.map((level) => {
                const isSelected = level.id === selectedRoastLevel.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedRoastLevelId(level.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#14110F] text-white border-[#14110F] shadow-md scale-[1.01]'
                        : 'bg-white text-[#14110F] border-[#ECE6DC] hover:border-[#C88A4B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: level.beanColor }}
                      />
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-white/15 text-amber-300' : 'bg-[#FAF0E6] text-[#A8622D]'
                      }`}>
                        {level.agtron}
                      </span>
                    </div>
                    <div className="font-sans font-bold text-sm">{level.name}</div>
                    <div className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-stone-300' : 'text-[#766A62]'}`}>
                      Drop: {level.dropTemp.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Roast Level Detail & Brewing Dial-In Recipe */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#ECE6DC]">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-white shadow-md shrink-0"
                    style={{ backgroundColor: selectedRoastLevel.beanColor }}
                  />
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#A8622D]">
                      {selectedRoastLevel.agtron} • Weight Loss: {selectedRoastLevel.weightLoss}
                    </span>
                    <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                      {selectedRoastLevel.name}
                    </h4>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] font-mono text-xs font-bold text-[#14110F]">
                  Drop Temp: {selectedRoastLevel.dropTemp}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-2.5 text-xs sm:text-sm">
                  <div className="font-mono text-xs font-bold uppercase text-[#A8622D]">
                    Bean Physics & Cellular Porosity
                  </div>
                  <p className="text-[#2A2421] leading-relaxed">
                    {selectedRoastLevel.chemistry}
                  </p>
                  <div className="text-xs text-[#574C45]">
                    <strong>Surface Appearance:</strong> {selectedRoastLevel.surface}
                  </div>
                  <div className="text-xs text-[#574C45]">
                    <strong>Typical Tasting Notes:</strong> {selectedRoastLevel.flavorProfile}
                  </div>
                </div>

                {/* How to Brew This Roast Level */}
                <div className="p-4 rounded-2xl bg-[#FAF0E6]/70 border border-[#ECD4BD] space-y-2.5 text-xs sm:text-sm">
                  <div className="font-mono text-xs font-bold uppercase text-[#A25A24] flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4" />
                    <span>How to Adjust Your Brew for {selectedRoastLevel.name.split(' ')[0]} Roast</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-white border border-[#ECD4BD]">
                      <div className="text-[10px] font-mono text-[#766A62]">WATER TEMP</div>
                      <div className="font-mono font-bold text-xs text-[#14110F] mt-0.5">{selectedRoastLevel.brewAdjustment.temp}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#ECD4BD]">
                      <div className="text-[10px] font-mono text-[#766A62]">GRIND SIZE</div>
                      <div className="font-sans font-bold text-xs text-[#14110F] mt-0.5">{selectedRoastLevel.brewAdjustment.grind.split(' ')[0]}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#ECD4BD]">
                      <div className="text-[10px] font-mono text-[#766A62]">TARGET RATIO</div>
                      <div className="font-mono font-bold text-xs text-[#14110F] mt-0.5">{selectedRoastLevel.brewAdjustment.ratio.split(' ')[0]}</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#2A2421] leading-relaxed pt-1">
                    <strong>Why?</strong> {selectedRoastLevel.brewAdjustment.reason}
                  </p>
                  {onSelectMethodToBrew && (
                    <button
                      type="button"
                      onClick={() => onSelectMethodToBrew('pour_over')}
                      className="mt-2 px-4 py-2 rounded-xl bg-[#14110F] hover:bg-[#A8622D] text-white font-mono text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Coffee className="w-3.5 h-3.5 text-[#E8AF72]" />
                      <span>Dial In This Roast in Brew Station →</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PILLAR 5: DIY HOME COFFEE ROASTING LAB & CALCULATOR                */}
        {/* =================================================================== */}
        {activePillar === 'diy' && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 Home Roasting Equipment Methods */}
            <div>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F] mb-1">
                4 Ways to Roast Green Coffee Beans at Home
              </h4>
              <p className="text-xs sm:text-sm text-[#766A62] mb-4">
                Green unroasted coffee beans cost $6–$9/lb (from sources like Sweet Maria’s, Showroom Coffee, or Burman Coffee Traders) and stay fresh for 12+ months. Select a method below:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {DIY_METHODS.map((m) => {
                  const isSelected = m.id === selectedDiyMethod.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedDiyMethodId(m.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#14110F] text-white border-[#14110F] shadow-md'
                          : 'bg-white text-[#14110F] border-[#ECE6DC] hover:border-[#C88A4B]'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded inline-block mb-2 ${
                          isSelected ? 'bg-[#E8AF72] text-[#14110F]' : 'bg-[#FAF0E6] text-[#A8622D]'
                        }`}>
                          {m.badge}
                        </span>
                        <div className="font-sans font-bold text-sm">{m.name}</div>
                      </div>
                      <div className={`text-xs font-mono font-bold mt-2 ${isSelected ? 'text-amber-300' : 'text-[#2F663C]'}`}>
                        Cost: {m.cost}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected DIY Method Detail Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A8622D] font-mono text-[10px] font-bold">
                      {selectedDiyMethod.heatTransfer}
                    </span>
                    <span className="text-xs font-mono text-[#766A62]">
                      Batch: <strong>{selectedDiyMethod.batchSize}</strong> • Time: <strong>{selectedDiyMethod.roastTime}</strong>
                    </span>
                  </div>
                  <h5 className="font-editorial text-xl font-bold text-[#14110F]">
                    {selectedDiyMethod.name} ({selectedDiyMethod.cost})
                  </h5>
                  <p className="text-xs sm:text-sm text-[#2A2421] leading-relaxed">
                    <strong>How It Works:</strong> {selectedDiyMethod.howItWorks}
                  </p>
                  <p className="text-xs text-[#574C45]">
                    <strong>Gear Needed:</strong> {selectedDiyMethod.equipmentNeeded}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#EBF3ED]/70 border border-[#C8E0CD] flex flex-col justify-center">
                  <div className="text-xs font-mono font-bold uppercase text-[#2F663C] mb-1">
                    💡 Home Roaster Pro Tip
                  </div>
                  <p className="text-xs text-[#14110F] leading-relaxed">
                    {selectedDiyMethod.proTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Home Roast DTR & Batch Yield Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8622D]">
                      INTERACTIVE ROAST CALCULATOR
                    </span>
                    <h5 className="font-editorial text-lg sm:text-xl font-bold text-[#14110F]">
                      DIY Batch Yield & Development Ratio (DTR)
                    </h5>
                  </div>
                  <Scale className="w-5 h-5 text-[#A8622D]" />
                </div>

                {/* Sliders */}
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-mono font-bold mb-1">
                      <span>1. Green Bean Charge Weight:</span>
                      <span className="text-[#A8622D]">{greenWeightG}g green</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={greenWeightG}
                      onChange={(e) => setGreenWeightG(Number(e.target.value))}
                      className="w-full accent-[#A8622D] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-mono font-bold mb-1">
                      <span>2. First Crack Start Time:</span>
                      <span className="text-[#A8622D]">{calcStats.fcFormatted} ({firstCrackSec}s)</span>
                    </div>
                    <input
                      type="range"
                      min="240"
                      max="660"
                      step="5"
                      value={firstCrackSec}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFirstCrackSec(val);
                        if (val >= totalRoastSec) setTotalRoastSec(val + 30);
                      }}
                      className="w-full accent-[#A8622D] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-mono font-bold mb-1">
                      <span>3. Total Roast Drop Time:</span>
                      <span className="text-[#2F663C]">{calcStats.totalFormatted} ({totalRoastSec}s)</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="840"
                      step="5"
                      value={totalRoastSec}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTotalRoastSec(Math.max(val, firstCrackSec + 15));
                      }}
                      className="w-full accent-[#2F663C] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Output Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-center">
                    <div className="text-[10px] font-mono text-[#766A62]">DEV TIME</div>
                    <div className="font-mono font-extrabold text-base sm:text-lg text-[#14110F] mt-0.5">
                      {calcStats.devFormatted}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF0E6] border border-[#ECD4BD] text-center">
                    <div className="text-[10px] font-mono text-[#A25A24]">DTR RATIO</div>
                    <div className="font-mono font-extrabold text-base sm:text-lg text-[#A25A24] mt-0.5">
                      {calcStats.dtrPct}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EBF3ED] border border-[#C8E0CD] text-center">
                    <div className="text-[10px] font-mono text-[#2F663C]">ROASTED YIELD</div>
                    <div className="font-mono font-extrabold text-base sm:text-lg text-[#2F663C] mt-0.5">
                      ~{calcStats.roastedYieldG}g
                    </div>
                    <div className="text-[9px] font-mono text-[#2F663C]/80">(-{calcStats.lossPct}% loss)</div>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs ${calcStats.dtrStatus.bg} ${calcStats.dtrStatus.border}`}>
                  <div className={`font-mono font-bold ${calcStats.dtrStatus.color}`}>
                    {calcStats.dtrStatus.label}
                  </div>
                  <p className="text-[#2A2421] mt-1 leading-relaxed">
                    {calcStats.dtrStatus.advice}
                  </p>
                </div>
              </div>

              {/* Right: Interactive Step-by-Step Home Roast Checklist */}
              <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2F663C]">
                      INTERACTIVE ROAST DAY PROTOCOL
                    </span>
                    <h5 className="font-editorial text-lg sm:text-xl font-bold text-[#14110F]">
                      Step-by-Step Home Roasting Checklist
                    </h5>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#766A62]">
                    {Object.values(checkedSteps).filter(Boolean).length}/{DIY_CHECKLIST.length} Done
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {DIY_CHECKLIST.map((item, idx) => {
                    const isChecked = Boolean(checkedSteps[idx]);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistStep(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-[#EBF3ED]/60 border-[#C8E0CD]'
                            : 'bg-[#FAF7F2] border-[#ECE6DC] hover:border-[#C88A4B]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 accent-[#2F663C] rounded cursor-pointer shrink-0"
                        />
                        <div className="text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-white border border-[#ECE6DC] text-[#A8622D]">
                              {item.minute}
                            </span>
                            <span className={`font-sans font-bold text-[#14110F] ${isChecked ? 'line-through opacity-70' : ''}`}>
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[#574C45] mt-1 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
