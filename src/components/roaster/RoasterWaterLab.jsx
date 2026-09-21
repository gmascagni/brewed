import React from 'react';
import { Droplet, ArrowRight, AlertCircle } from 'lucide-react';

export default function RoasterWaterLab({
  roaster,
  orchestrator,
  onOpenWaterLabWithProfile
}) {
  if (!roaster) return null;

  const hasCustomWater = Boolean(roaster.recommendedWater && roaster.recommendedWater.targetTds);
  const waterSpec = hasCustomWater ? roaster.recommendedWater : {
    targetTds: 140,
    gh: 70,
    kh: 30,
    ph: 7.0,
    philosophy: 'The Brew App Specialty Extraction Benchmark (calculated based on Specialty Coffee Association standards: 140 PPM TDS, 70 GH general hardness, 30 KH buffer alkalinity, 7.0 neutral pH for optimal clarity and enzymatic sweetness).',
    diyFormula: { epsomMl: 14.5, bakingSodaMl: 5.5 },
    bottledWaterPairing: 'Crystal Geyser (Mount Shasta or Alpine source) or Volvic Natural Spring Water'
  };

  const handleOpenWaterLab = () => {
    if (orchestrator) {
      orchestrator.water(waterSpec);
    } else if (onOpenWaterLabWithProfile) {
      onOpenWaterLabWithProfile(waterSpec);
    }
  };

  return (
    <div id="water-specs" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-black/50 to-espresso-950 border border-cyan-500/30 space-y-6 shadow-xl scroll-mt-24">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                {hasCustomWater ? 'Roaster-Approved Mineral Profile' : 'Specialty SCA Standard Extraction Spec'}
              </span>
              {!hasCustomWater && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Calculated SCA Default
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl font-bold text-cream-light">
              {roaster.name || 'Specialty Roastery'} Cupping Room Water Specification
            </h3>
          </div>
        </div>

        <button
          onClick={handleOpenWaterLab}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition cursor-pointer"
        >
          <span>Open in Water Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {!hasCustomWater && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Transparency Notice:</strong> {roaster.name} has not published custom cupping room water metrics. Displaying <strong>The Brew App Specialty Extraction Benchmark</strong> (calculated based on Specialty Coffee Association standards: 140 PPM TDS, 70 GH general hardness, 30 KH buffer alkalinity, 7.0 neutral pH for optimal clarity and enzymatic sweetness).
          </p>
        </div>
      )}

      <p className="text-sm text-cream-soft font-sans leading-relaxed">
        {waterSpec.philosophy}
      </p>

      {/* Water Targets Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
          <span className="text-[10px] uppercase text-cyan-400/80 block">Target TDS</span>
          <span className="text-2xl font-bold text-cream-light">{waterSpec.targetTds}</span>
          <span className="text-[10px] text-cream-soft/60 block">PPM</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
          <span className="text-[10px] uppercase text-cyan-400/80 block">Hardness (GH)</span>
          <span className="text-2xl font-bold text-amber-gold">{waterSpec.gh}</span>
          <span className="text-[10px] text-cream-soft/60 block">PPM CaCO3</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
          <span className="text-[10px] uppercase text-cyan-400/80 block">Buffer (KH)</span>
          <span className="text-2xl font-bold text-emerald-400">{waterSpec.kh}</span>
          <span className="text-[10px] text-cream-soft/60 block">PPM CaCO3</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
          <span className="text-[10px] uppercase text-cyan-400/80 block">Target pH</span>
          <span className="text-2xl font-bold text-cyan-300">{waterSpec.ph}</span>
          <span className="text-[10px] text-cream-soft/60 block">Neutral Balanced</span>
        </div>
      </div>

      {/* DIY & Bottled Water Recommendation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <div className="font-mono text-cyan-400 font-bold">
            DIY Mineral Formula (Per 1L Distilled Water):
          </div>
          <p className="text-cream-soft font-sans">
            {waterSpec.diyFormula
              ? `${waterSpec.diyFormula.epsomMl}mL Epsom Salt concentrate + ${waterSpec.diyFormula.bakingSodaMl}mL Baking Soda concentrate`
              : '14.5mL Epsom Salt concentrate + 5.5mL Baking Soda concentrate'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <div className="font-mono text-amber-gold font-bold">
            Recommended Bottled Water Pairing:
          </div>
          <p className="text-cream-soft font-sans">
            {waterSpec.bottledWaterPairing || 'Crystal Geyser (Mount Shasta source) or Volvic Natural Spring Water'}
          </p>
        </div>
      </div>

    </div>
  );
}
