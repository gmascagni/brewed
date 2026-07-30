import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import TroubleshootingHub from './TroubleshootingHub';

export default function DiagnosticsDrawer({ trackMode }) {
  const isCoffee = trackMode === 'coffee';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border-t border-white/[0.08] pt-8">
      {/* Diagnostics Drawer Toggle Bar */}
      <div className="p-7 md:p-9 rounded-3xl bg-[#14110E]/90 border border-white/[0.12] shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl ${
            isCoffee ? 'bg-amber-500/20 text-amber-gold border border-amber-400/30' : 'bg-sage-500/20 text-sage-300 border border-sage-500/30'
          }`}>
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-cream-light flex items-center gap-3">
              <span>Coffee & Tea Extraction Diagnostics</span>
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-extrabold">
                Troubleshooting & Water
              </span>
            </h3>
            <p className="text-xs md:text-sm text-stone-300 mt-1 font-normal">
              Diagnose flavor defects (sourness, bitterness, astringency, weakness) and calibrate Burr Grinder coarseness and water TDS/pH.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-7 py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2.5 shadow-2xl transition-all active:scale-95 whitespace-nowrap ${
            isOpen
              ? 'bg-amber-gold text-espresso-950 hover:bg-amber-gold/90'
              : 'bg-white/[0.08] text-cream-light hover:bg-white/[0.15] border border-white/[0.12]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isOpen ? 'Close Diagnostics' : 'Expand Diagnostics'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Diagnostics Body */}
      {isOpen && (
        <div className="mt-8 animate-fade-in">
          <TroubleshootingHub trackMode={trackMode} />
        </div>
      )}
    </div>
  );
}
