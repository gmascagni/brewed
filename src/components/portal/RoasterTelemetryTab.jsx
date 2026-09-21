import React from 'react';
import { Sparkles, Coffee, CheckCircle2 } from 'lucide-react';
import { getRoasterTelemetry } from '../../utils/telemetry';

export default function RoasterTelemetryTab({
  activeRoasterKey = 'methodical'
}) {
  const telemetry = getRoasterTelemetry(activeRoasterKey || 'methodical');
  const totalMethods = Object.values(telemetry.methodsUsed || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Telemetry Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-espresso-900 to-espresso-950 border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/20 text-amber-gold text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-amber-gold/40">
              <Sparkles className="w-3 h-3" />
              <span>Roaster Telemetry Engine</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-cream-light">
              Consumer Extraction & Dial-In Telemetry
            </h3>
            <p className="text-xs text-cream-soft max-w-2xl mt-1">
              Anonymized real-time extraction metrics captured when specialty coffee drinkers scan your retail bags and execute Guided Brew recipes.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 self-start sm:self-auto">
            🟢 Live Telemetry Stream
          </span>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs text-stone-400 font-sans">Total Guided Dial-Ins</span>
          <div className="font-serif text-3xl font-bold text-cream-light mt-1">
            {telemetry.totalDialIns}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 inline-block">
            Home extractions executed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs text-stone-400 font-sans">Average Customer Ratio</span>
          <div className="font-serif text-3xl font-bold text-amber-gold mt-1">
            1:{telemetry.avgRatio}
          </div>
          <span className="text-[11px] font-mono text-stone-400 mt-1 inline-block">
            Golden cup dialed-in range
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs text-stone-400 font-sans">Weekly Showcase Views</span>
          <div className="font-serif text-3xl font-bold text-cream-light mt-1">
            {telemetry.weeklyViews}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 inline-block">
            Connoisseur impressions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs text-stone-400 font-sans">Top Dialed Bean</span>
          <div className="font-serif text-lg font-bold text-amber-gold mt-2 line-clamp-1">
            {Object.keys(telemetry.topBeans || {})[0] || 'Single-Origin'}
          </div>
          <span className="text-[11px] font-mono text-stone-400 mt-1 inline-block">
            Customer favorite lot
          </span>
        </div>
      </div>

      {/* Extraction Method Distribution Bar */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h4 className="font-serif text-base font-bold text-cream-light flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-gold" />
          <span>Customer Extraction Method Distribution</span>
        </h4>
        <div className="space-y-3 text-xs font-mono">
          {Object.entries(telemetry.methodsUsed || {}).map(([method, count]) => {
            const pct = Math.round((count / totalMethods) * 100);
            const mName = String(method || 'pour_over').replace(/_/g, ' ').toUpperCase();
            return (
              <div key={method} className="space-y-1">
                <div className="flex justify-between text-stone-300">
                  <span>{mName}</span>
                  <span>{pct}% ({count} brews)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
                  <div className="h-full bg-gradient-to-r from-amber-gold to-[#A25A24] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner Tiers & Commercial Value */}
      <div className="p-6 rounded-2xl bg-espresso-900/60 border border-white/15 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h4 className="font-serif text-lg font-bold text-cream-light">
              Roaster Partner Tiers & Data Resale Intelligence
            </h4>
            <p className="text-xs text-stone-400">
              Generous free tools for all specialty roasters, with premium extraction analytics for production roasters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Free Tier */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-cream-light">Roaster Free Tier</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">FREE</span>
              </div>
              <p className="text-[11px] text-stone-400 mb-3">Permanent catalog & packaging setup.</p>
              <ul className="text-xs text-stone-300 space-y-1.5">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unlimited coffee registrations</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Thermal label QR sticker generation</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1-click recipe dial-in syncing</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Basic 7-day dial-in counters</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400 font-bold">
              ✓ Included with your account
            </div>
          </div>

          {/* Pro Telemetry Pack */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-gold/40 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-amber-gold">Market Intelligence Pro</span>
                <span className="text-xs font-mono font-bold text-amber-gold bg-amber-gold/20 px-2 py-0.5 rounded">$19 / mo</span>
              </div>
              <p className="text-[11px] text-stone-300 mb-3">Actionable data intelligence to refine your roast curves.</p>
              <ul className="text-xs text-stone-200 space-y-1.5">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Granular customer extraction drift reports</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Customer grinder micron distribution analytics</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Water chemistry pairing correlations (GH/KH)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Dedicated roaster showcase sponsor badge</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => alert('Roaster Telemetry Pro Pack requested! Our partner engineering team is generating your deep extraction reports.')}
              className="mt-4 w-full py-2 rounded-xl btn-tactile-amber text-espresso-950 font-bold text-xs shadow-md active:scale-95 cursor-pointer"
            >
              Activate Telemetry Pro ($19/mo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
