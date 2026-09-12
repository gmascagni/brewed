import React from 'react';
import { BookOpen, GraduationCap, Wrench, Newspaper, Sparkles, ShoppingBag, FlaskConical } from 'lucide-react';
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
  onOpenWaterLab
}) {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Learn Hub Header */}
      <div className="p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-card border border-[#ECE6DC] bg-gradient-to-br from-[#FAF7F2] via-white to-[#F7F4EE]">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Specialty Coffee Knowledge & Learning Center</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14110F] leading-tight mb-4">
            Extraction Science, Masterclasses & Brew Knowledge
          </h2>

          <p className="text-sm md:text-base text-[#5C524B] leading-relaxed mb-6 font-sans">
            Everything you need to master specialty coffee extraction. Explore verified video masterclasses from world barista champions, troubleshoot extraction channeling, discover water mineral chemistry, and browse precision coffee gear.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-medium text-[#766A62]">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ECE6DC] shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#C88A4B]" />
              Terroir & Processing Atlas
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ECE6DC] shadow-xs">
              <Wrench className="w-3.5 h-3.5 text-[#2F663C]" />
              Extraction Diagnostics
            </span>
            {onOpenWaterLab && (
              <button
                onClick={onOpenWaterLab}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] hover:bg-[#F5E2CF] transition-colors shadow-xs"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Launch Water Chemistry Lab ↗
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Collapsible Video Masterclasses Drawer */}
      <MasterclassHub
        trackMode={trackMode}
        activeMethod={activeMethod}
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
      />

      {/* 2. Collapsible Diagnostics & Troubleshooting Drawer */}
      <DiagnosticsDrawer trackMode={trackMode} />

      {/* 3. Collapsible Knowledge Base & Terroir Atlas Drawer */}
      <KnowledgeBaseDrawer trackMode={trackMode} />

      {/* 4. Collapsible Equipment & Gear Store Drawer */}
      <ShopDrawer trackMode={trackMode} activeMethod={activeMethod} />

      {/* 5. Real-Time World Brew News Dispatch (maintains #world-news anchor) */}
      <WorldNewsSection trackMode={trackMode} />
    </div>
  );
}
