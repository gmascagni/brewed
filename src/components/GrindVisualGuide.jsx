import React, { useState, useEffect } from 'react';
import { Gauge, Sparkles, Eye, X } from 'lucide-react';
import { GRIND_VISUAL_GUIDE } from '../data/brewData';

export default function GrindVisualGuide({ activeMethod }) {
  const [selectedGrindId, setSelectedGrindId] = useState('medium_fine');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const activeGrind = GRIND_VISUAL_GUIDE.find((g) => g.id === selectedGrindId) || GRIND_VISUAL_GUIDE[2];

  const handleOpenPhotoBubble = (grindItem, e) => {
    e.stopPropagation();
    setSelectedGrindId(grindItem.id);
    setIsModalOpen(true);
  };

  return (
    <section className="mt-10 p-7 md:p-9 rounded-3xl glass-panel shadow-2xl transition-all duration-500 relative">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
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

      {/* Burr Grinder Settings Buttons Grid with Instant Photo Bubble Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {GRIND_VISUAL_GUIDE.map((item) => {
          const isSelected = item.id === activeGrind.id;
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
                <div className={`text-[10px] truncate mb-3 ${isSelected ? 'opacity-90 font-semibold' : 'text-cream-soft/60'}`}>
                  {item.textureComparison.split('/')[0]}
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
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-3">
            <h4 className="font-serif text-xl font-bold text-cream-light">
              {activeGrind.name} Grind Setting ({activeGrind.micron})
            </h4>
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30">
              {activeGrind.textureComparison}
            </span>
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
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-cream-light hover:text-amber-gold hover:bg-white/20 transition-all border border-white/15"
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
            <p className="text-xs text-cream-soft/80 mb-4 font-medium">
              Texture Comparison: <strong className="text-amber-gold">{activeGrind.textureComparison}</strong>
            </p>

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
                <strong className="text-amber-gold">Recommended Burr Settings:</strong> {activeGrind.burrSettingTip}
              </div>
              <div>
                <strong className="text-amber-gold">Sensory Impact:</strong> {activeGrind.sensoryImpact}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
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
