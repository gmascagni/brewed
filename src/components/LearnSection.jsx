import React, { useState } from 'react';
import { BookOpen, GraduationCap, Wrench, Newspaper, Sparkles, ShoppingBag, FlaskConical, Flame, Tv } from 'lucide-react';
import CoffeeNoobGuide from './CoffeeNoobGuide';
import CoffeeRoastingGuide from './CoffeeRoastingGuide';
import MasterclassHub from './MasterclassHub';
import DiagnosticsDrawer from './DiagnosticsDrawer';
import KnowledgeBaseDrawer from './KnowledgeBaseDrawer';
import ShopDrawer from './ShopDrawer';
import WorldNewsSection from './WorldNewsSection';

export default function LearnSection({
  trackMode = 'coffee',
  activeMethod,
  activeVideo,
  setActiveVideo,
  onOpenWaterLab,
  onSelectMethodToBrew
}) {
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToNoob = () => handleScrollToSection('coffee-noob-section');
  const handleScrollToRoasting = () => handleScrollToSection('coffee-roasting-section');
  const handleScrollToMasterclass = () => handleScrollToSection('video-academy');
  const handleScrollToNews = () => handleScrollToSection('world-news');

  const handleOpenDiagnostics = () => {
    setIsDiagnosticsOpen(true);
    setTimeout(() => {
      const el = document.getElementById('diagnostics-drawer-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleOpenKnowledge = () => {
    setIsKnowledgeOpen(true);
    setTimeout(() => {
      const el = document.getElementById('knowledge-base-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  return (
    <div className="space-y-6 sm:space-y-12 animate-fade-in">
      {/* Sticky Mobile & Desktop Quick-Jump Sub-Navigation Bar */}
      <div className="sticky top-[54px] md:top-[74px] z-30 -mx-3 px-3 py-2 sm:mx-0 sm:px-4 sm:rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border-y sm:border border-[#ECE6DC] shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#766A62] shrink-0 hidden sm:inline pr-1">
          Jump To:
        </span>
        <button
          type="button"
          onClick={handleScrollToRoasting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14110F] text-white text-xs font-sans font-bold shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Flame className="w-3.5 h-3.5 text-[#E8AF72]" />
          <span>Roasting & RoR Lab</span>
        </button>
        <button
          type="button"
          onClick={handleScrollToNoob}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECE6DC] text-[#2A2421] text-xs font-sans font-semibold shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C88A4B]" />
          <span>Beginner Guide</span>
        </button>
        <button
          type="button"
          onClick={handleScrollToMasterclass}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECE6DC] text-[#2A2421] text-xs font-sans font-semibold shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <Tv className="w-3.5 h-3.5 text-rose-600" />
          <span>Video Academy</span>
        </button>
        <button
          type="button"
          onClick={handleOpenKnowledge}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECE6DC] text-[#2A2421] text-xs font-sans font-semibold shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#C88A4B]" />
          <span>Origins & Terroir</span>
        </button>
        <button
          type="button"
          onClick={handleOpenDiagnostics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECE6DC] text-[#2A2421] text-xs font-sans font-semibold shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <Wrench className="w-3.5 h-3.5 text-[#2F663C]" />
          <span>Diagnostics</span>
        </button>
        {onOpenWaterLab && (
          <button
            type="button"
            onClick={onOpenWaterLab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F5E2CF] border border-[#ECD4BD] text-[#A25A24] text-xs font-sans font-bold shrink-0 active:scale-95 transition-all cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Water Lab ↗</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleScrollToNews}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECE6DC] text-[#2A2421] text-xs font-sans font-semibold shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <Newspaper className="w-3.5 h-3.5 text-[#C88A4B]" />
          <span>News</span>
        </button>
      </div>

      {/* Learn Hub Header (Compact & Collapsible on Mobile) */}
      <div className="p-4 sm:p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-card border border-[#ECE6DC] bg-gradient-to-br from-[#FAF7F2] via-white to-[#F7F4EE]">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] font-sans text-[11px] sm:text-sm font-bold uppercase tracking-wider mb-2.5 sm:mb-4">
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Specialty Coffee Knowledge & Learning Center</span>
          </div>

          <h2 className="font-editorial text-xl sm:text-4xl lg:text-5xl font-bold text-[#14110F] leading-tight mb-2 sm:mb-4">
            Bean Anatomy, Roasting Science (RoR), Masterclasses & Extraction
          </h2>

          <div className="mb-4 sm:mb-6">
            <p className={`text-xs sm:text-base md:text-lg text-[#5C524B] leading-relaxed font-sans ${
              isHeroExpanded ? '' : 'line-clamp-2 sm:line-clamp-none'
            }`}>
              Everything you need to master specialty coffee from seed to cup. Explore interactive Rate of Rise (RoR) roasting thermodynamics, green bean anatomy, DIY home roasting, champion video masterclasses, and extraction diagnostics.
            </p>
            <button
              type="button"
              onClick={() => setIsHeroExpanded(prev => !prev)}
              className="sm:hidden mt-1 text-[11px] font-mono font-bold text-[#A8622D] hover:underline cursor-pointer"
            >
              {isHeroExpanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-sans font-bold">
            <button
              type="button"
              onClick={handleScrollToRoasting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14110F] hover:bg-[#A8622D] text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Flame className="w-4 h-4 text-[#E8AF72]" />
              <span>🔥 Beans, Roasting & RoR Guide</span>
            </button>

            <button
              type="button"
              onClick={handleScrollToNoob}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F5E2CF] border border-[#ECD4BD] text-[#A25A24] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#C88A4B]" />
              <span>🌱 Coffee Noob (Start Here)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenKnowledge}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#ECE6DC] hover:border-[#D69550] text-[#2A2421] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-[#C88A4B]" />
              <span>Terroir & Processing Atlas</span>
            </button>

            <button
              type="button"
              onClick={handleOpenDiagnostics}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#ECE6DC] hover:border-[#D69550] text-[#2A2421] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Wrench className="w-4 h-4 text-[#2F663C]" />
              <span>Extraction Diagnostics</span>
            </button>

            {onOpenWaterLab && (
              <button
                type="button"
                onClick={onOpenWaterLab}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F5E2CF] border border-[#ECD4BD] text-[#A25A24] transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Launch Water Chemistry Lab ↗</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 0A. Coffee Beans & Roasting Science (RoR, Anatomy, Thermal Phases, Spectrum & DIY Home Roasting) */}
      <CoffeeRoastingGuide
        onOpenWaterLab={onOpenWaterLab}
        onSelectMethodToBrew={onSelectMethodToBrew}
      />

      {/* 0B. Coffee Noob Section: Beginner's Field Guide */}
      <CoffeeNoobGuide 
        onOpenWaterLab={onOpenWaterLab} 
        onSelectMethodToBrew={onSelectMethodToBrew} 
      />

      {/* 1. Collapsible Video Masterclasses Drawer */}
      <MasterclassHub
        trackMode={trackMode}
        activeMethod={activeMethod}
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
      />

      {/* 2. Collapsible Diagnostics & Troubleshooting Drawer */}
      <DiagnosticsDrawer 
        trackMode={trackMode} 
        isOpen={isDiagnosticsOpen}
        onToggle={() => setIsDiagnosticsOpen(prev => !prev)}
      />

      {/* 3. Collapsible Knowledge Base & Terroir Atlas Drawer */}
      <KnowledgeBaseDrawer 
        trackMode={trackMode} 
        isOpen={isKnowledgeOpen}
        onToggle={() => setIsKnowledgeOpen(prev => !prev)}
      />

      {/* 4. Collapsible Equipment & Gear Store Drawer */}
      <ShopDrawer trackMode={trackMode} activeMethod={activeMethod} />

      {/* 5. Real-Time World Brew News Dispatch (maintains #world-news anchor) */}
      <WorldNewsSection trackMode={trackMode} />
    </div>
  );
}
