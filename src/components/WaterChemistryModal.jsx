import React, { useState } from 'react';
import { 
  Droplet, 
  FlaskConical, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Info, 
  ChevronRight, 
  Coffee, 
  Scale, 
  ShieldCheck, 
  HelpCircle,
  Award
} from 'lucide-react';

const WATER_PRESETS = [
  {
    id: 'sca_standard',
    name: 'SCA Official Standard',
    badge: 'Benchmark',
    tdsTarget: 150,
    ghTarget: 68,
    khTarget: 40,
    phTarget: 7.0,
    recommendedFor: 'Cup of Excellence cupping, all-round medium & light roasts',
    lotusFormula: { calcium: 3, magnesium: 3, buffer: 2 },
    diyFormula: { epsomMl: 12.5, bakingSodaMl: 8.5 },
    description: 'The Specialty Coffee Association baseline for balanced flavor clarity and acid-body equilibrium.'
  },
  {
    id: 'light_roast_clarity',
    name: 'Nordic & Washed Light Roast',
    badge: 'High Acidity & Florals',
    tdsTarget: 120,
    ghTarget: 80,
    khTarget: 25,
    phTarget: 6.8,
    recommendedFor: 'Washed Geisha, Ethiopian Yirgacheffe, Kenyan SL-28',
    lotusFormula: { calcium: 2, magnesium: 4, buffer: 1 },
    diyFormula: { epsomMl: 15.0, bakingSodaMl: 5.0 },
    description: 'Low bicarbonate buffer allows delicate jasmine, bergamot, and phosphoric berry acidity to sing.'
  },
  {
    id: 'natural_fruit_bomb',
    name: 'Anaerobic & Natural Sweetness',
    badge: 'Maximum Sweetness',
    tdsTarget: 135,
    ghTarget: 75,
    khTarget: 35,
    phTarget: 6.9,
    recommendedFor: 'Natural Processed, Anaerobic Fermentation, Fruit bombs',
    lotusFormula: { calcium: 3, magnesium: 2, buffer: 2 },
    diyFormula: { epsomMl: 11.0, bakingSodaMl: 7.0 },
    description: 'Higher calcium ratio amplifies perceived sweetness, heavy chocolate syrup, and stone fruit body.'
  },
  {
    id: 'espresso_anti_scale',
    name: 'Espresso Scale-Safe Crema',
    badge: 'Machine Protection',
    tdsTarget: 140,
    ghTarget: 50,
    khTarget: 50,
    phTarget: 7.2,
    recommendedFor: 'E61 dual boiler espresso machines, dark roasts, flat whites',
    lotusFormula: { calcium: 1, magnesium: 3, buffer: 3 },
    diyFormula: { epsomMl: 8.0, bakingSodaMl: 10.0 },
    description: 'Strictly prevents limescale accumulation in boiler heat exchangers while ensuring thick crema.'
  }
];

export default function WaterChemistryModal({ isOpen, onClose }) {
  const [selectedPreset, setSelectedPreset] = useState(WATER_PRESETS[1]); // Default to Light Roast
  const [waterBatchVolumeLiters, setWaterBatchVolumeLiters] = useState(1); // 1 Liter or 1 Gallon
  const [formulaMode, setFormulaMode] = useState('lotus'); // 'lotus' | 'diy' | 'tww'

  if (!isOpen) return null;

  // Scaling factor based on batch volume
  const scale = waterBatchVolumeLiters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-espresso-950/95 border border-[#A66E38]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="water-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  Extraction Science & Mineral Recipes
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-cream-soft text-[9px] font-mono font-bold">
                  TDS • GH/KH • Extraction Yield
                </span>
              </div>
              <h2 id="water-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-light">
                Coffee Water Chemistry Lab
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition"
            title="Close water lab"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Science Overview Notice */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-cream-soft/90 leading-relaxed">
              <p className="font-bold text-cream-light mb-1">Water makes up 98.5% of your filter coffee.</p>
              Tap water with high bicarbonate (KH) neutralizes delicate fruit acids, making high-end coffee taste flat and chalky. Pure distilled water lacks minerals to bind flavor compounds. Use these targeted mineral ratios with zero-TDS distilled or reverse-osmosis (RO) water.
            </div>
          </div>

          {/* Preset Profiles Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-gold">
                1. Select Roast & Brewing Profile
              </span>
              <span className="text-[11px] font-mono text-cream-soft/60">4 Verified Presets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WATER_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-4 rounded-2xl border text-left transition-all active:scale-98 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-gold shadow-lg shadow-amber-gold/15 ring-1 ring-amber-gold'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-serif font-bold text-sm text-cream-light">
                          {preset.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-amber-gold">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-cream-soft/75 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-gold font-bold">{preset.tdsTarget} PPM</span>
                      <span className="text-cream-soft/60">GH: {preset.ghTarget} | KH: {preset.khTarget}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mineral Targets Matrix */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="font-mono text-xs font-bold text-cream-light flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Target Ionic Concentration ({selectedPreset.name})</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SCA Compliant Range</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] font-mono text-cream-soft/60 uppercase">Total TDS</div>
                <div className="text-lg font-bold text-amber-gold font-mono mt-0.5">{selectedPreset.tdsTarget} PPM</div>
                <div className="text-[9px] text-cream-soft/50 font-mono">Optimal: 120–150</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] font-mono text-cream-soft/60 uppercase">General Hardness (GH)</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{selectedPreset.ghTarget} PPM</div>
                <div className="text-[9px] text-cream-soft/50 font-mono">Ca²⁺ / Mg²⁺ ions</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] font-mono text-cream-soft/60 uppercase">Alkalinity Buffer (KH)</div>
                <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">{selectedPreset.khTarget} PPM</div>
                <div className="text-[9px] text-cream-soft/50 font-mono">HCO₃⁻ buffer</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] font-mono text-cream-soft/60 uppercase">Target pH</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{selectedPreset.phTarget}</div>
                <div className="text-[9px] text-cream-soft/50 font-mono">Neutral extraction</div>
              </div>
            </div>
          </div>

          {/* Exact Mixing Formula & Batch Scaler */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-gold">
                  2. Mixing Formula & Batch Scaler
                </span>
                <p className="text-[11px] text-cream-soft/70 mt-0.5">Start with 100% distilled or ZeroWater RO baseline.</p>
              </div>

              {/* Water Volume Selector */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/15">
                {[1, 2, 3.8].map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setWaterBatchVolumeLiters(vol)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                      waterBatchVolumeLiters === vol
                        ? 'bg-amber-gold text-espresso-950 shadow'
                        : 'text-cream-soft hover:text-cream-light'
                    }`}
                  >
                    {vol === 3.8 ? '1 Gal (3.8L)' : `${vol} Liter${vol > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Formula Type Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setFormulaMode('lotus')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  formulaMode === 'lotus'
                    ? 'bg-white/15 text-cream-light border border-white/20'
                    : 'text-cream-soft/70 hover:text-cream-light'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lotus Drops Formula</span>
              </button>
              <button
                onClick={() => setFormulaMode('diy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  formulaMode === 'diy'
                    ? 'bg-white/15 text-cream-light border border-white/20'
                    : 'text-cream-soft/70 hover:text-cream-light'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-gold" />
                <span>DIY Salts (Epsom + Baking Soda)</span>
              </button>
            </div>

            {/* Calculated Formula Output */}
            {formulaMode === 'lotus' ? (
              <div className="p-5 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cream-light">Lotus Coffee Water Drops ({waterBatchVolumeLiters}L batch)</span>
                  <span className="text-cyan-400 font-bold">Standard 450mL Ratio Scaled</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Calcium Drops</span>
                    <span className="text-2xl font-extrabold text-cyan-400 block mt-1">
                      {Math.round(selectedPreset.lotusFormula.calcium * scale)}
                    </span>
                    <span className="text-[9px] text-cream-soft/50">For floral notes</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Magnesium Drops</span>
                    <span className="text-2xl font-extrabold text-emerald-400 block mt-1">
                      {Math.round(selectedPreset.lotusFormula.magnesium * scale)}
                    </span>
                    <span className="text-[9px] text-cream-soft/50">For fruit acidity</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Buffer Drops</span>
                    <span className="text-2xl font-extrabold text-amber-gold block mt-1">
                      {Math.round(selectedPreset.lotusFormula.buffer * scale)}
                    </span>
                    <span className="text-[9px] text-cream-soft/50">For alkalinity</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cream-light">DIY Concentrates ({waterBatchVolumeLiters}L batch)</span>
                  <span className="text-amber-gold font-bold">Barista Hustle Standard</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center font-mono">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Epsom Salt Solution (Hardness)</span>
                    <span className="text-2xl font-extrabold text-cyan-400 block mt-1">
                      {(selectedPreset.diyFormula.epsomMl * (waterBatchVolumeLiters / 3.8)).toFixed(1)} mL
                    </span>
                    <span className="text-[9px] text-cream-soft/50">From 71.4g/L MgSO₄ stock</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Baking Soda Solution (Buffer)</span>
                    <span className="text-2xl font-extrabold text-amber-gold block mt-1">
                      {(selectedPreset.diyFormula.bakingSodaMl * (waterBatchVolumeLiters / 3.8)).toFixed(1)} mL
                    </span>
                    <span className="text-[9px] text-cream-soft/50">From 16.8g/L NaHCO₃ stock</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono">
          <span className="text-cream-soft/60">
            Target brew temperature: <strong className="text-amber-gold">200°F–205°F (93°C–96°C)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-bold uppercase tracking-wider transition active:scale-95"
          >
            Ready to Brew
          </button>
        </div>
      </div>
    </div>
  );
}
