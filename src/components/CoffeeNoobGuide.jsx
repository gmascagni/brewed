import React, { useState } from 'react';
import { 
  Sparkles, 
  Coffee, 
  Droplets, 
  Scale, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Sliders,
  Award
} from 'lucide-react';

// 8 Beginner Brew Method Profiles with Pros, Cons, and Quick Specs
const NOOB_BREW_METHODS = [
  {
    id: 'french_press',
    name: 'French Press',
    tagline: 'The Forgiving Immersion Classic',
    difficulty: 'Super Easy',
    difficultyColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    flavorProfile: 'Rich, full-bodied, comforting, heavy chocolate & nutty notes.',
    time: '4m 00s',
    ratio: '1:15',
    grind: 'Coarse (sea salt texture)',
    bestFor: 'Dark/medium roasts, lovers of full body, zero-stress mornings.',
    description: 'Grounds steep freely in hot water before a fine metal mesh plunger pushes them to the bottom. Because there is no paper filter, natural coffee oils and micro-fines remain in your cup.',
    pros: [
      'Extremely forgiving — hard to brew a bad cup even if your timing is off',
      'No paper filters to buy or run out of',
      'Great for making multiple cups at once for family or guests',
      'Comforting, velvety mouthfeel with rich body'
    ],
    cons: [
      'Leaves fine coffee silt/sediment in the final sip of your mug',
      'Takes 4+ minutes to brew',
      'Cleaning wet grounds out of the glass beaker can be messy'
    ]
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    tagline: 'The Indestructible Swiss Army Knife',
    difficulty: 'Very Easy',
    difficultyColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    flavorProfile: 'Ultra-smooth, sweet, clean, near-zero bitterness.',
    time: '1m 30s – 2m 00s',
    ratio: '1:14 to 1:16',
    grind: 'Fine-Medium (table salt texture)',
    bestFor: 'Beginners, travelers, dorms, office desks, camping.',
    description: 'A syringe-like cylinder that uses gentle manual air pressure to push hot water through coffee grounds and a small paper disc in under two minutes.',
    pros: [
      'Virtually indestructible BPA-free plastic — drop it and it bounces',
      'Easiest cleanup in coffee — pop the compressed puck straight into the trash',
      'Very fast (less than 2 minutes total brew time)',
      'Highly versatile: can make light drip-style cups or thick espresso-style concentrates'
    ],
    cons: [
      'Only brews one single mug at a time',
      'Looks more like medical equipment than kitchen art',
      'Has multiple small parts (plunger, chamber, filter cap, paddle)'
    ]
  },
  {
    id: 'pour_over',
    name: 'Pour Over (Hario V60)',
    tagline: 'The Clarity & Flavor Champion',
    difficulty: 'Moderate',
    difficultyColor: 'bg-amber-100 text-amber-800 border-amber-200',
    flavorProfile: 'Clean, vibrant, articulate, bright fruit and delicate florals.',
    time: '3m 00s – 3m 30s',
    ratio: '1:16 to 1:16.6',
    grind: 'Medium-Fine (kosher salt texture)',
    bestFor: 'Single-origin specialty coffees (Ethiopia, Colombia, Kenya), light roasts.',
    description: 'Hot water trickles slowly through coffee in a spiral-ribbed cone filter. As gravity pulls water through the bed, it extracts delicate sugars and fruit acids with maximum clarity.',
    pros: [
      'Highest flavor clarity of any brew method — taste individual fruit and floral notes',
      'Highlights the natural terroir of quality specialty beans',
      'Quick and clean disposal — simply throw the paper filter into compost',
      'Affordable hardware ($10–$25 for a plastic V60 cone)'
    ],
    cons: [
      'Requires a gooseneck kettle for steady, controlled water pouring',
      'Sensitive to sloppy technique; erratic pouring can cause water channeling and bitter notes',
      'Brews only 1 to 2 cups at a time'
    ]
  },
  {
    id: 'chemex',
    name: 'Chemex',
    tagline: 'The Elegant Dinner Host',
    difficulty: 'Moderate',
    difficultyColor: 'bg-amber-100 text-amber-800 border-amber-200',
    flavorProfile: 'Crystal-clear, tea-like lightness, sparkling sweetness, zero silt.',
    time: '4m 00s – 4m 30s',
    ratio: '1:16.5',
    grind: 'Medium-Coarse',
    bestFor: 'Hosting guests, light & medium roasts, beautiful countertop aesthetic.',
    description: 'An iconic hourglass borosilicate glass carafe fitted with a polished wood collar. Uses 20-30% thicker bonded paper filters that trap all bitter oils and sediment.',
    pros: [
      'Iconic mid-century modern design worthy of a museum showcase',
      'Thick bonded filters yield the cleanest, purest cup with zero sediment',
      'Can easily brew 3 to 6 cups at once for brunches or gatherings',
      'Looks gorgeous on the breakfast table'
    ],
    cons: [
      'Glass is fragile and can shatter if knocked against a stone counter',
      'Proprietary thick filters are more expensive than standard cone filters',
      'Slow drawdown time if grind is even slightly too fine'
    ]
  },
  {
    id: 'moka_pot',
    name: 'Moka Pot (Stovetop)',
    tagline: 'The Heavy Stovetop Espresso',
    difficulty: 'Moderate',
    difficultyColor: 'bg-amber-100 text-amber-800 border-amber-200',
    flavorProfile: 'Intense, viscous, syrupy, dark chocolate punch.',
    time: '3m 00s',
    ratio: '1:10 (concentrated)',
    grind: 'Fine (finer than sand, coarser than espresso)',
    bestFor: 'Homemade lattes, cappuccinos, or anyone craving dark espresso intensity on a budget.',
    description: 'Steam pressure generated in the sealed bottom water boiler forces bubbling water up through a basket of coffee grounds into the top collector pot.',
    pros: [
      'Brews a rich, syrupy espresso-style concentrate without a $1,000 espresso machine',
      'Perfect base for homemade iced lattes, mochas, and flat whites with milk',
      'Heavy cast aluminum or stainless steel lasts for generations',
      'Classic European morning ritual'
    ],
    cons: [
      'Easy to scorch/burn if heat is too high, resulting in harsh metallic bitterness',
      'Pot gets extremely hot to the touch',
      'Requires constant watching on the stove — cannot walk away'
    ]
  },
  {
    id: 'cold_brew',
    name: 'Cold Brew',
    tagline: 'The Smooth, Low-Acid Pitcher',
    difficulty: 'Dead Simple',
    difficultyColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    flavorProfile: 'Silky, chocolatey, naturally sweet, virtually zero bitterness.',
    time: '12 – 18 Hours',
    ratio: '1:8 (concentrate) or 1:12 (ready-to-drink)',
    grind: 'Extra Coarse (raw sugar crystals)',
    bestFor: 'Iced coffee lovers, sensitive stomachs, making an entire week of coffee at once.',
    description: 'Coarsely ground beans steep slowly in cold or room-temperature water for 12 to 18 hours. Cold water extracts sugars and chocolate notes while leaving harsh tannins behind.',
    pros: [
      'Almost impossible to brew wrong — the most forgiving method in existence',
      'Up to 60% lower perceptible acidity — very gentle on sensitive stomachs',
      'Brew a large batch in the fridge that stays fresh and delicious for up to 10 days',
      'Refreshing base for iced drinks on hot summer mornings'
    ],
    cons: [
      'Requires 12 to 18 hours of advance planning',
      'Uses about double the coffee beans per batch compared to hot brewing',
      'Mutes delicate floral and fruity terroir notes found in light roasts'
    ]
  },
  {
    id: 'drip_brewer',
    name: 'Automatic Drip Machine',
    tagline: 'The Hands-Free Morning Autopilot',
    difficulty: 'Push-Button',
    difficultyColor: 'bg-blue-100 text-blue-800 border-blue-200',
    flavorProfile: 'Balanced, classic, familiar everyday drip cup.',
    time: '5m 00s',
    ratio: '1:16',
    grind: 'Medium (table salt)',
    bestFor: 'Busy families, weekday morning rushes, hands-free brewing.',
    description: 'Water in a back reservoir is heated by a thermal coil, pumped up through a showerhead, and showers over a paper or gold-tone filter basket into a glass or thermal carafe.',
    pros: [
      '100% hands-off: measure coffee, add water, press a button, and walk away',
      'Brews 8 to 12 cups at once while you get dressed or make breakfast',
      'Thermal carafes keep coffee warm for hours without scorching'
    ],
    cons: [
      'Budget grocery-store machines often brew with water under 195°F, causing sourness',
      'Cheap showerheads spurt water in the center, leaving outer grounds dry',
      'Lacks recipe nuance unless using a certified SCA-standard brewer (like Moccamaster or Breville)'
    ]
  },
  {
    id: 'espresso',
    name: 'Home Espresso Machine',
    tagline: 'The Ultimate Barista Craft',
    difficulty: 'Advanced',
    difficultyColor: 'bg-purple-100 text-purple-800 border-purple-200',
    flavorProfile: 'Thick, concentrated, complex, crowned with golden crema.',
    time: '25 – 30 Seconds',
    ratio: '1:2 (e.g. 18g coffee to 36g espresso)',
    grind: 'Very Fine (powdered soft sand)',
    bestFor: 'Espresso enthusiasts and hobbyists who love dialing in precision equipment.',
    description: 'A high-pressure electric pump forces 9 bars of 200°F water through a finely ground, densely compacted puck of coffee in 25–30 seconds.',
    pros: [
      'Authentic cafe-quality straight shots and velvety steamed microfoam milk drinks',
      'Rich, layered flavor complexity with thick golden crema',
      'Extremely rewarding hobby for precision enthusiasts'
    ],
    cons: [
      'High price of entry: requires an espresso-capable burr grinder and machine ($400–$2,000+)',
      'Steepest learning curve: requires precise puck distribution, tamping, and scale measurements',
      'Requires regular descaling, backflushing, and maintenance'
    ]
  }
];

export default function CoffeeNoobGuide({ onOpenWaterLab, onSelectMethodToBrew }) {
  const [activeTab, setActiveTab] = useState('pillars');
  const [selectedMethodId, setSelectedMethodId] = useState('french_press');

  const selectedMethod = NOOB_BREW_METHODS.find(m => m.id === selectedMethodId) || NOOB_BREW_METHODS[0];

  return (
    <section id="coffee-noob-section" className="space-y-8 animate-fade-in scroll-mt-20">
      {/* 1. Header Banner */}
      <div className="p-7 sm:p-9 md:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFEB] border-2 border-[#ECD4BD] shadow-elevated relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] font-sans font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Coffee Noob • Beginner's Field Guide</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14110F] leading-tight">
            How to brew the perfect cup, with zero snobbery.
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
            Welcome! If you're tired of bitter, burnt, or watery morning coffee and want to start making genuinely delicious cups at home, you're in the right place. You don't need a $2,000 machine or a chemistry degree. Here is everything that actually matters, in plain English.
          </p>

          {/* Quick Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('pillars')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                activeTab === 'pillars'
                  ? 'bg-[#2A2421] text-white shadow-sm'
                  : 'bg-white text-[#5C524B] hover:bg-[#FAF0E6] border border-[#ECE6DC]'
              }`}
            >
              1. The 5 Golden Rules
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('methods')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                activeTab === 'methods'
                  ? 'bg-[#2A2421] text-white shadow-sm'
                  : 'bg-white text-[#5C524B] hover:bg-[#FAF0E6] border border-[#ECE6DC]'
              }`}
            >
              2. Brew Methods (Pros & Cons)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('water')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                activeTab === 'water'
                  ? 'bg-[#2A2421] text-white shadow-sm'
                  : 'bg-white text-[#5C524B] hover:bg-[#FAF0E6] border border-[#ECE6DC]'
              }`}
            >
              3. The Truth About Water
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-[#2A2421] text-white shadow-sm'
                  : 'bg-white text-[#5C524B] hover:bg-[#FAF0E6] border border-[#ECE6DC]'
              }`}
            >
              4. Tomorrow Morning Checklist
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: THE 5 GOLDEN RULES (What Makes a Good Cup Important)               */}
      {/* ========================================================================= */}
      {activeTab === 'pillars' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
            <div>
              <span className="text-xs font-sans font-bold text-[#A25A24] uppercase tracking-wider">Pillars of Extraction</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                The 5 Things That Actually Make a Good Cup
              </h3>
            </div>
            <span className="text-xs font-sans text-[#766A62] hidden sm:inline">
              90% of your coffee quality comes from these 5 fundamentals.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Rule 1: Fresh Whole Beans */}
            <div className="p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-sans font-semibold border border-emerald-200">
                  Most Important
                </span>
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                Fresh Whole Beans (Never Stale Pre-Ground)
              </h4>
              <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                Coffee beans are food. The moment beans are ground, their cellular walls shatter, and more than 60% of their delicate floral and fruit aromas oxidize and evaporate within <strong>15 minutes</strong>.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-xs text-[#5C524B] space-y-1.5 font-sans">
                <p className="font-semibold text-[#14110F] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F663C]" />
                  <span>The Noob Rule: Check the "Roasted On" Date</span>
                </p>
                <p>
                  Avoid grocery bags with vague "Best By" dates six months away. Look for bags stamped with a <strong>"Roasted On"</strong> date within the last <strong>7 to 30 days</strong>. That is when coffee is at its sweet, vibrant peak.
                </p>
              </div>
            </div>

            {/* Rule 2: Burr Grinder */}
            <div className="p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-sans font-semibold border border-amber-200">
                  Game-Changing Gear
                </span>
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                A Burr Grinder (Ditch the Whirling Blade)
              </h4>
              <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                Spinning blade choppers smash beans unevenly into giant boulders and micro-dust. When hot water hits this mess, the dust over-extracts (tasting bitter & ashy) while boulders under-extract (tasting sour & grassy) in the exact same cup.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-xs text-[#5C524B] space-y-1.5 font-sans">
                <p className="font-semibold text-[#14110F] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F663C]" />
                  <span>The Noob Rule: Conical Burrs Crush Uniformly</span>
                </p>
                <p>
                  A burr grinder passes beans between two rotating textured plates, grinding every particle to the exact same uniform size. A $40–$60 manual burr grinder (like Timemore) beats a $300 coffee maker every day.
                </p>
              </div>
            </div>

            {/* Rule 3: The Golden Ratio */}
            <div className="p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-sans font-semibold border border-blue-200">
                  Instant Consistency
                </span>
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                The Golden Ratio (Weigh in Grams, Don't Guess with Spoons)
              </h4>
              <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                Coffee density changes drastically by roast. A scoop of dark roast weighs much less than a scoop of dense light roast! Measuring with random spoons guarantees unpredictable, erratic coffee every morning.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-xs text-[#5C524B] space-y-1.5 font-sans">
                <p className="font-semibold text-[#14110F] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#A25A24]" />
                  <span>The Magic Ratio: 1:16 (1g Coffee per 16g Water)</span>
                </p>
                <p>
                  Put your mug on a simple $12 kitchen scale. <strong>18 grams of coffee + 300 grams (mL) of water</strong> makes one delicious, perfectly balanced morning mug.
                </p>
              </div>
            </div>

            {/* Rule 4: Water Temperature */}
            <div className="p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  4
                </span>
                <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 text-[11px] font-sans font-semibold border border-orange-200">
                  Thermal Control
                </span>
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                Water Temperature (The 195°F – 205°F Sweet Spot)
              </h4>
              <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                Water too cool (under 195°F / 90°C) cannot dissolve the sweet caramelized sugars in coffee, resulting in weak, sour cups. Rolling boiling water (212°F / 100°C) can scorch darker roasts and pull out bitter wood fibers.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-xs text-[#5C524B] space-y-1.5 font-sans">
                <p className="font-semibold text-[#14110F] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#A25A24]" />
                  <span>The Noob Rule: The 30-Second Rest</span>
                </p>
                <p>
                  No thermometer? Bring your kettle to a full boil, take it off the heat, and wait <strong>30 to 45 seconds</strong>. The water naturally drops to the ideal 200°F extraction range.
                </p>
              </div>
            </div>

            {/* Rule 5: The Bloom */}
            <div className="p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  5
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-sans font-semibold border border-rose-200">
                  Pro Technique
                </span>
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                The Magic "Bloom" (Why We Wet the Grounds First)
              </h4>
              <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                When coffee beans roast, carbon dioxide gas (CO2) gets trapped inside their cellular pockets. If you dump all your hot water on dry coffee at once, the escaping gas bubbles push the water away, preventing it from touching the coffee bed.
              </p>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-[#5C524B]">
                <div>
                  <strong className="text-[#14110F] block mb-1">Step 1: Pour 2x Weight</strong>
                  Pour double the dry coffee weight in water (e.g. 40g water for a 20g dose) gently over all grounds.
                </div>
                <div>
                  <strong className="text-[#14110F] block mb-1">Step 2: Watch it Puff</strong>
                  Watch the coffee bed puff up like a chocolate muffin as trapped CO2 gas escapes.
                </div>
                <div>
                  <strong className="text-[#14110F] block mb-1">Step 3: Wait 30–45s</strong>
                  Wait 30 to 45 seconds. Now the coffee is de-gassed and ready to surrender its sweet sugars smoothly.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BREW METHODS MATCHMAKER (Brief Description, Pros & Cons)            */}
      {/* ========================================================================= */}
      {activeTab === 'methods' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECE6DC] pb-3 gap-2">
            <div>
              <span className="text-xs font-sans font-bold text-[#A25A24] uppercase tracking-wider">Brew Method Guide</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                Pick Your Brewing Weapon: Pros & Cons
              </h3>
            </div>
            <span className="text-xs font-sans text-[#766A62]">
              Click any brewer below to inspect its detailed breakdown.
            </span>
          </div>

          {/* Quick Method Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {NOOB_BREW_METHODS.map((method) => {
              const isSelected = selectedMethodId === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethodId(method.id)}
                  className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#14110F] text-white border-[#14110F] shadow-sm'
                      : 'bg-white text-[#5C524B] hover:bg-[#FAF7F2] border-[#ECE6DC]'
                  }`}
                >
                  {method.name}
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Brewer Spotlight Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#ECD4BD] shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE6DC] pb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                    {selectedMethod.name}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold border ${selectedMethod.difficultyColor}`}>
                    {selectedMethod.difficulty}
                  </span>
                </div>
                <p className="font-sans text-sm text-[#A25A24] font-semibold">
                  "{selectedMethod.tagline}"
                </p>
              </div>

              {/* Quick Specs Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#2A2421]">
                  Ratio: <strong>{selectedMethod.ratio}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#2A2421]">
                  Time: <strong>{selectedMethod.time}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#2A2421]">
                  Grind: <strong>{selectedMethod.grind}</strong>
                </span>
              </div>
            </div>

            <p className="font-sans text-base text-[#5C524B] leading-relaxed">
              {selectedMethod.description}
            </p>

            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#ECD4BD] text-xs font-sans text-[#5C524B] space-y-1">
              <span className="font-bold text-[#14110F] uppercase tracking-wider block">Flavor Profile & Best Beans:</span>
              <p><strong>Flavor:</strong> {selectedMethod.flavorProfile}</p>
              <p><strong>Recommended For:</strong> {selectedMethod.bestFor}</p>
            </div>

            {/* Pros and Cons Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Pros */}
              <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
                <div className="flex items-center gap-2 text-[#166534] font-sans font-bold text-sm">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>The Pros (Why you'll love it)</span>
                </div>
                <ul className="space-y-2 text-xs font-sans text-[#14532D]">
                  {selectedMethod.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-5 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] space-y-3">
                <div className="flex items-center gap-2 text-[#9F1239] font-sans font-bold text-sm">
                  <ThumbsDown className="w-4 h-4 text-rose-600" />
                  <span>The Cons (What to watch out for)</span>
                </div>
                <ul className="space-y-2 text-xs font-sans text-[#881337]">
                  {selectedMethod.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            {onSelectMethodToBrew && (
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onSelectMethodToBrew(selectedMethod.id)}
                  className="py-3 px-6 rounded-xl bg-[#2A2421] hover:bg-[#14110F] text-white font-sans font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <span>Open Guided Brew Timer for {selectedMethod.name}</span>
                  <ArrowRight className="w-4 h-4 text-[#D69550]" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: THE TRUTH ABOUT WATER (The Overlooked 98%)                          */}
      {/* ========================================================================= */}
      {activeTab === 'water' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
            <div>
              <span className="text-xs font-sans font-bold text-[#A25A24] uppercase tracking-wider">Water Chemistry Demystified</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                Why Water is 98% of Your Cup (And How to Fix It)
              </h3>
            </div>
            {onOpenWaterLab && (
              <button
                type="button"
                onClick={onOpenWaterLab}
                className="text-xs font-sans font-semibold text-[#A25A24] hover:underline hidden sm:inline"
              >
                Launch Advanced Mineral Lab →
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ECE6DC] shadow-card space-y-6">
            <p className="font-sans text-base text-[#5C524B] leading-relaxed">
              When you drink a cup of coffee, you are drinking <strong>98.5% water</strong> and only 1.5% dissolved coffee solids. If you take world-class $40 single-origin gesha beans and brew them with harsh municipal tap water, your coffee will taste flat, chalky, or chemically bitter.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Chemistry 1: The Flavor Magnets */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  🧲
                </div>
                <h4 className="font-editorial text-lg font-bold text-[#14110F]">
                  Minerals = Flavor Magnets
                </h4>
                <p className="font-sans text-xs text-[#5C524B] leading-relaxed">
                  Pure distilled water with zero minerals makes surprisingly terrible, empty coffee! Minerals like <strong>Magnesium</strong> and <strong>Calcium</strong> act like microscopic magnets that latch onto sweetness, fruit acids, and aromatics to pull them out of the bean.
                </p>
              </div>

              {/* Chemistry 2: The Acid Buffer */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  🛡️
                </div>
                <h4 className="font-editorial text-lg font-bold text-[#14110F]">
                  Alkalinity = The Acid Sponge
                </h4>
                <p className="font-sans text-xs text-[#5C524B] leading-relaxed">
                  Bicarbonate buffer acts like a sponge. If you have <strong>too little buffer</strong>, coffee tastes unpleasantly sharp and vinegar-sour. If you have <strong>too much buffer</strong> (hard tap water), it kills all brightness, leaving dull, muddy coffee.
                </p>
              </div>

              {/* Chemistry 3: Chlorine */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm">
                  🚫
                </div>
                <h4 className="font-editorial text-lg font-bold text-[#14110F]">
                  Chlorine Destroys Aromatics
                </h4>
                <p className="font-sans text-xs text-[#5C524B] leading-relaxed">
                  Municipalities add chlorine to tap water to kill bacteria. When boiled, chlorine reacts with hot coffee compounds to create a distinctive medicine-like, astringent off-flavor.
                </p>
              </div>
            </div>

            {/* 3 Simple Rules for Beginners */}
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#ECD4BD] space-y-4">
              <h4 className="font-editorial text-xl font-bold text-[#14110F] flex items-center gap-2">
                <Droplets className="w-5 h-5 text-[#C88A4B]" />
                <span>The 3 No-Nonsense Water Rules for Beginners</span>
              </h4>

              <div className="space-y-3 font-sans text-sm text-[#5C524B]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#14110F] block">The Sip Test:</strong>
                    If you wouldn't enjoy a tall glass of your cold tap water, never brew coffee with it.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#14110F] block">Use an Activated Carbon Filter:</strong>
                    A simple Brita pitcher, PUR faucet attachment, or your refrigerator filter strips out chlorine and heavy sediments instantly.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#14110F] block">If You Have Hard Water (Kettle Limescale):</strong>
                    If white chalk coats your kettle, your water is too hard. Mix 50% distilled water with 50% filtered tap water, or buy a gallon of spring water (like Crystal Geyser) for a night-and-day taste improvement.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TOMORROW MORNING CHECKLIST (Actionable 3-Step Wins)                 */}
      {/* ========================================================================= */}
      {activeTab === 'checklist' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
            <div>
              <span className="text-xs font-sans font-bold text-[#A25A24] uppercase tracking-wider">Action Plan</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                Your "First Win" Tomorrow Morning
              </h3>
            </div>
            <span className="text-xs font-sans text-[#766A62] hidden sm:inline">
              Three simple steps to immediately upgrade your coffee tomorrow.
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ECE6DC] shadow-card space-y-6">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg font-bold text-[#14110F]">
                      Buy 1 bag of whole beans with a visible roast date
                    </h4>
                    <p className="font-sans text-xs text-[#5C524B] mt-0.5">
                      Visit a local cafe or check your grocery shelf for a bag stamped roasted within the last 10–25 days. Choose a medium roast for balanced sweetness and chocolate notes.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#A25A24] text-xs font-sans font-semibold border border-[#ECD4BD] shrink-0">
                  Flavor Upgrade: +50%
                </span>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg font-bold text-[#14110F]">
                      Weigh 18g coffee and 300g water (1:16.6)
                    </h4>
                    <p className="font-sans text-xs text-[#5C524B] mt-0.5">
                      Put your cup or brewer on a kitchen scale, hit tare (zero), and measure exactly 18g coffee. Pour 300g water total. Say goodbye to bitter accidental overdosing.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#A25A24] text-xs font-sans font-semibold border border-[#ECD4BD] shrink-0">
                  Consistency: 100%
                </span>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg font-bold text-[#14110F]">
                      Let boiling water rest for 30 seconds & bloom for 40s
                    </h4>
                    <p className="font-sans text-xs text-[#5C524B] mt-0.5">
                      When your kettle boils, count to 30 before pouring. Pour about 40g water first, wait 40 seconds to let CO2 gas bubble off, then pour the remaining water steadily.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#A25A24] text-xs font-sans font-semibold border border-[#ECD4BD] shrink-0">
                  Sweetness: Maximum
                </span>
              </div>
            </div>

            {/* Beginner Flavor Diagnostic Table */}
            <div className="pt-4 border-t border-[#ECE6DC] space-y-3">
              <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                Quick Diagnostic: How Does Your Cup Taste?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Tastes Sour, Salty, or Sharp?</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    <strong>Cause: Under-extraction.</strong> Water didn't extract enough sweet sugars.
                  </p>
                  <p className="text-xs text-amber-900 font-semibold">
                    👉 Fix: Grind one click finer, or brew with hotter water.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <AlertCircle className="w-4 h-4 text-stone-700" />
                    <span>Tastes Bitter, Dry, or Ashy?</span>
                  </div>
                  <p className="text-xs text-stone-800">
                    <strong>Cause: Over-extraction.</strong> Water extracted harsh, woody tannins.
                  </p>
                  <p className="text-xs text-stone-900 font-semibold">
                    👉 Fix: Grind one click coarser, or brew with slightly cooler water.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
