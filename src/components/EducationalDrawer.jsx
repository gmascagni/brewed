import React, { useState } from 'react';
import { GraduationCap, HelpCircle, ChevronDown, ChevronUp, BookOpen, Sparkles } from 'lucide-react';
import UniversityHub from './UniversityHub';
import TroubleshootingHub from './TroubleshootingHub';

export default function EducationalDrawer({ trackMode }) {
  const isCoffee = trackMode === 'coffee';
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('university'); // 'university' | 'troubleshooting'

  return (
    <div className="mt-16 border-t border-white/10 pt-8">
      {/* Drawer Toggle Header Bar */}
      <div className="p-6 rounded-3xl bg-espresso-900/90 border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 rounded-2xl ${
            isCoffee ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/30' : 'bg-sage-500/20 text-sage-300 border border-sage-500/30'
          }`}>
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-extrabold text-cream-light flex items-center gap-2">
              <span>Knowledge Base & Extraction Diagnostics</span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-amber-gold border border-amber-gold/30">
                Educational Hub
              </span>
            </h3>
            <p className="text-xs text-cream-soft/70 mt-0.5">
              Explore the Coffee Belt, Arabica vs. Robusta agronomy, tea leaf origins, and extraction troubleshooting.
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
          <span>{isOpen ? 'Close Knowledge Base' : 'Expand Knowledge Base'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Drawer Content Body */}
      {isOpen && (
        <div className="mt-6 space-y-6 animate-fade-in">
          {/* Inner Tab Selector */}
          <div className="flex items-center space-x-3 bg-black/40 p-2 rounded-2xl border border-white/10 max-w-md">
            <button
              onClick={() => setActiveTab('university')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'university'
                  ? 'bg-amber-gold text-espresso-950 font-extrabold shadow-md'
                  : 'text-cream-soft/70 hover:text-cream-light'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Terroir & Agronomy</span>
            </button>

            <button
              onClick={() => setActiveTab('troubleshooting')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'troubleshooting'
                  ? 'bg-amber-gold text-espresso-950 font-extrabold shadow-md'
                  : 'text-cream-soft/70 hover:text-cream-light'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Taste Diagnostics</span>
            </button>
          </div>

          {/* Tab Render */}
          {activeTab === 'university' ? (
            <UniversityHub trackMode={trackMode} />
          ) : (
            <TroubleshootingHub trackMode={trackMode} />
          )}
        </div>
      )}
    </div>
  );
}
