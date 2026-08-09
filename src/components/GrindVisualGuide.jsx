import React, { useState, useEffect } from 'react';
import { Gauge, Sparkles, Eye, X, Compass, Sliders, CheckCircle2 } from 'lucide-react';
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
    else if (methodId === 'pour_over') setSelectedGrindId('medium_fine');
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
            Preselected for <strong className="text-amber-gold">{activeMethod?.name}</strong> • Click any Burr Grinder setting to inspect high-definition macro photos
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

              {/* Photo Bubble Button */}
              <button
                onClick={(e) => handleOpenPhotoBubble(item, e)}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all shadow-inner ${
                  isSelected
                    ? 'bg-black/30 text-current border border-current/20 hover:bg-black/40'
                    : 'bg-amber-gold/20 text-amber-gold border border-amber-gold/30 hover:bg-amber-gold/30'
                }`}
              >
                <Eye className="w-3 h-3 fill-current" />
                <span>Photo Bubble</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Selected Grind Focus Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-espresso-950/95 border border-amber-gold/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            {/* Clickable Photo Bubble Preview Thumbnail */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-gold/60 shadow-2xl relative flex-shrink-0 cursor-pointer group hover:scale-105 transition-transform"
            >
              <img
                src={activeGrind.image}
                alt={activeGrind.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-amber-gold opacity-90 group-hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 drop-shadow" />
                <span className="text-[9px] font-extrabold uppercase mt-0.5">Inspect</span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h4 className="font-serif text-2xl font-extrabold text-cream-light">
                  {activeGrind.name} Grind
                </h4>
                <span className="px-3 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 font-mono text-xs font-bold">
                  {activeGrind.micron}
                </span>
              </div>

              <div className="text-xs text-cream-soft/80 font-medium mb-3">
                Texture Comparison: <strong className="text-amber-gold">{activeGrind.textureComparison}</strong>
              </div>

              <p className="text-xs text-cream-soft/90 leading-relaxed max-w-xl">
                {activeGrind.sensoryImpact}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-3 px-6 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
            >
              <Eye className="w-4 h-4 fill-current" />
              <span>Open HD Macro Photo Bubble</span>
            </button>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-cream-soft/70 text-right">
              <strong className="text-amber-gold font-bold">Ideal For: </strong>
              <span>{activeGrind.suitableMethods.join(', ')}</span>
            </div>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-cream-soft/80 font-medium flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-gold flex-shrink-0" />
          <span><strong className="text-amber-gold font-bold">Burr Setting Tip: </strong>{activeGrind.burrSettingTip}</span>
        </div>

        {/* Contextual Amazon Affiliate Recommendation Box for Precision Burr Coffee Grinders */}
        <div className="mt-5 p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-stone-300">
            <Gauge className="w-4 h-4 text-amber-gold flex-shrink-0" />
            <span>Uniform particle distribution requires precision conical or flat burr grinders (Fellow Ode Gen 2, Baratza Encore ESP, 1Zpresso).</span>
          </div>
          <a
            href="https://www.amazon.com/s?k=Burr+Coffee+Grinder+Espresso+Pour+Over&tag=thebrewapp13-20"
            target="_blank"
            rel="nofollow sponsored noopener"
            data-product-name="Precision Burr Coffee Grinders"
            data-link-id="precision_burr_grinders"
            data-context="step3_grind_burr"
            className="px-4 py-2 rounded-xl bg-amber-400/20 text-amber-gold hover:bg-amber-400/30 border border-amber-400/40 font-extrabold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0"
          >
            Check Coffee Grinders on Amazon ↗
          </a>
        </div>
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
