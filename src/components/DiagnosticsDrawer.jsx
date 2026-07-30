import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import TroubleshootingHub from './TroubleshootingHub';

export default function DiagnosticsDrawer({ trackMode }) {
  const isCoffee = trackMode === 'coffee';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      {/* Diagnostics Drawer Toggle Bar */}
      <div className="p-6 rounded-3xl bg-espresso-900/90 border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 rounded-2xl ${
            isCoffee ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/30' : 'bg-sage-500/20 text-sage-300 border border-sage-500/30'
          }`}>
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-extrabold text-cream-light flex items-center gap-2">
              <span>Coffee & Tea Extraction Diagnostics</span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Troubleshooting & Water
              </span>
            </h3>
            <p className="text-xs text-cream-soft/70 mt-0.5">
              Identify taste defects (sourness, bitterness, flat taste) and calibrate Burr Grinder settings and water TDS/pH.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-6 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
            isOpen
              ? 'bg-amber-gold text-espresso-950 hover:bg-amber-gold/90'
              : 'bg-white/10 text-cream-light hover:bg-white/20 border border-white/15'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isOpen ? 'Close Diagnostics' : 'Expand Diagnostics'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Diagnostics Body */}
      {isOpen && (
        <div className="mt-6 animate-fade-in">
          <TroubleshootingHub trackMode={trackMode} />
        </div>
      )}
    </div>
  );
}
