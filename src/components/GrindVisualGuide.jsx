import React, { useState } from 'react';
import { Gauge, Sparkles, Eye, X, Compass, Sliders, CheckCircle2 } from 'lucide-react';
import { GRIND_VISUAL_GUIDE } from '../data/brewData';

export default function GrindVisualGuide({ activeMethod }) {
  const [selectedGrindId, setSelectedGrindId] = useState('medium_fine');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            Click any Burr Grinder setting to inspect actual high-definition macro photos of each coarseness level
          </p>
        </div>

        <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40 shadow-inner">
          Interactive Photo Bubbles Available
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

              {/* Photo Bubble Trigger Button */}
              <button
                onClick={(e) => handleOpenPhotoBubble(item, e)}
                className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 border transition-all active:scale-95 shadow ${
                  isSelected
                    ? 'bg-espresso-950 text-amber-gold border-amber-gold/40 hover:bg-black'
                    : 'bg-white/10 border-white/15 text-cream-light hover:bg-amber-gold/20 hover:text-amber-gold'
                }`}
                title={`View Macro Photo of ${item.name} Coffee Grounds`}
              >
                <Eye className="w-3 h-3 fill-current" />
                <span>Photo Bubble</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Coarseness Reference Showcase Card */}
      {activeGrind && (
        <div className="p-6 md:p-8 rounded-3xl bg-espresso-950/95 border border-amber-gold/40 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/10">
            
            <div className="flex items-center space-x-4">
              {/* Thumbnail Preview Circle */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-gold shadow-xl cursor-pointer group flex-shrink-0"
                title="Click to expand macro photo bubble"
              >
                <img
                  src={activeGrind.image}
                  alt={activeGrind.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                  <Eye className="w-5 h-5 text-cream-light drop-shadow" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light tracking-wide">
                    {activeGrind.name} Grind
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 text-xs font-mono font-bold">
                    {activeGrind.micron}
                  </span>
                </div>
                <div className="text-xs text-cream-soft/80 font-medium">
                  Texture Comparison: <strong className="text-amber-gold">{activeGrind.textureComparison}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl btn-tactile-amber text-espresso-950 text-xs font-extrabold flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Eye className="w-4 h-4 fill-current" />
              <span>Inspect {activeGrind.name} Macro Photo</span>
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Suitable Brewing Methods */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-gold mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-gold" />
                <span>Optimal Coffee Methods for {activeGrind.name}:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeGrind.suitableMethods.map((method, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-gold/15 text-amber-gold border border-amber-gold/30 text-xs font-extrabold shadow-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Burr Grinder Setting Tip */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
              <div className="text-xs font-extrabold uppercase tracking-wider text-cream-soft/80 mb-2 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-gold" />
                <span>Burr Grinder Setting Guide:</span>
              </div>
              <p className="text-xs text-cream-soft/90 font-medium leading-relaxed">
                {activeGrind.burrSettingTip}
              </p>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-cream-soft/80 font-medium leading-relaxed flex items-center justify-between">
            <span>
              <strong className="text-amber-gold">Sensory Extraction Impact:</strong> {activeGrind.sensoryImpact}
            </span>
          </div>

        </div>
      )}

      {/* MACRO PHOTO BUBBLE MODAL POPUP */}
      {isModalOpen && activeGrind && (
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
              <span>Macro Photo Inspection • {activeGrind.micron}</span>
            </div>

            <h3 className="font-serif text-2xl font-extrabold text-cream-light mb-4">
              {activeGrind.name} Ground Coffee Photo
            </h3>

            {/* High-Definition Macro Photo Container */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-amber-gold/40 shadow-2xl mb-5 relative group">
              <img
                src={activeGrind.image}
                alt={activeGrind.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-xs font-mono font-bold text-amber-gold border border-amber-gold/30">
                Texture: {activeGrind.textureComparison}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 text-xs text-cream-soft/90 font-medium space-y-2">
              <div>
                <strong className="text-amber-gold">Burr Setting Range:</strong> {activeGrind.burrSettingTip}
              </div>
              <div>
                <strong className="text-amber-gold">Particle Density:</strong> {activeGrind.visualDensity}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 rounded-2xl btn-tactile-amber text-espresso-950 text-xs font-extrabold shadow-xl active:scale-95"
            >
              Close Macro Photo Bubble
            </button>

          </div>

        </div>
      )}

    </section>
  );
}
