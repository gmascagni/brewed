import React, { useState, useEffect } from 'react';
import { HelpCircle, Droplet, Gauge, Flame, AlertCircle, ChevronRight, CheckCircle2, RefreshCw, Eye, X, Sparkles, Leaf } from 'lucide-react';
import { TROUBLESHOOTING_GUIDE } from '../data/brewData';

export default function TroubleshootingHub({ trackMode }) {
  const isCoffee = trackMode === 'coffee';
  const guides = TROUBLESHOOTING_GUIDE[trackMode] || TROUBLESHOOTING_GUIDE.coffee;
  const [selectedSymptomId, setSelectedSymptomId] = useState(guides[0]?.id || 'sour');
  const [activePhotoModalItem, setActivePhotoModalItem] = useState(null);

  // Sync selected symptom when switching tracks
  useEffect(() => {
    const currentGuides = TROUBLESHOOTING_GUIDE[trackMode] || TROUBLESHOOTING_GUIDE.coffee;
    setSelectedSymptomId(currentGuides[0]?.id || 'sour');
  }, [trackMode]);

  const selectedGuide = guides.find((g) => g.id === selectedSymptomId) || guides[0];

  const GRIND_MATRIX = [
    { level: 'Extra Fine', range: '200 - 300 µm', idealFor: 'Espresso / Turkish Coffee', visual: 'Powder / Flour-like texture', image: './extra_fine_grind.jpg', burrTip: 'Baratza Encore #1-3, Fellow Ode Gen 2 with SSP burrs' },
    { level: 'Fine / Medium-Fine', range: '350 - 500 µm', idealFor: 'Moka Pot / Hario V60 Dripper', visual: 'Table salt texture', image: './fine_grind.jpg', burrTip: 'Baratza Encore #4-8, Fellow Ode #2-4' },
    { level: 'Medium', range: '600 - 750 µm', idealFor: 'Automatic Drip Maker / Siphon', visual: 'Regular beach sand texture', image: './medium_grind.jpg', burrTip: 'Baratza Encore #15-20, Fellow Ode #5-7' },
    { level: 'Medium-Coarse', range: '750 - 900 µm', idealFor: 'Chemex / Clever Dripper', visual: 'Rough sand / Kosher salt', image: './medium_coarse_grind.jpg', burrTip: 'Baratza Encore #21-26, Fellow Ode #8-9' },
    { level: 'Coarse', range: '900 - 1100 µm', idealFor: 'French Press / Cold Brew', visual: 'Coarse sea salt / Breadcrumb', image: './coarse_grind.jpg', burrTip: 'Baratza Encore #27-35, Fellow Ode #10-11' }
  ];

  const TEA_LEAF_MATRIX = [
    { level: 'Himalayan Darjeeling', temp: '88°C (190°F)', idealFor: 'Darjeeling First & Second Flush', visual: 'FTGFOP1 Whole Leaf Muscatel' },
    { level: 'Masala Chai Spices', temp: '98°C (208°F)', idealFor: 'Assam CTC & Whole Spices', visual: 'Cracked Spices & Black Leaf' },
    { level: 'English Breakfast', temp: '96°C (205°F)', idealFor: 'Assam, Ceylon & Kenyan Blend', visual: 'Orthodox Broken Orange Pekoe' },
    { level: 'Earl Grey Bergamot', temp: '95°C (203°F)', idealFor: 'Italian Bergamot & Ceylon', visual: 'Citrus Oil Infused Whole Leaf' },
    { level: 'Specialty Green Tea', temp: '78°C (172°F)', idealFor: 'Japanese Sencha & Longjing', visual: 'Steamed / Pan-Fired Green Leaf' },
    { level: 'Ceremonial Matcha', temp: '80°C (176°F)', idealFor: 'Uji Stone-Ground Usucha', visual: 'Micro-Milled Tencha Jade Powder' },
    { level: 'Gongfu Oolong Tea', temp: '88°C (190°F)', idealFor: 'Alishan & Da Hong Pao Oolong', visual: 'Tightly Rolled Tea Balls' },
    { level: 'Ceylon High-Grown', temp: '95°C (203°F)', idealFor: 'Nuwara Eliya & Dimbula Ceylon', visual: 'BOP Brisk Citrus Copper Leaf' },
    { level: 'White Tea Buds', temp: '83°C (181°F)', idealFor: 'Silver Needle & White Peony', visual: 'Unoxidized Downy Silver Buds' },
    { level: 'Turmeric & Botanicals', temp: '98°C (208°F)', idealFor: 'Golden Root & Ginger Infusion', visual: 'Crushed Golden Roots & Herbs' }
  ];

  return (
    <section className="mt-12 p-7 md:p-9 rounded-3xl glass-panel shadow-2xl transition-all duration-500 relative">
      
      {/* Section Header */}
      <div className="mb-8 pb-4 border-b border-white/10">
        <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>{isCoffee ? 'Coffee Extraction Diagnostics' : 'Tea Steeping Diagnostics'}</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
          {isCoffee ? 'Home Coffee Extraction Diagnostics & Variable Control' : 'Fine Tea Steeping Diagnostics & Leaf Variable Control'}
        </h3>
        <p className="text-xs md:text-sm text-cream-soft/70 mt-1">
          {isCoffee 
            ? 'Identify coffee brew defects (sourness, bitterness, astringency) and adjust grind size, water quality, and temperature.' 
            : 'Identify tea steeping defects (scalding, harshness, grassy notes) and adjust water temp, steep time, and leaf ratio.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Interactive Extraction Symptom Diagnostics */}
        <div>
          <h4 className="text-sm uppercase tracking-wider font-extrabold text-cream-light mb-4 flex items-center gap-2 drop-shadow">
            <AlertCircle className="w-4 h-4 text-amber-gold" />
            <span>Interactive {isCoffee ? 'Coffee' : 'Tea'} Taste Diagnostics:</span>
          </h4>

          {/* Symptom Picker Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {guides.map((item) => {
              const isSelected = item.id === selectedGuide?.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedSymptomId(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-0.5 ${
                    isSelected
                      ? isCoffee 
                        ? 'btn-tactile-amber text-espresso-950 font-extrabold scale-105'
                        : 'btn-tactile-sage text-cream-light font-extrabold scale-105'
                      : 'bg-espresso-900/70 border-white/10 text-cream-soft hover:bg-white/10 hover:border-white/20 shadow-md'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center justify-between">
                    <span>{item.symptom}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Diagnosis Result Card */}
          {selectedGuide && (
            <div className="p-6 rounded-3xl bg-espresso-950/95 border border-amber-gold/40 shadow-2xl">
              <div className="text-xs font-extrabold text-amber-gold uppercase tracking-wider mb-2">
                Root Cause Analysis:
              </div>
              <p className="text-sm font-bold text-cream-light mb-5 leading-relaxed drop-shadow">
                {selectedGuide.cause}
              </p>

              <div className="text-xs font-extrabold text-cream-soft/70 uppercase tracking-wider mb-3">
                Actionable Home Remedies:
              </div>
              <div className="space-y-2.5">
                {selectedGuide.remedies.map((remedy, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-cream-soft font-medium flex items-start gap-3 shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{remedy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Burr Grinder Settings / Tea Leaf Infusion Guide */}
        <div className="space-y-6">
          
          {/* Card: Coffee Burr Grinder or Tea Leaf Infusion Temperature Guide */}
          {isCoffee ? (
            <div className="p-6 rounded-3xl bg-espresso-900/70 border border-white/15 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm uppercase tracking-wider font-extrabold text-cream-light flex items-center gap-2 drop-shadow">
                  <Gauge className="w-4 h-4 text-amber-gold" />
                  <span>Burr Grinder Setting & Micron Guide</span>
                </h4>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-gold bg-amber-gold/20 px-2.5 py-1 rounded-full border border-amber-gold/30">
                  Click Row for Macro Photo Bubble
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {GRIND_MATRIX.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoModalItem(item)}
                    className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-gold/60 hover:bg-white/10 transition-all duration-300 text-left flex items-center justify-between shadow-inner group active:scale-98"
                  >
                    <div className="pr-2">
                      <div className="font-extrabold text-cream-light group-hover:text-amber-gold flex items-center gap-2">
                        <span>{item.level}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 text-[10px] font-extrabold flex items-center gap-1">
                          <Eye className="w-3 h-3 fill-current" />
                          <span>Photo Bubble</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-cream-soft/70 font-medium mt-0.5">{item.visual}</div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-amber-gold font-extrabold text-sm">{item.range}</div>
                      <div className="text-[10px] text-cream-soft/60 font-medium">{item.idealFor}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-sage-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm uppercase tracking-wider font-extrabold text-cream-light flex items-center gap-2 drop-shadow">
                  <Leaf className="w-4 h-4 text-sage-300" />
                  <span>Tea Leaf Category & Infusion Temp Guide</span>
                </h4>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sage-300 bg-sage-500/20 px-2.5 py-1 rounded-full border border-sage-500/30">
                  Thermal Precision
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {TEA_LEAF_MATRIX.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between shadow-inner"
                  >
                    <div className="pr-2">
                      <div className="font-extrabold text-cream-light text-sage-300">
                        {item.level}
                      </div>
                      <div className="text-[11px] text-cream-soft/70 font-medium mt-0.5">{item.visual}</div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-sage-300 font-extrabold text-sm">{item.temp}</div>
                      <div className="text-[10px] text-cream-soft/60 font-medium">{item.idealFor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comprehensive Water Quality & Extraction Chemistry Masterclass Card */}
          <div className="p-6 rounded-3xl bg-espresso-900/90 border-2 border-cyan-500/40 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <h4 className="text-sm uppercase font-mono tracking-wider font-extrabold text-cream-light flex items-center gap-2 drop-shadow">
                <Droplet className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Why Water Quality Is Paramount (98.5% of Your Cup)</span>
              </h4>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-full border border-cyan-400/40">
                Critical Ingredient
              </span>
            </div>

            <p className="text-xs text-cream-soft/90 font-medium leading-relaxed">
              Water makes up <strong className="text-cyan-300 font-mono">98.5% of brewed coffee</strong> and <strong className="text-cyan-300 font-mono">99.5% of tea</strong>. Water is not merely a solvent—its mineral composition dictates how flavor compounds dissolve. Bad tap water with high alkalinity or chlorine will ruin even $100/lb specialty micro-lots.
            </p>

            {/* Target Water Chemistry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
                <span className="text-stone-400 block text-[9px] font-extrabold uppercase">Target TDS</span>
                <strong className="text-amber-gold font-extrabold text-xs sm:text-sm">120 - 150 ppm</strong>
                <span className="text-[9px] text-stone-400 block font-sans">SCA Benchmark</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
                <span className="text-stone-400 block text-[9px] font-extrabold uppercase">Optimal pH</span>
                <strong className="text-emerald-400 font-extrabold text-xs sm:text-sm">6.5 - 7.5 pH</strong>
                <span className="text-[9px] text-stone-400 block font-sans">Neutral Buffer</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
                <span className="text-stone-400 block text-[9px] font-extrabold uppercase">Ca²⁺ / Mg²⁺</span>
                <strong className="text-cyan-300 font-extrabold text-xs sm:text-sm">50 - 85 ppm</strong>
                <span className="text-[9px] text-stone-400 block font-sans">Flavor Binding</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
                <span className="text-stone-400 block text-[9px] font-extrabold uppercase">Alkalinity</span>
                <strong className="text-purple-300 font-extrabold text-xs sm:text-sm">40 - 50 ppm</strong>
                <span className="text-[9px] text-stone-400 block font-sans">Acid Balance</span>
              </div>
            </div>

            {/* Water Defects Diagnostics Summary */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] space-y-2 text-stone-300">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cream-light font-bold">Hard Tap Water (High Limescale & Bicarbonates):</strong> Completely destroys bright citric acidity, turning light roasts chalky, flat, and woody.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cream-light font-bold">Pure Distilled / Zero-TDS Water:</strong> Lacks essential Magnesium (Mg²⁺) and Calcium (Ca²⁺) binding ions, leaving cups thin, sharp, and sour.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cream-light font-bold">Chlorinated Tap Water:</strong> Causes plastic, chemical, or metallic off-flavors. Always use activated charcoal filtration or remineralized RO water.
                </div>
              </div>
            </div>

            {/* Contextual Amazon Affiliate Recommendation Box for Water Chemistry */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <span className="text-stone-300 font-medium">Test tap water TDS mineral content or add minerals:</span>
              <div className="flex gap-2">
                <a
                  href="https://www.amazon.com/s?k=Digital+TDS+Water+Quality+Tester+Purity+Meter&tag=thebrewapp13-20"
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  data-product-name="Digital TDS Water Quality Tester"
                  data-link-id="tds_water_tester"
                  data-context="diagnostics_water"
                  className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-gold hover:bg-amber-400/30 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-wider transition-all"
                >
                  TDS Tester ↗
                </a>
                <a
                  href="https://www.amazon.com/s?k=Third+Wave+Water+Coffee+Mineral+Packets&tag=thebrewapp13-20"
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  data-product-name="Third Wave Water Coffee Minerals"
                  data-link-id="third_wave_water"
                  data-context="diagnostics_water"
                  className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-gold hover:bg-amber-400/30 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-wider transition-all"
                >
                  Minerals ↗
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MACRO PHOTO BUBBLE MODAL POPUP FOR DIAGNOSTICS BURR GRINDER GUIDE */}
      {activePhotoModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          
          <div className="relative max-w-lg w-full rounded-3xl bg-espresso-950 border-2 border-amber-gold p-6 shadow-2xl overflow-hidden">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setActivePhotoModalItem(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-cream-light hover:text-amber-gold hover:bg-white/20 transition-all border border-white/15"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Macro Photo Bubble • {activePhotoModalItem.range}</span>
            </div>

            <h3 className="font-serif text-2xl font-extrabold text-cream-light mb-1">
              {activePhotoModalItem.level} Ground Coffee Photo
            </h3>
            <p className="text-xs text-cream-soft/80 mb-4 font-medium">
              Texture Comparison: <strong className="text-amber-gold">{activePhotoModalItem.visual}</strong>
            </p>

            {/* High-Definition Macro Photo Container */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-amber-gold/40 shadow-2xl mb-5 relative group">
              <img
                src={activePhotoModalItem.image}
                alt={activePhotoModalItem.level}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-xs font-mono font-bold text-amber-gold border border-amber-gold/30">
                Ideal For: {activePhotoModalItem.idealFor}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 text-xs text-cream-soft/90 font-medium space-y-2">
              <div>
                <strong className="text-amber-gold">Recommended Burr Settings:</strong> {activePhotoModalItem.burrTip}
              </div>
              <div>
                <strong className="text-amber-gold">Micron Range:</strong> {activePhotoModalItem.range}
              </div>
            </div>

            <button
              onClick={() => setActivePhotoModalItem(null)}
              className="w-full py-3 rounded-2xl btn-tactile-amber text-espresso-950 text-xs font-extrabold shadow-xl active:scale-95"
            >
              Close Photo Bubble
            </button>

          </div>

        </div>
      )}

    </section>
  );
}
