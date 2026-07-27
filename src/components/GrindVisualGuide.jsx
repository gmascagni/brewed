import React, { useState } from 'react';
import { Gauge, Sparkles, Layers, Sliders, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';
import { GRIND_VISUAL_GUIDE } from '../data/brewData';

export default function GrindVisualGuide({ activeMethod }) {
  const [selectedGrindId, setSelectedGrindId] = useState('medium_fine');

  const activeGrind = GRIND_VISUAL_GUIDE.find((g) => g.id === selectedGrindId) || GRIND_VISUAL_GUIDE[2];

  return (
    <section className="mt-10 p-7 md:p-9 rounded-3xl glass-panel shadow-2xl transition-all duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
            <Gauge className="w-4 h-4 animate-pulse" />
            <span>Coffee Grind Coarseness Visual Reference Guide</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
            Particle Size, Texture & Microns ($\mu\text{m}$) Reference
          </h3>
          <p className="text-xs md:text-sm text-cream-soft/70 mt-1">
            Compare coffee ground coarseness using real-world food textures (Table Salt, Sand, Kosher Salt, Cracked Pepper)
          </p>
        </div>

        <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40 shadow-inner">
          6 Coarseness Grades
        </span>
      </div>

      {/* Grind Coarseness Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {GRIND_VISUAL_GUIDE.map((item) => {
          const isSelected = item.id === activeGrind.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedGrindId(item.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 shadow-lg ${
                isSelected
                  ? 'btn-tactile-amber text-espresso-950 scale-105 font-extrabold ring-2 ring-amber-gold'
                  : 'bg-espresso-900/80 border-white/10 text-cream-soft hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-extrabold tracking-wide drop-shadow mb-1">{item.name}</div>
              <div className="text-[11px] font-mono font-bold text-amber-gold mb-1">{item.micron}</div>
              <div className={`text-[10px] truncate ${isSelected ? 'opacity-90 font-semibold' : 'text-cream-soft/60'}`}>
                {item.textureComparison.split('/')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Selected Grind Detail Showcase Card */}
      {activeGrind && (
        <div className="p-6 md:p-8 rounded-3xl bg-espresso-950/95 border border-amber-gold/40 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
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

            <div className="text-xs font-mono font-bold bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 text-cream-light">
              Visual Particle Density: {activeGrind.visualDensity}
            </div>
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

            {/* Extraction & Sensory Impact */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
              <div className="text-xs font-extrabold uppercase tracking-wider text-cream-soft/80 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Extraction & Flavor Impact:</span>
              </div>
              <p className="text-xs text-cream-soft/90 font-medium leading-relaxed">
                {activeGrind.sensoryImpact}
              </p>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-cream-soft/80 font-medium leading-relaxed">
            <strong className="text-amber-gold">Grinder Calibration Note:</strong> Grinder burr sizes and dial numbers vary between manufacturers (e.g. Fellow Ode, Baratza Encore, Comandante). Always adjust grind size by inspecting the physical particle texture comparison above.
          </div>

        </div>
      )}

    </section>
  );
}
