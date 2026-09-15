import React, { useState, useEffect } from 'react';
import { Gauge, Sparkles, Eye, X, Sliders } from 'lucide-react';
import { GRIND_VISUAL_GUIDE } from '../data/brewData';
import { 
  GRINDER_PROFILES, 
  getSavedGrinderId, 
  saveGrinderId, 
  getGrinderSetting 
} from '../data/grinderProfiles';

export default function GrindVisualGuide({ activeMethod }) {
  const [selectedGrindId, setSelectedGrindId] = useState('medium_fine');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrinderId, setSelectedGrinderId] = useState(getSavedGrinderId);

  // Automatically sync preselected grind when activeMethod changes
  useEffect(() => {
    if (!activeMethod) return;
    const methodId = activeMethod.id;
    if (methodId === 'french_press') setSelectedGrindId('coarse');
    else if (methodId === 'espresso') setSelectedGrindId('extra_fine');
    else if (methodId === 'moka_pot') setSelectedGrindId('fine');
    else if (methodId === 'drip_brewer') setSelectedGrindId('medium');
    else if (methodId === 'pour_over' || methodId === 'classic_pour_over') setSelectedGrindId('medium_fine');
    else if (methodId === 'aeropress') setSelectedGrindId('medium_fine');
    else if (activeMethod.grind) {
      const g = activeMethod.grind.toLowerCase();
      if (g.includes('coarse')) setSelectedGrindId('coarse');
      else if (g.includes('extra fine')) setSelectedGrindId('extra_fine');
      else if (g.includes('fine')) setSelectedGrindId('fine');
      else if (g.includes('medium')) setSelectedGrindId('medium');
    }
  }, [activeMethod]);

  const handleGrinderChange = (e) => {
    const nextId = e.target.value;
    setSelectedGrinderId(nextId);
    saveGrinderId(nextId);
  };

  const activeGrind = GRIND_VISUAL_GUIDE.find((g) => g.id === selectedGrindId) || GRIND_VISUAL_GUIDE[2];
  const currentGrinderSetting = getGrinderSetting(selectedGrinderId, activeGrind.id);

  const handleOpenPhotoBubble = (grindItem, e) => {
    e.stopPropagation();
    setSelectedGrindId(grindItem.id);
    setIsModalOpen(true);
  };

  return (
    <section className="mt-10 p-7 md:p-9 rounded-3xl glass-panel shadow-2xl transition-all duration-500 relative">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
            <Gauge className="w-4 h-4 animate-pulse" />
            <span>Coffee Grind Coarseness Visual Reference Guide</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
            Burr Grinder Settings & Macro Texture Photos
          </h3>
          <p className="text-xs md:text-sm text-cream-soft/70 mt-1">
            Preselected for {activeMethod?.name || 'Your Method'} • Click any Burr Grinder setting to inspect high-definition macro photos
          </p>
        </div>

        <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40 shadow-inner">
          Auto-Matched: {activeGrind.name}
        </span>
      </div>

      {/* Interactive Grinder Model Dial-In Setting Banner */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-espresso-950 via-black/80 to-espresso-950 border border-amber-gold/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-gold/20 border border-amber-gold/40 flex items-center justify-center text-amber-gold shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-gold font-extrabold">
                EQUIPMENT DIAL-IN TRANSLATOR
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-cream-soft/80 font-mono">
                Real Micron Calibration
              </span>
            </div>
            <h4 className="font-serif text-lg font-bold text-cream-light leading-tight mt-0.5">
              Dial Setting for <span className="text-amber-gold">{activeGrind.name}</span>
            </h4>
          </div>
        </div>

        {/* Grinder Model Dropdown & Live Setting Badge */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col">
            <label htmlFor="grinder-model-select" className="text-[10px] font-mono text-cream-soft/60 mb-1">
              Select Your Burr Grinder:
            </label>
            <select
              id="grinder-model-select"
              value={selectedGrinderId}
              onChange={handleGrinderChange}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-cream-light text-xs font-mono font-medium focus:outline-none focus:border-amber-gold cursor-pointer"
            >
              {GRINDER_PROFILES.map((grinder) => (
                <option key={grinder.id} value={grinder.id} className="bg-stone-900 text-cream-light">
                  {grinder.name} ({grinder.brand})
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-gold/15 border border-amber-gold/50 text-center shadow-inner min-w-[120px]">
            <span className="block text-[8px] font-mono uppercase tracking-wider text-amber-gold/90 font-bold">
              Target Setting
            </span>
            <span className="font-mono text-base font-extrabold text-amber-gold">
              {currentGrinderSetting.setting}
            </span>
            <span className="block text-[8px] font-mono text-cream-soft/70 truncate max-w-[160px]">
              {currentGrinderSetting.subtext}
            </span>
          </div>
        </div>
      </div>

      {/* Burr Grinder Settings Buttons Grid with Instant Photo Bubble Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {GRIND_VISUAL_GUIDE.map((item) => {
          const isSelected = item.id === activeGrind.id;
          const modelSetting = getGrinderSetting(selectedGrinderId, item.id);
          return (
            <div
              key={item.id}
              onClick={() => setSelectedGrindId(item.id)}
              className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 shadow-xl cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'btn-tactile-amber text-espresso-950 scale-105 font-extrabold ring-2 ring-amber-gold'
                  : 'bg-espresso-900/80 border-white/10 text-cream-soft hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="text-xs font-extrabold tracking-wide drop-shadow mb-1">{item.name}</div>
                <div className="text-[11px] font-mono font-bold text-amber-gold mb-1">{item.micron}</div>
                <div className={`text-[10px] truncate mb-2 ${isSelected ? 'opacity-90 font-semibold' : 'text-cream-soft/60'}`}>
                  {item.textureComparison.split('/')[0]}
                </div>
                {/* Grinder model specific dial translation */}
                <div className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-between border ${
                  isSelected
                    ? 'bg-espresso-950 text-amber-gold border-amber-gold/40'
                    : 'bg-black/40 text-amber-200/90 border-white/10'
                }`}>
                  <span className="text-[8px] uppercase tracking-wider text-stone-400">Dial:</span>
                  <span className="truncate ml-1">{modelSetting.setting}</span>
                </div>
              </div>

              <button
                onClick={(e) => handleOpenPhotoBubble(item, e)}
                className={`mt-2 py-1.5 px-2 rounded-xl text-[10px] font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  isSelected
                    ? 'bg-espresso-950 text-amber-gold hover:bg-black'
                    : 'bg-amber-gold/20 text-amber-gold hover:bg-amber-gold hover:text-espresso-950 border border-amber-gold/30'
                }`}
                title={`Inspect macro photo bubble for ${item.name}`}
              >
                <Eye className="w-3 h-3" />
                <span>Inspect Photo</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Preselected Grind Details Card */}
      <div className="p-6 rounded-3xl bg-espresso-950/90 border border-white/15 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex items-center space-x-3">
            <h4 className="font-serif text-xl font-bold text-cream-light">
              {activeGrind.name} Grind Setting ({activeGrind.micron})
            </h4>
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30">
              {activeGrind.textureComparison}
            </span>
          </div>

          {/* Grinder-specific dial suggestion pill */}
          <div className="p-2.5 rounded-xl bg-amber-gold/10 border border-amber-gold/30 text-xs font-mono text-cream-light flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-amber-gold font-bold">{currentGrinderSetting.grinderName}: </span>
              <span className="text-white font-extrabold text-sm">{currentGrinderSetting.setting}</span>
              <span className="text-cream-soft/70 text-[11px] ml-1.5">({currentGrinderSetting.subtext})</span>
            </div>
            <div className="text-[10px] text-cream-soft/70 italic">
              💡 {currentGrinderSetting.calibrationTip}
            </div>
          </div>

          <p className="text-xs text-cream-soft/90 font-medium leading-relaxed">
            {activeGrind.burrSettingTip}
          </p>
          <div className="text-xs text-stone-400 font-medium">
            <strong className="text-amber-gold">Flavor Extraction Profile:</strong> {activeGrind.sensoryImpact}
          </div>
        </div>

        <button
          onClick={(e) => handleOpenPhotoBubble(activeGrind, e)}
          className="py-3 px-6 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Expand Macro Photo Bubble</span>
        </button>
      </div>

      {/* MACRO PHOTO BUBBLE MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative max-w-lg w-full rounded-3xl bg-espresso-950 border-2 border-amber-gold p-6 shadow-2xl overflow-hidden">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-cream-light hover:text-amber-gold hover:bg-white/20 transition-all border border-white/15 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Macro Photo Bubble • {activeGrind.micron}</span>
            </div>

            <h3 className="font-serif text-2xl font-extrabold text-cream-light mb-1">
              {activeGrind.name} Ground Coffee Photo
            </h3>
            <p className="text-xs text-cream-soft/80 mb-3 font-medium">
              Texture Comparison: <strong className="text-amber-gold">{activeGrind.textureComparison}</strong>
            </p>

            {/* Model-specific dial in modal */}
            <div className="p-3 rounded-xl bg-amber-gold/10 border border-amber-gold/30 text-xs font-mono text-cream-light mb-4">
              <div className="flex items-center justify-between">
                <strong className="text-amber-gold">{currentGrinderSetting.grinderName}:</strong>
                <span className="text-white font-extrabold text-sm">{currentGrinderSetting.setting}</span>
              </div>
              <p className="text-[10px] text-cream-soft/80 mt-1">
                {currentGrinderSetting.calibrationTip}
              </p>
            </div>

            {/* High-Definition Macro Photo Container */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-amber-gold/40 shadow-2xl mb-5 relative group">
              <img
                src={activeGrind.image}
                alt={activeGrind.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-xs font-mono font-bold text-amber-gold border border-amber-gold/30">
                Ideal For: {activeGrind.suitableMethods.join(', ')}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 text-xs text-cream-soft/90 font-medium space-y-2">
              <div>
                <strong className="text-amber-gold">Sensory Impact:</strong> {activeGrind.sensoryImpact}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 rounded-2xl btn-tactile-amber text-espresso-950 text-xs font-extrabold shadow-xl active:scale-95 cursor-pointer"
            >
              Close Photo Bubble
            </button>

          </div>
        </div>
      )}

      {/* Contextual Amazon Affiliate Grinder Callout */}
      <div className="mt-8 p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-stone-300">
          <Gauge className="w-4 h-4 flex-shrink-0 text-[#D2A06E]" />
          <span>Consistent micron distribution requires precision European 40mm steel conical burrs (Baratza Encore, Fellow Ode, 1Zpresso).</span>
        </div>
        <a
          href="https://www.amazon.com/dp/B007F183LK/?tag=thebrewapp13-20"
          target="_blank"
          rel="nofollow sponsored noopener"
          data-product-name="Baratza Encore Conical Burr Grinder"
          data-link-id="baratza_encore_grinder"
          data-context="step3_grind_visual_guide"
          className="px-4 py-2 rounded-xl border font-extrabold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0 bg-[#A66E38]/20 text-[#D2A06E] hover:bg-[#A66E38]/30 border-[#A66E38]/40 shadow-xs active:scale-95"
        >
          Check Baratza Encore on Amazon ↗
        </a>
      </div>

    </section>
  );
}
