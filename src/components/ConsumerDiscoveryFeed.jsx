import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  Coffee, 
  MapPin, 
  ArrowUpRight,
  Scale,
  Clock,
  Gauge,
  Thermometer,
  Flame,
  Check,
  HelpCircle,
  Compass,
  Camera
} from 'lucide-react';
import BeanCard from './BeanCard';
import TastingNoteBadge from './TastingNoteBadge';
import { CURATED_SINGLE_ORIGINS } from '../data/coffeeSensoryData';
import { SHOWCASE_ROASTERS } from '../data/roasterShowcaseData';
import { getAssetUrl } from '../utils/assetUrl';

// Friendly coffee flavor filter options
const FRIENDLY_FLAVORS = [
  'All Coffees',
  'Fruity & Bright',
  'Sweet & Chocolatey',
  'Floral & Tea-like',
  'Smooth & Balanced'
];

// Interactive Brewer Profiles for the Quick-Start Hero Calculator
const QUICK_BREWERS = [
  {
    id: 'pour_over',
    name: 'Pour Over',
    fullName: 'Hario V60 Pour Over',
    heroImage: '/pour_over_hero.jpg',
    ratio: 16.0,
    grind: 'Medium-Fine',
    grindTexture: 'Like table salt',
    tempF: 205,
    tempC: 96,
    time: '3m 30s',
    recommendedOrigin: 'Ethiopia or Colombia for crisp fruit & floral sweetness',
    description: 'Clean, articulate, and vibrant. Highlights single-origin florals and fruit.'
  },
  {
    id: 'french_press',
    name: 'French Press',
    fullName: 'Classic French Press',
    heroImage: '/french_press.jpg',
    ratio: 15.0,
    grind: 'Coarse',
    grindTexture: 'Like coarse sea salt',
    tempF: 200,
    tempC: 93,
    time: '4m 00s',
    recommendedOrigin: 'Guatemala, Brazil, or Sumatra for rich, heavy chocolate body',
    description: 'Immersion brewing gives a velvety, comforting cup with full body.'
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    fullName: 'AeroPress Inverted',
    heroImage: '/aeropress_hero.jpg',
    ratio: 14.0,
    grind: 'Fine-Medium',
    grindTexture: 'Slightly finer than sand',
    tempF: 195,
    tempC: 90,
    time: '2m 00s',
    recommendedOrigin: 'Kenya, Rwanda, or Naturals for sweet, juicy, punchy cups',
    description: 'Fast, smooth, and forgiving. Extracts big flavor with minimal bitterness.'
  },
  {
    id: 'chemex',
    name: 'Chemex',
    fullName: 'Chemex 6-Cup Glass',
    heroImage: '/chemex_hero.jpg',
    ratio: 16.5,
    grind: 'Medium-Coarse',
    grindTexture: 'Like kosher salt',
    tempF: 205,
    tempC: 96,
    time: '4m 30s',
    recommendedOrigin: 'Washed Central & South Americans for crystal sweetness',
    description: 'Extra-thick bonded filters create an ultra-clean, tea-like cup.'
  },
  {
    id: 'moka_pot',
    name: 'Moka Pot',
    fullName: 'Stovetop Moka Express',
    heroImage: '/moka_pot_hero.jpg',
    ratio: 10.0,
    grind: 'Fine',
    grindTexture: 'Finer than sand, coarser than espresso',
    tempF: 200,
    tempC: 93,
    time: '3m 00s',
    recommendedOrigin: 'Medium & dark roasts for rich espresso-style intensity',
    description: 'Stovetop steam pressure creates a thick, syrupy morning wake-up cup.'
  },
  {
    id: 'cold_brew',
    name: 'Cold Brew',
    fullName: 'Smooth Cold Brew Pitcher',
    heroImage: '/cold_brew_hero.jpg',
    ratio: 8.0,
    grind: 'Extra Coarse',
    grindTexture: 'Like raw sugar crystals',
    tempF: 68,
    tempC: 20,
    time: '16 hours',
    recommendedOrigin: 'Chocolatey blends or naturally sweet Latin Americans',
    description: 'Slow cold immersion yielding silky, sweet coffee with almost zero acid.'
  }
];

export default function ConsumerDiscoveryFeed({
  onSelectBeanToBrew,
  onLaunchDirectBrew,
  onNavigateToRoaster,
  onOpenLocator,
  onStartBrewStation,
  onOpenScanner,
  activeBrewerId,
  onSelectBrewerId
}) {
  // Quick Calculator State
  const [selectedBrewerId, setSelectedBrewerId] = useState(activeBrewerId || 'pour_over');

  // Keep selected brewer in sync if parent changes activeMethod
  useEffect(() => {
    if (activeBrewerId) {
      const mappedId = (activeBrewerId === 'classic_pour_over') ? 'pour_over' : activeBrewerId;
      if (QUICK_BREWERS.some(b => b.id === mappedId)) {
        setSelectedBrewerId(mappedId);
      }
    }
  }, [activeBrewerId]);

  const [selectedWaterGrams, setSelectedWaterGrams] = useState(300);
  const [selectedFilter, setSelectedFilter] = useState('All Coffees');

  const activeBrewer = QUICK_BREWERS.find(b => b.id === selectedBrewerId) || QUICK_BREWERS[0];
  const calculatedCoffeeGrams = (selectedWaterGrams / activeBrewer.ratio).toFixed(1);

  // Filter beans by flavor note
  const filteredBeans = CURATED_SINGLE_ORIGINS.filter(b => {
    if (selectedFilter === 'All Coffees') return true;
    const notes = b.tastingNotes.join(' ').toLowerCase();
    if (selectedFilter.includes('Fruity')) return notes.includes('peach') || notes.includes('fruit') || notes.includes('citrus') || notes.includes('berry');
    if (selectedFilter.includes('Sweet')) return notes.includes('sweet') || notes.includes('honey') || notes.includes('cocoa') || notes.includes('caramel');
    if (selectedFilter.includes('Floral')) return notes.includes('floral') || notes.includes('jasmine') || notes.includes('tea') || notes.includes('bergamot');
    if (selectedFilter.includes('Smooth')) return notes.includes('honey') || notes.includes('cocoa') || notes.includes('sweet');
    return true;
  });

  // Handle direct launch of timer from the calculator
  const handleStartTimer = () => {
    if (onLaunchDirectBrew) {
      onLaunchDirectBrew({
        methodId: activeBrewer.id,
        waterGrams: selectedWaterGrams,
        ratio: activeBrewer.ratio
      });
    } else if (onStartBrewStation) {
      onStartBrewStation();
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: THE ESSENTIAL BREW GUIDE (Direct, Practical, Warm)       */}
      {/* ========================================================================= */}
      <section className="relative pt-2 pb-4">
        {/* Intro Typographic Headline */}
        <div className="max-w-3xl space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] text-xs font-sans font-semibold">
            <Coffee className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>The Essential Brew Guide</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#14110F] leading-[1.08]">
            Great coffee made simple.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed">
            Select your brewer and how much coffee you want to make. We'll give you the exact coffee grams, water temperature, grind size, and step-by-step timer ready to start right now.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenScanner}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#2A2421] font-sans font-semibold text-xs border border-[#ECE6DC] hover:border-[#D69550] flex items-center gap-1.5 shadow-subtle active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Scan Bag Recipe</span>
            </button>

            <button
              type="button"
              onClick={onStartBrewStation}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#2A2421] font-sans font-semibold text-xs border border-[#ECE6DC] hover:border-[#D69550] flex items-center gap-1.5 shadow-subtle active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore All Brewing Guides</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C88A4B]" />
            </button>

            <button
              type="button"
              onClick={onOpenLocator}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#2A2421] font-sans font-semibold text-xs border border-[#ECE6DC] hover:border-[#D69550] flex items-center gap-1.5 shadow-subtle active:scale-95 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Find Local Specialty Cafes</span>
            </button>
          </div>
        </div>

        {/* Interactive Hero Quick-Start Calculator Box */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-[#FFFDF9] border-2 border-[#ECD4BD] shadow-elevated relative overflow-hidden transition-all duration-500">
          {/* Transparent Background Image of Selected Brewer */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              key={activeBrewer.id}
              src={getAssetUrl(activeBrewer.heroImage)}
              alt={activeBrewer.name}
              className="w-full h-full object-cover object-center transform scale-105 filter saturate-105 contrast-100 transition-all duration-700 opacity-15 sm:opacity-20"
            />
            {/* Soft warm gradient overlay: ensures crisp readability while revealing the brewer silhouette */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9]/95 via-[#FFFDF9]/90 to-[#FAF7F2]/85 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 space-y-7">
            {/* Step A: Pick Brewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans font-bold text-[#14110F] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#14110F] text-[#FAF7F2] flex items-center justify-center text-[11px]">1</span>
                  <span>Select your brewer:</span>
                </label>
                <span className="text-xs text-[#766A62] font-sans hidden sm:inline">
                  {activeBrewer.description}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {QUICK_BREWERS.map((brewer) => {
                  const isSelected = selectedBrewerId === brewer.id;
                  return (
                    <button
                      key={brewer.id}
                      type="button"
                      onClick={() => {
                        setSelectedBrewerId(brewer.id);
                        if (onSelectBrewerId) {
                          onSelectBrewerId(brewer.id);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xs ${
                        isSelected
                          ? 'bg-[#14110F] text-[#FAF7F2] border-[#14110F] shadow-md ring-2 ring-[#C88A4B]/30 -translate-y-0.5'
                          : 'bg-white/80 text-[#2A2421] hover:text-[#14110F] hover:bg-white border-[#ECE6DC] hover:border-[#D69550]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/15 text-[#E8AF72]' : 'bg-[#FAF7F2] text-[#A8622D]'}`}>
                          <Coffee className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#E8AF72]" />
                        )}
                      </div>
                      <div>
                        <div className="font-sans font-bold text-xs">
                          {brewer.name}
                        </div>
                        <div className={`text-[10px] font-sans ${isSelected ? 'text-[#C4B7AC]' : 'text-[#766A62]'}`}>
                          1 : {brewer.ratio}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step B: Choose Cup Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans font-bold text-[#14110F] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#14110F] text-[#FAF7F2] flex items-center justify-center text-[11px]">2</span>
                  <span>How much coffee are you making?</span>
                </label>
                <span className="text-xs text-[#766A62] font-sans">
                  Water volume: <strong className="text-[#14110F] font-semibold">{selectedWaterGrams}g</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '1 Mug', grams: 300, desc: '10 oz (Single cup)' },
                  { label: '2 Mugs', grams: 600, desc: '20 oz (Two cups)' },
                  { label: 'Full Carafe', grams: 900, desc: '30 oz (Batch / Chemex)' }
                ].map((size) => {
                  const isSelected = selectedWaterGrams === size.grams;
                  return (
                    <button
                      key={size.grams}
                      type="button"
                      onClick={() => setSelectedWaterGrams(size.grams)}
                      className={`p-3.5 rounded-2xl border font-sans text-xs transition-all cursor-pointer text-center backdrop-blur-xs ${
                        isSelected
                          ? 'bg-[#C88A4B] text-white font-bold border-[#C88A4B] shadow-md'
                          : 'bg-white/85 text-[#5C524B] hover:text-[#14110F] hover:bg-white border-[#ECE6DC]'
                      }`}
                    >
                      <div className="font-bold text-sm">{size.label}</div>
                      <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#766A62]'}`}>
                        {size.grams}g • {size.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step C: Live Recipe Results Readout */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2]/85 backdrop-blur-sm border border-[#ECD4BD] shadow-subtle">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white/90 rounded-xl border border-[#ECE6DC] backdrop-blur-xs">
                  <span className="text-[11px] font-sans text-[#766A62] block">Ground Coffee</span>
                  <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                    {calculatedCoffeeGrams}g
                  </span>
                  <span className="text-[10px] text-[#A25A24] font-medium block mt-0.5">Scale dry dose</span>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-[#ECE6DC] backdrop-blur-xs">
                  <span className="text-[11px] font-sans text-[#766A62] block">Hot Water</span>
                  <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                    {selectedWaterGrams}g
                  </span>
                  <span className="text-[10px] text-[#766A62] block mt-0.5">at {activeBrewer.tempF}°F ({activeBrewer.tempC}°C)</span>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-[#ECE6DC] backdrop-blur-xs">
                  <span className="text-[11px] font-sans text-[#766A62] block">Grind Texture</span>
                  <span className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F] truncate block">
                    {activeBrewer.grind}
                  </span>
                  <span className="text-[10px] text-[#766A62] block mt-0.5">{activeBrewer.grindTexture}</span>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-[#ECE6DC] backdrop-blur-xs">
                  <span className="text-[11px] font-sans text-[#766A62] block">Target Brew Time</span>
                  <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                    {activeBrewer.time}
                  </span>
                  <span className="text-[10px] text-[#2F663C] font-semibold block mt-0.5">Balanced Sweetness</span>
                </div>
              </div>
            </div>

          {/* Step D: Instant Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="text-xs text-[#5C524B] font-sans flex items-center gap-1.5">
              <span className="text-[#C88A4B]">💡</span>
              <span><strong>Barista tip:</strong> {activeBrewer.recommendedOrigin}</span>
            </div>

            <button
              type="button"
              onClick={handleStartTimer}
              className="py-3.5 px-8 rounded-2xl bg-[#14110F] hover:bg-[#2A2421] text-[#FAF7F2] font-sans font-semibold text-sm flex items-center justify-center gap-2.5 shadow-card hover:shadow-elevated active:scale-95 transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#E8AF72]" />
              <span>Start Guided Brew Timer ({activeBrewer.time})</span>
              <ChevronRight className="w-4 h-4 text-[#E8AF72]" />
            </button>
          </div>
        </div>
      </div>
    </section>

      {/* ========================================================================= */}
      {/* 2. CURATED BEANS FOR YOUR BREWER                                          */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-sans font-semibold text-[#A8622D]">
              Fresh Roasts Tested for {activeBrewer.name}
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
              Beans that shine with this method
            </h2>
          </div>

          <div className="text-xs text-[#766A62] font-sans">
            Showing <strong className="text-[#14110F]">{filteredBeans.length}</strong> coffees ready to brew
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FRIENDLY_FLAVORS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`text-xs font-sans font-semibold py-2 px-4 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-[#14110F] text-[#FAF7F2] shadow-sm'
                  : 'bg-white text-[#5C524B] hover:text-[#14110F] hover:bg-[#FAF7F2] border border-[#ECE6DC]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 4-Column Responsive Bean Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBeans.map((coffee) => (
            <BeanCard
              key={coffee.id}
              coffee={coffee}
              onBrew={(c) => onSelectBeanToBrew(c)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. GOLDEN CUP RATIO QUICK REFERENCE (James Hoffmann friendly style)        */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-6">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-xs font-sans font-semibold text-[#A8622D]">
            Coffee Made Simple
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
            The Golden Cup Ratio Reference
          </h2>
          <p className="text-xs sm:text-sm text-[#5C524B] font-sans leading-relaxed">
            The ratio of ground coffee to water determines how rich, light, or sweet your cup tastes. Here is a handy reference:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#ECE6DC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-editorial text-xl font-bold text-[#14110F]">1 : 17</span>
              <span className="text-xs font-sans font-semibold text-[#2F663C] bg-[#EBF3ED] px-2.5 py-0.5 rounded-full">
                Light & Delicate
              </span>
            </div>
            <p className="text-xs text-[#5C524B] leading-relaxed">
              <strong>Best for:</strong> Delicate washed Ethiopians, floral Geishas, and iced pour-overs where you want tea-like clarity.
            </p>
            <div className="text-[11px] text-[#766A62] pt-1 border-t border-[#ECE6DC]">
              Approx. <strong>17.6g coffee</strong> per 300g water
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#C88A4B]/40 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-editorial text-xl font-bold text-[#14110F]">1 : 16</span>
              <span className="text-xs font-sans font-semibold text-[#A25A24] bg-[#FAF0E6] px-2.5 py-0.5 rounded-full border border-[#ECD4BD]">
                Standard Balanced
              </span>
            </div>
            <p className="text-xs text-[#5C524B] leading-relaxed">
              <strong>The Sweet Spot:</strong> The universal specialty standard. Maximizes sweetness, balanced acidity, and pleasant body.
            </p>
            <div className="text-[11px] text-[#766A62] pt-1 border-t border-[#ECE6DC]">
              Approx. <strong>18.8g coffee</strong> per 300g water
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ECE6DC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-editorial text-xl font-bold text-[#14110F]">1 : 15</span>
              <span className="text-xs font-sans font-semibold text-[#14110F] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#ECE6DC]">
                Rich & Bold
              </span>
            </div>
            <p className="text-xs text-[#5C524B] leading-relaxed">
              <strong>Best for:</strong> French Press, Chemex with milk, or coffees with rich chocolate and caramel tasting notes.
            </p>
            <div className="text-[11px] text-[#766A62] pt-1 border-t border-[#ECE6DC]">
              Approx. <strong>20.0g coffee</strong> per 300g water
            </div>
          </div>
        </div>

        {/* Friendly Barista Troubleshooting Tips */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ECE6DC] space-y-2">
          <span className="text-xs font-sans font-bold text-[#14110F] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#C88A4B]" />
            <span>How to tweak your cup if it doesn't taste quite right:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5C524B] pt-1">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
              <strong className="text-[#14110F] block mb-1">🍋 Tastes too sour or weak?</strong>
              Your coffee is under-extracted. Grind slightly finer, pour a bit slower, or use hotter water.
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
              <strong className="text-[#14110F] block mb-1">🍫 Tastes too bitter or dry?</strong>
              Your coffee is over-extracted. Grind slightly coarser, pour a bit faster, or lower water temp slightly.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INDEPENDENT CRAFT ROASTERS SPOTLIGHT                                   */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-sans font-semibold text-[#A8622D]">
            Craft Partners
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
            Meet Our Independent Roasters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_ROASTERS.map((roaster) => (
            <article
              key={roaster.id}
              className="editorial-card p-6 flex flex-col justify-between group hover:border-[#D69550] transition-all bg-white border border-[#ECE6DC]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center font-serif text-lg font-bold text-[#A8622D]">
                    {roaster.monogram || roaster.name.charAt(0)}
                  </div>
                  <span className="text-xs font-sans text-[#766A62]">
                    {roaster.city}, {roaster.state}
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#14110F] group-hover:text-[#A8622D] transition-colors mb-1.5">
                  {roaster.name}
                </h3>
                <p className="text-xs text-[#5C524B] font-sans line-clamp-2 mb-4 leading-relaxed">
                  {roaster.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-[#ECE6DC] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigateToRoaster(roaster.id)}
                  className="text-xs font-sans font-bold text-[#14110F] hover:text-[#A8622D] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore Roaster Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C88A4B]" />
                </button>

                <a
                  href={roaster.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-[#8C8178] hover:text-[#14110F] transition-colors"
                  title={`Visit ${roaster.name} Official Website`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
