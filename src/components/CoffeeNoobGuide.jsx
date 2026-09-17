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
  Award,
  ExternalLink,
  Star,
  ShoppingBag
} from 'lucide-react';
import { PRODUCTS_DATA, AMAZON_AFFILIATE_TAG } from '../data/productsData';
import { trackEvent } from '../utils/analytics';
import { getAssetUrl } from '../utils/assetUrl';

// Map of brew methods to authentic Amazon affiliate equipment
const METHOD_PRODUCT_MAP = {
  french_press: 'bodum_french_press',
  aeropress: 'aeropress_original',
  pour_over: 'v60_dripper_kit',
  chemex: 'chemex_8cup',
  moka_pot: 'bialetti_moka_express',
  cold_brew: 'bodum_french_press',
  drip_brewer: 'baratza_encore',
  espresso: 'lavazza_super_crema'
};

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

const NOOB_TABS = [
  { id: 'pillars', label: '1. The 5 Golden Rules', icon: Sparkles },
  { id: 'methods', label: '2. Brew Methods (Pros & Cons)', icon: Coffee },
  { id: 'water', label: '3. The Truth About Water', icon: Droplets },
  { id: 'checklist', label: '4. Tomorrow Morning Checklist', icon: CheckCircle2 },
  { id: 'gear', label: '5. Recommended Gear', icon: ShoppingBag }
];

/**
 * Reusable Product Recommendation Callout with Direct Amazon ASIN Link
 */
function NoobProductCallout({ productId, label = "Recommended Gear", whyNoobsLoveIt }) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return null;

  return (
    <div className="mt-3 p-4 sm:p-4.5 rounded-2xl bg-[#FFFDF9] border border-[#ECD4BD] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs hover:border-[#D69550] transition-colors">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#ECE6DC] shrink-0 p-1 flex items-center justify-center shadow-xs">
          <img
            src={getAssetUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#A25A24] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>{label}</span>
          </div>
          <h5 className="font-editorial text-base sm:text-lg font-bold text-[#14110F] truncate">
            {product.name}
          </h5>
          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs sm:text-sm">
            <span className="font-sans font-bold text-[#2A2421]">{product.priceRange}</span>
            <span className="text-[#ECE6DC]">•</span>
            <span className="flex items-center gap-1 text-[#A25A24] font-semibold text-xs sm:text-sm">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{product.rating}</span>
            </span>
            {whyNoobsLoveIt && (
              <span className="text-xs sm:text-sm text-[#766A62] hidden md:inline truncate">
                • {whyNoobsLoveIt}
              </span>
            )}
          </div>
        </div>
      </div>

      <a
        href={product.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent('amazon_click', {
            product_id: product.id,
            product_name: product.name,
            source: 'coffee_noob_guide'
          });
        }}
        className="px-4 py-2.5 rounded-xl bg-[#2A2421] hover:bg-[#14110F] text-white text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition active:scale-95 cursor-pointer self-stretch sm:self-auto"
      >
        <span>View on Amazon</span>
        <ExternalLink className="w-4 h-4 text-[#D69550]" />
      </a>
    </div>
  );
}

export default function CoffeeNoobGuide({ onOpenWaterLab, onSelectMethodToBrew }) {
  const [activeTab, setActiveTab] = useState('pillars');
  const [selectedMethodId, setSelectedMethodId] = useState('french_press');

  const selectedMethod = NOOB_BREW_METHODS.find(m => m.id === selectedMethodId) || NOOB_BREW_METHODS[0];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setTimeout(() => {
      const el = document.getElementById('noob-tab-content');
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section id="coffee-noob-section" className="space-y-8 animate-fade-in scroll-mt-20 relative z-10">
      {/* 1. Header Banner */}
      <div className="p-7 sm:p-9 md:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFEB] border-2 border-[#ECD4BD] shadow-elevated relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Mission & Intro */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] font-sans font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-[#C88A4B]" />
              <span>Coffee Noob • Beginner's Field Guide</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14110F] leading-tight">
              How to brew the perfect cup, with zero snobbery.
            </h2>

            <p className="font-sans text-base sm:text-lg md:text-xl text-[#5C524B] leading-relaxed">
              Welcome! If you're tired of bitter, burnt, or watery morning coffee and want to start making genuinely delicious cups at home, you're in the right place. You don't need a $2,000 machine or a chemistry degree. Here is everything that actually matters, in plain English.
            </p>

            {/* Quick Extraction Metrics */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm font-sans font-semibold text-[#5C524B]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ECE6DC] text-[#2A2421] shadow-2xs">
                ☕ Whole Beans Only
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ECE6DC] text-[#2A2421] shadow-2xs">
                ⚖️ 1:16 Golden Ratio
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ECE6DC] text-[#2A2421] shadow-2xs">
                🌡️ 200°F Sweet Spot
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ECE6DC] text-[#2A2421] shadow-2xs">
                ⏱️ 3–4 Min Brews
              </span>
            </div>
          </div>

          {/* Right Column: "First Cup Fast Start" Reference Card (Fills the large empty space) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-[#ECD4BD] shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
                <span className="font-editorial text-lg sm:text-xl font-bold text-[#14110F] flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#C88A4B]" />
                  <span>The 3-Minute Quick Formula</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#A25A24] text-xs font-sans font-bold">
                  Rule of Thumb
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-sans text-[#5C524B]">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-[#14110F]">Measure with a Scale:</strong> 18g coffee to 300g water fills a standard 10oz mug with balanced flavor.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-[#14110F]">Wait 30s Off the Boil:</strong> Rolling boiling water is ~212°F; resting 30 seconds lands right in the 200°F sweet spot.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-[#14110F]">Bloom for 40 Seconds:</strong> Pour double the coffee weight (36g water), watch it puff, then pour steadily.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleTabChange('methods')}
                className="w-full py-3 px-4 rounded-xl bg-[#2A2421] hover:bg-[#14110F] text-white text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <span>Compare All 8 Brew Methods Below</span>
                <ChevronRight className="w-4 h-4 text-[#D69550]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs Bar (Prominent, High-Contrast, Always Shows Selected Content) */}
      <div id="noob-tab-navigation" className="p-2.5 sm:p-3 rounded-2xl bg-white border border-[#ECE6DC] shadow-sm relative z-10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {NOOB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`py-3 px-4 sm:px-5 rounded-xl font-sans font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  isTabActive
                    ? 'bg-[#14110F] text-white shadow-md ring-2 ring-[#C88A4B]/40'
                    : 'bg-[#FAF7F2] text-[#5C524B] hover:text-[#14110F] hover:bg-[#FAF0E6] border border-[#ECE6DC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isTabActive ? 'text-[#E8AF72]' : 'text-[#C88A4B]'}`} />
                <span>{tab.label}</span>
                {isTabActive && (
                  <span className="w-2 h-2 rounded-full bg-[#E8AF72] animate-pulse ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Tab Content Area */}
      <div id="noob-tab-content" className="scroll-mt-24 relative z-10">
      {/* ========================================================================= */}
      {/* TAB 1: THE 5 GOLDEN RULES (What Makes a Good Cup Important)               */}
      {/* ========================================================================= */}
      {activeTab === 'pillars' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECE6DC] pb-3 gap-1.5">
            <div>
              <span className="text-sm font-sans font-bold text-[#A25A24] uppercase tracking-wider">Pillars of Extraction</span>
              <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14110F]">
                The 5 Things That Actually Make a Good Cup
              </h3>
            </div>
            <span className="text-sm font-sans text-[#766A62]">
              90% of your coffee quality comes from these 5 fundamentals.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule 1: Fresh Whole Beans */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                    1
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-sans font-bold border border-emerald-200">
                    Most Important
                  </span>
                </div>
                <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                  Fresh Whole Beans (Never Stale Pre-Ground)
                </h4>
                <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
                  Coffee beans are food. The moment beans are ground, their cellular walls shatter, and more than 60% of their delicate floral and fruit aromas oxidize and evaporate within <strong>15 minutes</strong>.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-sm sm:text-base text-[#5C524B] space-y-2 font-sans leading-relaxed">
                  <p className="font-bold text-[#14110F] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2F663C]" />
                    <span>The Noob Rule: Check the "Roasted On" Date</span>
                  </p>
                  <p>
                    Avoid grocery bags with vague "Best By" dates six months away. Look for bags stamped with a <strong>"Roasted On"</strong> date within the last <strong>7 to 30 days</strong>. That is when coffee is at its sweet, vibrant peak.
                  </p>
                </div>
              </div>

              <NoobProductCallout
                productId="stumptown_hair_bender"
                label="Recommended Starter Whole Bean"
                whyNoobsLoveIt="Balanced sweet cherry, dark chocolate & toffee notes"
              />
            </div>

            {/* Rule 2: Burr Grinder */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                    2
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-sans font-bold border border-amber-200">
                    Game-Changing Gear
                  </span>
                </div>
                <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                  A Burr Grinder (Ditch the Whirling Blade)
                </h4>
                <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
                  Spinning blade choppers smash beans unevenly into giant boulders and micro-dust. When hot water hits this mess, the dust over-extracts (tasting bitter & ashy) while boulders under-extract (tasting sour & grassy) in the exact same cup.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-sm sm:text-base text-[#5C524B] space-y-2 font-sans leading-relaxed">
                  <p className="font-bold text-[#14110F] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2F663C]" />
                    <span>The Noob Rule: Conical Burrs Crush Uniformly</span>
                  </p>
                  <p>
                    A burr grinder passes beans between two rotating textured plates, grinding every particle to the exact same uniform size. A burr grinder will upgrade your coffee quality more than any other tool.
                  </p>
                </div>
              </div>

              <NoobProductCallout
                productId="baratza_encore"
                label="Recommended Burr Grinder"
                whyNoobsLoveIt="European conical alloy burrs, 40 precision grind settings"
              />
            </div>

            {/* Rule 3: The Golden Ratio */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                    3
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-sans font-bold border border-blue-200">
                    Instant Consistency
                  </span>
                </div>
                <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                  The Golden Ratio (Weigh in Grams, Don't Guess with Spoons)
                </h4>
                <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
                  Coffee density changes drastically by roast. A scoop of dark roast weighs much less than a scoop of dense light roast! Measuring with random spoons guarantees unpredictable, erratic coffee every morning.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-sm sm:text-base text-[#5C524B] space-y-2 font-sans leading-relaxed">
                  <p className="font-bold text-[#14110F] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#A25A24]" />
                    <span>The Magic Ratio: 1:16 (1g Coffee per 16g Water)</span>
                  </p>
                  <p>
                    Put your mug on a simple digital scale. <strong>18 grams of coffee + 300 grams (mL) of water</strong> makes one delicious, perfectly balanced morning mug.
                  </p>
                </div>
              </div>

              <NoobProductCallout
                productId="timemore_black_mirror"
                label="Recommended Precision Scale"
                whyNoobsLoveIt="0.1g fast accuracy sensor with automatic brew timer"
              />
            </div>

            {/* Rule 4: Water Temperature */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                    4
                  </span>
                  <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-sans font-bold border border-orange-200">
                    Thermal Control
                  </span>
                </div>
                <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                  Water Temperature (The 195°F – 205°F Sweet Spot)
                </h4>
                <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
                  Water too cool (under 195°F / 90°C) cannot dissolve the sweet caramelized sugars in coffee, resulting in weak, sour cups. Rolling boiling water (212°F / 100°C) can scorch darker roasts and pull out bitter wood fibers.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-sm sm:text-base text-[#5C524B] space-y-2 font-sans leading-relaxed">
                  <p className="font-bold text-[#14110F] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#A25A24]" />
                    <span>The Noob Rule: The 30-Second Rest</span>
                  </p>
                  <p>
                    No thermometer? Bring your kettle to a full boil, take it off the heat, and wait <strong>30 to 45 seconds</strong>. The water naturally drops to the ideal 200°F extraction range.
                  </p>
                </div>
              </div>

              <NoobProductCallout
                productId="fellow_stagg_ekg"
                label="Recommended Gooseneck Kettle"
                whyNoobsLoveIt="Exact 1° PID temperature hold & counterbalanced spout"
              />
            </div>

            {/* Rule 5: The Bloom */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all space-y-3.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                  5
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-sans font-bold border border-rose-200">
                  Pro Technique
                </span>
              </div>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                The Magic "Bloom" (Why We Wet the Grounds First)
              </h4>
              <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
                When coffee beans roast, carbon dioxide gas (CO2) gets trapped inside their cellular pockets. If you dump all your hot water on dry coffee at once, the escaping gas bubbles push the water away, preventing it from touching the coffee bed.
              </p>
              <div className="p-4 sm:p-5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base font-sans text-[#5C524B] leading-relaxed">
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
              <span className="text-xs sm:text-sm font-sans font-bold text-[#A25A24] uppercase tracking-wider">Brew Method Guide</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                Pick Your Brewing Weapon: Pros & Cons
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-sans text-[#766A62]">
              Click any brewer below to inspect its breakdown and gear recommendations.
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
                  className={`px-4 py-2.5 rounded-xl font-sans text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
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
              <div className="flex items-center gap-4">
                {(() => {
                  const product = PRODUCTS_DATA.find(p => p.id === METHOD_PRODUCT_MAP[selectedMethod.id]);
                  if (!product) return null;
                  return (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#ECE6DC] shrink-0 p-1.5 flex items-center justify-center shadow-xs overflow-hidden">
                      <img
                        src={getAssetUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                })()}
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                      {selectedMethod.name}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-sans font-bold border ${selectedMethod.difficultyColor}`}>
                      {selectedMethod.difficulty}
                    </span>
                  </div>
                  <p className="font-sans text-base sm:text-lg text-[#A25A24] font-semibold">
                    "{selectedMethod.tagline}"
                  </p>
                </div>
              </div>

              {/* Quick Specs Badges */}
              <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#2A2421]">
                  Ratio: <strong>{selectedMethod.ratio}</strong>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#2A2421]">
                  Time: <strong>{selectedMethod.time}</strong>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#2A2421]">
                  Grind: <strong>{selectedMethod.grind}</strong>
                </span>
              </div>
            </div>

            <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
              {selectedMethod.description}
            </p>

            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#ECD4BD] text-sm sm:text-base font-sans text-[#5C524B] space-y-1.5">
              <span className="font-bold text-[#14110F] uppercase tracking-wider block">Flavor Profile & Best Beans:</span>
              <p><strong>Flavor:</strong> {selectedMethod.flavorProfile}</p>
              <p><strong>Recommended For:</strong> {selectedMethod.bestFor}</p>
            </div>

            {/* Pros and Cons Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Pros */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
                <div className="flex items-center gap-2 text-[#166534] font-sans font-bold text-base">
                  <ThumbsUp className="w-5 h-5 text-emerald-600" />
                  <span>The Pros (Why you'll love it)</span>
                </div>
                <ul className="space-y-2.5 text-sm font-sans text-[#14532D]">
                  {selectedMethod.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] space-y-3">
                <div className="flex items-center gap-2 text-[#9F1239] font-sans font-bold text-base">
                  <ThumbsDown className="w-5 h-5 text-rose-600" />
                  <span>The Cons (What to watch out for)</span>
                </div>
                <ul className="space-y-2.5 text-sm font-sans text-[#881337]">
                  {selectedMethod.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Hardware Callout */}
            {METHOD_PRODUCT_MAP[selectedMethod.id] && (
              <div className="pt-2">
                <span className="text-sm font-sans font-bold text-[#A25A24] uppercase tracking-wider block mb-2">
                  Tested & Recommended Equipment:
                </span>
                <NoobProductCallout
                  productId={METHOD_PRODUCT_MAP[selectedMethod.id]}
                  label={`Recommended ${selectedMethod.name}`}
                  whyNoobsLoveIt="Durable construction, proven extraction consistency, barista benchmark"
                />
                {selectedMethod.id === 'pour_over' && (
                  <NoobProductCallout
                    productId="v60_paper_filters"
                    label="Essential V60 Filters"
                    whyNoobsLoveIt="Japanese oxygen-bleached tabbed paper filters for clean cup"
                  />
                )}
              </div>
            )}

            {/* Action Bar */}
            {onSelectMethodToBrew && (
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onSelectMethodToBrew(selectedMethod.id)}
                  className="py-3.5 px-6 rounded-xl bg-[#2A2421] hover:bg-[#14110F] text-white font-sans font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-sm transition active:scale-95 cursor-pointer"
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
              <span className="text-xs sm:text-sm font-sans font-bold text-[#A25A24] uppercase tracking-wider">Water Chemistry Demystified</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                Why Water is 98% of Your Cup (And How to Fix It)
              </h3>
            </div>
            {onOpenWaterLab && (
              <button
                type="button"
                onClick={onOpenWaterLab}
                className="text-xs sm:text-sm font-sans font-semibold text-[#A25A24] hover:underline hidden sm:inline cursor-pointer"
              >
                Launch Advanced Mineral Lab →
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ECE6DC] shadow-card space-y-6">
            <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
              When you drink a cup of coffee, you are drinking <strong>98.5% water</strong> and only 1.5% dissolved coffee solids. If you take world-class $40 single-origin gesha beans and brew them with harsh municipal tap water, your coffee will taste flat, chalky, or chemically bitter.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Chemistry 1: The Flavor Magnets */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                  🧲
                </div>
                <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                  Minerals = Flavor Magnets
                </h4>
                <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                  Pure distilled water with zero minerals makes surprisingly terrible, empty coffee! Minerals like <strong>Magnesium</strong> and <strong>Calcium</strong> act like microscopic magnets that latch onto sweetness, fruit acids, and aromatics to pull them out of the bean.
                </p>
              </div>

              {/* Chemistry 2: The Acid Buffer */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                  🛡️
                </div>
                <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                  Alkalinity = The Acid Sponge
                </h4>
                <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                  Bicarbonate buffer acts like a sponge. If you have <strong>too little buffer</strong>, coffee tastes unpleasantly sharp and vinegar-sour. If you have <strong>too much buffer</strong> (hard tap water), it kills all brightness, leaving dull, muddy coffee.
                </p>
              </div>

              {/* Chemistry 3: Chlorine */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-base">
                  🚫
                </div>
                <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                  Chlorine Destroys Aromatics
                </h4>
                <p className="font-sans text-sm text-[#5C524B] leading-relaxed">
                  Municipalities add chlorine to tap water to kill bacteria. When boiled, chlorine reacts with hot coffee compounds to create a distinctive medicine-like, astringent off-flavor.
                </p>
              </div>
            </div>

            {/* 3 Simple Rules for Beginners */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFDF9] border-2 border-[#ECD4BD] space-y-5">
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F] flex items-center gap-2.5">
                <Droplets className="w-6 h-6 text-[#C88A4B]" />
                <span>The 3 No-Nonsense Water Rules for Beginners</span>
              </h4>

              <div className="space-y-4 font-sans text-base text-[#5C524B]">
                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#14110F] block">The Sip Test:</strong>
                    If you wouldn't enjoy a tall glass of your cold tap water, never brew coffee with it.
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#14110F] block">Use an Activated Carbon Filter:</strong>
                    A simple Brita pitcher, PUR faucet attachment, or your refrigerator filter strips out chlorine and heavy sediments instantly.
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#14110F] block">If You Have Hard Water (Kettle Limescale):</strong>
                    If white chalk coats your kettle, your water is too hard. Mix 50% distilled water with 50% filtered tap water, or buy a gallon of spring water (like Crystal Geyser) for a night-and-day taste improvement.
                  </div>
                </div>
              </div>
            </div>

            {/* In-Line Water Products */}
            <div className="pt-2">
              <span className="text-sm font-sans font-bold text-[#A25A24] uppercase tracking-wider block mb-2">
                Recommended Water Minerals & Precision Kettles:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NoobProductCallout
                  productId="third_wave_water"
                  label="Water Chemistry Packets"
                  whyNoobsLoveIt="Add 1 packet to a gallon of distilled water for cafe-spec minerals"
                />
                <NoobProductCallout
                  productId="fellow_stagg_ekg"
                  label="Precision Electric Gooseneck"
                  whyNoobsLoveIt="Exact 1-degree temperature control and slow counterbalanced pour"
                />
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
              <span className="text-xs sm:text-sm font-sans font-bold text-[#A25A24] uppercase tracking-wider">Action Plan</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                Your "First Win" Tomorrow Morning
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-sans text-[#766A62] hidden sm:inline">
              Three simple steps to immediately upgrade your coffee tomorrow.
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ECE6DC] shadow-card space-y-6">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-lg shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                      Buy 1 bag of whole beans with a visible roast date
                    </h4>
                    <p className="font-sans text-sm sm:text-base text-[#5C524B] mt-1 leading-relaxed">
                      Visit a local cafe or check your grocery shelf for a bag stamped roasted within the last 10–25 days. Choose a medium roast for balanced sweetness and chocolate notes.
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-white text-[#A25A24] text-xs sm:text-sm font-sans font-bold border border-[#ECD4BD] shrink-0">
                  Flavor Upgrade: +50%
                </span>
              </div>

              {/* Step 2 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-lg shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                      Weigh 18g coffee and 300g water (1:16.6)
                    </h4>
                    <p className="font-sans text-sm sm:text-base text-[#5C524B] mt-1 leading-relaxed">
                      Put your cup or brewer on a kitchen scale, hit tare (zero), and measure exactly 18g coffee. Pour 300g water total. Say goodbye to bitter accidental overdosing.
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-white text-[#A25A24] text-xs sm:text-sm font-sans font-bold border border-[#ECD4BD] shrink-0">
                  Consistency: 100%
                </span>
              </div>

              {/* Step 3 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-[#A25A24] flex items-center justify-center font-bold text-lg shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-[#14110F]">
                      Let boiling water rest for 30 seconds & bloom for 40s
                    </h4>
                    <p className="font-sans text-sm sm:text-base text-[#5C524B] mt-1 leading-relaxed">
                      When your kettle boils, count to 30 before pouring. Pour about 40g water first, wait 40 seconds to let CO2 gas bubble off, then pour the remaining water steadily.
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-white text-[#A25A24] text-xs sm:text-sm font-sans font-bold border border-[#ECD4BD] shrink-0">
                  Sweetness: Maximum
                </span>
              </div>
            </div>

            {/* Beginner Flavor Diagnostic Table */}
            <div className="pt-4 border-t border-[#ECE6DC] space-y-4">
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                Quick Diagnostic: How Does Your Cup Taste?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 font-sans">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
                    <AlertCircle className="w-5 h-5 text-amber-700" />
                    <span>Tastes Sour, Salty, or Sharp?</span>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Cause: Under-extraction.</strong> Water didn't extract enough sweet sugars.
                  </p>
                  <p className="text-sm sm:text-base text-amber-950 font-bold pt-1">
                    👉 Fix: Grind one click finer, or brew with hotter water.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-100 border border-stone-300 space-y-2 font-sans">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-base">
                    <AlertCircle className="w-5 h-5 text-stone-700" />
                    <span>Tastes Bitter, Dry, or Ashy?</span>
                  </div>
                  <p className="text-sm text-stone-800 leading-relaxed">
                    <strong>Cause: Over-extraction.</strong> Water extracted harsh, woody tannins.
                  </p>
                  <p className="text-sm sm:text-base text-stone-950 font-bold pt-1">
                    👉 Fix: Grind one click coarser, or brew with slightly cooler water.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RECOMMENDED NOOB GEAR & STARTER KITS (Amazon Affiliate Links)      */}
      {/* ========================================================================= */}
      {activeTab === 'gear' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECE6DC] pb-4 gap-3">
            <div>
              <span className="text-xs sm:text-sm font-sans font-bold text-[#A25A24] uppercase tracking-wider">Buyer's Field Guide</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                The Coffee Noob Starter Gear & Affiliate Picks
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-sans text-[#766A62]">
              Handpicked tools tested for real extraction consistency.
            </span>
          </div>

          {/* Transparent Affiliate Disclosure Banner */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#ECD4BD] flex items-start gap-3.5 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#C88A4B] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-sans text-[#5C524B] leading-relaxed">
              <strong className="text-[#14110F] block mb-0.5 font-bold">Amazon Associate Disclosure & Transparency:</strong>
              As an Amazon Associate, TheBrew.App earns from qualifying purchases made through these links at zero extra cost to you. We do not accept paid manufacturer placements — every item here is independently selected because it genuinely improves home brewing.
            </div>
          </div>

          {/* Two Clear Starter Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Path A */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#ECD4BD] shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-sans font-bold border border-emerald-200">
                  Option 1: The Budget Sweet Spot
                </span>
                <span className="font-sans font-bold text-sm sm:text-base text-[#A25A24]">~$75 – $95 Total</span>
              </div>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                The "Zero-Stress" Starter Kit
              </h4>
              <p className="font-sans text-sm sm:text-base text-[#5C524B] leading-relaxed">
                Maximum flavor upgrade per dollar. An immersion brewer that is virtually impossible to mess up, paired with a precision scale and fresh whole beans.
              </p>
              <div className="space-y-3 pt-2">
                <NoobProductCallout
                  productId="aeropress_original"
                  label="The Brewer"
                  whyNoobsLoveIt="Smooth, zero-bitterness cup in 60 seconds"
                />
                <NoobProductCallout
                  productId="timemore_black_mirror"
                  label="The Scale"
                  whyNoobsLoveIt="0.1g accuracy with auto-timer"
                />
                <NoobProductCallout
                  productId="stumptown_hair_bender"
                  label="The Beans"
                  whyNoobsLoveIt="Rich chocolate, sweet cherry & toffee"
                />
              </div>
            </div>

            {/* Path B */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#ECD4BD] shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-sans font-bold border border-amber-200">
                  Option 2: The Enthusiast Path
                </span>
                <span className="font-sans font-bold text-sm sm:text-base text-[#A25A24]">~$220 – $280 Total</span>
              </div>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                The "Home Barista Lab" Kit
              </h4>
              <p className="font-sans text-sm sm:text-base text-[#5C524B] leading-relaxed">
                The exact core kit used by specialty cafe baristas at home. A conical burr grinder for uniform particle distribution and the clarity champion V60.
              </p>
              <div className="space-y-3 pt-2">
                <NoobProductCallout
                  productId="baratza_encore"
                  label="The Burr Grinder"
                  whyNoobsLoveIt="40 precision grind settings"
                />
                <NoobProductCallout
                  productId="v60_dripper_kit"
                  label="The Pour-Over"
                  whyNoobsLoveIt="Iconic 60° spiral cone"
                />
                <NoobProductCallout
                  productId="third_wave_water"
                  label="The Water Minerals"
                  whyNoobsLoveIt="SCA-certified magnesium & calcium"
                />
              </div>
            </div>
          </div>

          {/* Full Catalog of Tested Products */}
          <div className="space-y-5 pt-4">
            <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
              All Recommended Equipment by Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS_DATA.filter(p => p.track === 'coffee').map(product => (
                <div key={product.id} className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-subtle hover:border-[#D69550] transition-all flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2] p-2 flex items-center justify-center border border-[#ECE6DC]">
                      <img
                        src={getAssetUrl(product.image)}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#FAF0E6] text-[#A25A24] text-xs font-sans font-bold uppercase tracking-wider inline-block mb-1.5">
                          {product.badge}
                        </span>
                      )}
                      <h5 className="font-editorial text-lg font-bold text-[#14110F] line-clamp-2">
                        {product.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1.5 text-sm">
                        <span className="font-sans font-bold text-[#2A2421]">{product.priceRange}</span>
                        <span className="text-[#ECE6DC]">•</span>
                        <span className="flex items-center gap-1 text-[#A25A24] font-semibold text-xs sm:text-sm">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span>{product.rating}</span>
                          <span className="text-[#766A62] font-normal">({product.reviewsCount.toLocaleString()})</span>
                        </span>
                      </div>
                    </div>
                    <p className="font-sans text-sm text-[#5C524B] line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#ECE6DC]">
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent('amazon_click', {
                          product_id: product.id,
                          product_name: product.name,
                          source: 'coffee_noob_catalog'
                        });
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-[#2A2421] hover:bg-[#14110F] text-white text-sm font-sans font-bold flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      <span>Check Price on Amazon</span>
                      <ExternalLink className="w-4 h-4 text-[#D69550]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
