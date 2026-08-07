import React from 'react';
import { X, Sparkles, Droplets, Thermometer, Sliders, Clock, CheckCircle2 } from 'lucide-react';

export default function V60ProTipModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative max-w-2xl w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/60 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 text-cream-light hover:text-amber-gold hover:bg-white/20 transition-all border border-white/15"
          title="Close Pro Tip Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-2">
          <Sparkles className="w-4 h-4 animate-pulse text-amber-gold" />
          <span>Pro Tip Masterclass • 1 Cup V60 Technique</span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light mb-2">
          1 Cup V60 Pour Over Technique
        </h3>
        <p className="text-xs text-stone-300 mb-6 font-normal">
          Dose: <strong className="text-amber-gold font-mono">15g Ground Coffee</strong> to <strong className="text-cyan-400 font-mono">250g Water</strong> (1:16.6 Ratio). Target Total Brew Time: <strong className="text-amber-gold font-mono">Approx. ~3:00 min</strong> (YMMV).
        </p>

        {/* 1. Core Water Quality & Spout Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs">
            <div className="font-bold text-amber-gold mb-2 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Water Quality & Pouring</span>
            </div>
            <ul className="space-y-1.5 text-stone-300 text-[11px] list-disc list-inside">
              <li>Try to use best possible quality of water</li>
              <li>Try to use water as hot as possible after boiling</li>
              <li>Use swirling motion & aim for <strong>5g/sec pour rate</strong></li>
              <li>Try to keep kettle spout close to surface</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs">
            <div className="font-bold text-amber-gold mb-2 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Preparation Steps</span>
            </div>
            <ul className="space-y-1.5 text-stone-300 text-[11px] list-disc list-inside">
              <li>Preheat and Rinse (Plastic) Brewer and Filter with Hot tap water (Hot to Touch)</li>
              <li>Dig a mound/divot in middle of Ground Coffee</li>
              <li>Zero/Reset Scale with Brewer & Ground Coffee</li>
              <li>Boil Water to target roast temperature</li>
            </ul>
          </div>
        </div>

        {/* 2. Roast Level Kettle Temperatures */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-gold/30 mb-6 text-xs">
          <div className="font-bold text-amber-gold mb-2.5 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono">
            <Thermometer className="w-4 h-4 text-amber-gold" />
            <span>Kettle Temps by Roast Level</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-stone-400 block font-sans uppercase font-bold">Light Roast</span>
              <strong className="text-amber-gold text-sm font-bold">100°C</strong>
              <span className="text-[9px] text-stone-400 block font-sans">(212°F Boiling)</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-stone-400 block font-sans uppercase font-bold">Medium Roast</span>
              <strong className="text-amber-gold text-sm font-bold">90°C - 95°C</strong>
              <span className="text-[9px] text-stone-400 block font-sans">(194°F - 203°F)</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-stone-400 block font-sans uppercase font-bold">Darker Roasts</span>
              <strong className="text-amber-gold text-sm font-bold">80°C - 85°C</strong>
              <span className="text-[9px] text-stone-400 block font-sans">(176°F - 185°F)</span>
            </div>
          </div>
        </div>

        {/* 3. Timeline & Pour Schedule Table */}
        <div className="mb-6">
          <div className="font-bold text-cream-light text-xs uppercase font-mono tracking-wider mb-2.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-gold" />
            <span>Phase-by-Phase Pour Schedule</span>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-stone-400 text-[10px] uppercase font-mono">
                  <th className="p-2.5">Time Interval</th>
                  <th className="p-2.5">Action & Target Water Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px] text-stone-300">
                <tr>
                  <td className="p-2.5 font-bold text-amber-gold">0:00</td>
                  <td className="p-2.5">Approx. ~50g Bloom Pour</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-gold">0:10 - 0:15</td>
                  <td className="p-2.5">Gentle Swirl</td>
                </tr>
                <tr className="bg-amber-500/5">
                  <td className="p-2.5 font-bold text-amber-gold">0:00 - 0:45</td>
                  <td className="p-2.5 text-amber-gold font-sans font-bold">Bloom Phase</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-gold">0:45 - 1:00</td>
                  <td className="p-2.5">Pour to ~100g Total</td>
                </tr>
                <tr className="text-stone-400 bg-black/40">
                  <td className="p-2.5">1:00 - 1:10</td>
                  <td className="p-2.5 font-sans italic">Pause</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-gold">1:10 - 1:20</td>
                  <td className="p-2.5">Pour to ~150g Total</td>
                </tr>
                <tr className="text-stone-400 bg-black/40">
                  <td className="p-2.5">1:20 - 1:30</td>
                  <td className="p-2.5 font-sans italic">Pause</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-gold">1:30 - 1:40</td>
                  <td className="p-2.5">Pour to ~200g Total</td>
                </tr>
                <tr className="text-stone-400 bg-black/40">
                  <td className="p-2.5">1:40 - 1:50</td>
                  <td className="p-2.5 font-sans italic">Pause</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-gold">1:50 - 2:00</td>
                  <td className="p-2.5 font-bold text-cyan-300">Pour to ~250g Total (Final Fill)</td>
                </tr>
                <tr className="bg-amber-500/10">
                  <td className="p-2.5 font-bold text-amber-gold">2:00</td>
                  <td className="p-2.5 font-sans font-bold text-cream-light">Gentle Swirl, Wait for drawdown to Complete</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-stone-400 font-mono mt-1.5">
            Target Total Brew Time: Approx. ~3:00 min (YMMV; Adjust Grind if necessary for Taste/Time).
          </p>
        </div>

        {/* 4. Troubleshooting & Dialing-In Guide */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs">
          <div className="font-bold text-cream-light mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Taste & Extraction Grind Adjustment</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <strong className="block mb-0.5">Too Fast / Acidic:</strong> Adjust grind <strong>FINER</strong>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <strong className="block mb-0.5">Too Slow / Bitter:</strong> Adjust grind <strong>COARSER</strong>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all"
        >
          Got It, Start 1-Cup V60 Brew ☕
        </button>

      </div>
    </div>
  );
}
