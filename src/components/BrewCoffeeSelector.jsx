import React, { useState, useMemo } from 'react';
import { 
  Coffee, 
  ScanLine, 
  Sparkles, 
  Flame, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Bookmark, 
  Search,
  Sliders
} from 'lucide-react';
import { SHOWCASE_ROASTERS } from '../data/roasterShowcaseData';
import { hapticTap } from '../utils/haptics';

export const ROAST_PRESETS = [
  {
    id: 'light_roast',
    name: 'Light Roast Single-Origin',
    roastLevel: 'Light',
    origin: 'High Altitude (1,800m+)',
    description: 'Vibrant, floral, citric brightness, tea-like delicacy. Requires higher extraction temperature to dissolve dense bean cell structures.',
    tempF: 204,
    tempC: 95.5,
    recommendedRatio: 16.5,
    recommendedGrind: 'Medium-Fine',
    tastingNotes: ['Jasmine', 'Bergamot', 'Peach', 'Honey'],
    color: '#D4A373',
    badge: 'High Acidity & Florals'
  },
  {
    id: 'medium_roast',
    name: 'Medium Roast Balanced',
    roastLevel: 'Medium',
    origin: 'Central & South America',
    description: 'Balanced sweetness, milk chocolate, caramelization, and stone fruit acidity. Standard golden ratio benchmark.',
    tempF: 200,
    tempC: 93.3,
    recommendedRatio: 16.0,
    recommendedGrind: 'Medium',
    tastingNotes: ['Milk Chocolate', 'Toffee', 'Red Apple', 'Almond'],
    color: '#A66E38',
    badge: 'Balanced & Sweet'
  },
  {
    id: 'dark_roast',
    name: 'Dark Roast Bold Profile',
    roastLevel: 'Dark',
    origin: 'Rich Volcanic Soils',
    description: 'Deep body, dark cocoa, smoky molasses, low acidity. Lower water temperature prevents over-extracting bitter astringency.',
    tempF: 194,
    tempC: 90.0,
    recommendedRatio: 15.0,
    recommendedGrind: 'Medium-Coarse',
    tastingNotes: ['Dark Chocolate', 'Molasses', 'Roasted Nut', 'Smoky Cedar'],
    color: '#5A3825',
    badge: 'Rich & Heavy Body'
  },
  {
    id: 'decaf_natural',
    name: 'Decaf / Natural Processed',
    roastLevel: 'Medium-Light',
    origin: 'Swiss Water / Sugarcane EA',
    description: 'Porous bean structure that extracts rapidly. Gentle pouring and slightly lower temperature preserves sweet fruit notes.',
    tempF: 198,
    tempC: 92.2,
    recommendedRatio: 15.5,
    recommendedGrind: 'Medium',
    tastingNotes: ['Brown Sugar', 'Dried Fig', 'Graham Cracker', 'Vanilla'],
    color: '#7E4B21',
    badge: 'Gentle Extraction'
  }
];

export default function BrewCoffeeSelector({
  activeMethod,
  selectedCoffee,
  onSelectCoffee,
  onOpenScanner,
  onPrevStep,
  onNextStep,
  unitSystem = 'imperial'
}) {
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'stash' | 'showcase'
  const isMetric = unitSystem === 'metric';

  // Load user stash from local journal storage
  const userStash = useMemo(() => {
    try {
      if (typeof window === 'undefined') return [];
      const saved = JSON.parse(localStorage.getItem('the_brew_app_journal_v1') || '[]');
      // Deduplicate by beanName + roaster
      const seen = new Set();
      const list = [];
      for (const entry of saved) {
        if (!entry.beanName) continue;
        const key = `${entry.roaster || ''}-${entry.beanName}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            id: `stash_${entry.id || key}`,
            beanName: entry.beanName,
            roaster: entry.roaster || 'Specialty Roastery',
            roastLevel: entry.roastLevel || 'Medium',
            recommendedRatio: parseFloat(String(entry.ratioStr || '').replace('1 :', '').trim()) || entry.ratio || 16,
            tempF: parseInt(entry.tempStr) || 202,
            recommendedGrind: entry.grindStr || 'Medium-Fine',
            tastingNotes: entry.tastingNotes || [],
            notes: entry.notes || '',
            date: entry.date,
            rating: entry.rating || 5
          });
        }
      }
      return list;
    } catch {
      return [];
    }
  }, []);

  // Curated showcase coffees from verified artisan roasters
  const showcaseCoffees = useMemo(() => {
    const list = [];
    SHOWCASE_ROASTERS.forEach(roaster => {
      (roaster.coffees || []).forEach(coffee => {
        list.push({
          ...coffee,
          roaster: roaster.name,
          roasterSlug: roaster.slug
        });
      });
    });
    return list;
  }, []);

  const handleSelect = (coffee) => {
    hapticTap();
    onSelectCoffee(coffee);
  };

  const isCurrent = (coffee) => {
    if (!selectedCoffee) return false;
    return (
      (selectedCoffee.id && selectedCoffee.id === coffee.id) ||
      (selectedCoffee.beanName && selectedCoffee.beanName === coffee.beanName) ||
      (selectedCoffee.name && selectedCoffee.name === coffee.name)
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header: Step Title & Purpose */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE8] border border-[#ECE6DC] shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] text-xs font-sans font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Step 2 of 4 • Select Your Coffee</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14110F] leading-tight">
            What coffee are you brewing today?
          </h2>

          <p className="text-sm text-[#5C524B] leading-relaxed font-sans">
            Your coffee’s origin and roast level determine the ideal extraction temperature, golden ratio, and grind coarseness for your {activeMethod?.name || 'brewer'}.
          </p>
        </div>
      </div>

      {/* 2. Instant Scan Bag Hero Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#14110F] via-[#2A2421] to-[#14110F] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#E8AF72] shrink-0">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-[#FAF7F2] flex items-center gap-2">
              <span>Have a bag of specialty coffee?</span>
              <span className="text-[10px] font-mono bg-[#A8622D] text-white px-2 py-0.5 rounded-full uppercase font-bold">Fastest</span>
            </h3>
            <p className="text-xs text-[#C4B7AC]">
              Scan the barcode or Smart Bag QR code to auto-dial in roast date, origin, and golden ratio in 2 seconds.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            hapticTap();
            if (onOpenScanner) onOpenScanner();
          }}
          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#C88A4B] hover:bg-[#D69550] text-[#14110F] font-sans font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <ScanLine className="w-4 h-4" />
          <span>Scan Coffee Bag</span>
        </button>
      </div>

      {/* 3. Selector Mode Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DC] w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Roast Profiles (4)</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stash')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'stash'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#2F663C]" />
            <span>My Stash ({userStash.length})</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('showcase')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'showcase'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A25A24]" />
            <span>Artisan Lots ({showcaseCoffees.length})</span>
          </span>
        </button>
      </div>

      {/* 4. Tab Content Panels */}
      <div>
        {/* Tab 1: Roast Presets */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {ROAST_PRESETS.map((preset) => {
              const selected = isCurrent(preset);
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelect(preset)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-md ${
                    selected
                      ? 'bg-[#FFFDF9] border-[#C88A4B] ring-2 ring-[#C88A4B]/25 -translate-y-0.5'
                      : 'bg-white border-[#ECE6DC] hover:border-[#D69550]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF0E6] text-[#A25A24] border border-[#ECD4BD]">
                        {preset.badge}
                      </span>
                      {selected && (
                        <div className="w-5 h-5 rounded-full bg-[#C88A4B] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#14110F]">
                      {preset.name}
                    </h3>

                    <p className="text-xs text-[#5C524B] leading-relaxed line-clamp-2">
                      {preset.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {preset.tastingNotes.map((note, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#766A62] text-[10px] font-sans border border-[#ECE6DC]">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#ECE6DC] flex items-center justify-between text-xs font-mono text-[#766A62]">
                    <span>Temp: <strong className="text-[#14110F]">{isMetric ? `${preset.tempC}°C` : `${preset.tempF}°F`}</strong></span>
                    <span>Ratio: <strong className="text-[#14110F]">1 : {preset.recommendedRatio}</strong></span>
                    <span>Grind: <strong className="text-[#14110F]">{preset.recommendedGrind}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: User Stash */}
        {activeTab === 'stash' && (
          <div className="space-y-4 animate-fade-in">
            {userStash.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-[#ECE6DC] text-center space-y-3">
                <Coffee className="w-8 h-8 text-[#A89F91] mx-auto opacity-70" />
                <h4 className="font-serif font-bold text-base text-[#14110F]">Your Stash is Clean</h4>
                <p className="text-xs text-[#766A62] max-w-md mx-auto">
                  When you brew coffee or scan bags, your favorite coffees will be saved here for instant 1-click replay.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0E6] text-[#14110F] text-xs font-sans font-bold border border-[#ECE6DC] cursor-pointer"
                >
                  Choose a Roast Profile Instead
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userStash.map((coffee) => {
                  const selected = isCurrent(coffee);
                  return (
                    <div
                      key={coffee.id}
                      onClick={() => handleSelect(coffee)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-md ${
                        selected
                          ? 'bg-[#FFFDF9] border-[#C88A4B] ring-2 ring-[#C88A4B]/25 -translate-y-0.5'
                          : 'bg-white border-[#ECE6DC] hover:border-[#D69550]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#766A62]">
                          <span className="font-mono text-[11px] font-bold text-[#A8622D]">{coffee.roaster}</span>
                          {selected && (
                            <div className="w-5 h-5 rounded-full bg-[#C88A4B] text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <h4 className="font-serif font-bold text-base text-[#14110F]">
                          {coffee.beanName}
                        </h4>

                        {coffee.tastingNotes && coffee.tastingNotes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {coffee.tastingNotes.map((note, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#766A62] text-[10px]">
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#ECE6DC] flex items-center justify-between text-xs font-mono text-[#766A62]">
                        <span>Ratio: <strong className="text-[#14110F]">1:{coffee.recommendedRatio || 16}</strong></span>
                        <span>Grind: <strong className="text-[#14110F]">{coffee.recommendedGrind}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Artisan Showcase */}
        {activeTab === 'showcase' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {showcaseCoffees.map((coffee) => {
              const selected = isCurrent(coffee);
              return (
                <div
                  key={coffee.id}
                  onClick={() => handleSelect(coffee)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-md ${
                    selected
                      ? 'bg-[#FFFDF9] border-[#C88A4B] ring-2 ring-[#C88A4B]/25 -translate-y-0.5'
                      : 'bg-white border-[#ECE6DC] hover:border-[#D69550]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#A25A24]">
                        {coffee.roaster} • {coffee.origin.split(',')[0]}
                      </span>
                      {selected && (
                        <div className="w-5 h-5 rounded-full bg-[#C88A4B] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#14110F]">
                      {coffee.beanName}
                    </h4>

                    <p className="text-xs text-[#5C524B] line-clamp-2">
                      {coffee.description}
                    </p>

                    {coffee.tastingNotes && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {coffee.tastingNotes.map((note, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#766A62] text-[10px] border border-[#ECE6DC]">
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#ECE6DC] flex items-center justify-between text-xs font-mono text-[#766A62]">
                    <span>Score: <strong className="text-[#A25A24]">{coffee.cuppingScore} SCA</strong></span>
                    <span>Ratio: <strong className="text-[#14110F]">1:{coffee.recommendedRatio}</strong></span>
                    <span>Temp: <strong className="text-[#14110F]">{isMetric ? `${coffee.tempC}°C` : `${coffee.tempF}°F`}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Active Coffee Summary Banner */}
      {selectedCoffee && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF0E6] border border-[#ECD4BD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#A25A24] text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#A25A24] block">
                Selected Coffee Ready
              </span>
              <h4 className="font-serif font-bold text-base text-[#14110F]">
                {selectedCoffee.beanName || selectedCoffee.name}
              </h4>
              <p className="text-xs text-[#766A62]">
                {selectedCoffee.roaster || selectedCoffee.origin || 'Custom Specialty Selection'} • Starting Temp: {selectedCoffee.tempF || 202}°F
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNextStep}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#14110F] hover:bg-[#2A2421] text-white font-sans font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <span>Dial In Recipe & Grind</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. Step Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-[#ECE6DC]">
        <button
          type="button"
          onClick={onPrevStep}
          className="py-3 px-6 rounded-2xl bg-[#FAF7F2] hover:bg-white text-[#5C524B] font-sans font-bold text-xs flex items-center gap-2 border border-[#ECE6DC] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Step 01: Choose Brewer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            // If no coffee selected yet, default to Light Roast preset
            if (!selectedCoffee) {
              onSelectCoffee(ROAST_PRESETS[0]);
            }
            onNextStep();
          }}
          className="py-3 px-7 rounded-2xl bg-[#C88A4B] hover:bg-[#D69550] text-[#14110F] font-sans font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Step 03: Recipe & Ratio</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
