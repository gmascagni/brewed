import React, { useState } from 'react';
import { BookOpen, GraduationCap, Wrench, Newspaper, Sparkles, ShoppingBag, FlaskConical } from 'lucide-react';
import CoffeeNoobGuide from './CoffeeNoobGuide';
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

  const handleScrollToNoob = () => {
    const el = document.getElementById('coffee-noob-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
    <div className="space-y-12 animate-fade-in">
      {/* Learn Hub Header */}
      <div className="p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-card border border-[#ECE6DC] bg-gradient-to-br from-[#FAF7F2] via-white to-[#F7F4EE]">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] font-sans text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Specialty Coffee Knowledge & Learning Center</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14110F] leading-tight mb-4">
            Extraction Science, Masterclasses & Brew Knowledge
          </h2>

          <p className="text-base md:text-lg text-[#5C524B] leading-relaxed mb-6 font-sans">
            Everything you need to master specialty coffee extraction. Explore verified video masterclasses from world barista champions, troubleshoot extraction channeling, discover water mineral chemistry, and browse precision coffee gear.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-sans font-bold">
            <button
              type="button"
              onClick={handleScrollToNoob}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F5E2CF] border border-[#ECD4BD] text-[#A25A24] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#C88A4B]" />
              <span>🌱 Coffee Noob (Start Here)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenKnowledge}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#ECE6DC] hover:border-[#D69550] text-[#2A2421] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-[#C88A4B]" />
              <span>Terroir & Processing Atlas</span>
            </button>

            <button
              type="button"
              onClick={handleOpenDiagnostics}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#ECE6DC] hover:border-[#D69550] text-[#2A2421] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Wrench className="w-4 h-4 text-[#2F663C]" />
              <span>Extraction Diagnostics</span>
            </button>

            {onOpenWaterLab && (
              <button
                type="button"
                onClick={onOpenWaterLab}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F5E2CF] border border-[#ECD4BD] text-[#A25A24] transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Launch Water Chemistry Lab ↗</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 0. Coffee Noob Section: Beginner's Field Guide */}
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
