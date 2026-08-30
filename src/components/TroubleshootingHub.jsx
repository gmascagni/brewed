import React, { useState, useEffect } from 'react';
import { HelpCircle, Droplet, Gauge, AlertCircle, ChevronRight, CheckCircle2, Eye, X, Sparkles, Leaf } from 'lucide-react';
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
    <section className={`mt-12 p-7 md:p-9 rounded-3xl ${
      isCoffee ? 'glass-panel-coffee border-[#A66E38]/40' : 'glass-panel-tea border-sage-500/40'
    } shadow-2xl transition-all duration-500 relative`}>
      
      {/* Section Header */}
      <div className="mb-8 pb-4 border-b border-white/10">
        <div className={`inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest mb-1.5 ${
          isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
        }`}>
          {isCoffee ? <HelpCircle className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
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
            <AlertCircle className={`w-4 h-4 ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
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
                        ? 'btn-tactile-coffee text-[#140C08] font-extrabold scale-105'
                        : 'btn-tactile-tea text-white font-extrabold scale-105'
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
            <div className={`p-6 rounded-3xl bg-espresso-950/95 border shadow-2xl ${
              isCoffee ? 'border-[#A66E38]/40' : 'border-sage-500/40'
            }`}>
              <div className={`text-xs font-extrabold uppercase tracking-wider mb-2 ${
                isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
              }`}>
                Root Cause Analysis:
              </div>
              <p className="text-sm font-bold text-cream-light mb-5 leading-relaxed drop-shadow">
                {selectedGuide.cause}
              </p>

              <div className="text-xs font-extrabold text-cream-soft/70 uppercase tracking-wider mb-3">
                Actionable Remedies:
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

        {/* Right Column: Visual Reference Matrix */}
        <div>
          <h4 className="text-sm uppercase tracking-wider font-extrabold text-cream-light mb-4 flex items-center gap-2 drop-shadow">
            <Gauge className={`w-4 h-4 ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
            <span>{isCoffee ? 'Particle Size & Burr Alignment Matrix' : 'Fine Tea Leaf & Water Temp Matrix'}</span>
          </h4>

          {isCoffee ? (
            <div className="space-y-3">
              {GRIND_MATRIX.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-espresso-950/80 border border-white/10 hover:border-[#A66E38]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-serif font-extrabold text-cream-light">{item.level}</span>
                      <span className="text-[10px] font-mono font-bold text-[#D2A06E] bg-[#A66E38]/20 px-2 py-0.5 rounded-md border border-[#A66E38]/30">
                        {item.range}
                      </span>
                    </div>
                    <div className="text-[11px] text-cream-soft/70 mt-1 font-medium">
                      Ideal For: <strong className="text-cream-light">{item.idealFor}</strong> • {item.visual}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                      Burr Setting: {item.burrTip}
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePhotoModalItem(item)}
                    className="px-3 py-1.5 rounded-xl bg-[#A66E38]/20 text-[#D2A06E] hover:bg-[#A66E38] hover:text-[#140C08] border border-[#A66E38]/40 font-mono font-extrabold text-[10px] uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect Photo</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {TEA_LEAF_MATRIX.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-espresso-950/80 border border-white/10 hover:border-sage-400/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-serif font-extrabold text-cream-light">{item.level}</span>
                      <span className="text-[10px] font-mono font-bold text-sage-300 bg-sage-500/20 px-2 py-0.5 rounded-md border border-sage-500/30">
                        {item.temp}
                      </span>
                    </div>
                    <div className="text-[11px] text-cream-soft/70 mt-1 font-medium">
                      Ideal For: <strong className="text-cream-light">{item.idealFor}</strong> • {item.visual}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Photo Modal */}
      {activePhotoModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative max-w-md w-full rounded-3xl bg-espresso-950 border-2 border-[#A66E38] p-6 shadow-2xl">
            <button
              onClick={() => setActivePhotoModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-cream-light hover:bg-white/20 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-serif text-xl font-bold text-cream-light mb-2">{activePhotoModalItem.level}</h4>
            <div className="aspect-square w-full rounded-2xl overflow-hidden mb-4 border border-white/20">
              <img src={activePhotoModalItem.image} alt={activePhotoModalItem.level} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-cream-soft/80">{activePhotoModalItem.visual}</p>
          </div>
        </div>
      )}

    </section>
  );
}
