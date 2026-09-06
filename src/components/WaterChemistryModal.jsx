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
  Award,
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check
} from 'lucide-react';
import { BOTTLED_WATERS, BOTTLED_WATER_CATEGORIES } from '../data/bottledWaterData';

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
  const [activeTab, setActiveTab] = useState('bottled'); // 'bottled' | 'custom'
  const [selectedPreset, setSelectedPreset] = useState(WATER_PRESETS[1]); // Default to Light Roast
  const [waterBatchVolumeLiters, setWaterBatchVolumeLiters] = useState(1); // 1 Liter or 1 Gallon
  const [formulaMode, setFormulaMode] = useState('lotus'); // 'lotus' | 'diy'
  const [bottledCategory, setBottledCategory] = useState('all');
  const [bottledSearch, setBottledSearch] = useState('');
  const [expandedWaterId, setExpandedWaterId] = useState(null);

  if (!isOpen) return null;

  // Scaling factor based on batch volume
  const scale = waterBatchVolumeLiters;

  // Filter bottled waters
  const filteredBottledWaters = BOTTLED_WATERS.filter((water) => {
    const matchesCategory = bottledCategory === 'all' || water.category === bottledCategory;
    const q = bottledSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      water.name.toLowerCase().includes(q) || 
      water.brand.toLowerCase().includes(q) || 
      water.source.toLowerCase().includes(q) ||
      water.verdictBadge.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
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
                  TDS • GH/KH • Bottled Water
                </span>
              </div>
              <h2 id="water-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-light">
                Coffee Water Chemistry Lab
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition cursor-pointer"
            title="Close water lab"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Mode Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-black/30 px-5 sm:px-6 pt-3 gap-3 sm:gap-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('bottled')}
            className={`pb-3 text-xs sm:text-sm font-mono font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'bottled'
                ? 'border-amber-gold text-amber-gold shadow-[0_2px_10px_rgba(210,160,110,0.3)]'
                : 'border-transparent text-cream-soft/60 hover:text-cream-light'
            }`}
          >
            <Droplet className="w-4 h-4 text-amber-gold" />
            <span>Bottled Water Guide</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30">
              Grocery Store
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-3 text-xs sm:text-sm font-mono font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'custom'
                ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(34,211,238,0.3)]'
                : 'border-transparent text-cream-soft/60 hover:text-cream-light'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <span>Mineral Recipes & Scaler</span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[9px] font-mono font-bold border border-cyan-500/30">
              Lotus / DIY
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* ========================================================================= */}
          {/* TAB 1: BOTTLED WATER GUIDE & DATABASE */}
          {/* ========================================================================= */}
          {activeTab === 'bottled' && (
            <div className="space-y-5">
              
              {/* Educational Notice */}
              <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 flex items-start gap-3">
                <Droplet className="w-5 h-5 text-amber-gold flex-shrink-0 mt-0.5" />
                <div className="text-xs text-cream-soft/90 leading-relaxed">
                  <p className="font-bold text-cream-light mb-1">
                    No droppers or mineral scales? Buy these off the grocery shelf.
                  </p>
                  Water accounts for <strong>98.5% of your cup</strong>. The SCA target is <strong>75–250 ppm TDS (optimal 150 ppm)</strong> with balanced General Hardness (GH) and moderate Alkalinity (KH). Below are lab-verified mineral profiles of commercial bottled waters and their impact on extraction flavor.
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={bottledSearch}
                    onChange={(e) => setBottledSearch(e.target.value)}
                    placeholder="Search brand, spring source, or country (e.g. Crystal Geyser, Volvic, France)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs font-mono text-cream-light placeholder:text-stone-500 focus:outline-none focus:border-amber-gold/60 focus:ring-1 focus:ring-amber-gold/40"
                  />
                  {bottledSearch && (
                    <button
                      onClick={() => setBottledSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {BOTTLED_WATER_CATEGORIES.map((cat) => {
                    const count = cat.id === 'all' 
                      ? BOTTLED_WATERS.length 
                      : BOTTLED_WATERS.filter(w => w.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setBottledCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                          bottledCategory === cat.id
                            ? 'bg-amber-gold text-espresso-950 shadow-md font-extrabold'
                            : 'bg-white/[0.05] border border-white/10 text-stone-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="text-[10px] opacity-75 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottled Water List Cards */}
              <div className="space-y-4">
                {filteredBottledWaters.length === 0 ? (
                  <div className="p-8 text-center border border-white/10 rounded-2xl bg-black/30">
                    <p className="text-sm font-mono text-stone-400">No bottled waters matched your search.</p>
                    <button
                      onClick={() => { setBottledSearch(''); setBottledCategory('all'); }}
                      className="mt-2 text-xs font-mono text-amber-gold hover:underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  filteredBottledWaters.map((water) => {
                    const isExpanded = expandedWaterId === water.id;
                    const isOptimal = water.tds >= 75 && water.tds <= 250;
                    const isTooSoft = water.tds < 75;
                    const isTooHard = water.tds > 250;

                    return (
                      <div
                        key={water.id}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                          water.category === 'recommended'
                            ? 'bg-[#150E09]/90 border-[#A66E38]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#A66E38]/70'
                            : 'bg-black/40 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="p-4 sm:p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-serif font-bold text-base sm:text-lg text-cream-light">
                                  {water.name}
                                </h3>
                                <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                                  {[...Array(water.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-[11px] font-mono text-stone-400 mt-0.5 flex items-center gap-1.5">
                                <span>📍 {water.source}</span>
                                <span>•</span>
                                <span className="text-stone-300 font-semibold">{water.brand}</span>
                              </p>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wide border self-start sm:self-auto ${
                              water.verdictColor === 'emerald'
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                : water.verdictColor === 'cyan'
                                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                                : water.verdictColor === 'amber'
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                : water.verdictColor === 'blue'
                                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                                : water.verdictColor === 'rose'
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                                : 'bg-stone-500/15 border-stone-500/40 text-stone-300'
                            }`}>
                              {water.verdictBadge}
                            </span>
                          </div>

                          {/* Quick Metrics Bar */}
                          <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs">
                            <div>
                              <span className="text-[9px] text-stone-400 block uppercase">TDS</span>
                              <span className={`font-black text-sm block mt-0.5 ${
                                isOptimal ? 'text-emerald-400' : isTooSoft ? 'text-cyan-300' : 'text-rose-400'
                              }`}>
                                {water.tds} PPM
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-stone-400 block uppercase">Hardness (GH)</span>
                              <span className="font-bold text-sm block mt-0.5 text-cyan-400">
                                {water.gh}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-stone-400 block uppercase">Alkalinity (KH)</span>
                              <span className="font-bold text-sm block mt-0.5 text-amber-300">
                                {water.kh}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-stone-400 block uppercase">pH</span>
                              <span className="font-bold text-sm block mt-0.5 text-cream-light">
                                {water.ph}
                              </span>
                            </div>
                          </div>

                          {/* Recommendation & Tasting Impact */}
                          <div className="space-y-2 text-xs">
                            <p className="text-cream-light font-medium leading-relaxed">
                              {water.recommendation}
                            </p>
                            <p className="text-cream-soft/80 leading-relaxed text-[11px] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                              <strong className="text-amber-gold font-mono">Tasting Profile: </strong>
                              {water.tastingImpact}
                            </p>
                          </div>

                          {/* Preparation / Brewing Tip Pill */}
                          <div className="flex items-start gap-2 text-xs font-mono text-emerald-300/90 bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-xl">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span><strong>Brew Tip:</strong> {water.preparationTip}</span>
                          </div>

                          {/* Expandable Mineral Analysis Toggle */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setExpandedWaterId(isExpanded ? null : water.id)}
                              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>{isExpanded ? 'Hide Mineral Ion Analysis' : 'View Full Mineral Ion Breakdown'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 p-3.5 rounded-xl bg-black/60 border border-cyan-500/30 text-xs font-mono space-y-2 animate-fade-in">
                                <div className="text-[10px] uppercase font-bold text-cyan-300">
                                  Laboratory Ion Concentration (mg/L):
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                                  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                                    <span className="text-stone-400 block">Calcium (Ca²⁺):</span>
                                    <span className="text-cream-light font-bold">{water.minerals.calcium} mg/L</span>
                                  </div>
                                  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                                    <span className="text-stone-400 block">Magnesium (Mg²⁺):</span>
                                    <span className="text-cream-light font-bold">{water.minerals.magnesium} mg/L</span>
                                  </div>
                                  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                                    <span className="text-stone-400 block">Sodium (Na⁺):</span>
                                    <span className="text-cream-light font-bold">{water.minerals.sodium} mg/L</span>
                                  </div>
                                  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                                    <span className="text-stone-400 block">Potassium (K⁺):</span>
                                    <span className="text-cream-light font-bold">{water.minerals.potassium} mg/L</span>
                                  </div>
                                  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                                    <span className="text-stone-400 block">Bicarbonate (HCO₃⁻):</span>
                                    <span className="text-amber-300 font-bold">{water.minerals.bicarbonate} mg/L</span>
                                  </div>
                                  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                                    <span className="text-stone-400 block">Silica (SiO₂):</span>
                                    <span className="text-cyan-300 font-bold">{water.minerals.silica} mg/L</span>
                                  </div>
                                </div>
                                <div className="text-[10px] text-stone-400 italic pt-1 border-t border-white/10">
                                  SCA Target Status: {water.scaCompliance}
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CUSTOM MINERAL RECIPES & BATCH SCALER */}
          {/* ========================================================================= */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              
              {/* Science Overview Notice */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-cream-soft/90 leading-relaxed">
                  <p className="font-bold text-cream-light mb-1">Water makes up 98.5% of your filter coffee.</p>
                  Tap water with high bicarbonate (KH) neutralizes delicate fruit acids, making high-end coffee taste flat and chalky. Pure distilled water lacks minerals to bind flavor compounds. Use these targeted mineral ratios with zero-TDS distilled or reverse-osmosis (RO) water.
                </div>
              </div>

              {/* Shortcut Banner to Bottled Water Tab */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs">
                  <Droplet className="w-4 h-4 text-amber-gold flex-shrink-0" />
                  <span className="text-cream-light">
                    Want to skip mixing powders? Use off-the-shelf bottled waters like <strong>Crystal Geyser</strong> or <strong>Volvic</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('bottled')}
                  className="px-3 py-1 rounded-xl bg-amber-gold text-espresso-950 font-mono font-bold text-xs whitespace-nowrap hover:bg-amber-400 transition cursor-pointer"
                >
                  View Bottled Waters
                </button>
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
                        className={`p-4 rounded-2xl border text-left transition-all active:scale-98 flex flex-col justify-between cursor-pointer ${
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
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
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono">
          <span className="text-cream-soft/60">
            SCA Target TDS: <strong className="text-amber-gold">150 PPM</strong> (Range: 75–250)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-bold uppercase tracking-wider transition active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
