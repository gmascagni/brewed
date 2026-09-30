import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sliders, 
  Sparkles, 
  Check, 
  Coffee, 
  Info, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { GRINDER_PROFILES, getSavedGrinderId, saveGrinderId } from '../data/grinderProfiles';
import { trackEvent } from '../utils/analytics';
import { hapticTap, hapticSuccess } from '../utils/haptics';

const CANONICAL_TIERS = [
  {
    id: 'extra_fine',
    name: 'Extra-Fine',
    micron: '200 – 300 µm',
    texture: 'Powdered sugar / Flour',
    methods: '9-Bar Espresso, Turkish Ibrik',
    icon: '⚡'
  },
  {
    id: 'fine',
    name: 'Fine',
    micron: '350 – 500 µm',
    texture: 'Fine table salt',
    methods: 'Moka Pot, AeroPress short concentrate',
    icon: '☕'
  },
  {
    id: 'medium_fine',
    name: 'Medium-Fine',
    micron: '400 – 600 µm',
    texture: 'Table salt / Sand',
    methods: 'Hario V60, Kalita 155, Origami Dripper',
    icon: '✨'
  },
  {
    id: 'medium',
    name: 'Medium',
    micron: '600 – 750 µm',
    texture: 'Kosher salt / Granulated sugar',
    methods: 'Kalita Wave 185, Clever Dripper, Batch Brew',
    icon: '🎯'
  },
  {
    id: 'medium_coarse',
    name: 'Medium-Coarse',
    micron: '750 – 900 µm',
    texture: 'Coarse sea salt',
    methods: 'Chemex 6–8 Cup Bonded Filter',
    icon: '⏳'
  },
  {
    id: 'coarse',
    name: 'Coarse',
    micron: '800 – 1000 µm',
    texture: 'Cracked black peppercorns',
    methods: 'French Press, Toddy Cold Brew Immersion',
    icon: '🪵'
  }
];

export default function GrindTranslatorModal({
  isOpen,
  onClose,
  initialTier = 'medium_fine',
  onSelectGrinder = null
}) {
  if (!isOpen) return null;

  const [activeTierId, setActiveTierId] = useState(initialTier);
  const [activeGrinderId, setActiveGrinderId] = useState(() => getSavedGrinderId());
  const activeTier = CANONICAL_TIERS.find(t => t.id === activeTierId) || CANONICAL_TIERS[2];

  const handleSelectGrinder = (grinderId) => {
    hapticSuccess();
    setActiveGrinderId(grinderId);
    saveGrinderId(grinderId);
    if (onSelectGrinder) onSelectGrinder(grinderId);
    trackEvent('set_default_grinder', { grinder_id: grinderId });
  };

  const handleTierChange = (tierId) => {
    hapticTap();
    setActiveTierId(tierId);
    trackEvent('grind_translator_tier_changed', { tier_id: tierId });
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grind-translator-modal-title"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#14100D] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-cream-light animate-slide-up">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-gold flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                  Cross-Grinder Calibration
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Micron Translation Matrix
                </span>
              </div>
              <h3 id="grind-translator-modal-title" className="font-serif text-lg sm:text-xl font-bold text-cream-light leading-tight mt-0.5">
                Grind Size Translation Across Common Grinders
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/10 transition cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
          
          {/* 1. Canonical Particle Size Tier Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-cream-light">
                Select Grind Spectrum Tier:
              </label>
              <span className="text-[10px] font-mono text-stone-400">
                Calibrated across 9 standard grinders
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
              {CANONICAL_TIERS.map(tier => {
                const isActive = tier.id === activeTierId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleTierChange(tier.id)}
                    className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg font-bold scale-[1.02]'
                        : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{tier.icon}</span>
                    <span className="text-[11px] font-bold leading-tight">{tier.name}</span>
                    <span className="text-[8px] text-stone-400">{tier.micron}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Active Tier Physics & Texture Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-gold font-bold uppercase tracking-wider text-[11px]">
                  {activeTier.name} Particle Target:
                </span>
                <span className="text-stone-300 font-bold">{activeTier.micron}</span>
              </div>
              <p className="text-stone-300 font-sans text-xs mt-0.5">
                Physical Texture: <strong className="text-cream-light">{activeTier.texture}</strong> • Ideal for: <strong className="text-amber-gold">{activeTier.methods}</strong>
              </p>
            </div>
            <div className="text-[11px] text-stone-400 shrink-0">
              Active Grinder: <strong className="text-amber-300">{GRINDER_PROFILES.find(g => g.id === activeGrinderId)?.name || 'Generic'}</strong>
            </div>
          </div>

          {/* 3. Cross-Grinder Translation Cards Grid */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-gold block">
              Exact Setting per Grinder Model:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GRINDER_PROFILES.map(grinder => {
                const settingObj = grinder.settings[activeTierId];
                const isSelected = grinder.id === activeGrinderId;

                return (
                  <div 
                    key={grinder.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block">
                            {grinder.brand}
                          </span>
                          <h4 className="font-serif text-base font-bold text-cream-light leading-snug">
                            {grinder.name}
                          </h4>
                        </div>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[9px] font-mono font-bold uppercase shrink-0">
                            My Grinder
                          </span>
                        )}
                      </div>

                      {/* Main Setting Value */}
                      <div className="mt-3 p-3 rounded-xl bg-black/60 border border-white/10 text-center">
                        <span className="text-xl sm:text-2xl font-mono font-black text-amber-gold block tracking-tight">
                          {settingObj?.setting || 'N/A'}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 block mt-0.5 line-clamp-1">
                          {settingObj?.subtext || grinder.burrType}
                        </span>
                      </div>
                    </div>

                    {/* Grinder Details & Set Default Action */}
                    <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                      <span className="text-[9px] text-stone-500 truncate max-w-[140px]">
                        {grinder.calibrationTip || grinder.description}
                      </span>

                      {!isSelected && (
                        <button
                          type="button"
                          onClick={() => handleSelectGrinder(grinder.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white border border-white/10 text-[10px] transition cursor-pointer active:scale-95"
                          title="Save as my default grinder"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
