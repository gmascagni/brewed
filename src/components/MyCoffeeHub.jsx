import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  User, 
  Sliders, 
  QrCode, 
  Coffee, 
  Clock, 
  Award, 
  Plus, 
  Layers,
  ChevronRight,
  Flame,
  Store
} from 'lucide-react';
import BrewJournal from './BrewJournal';
import RecipeExplorer from './RecipeExplorer';
import UserProfileDashboard from './UserProfileDashboard';
import { hapticTap } from '../utils/haptics';

export default function MyCoffeeHub({
  trackMode = 'coffee',
  activeMethod,
  cupCount,
  cupMl,
  customRatio,
  unitSystem = 'imperial',
  currentUser,
  onOpenAuth,
  onOpenScanner,
  onOpenRecipeBuilder,
  onSelectRecipeToBrew,
  onBrewAgain,
  onOpenRoasterPortal,
  initialTab = 'journal'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'journal' | 'recipes' | 'profile' | 'tools'

  const handleTabChange = (tabId) => {
    hapticTap();
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-6xl mx-auto" data-view="recipes" id="recipe-vault-section">
      
      {/* 1. Header: My Coffee Personal Studio */}
      <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE8] border border-[#ECE6DC] shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] text-xs font-sans font-semibold">
            <Coffee className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Personal Barista Studio & Vault</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14110F] leading-tight">
            My Coffee Companion
          </h2>

          <p className="text-sm text-[#5C524B] leading-relaxed font-sans">
            Your personal hub for logged tasting extractions, custom recipes, barista achievement badges, and quick 1-click brew replay.
          </p>
        </div>
      </div>

      {/* 2. Primary My Coffee Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DC] w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('journal')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#A8622D]" />
            <span>Tasting Journal</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('recipes')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'recipes'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2F663C]" />
            <span>Recipe Vault</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('profile')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <User className="w-4 h-4 text-[#C88A4B]" />
            <span>Barista Profile</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('tools')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'tools'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Store className="w-4 h-4 text-[#A25A24]" />
            <span>Roaster Studio</span>
          </span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      <div>
        {/* Tab 1: Tasting Journal (Inlined) */}
        {activeTab === 'journal' && (
          <div className="space-y-6 animate-fade-in">
            <BrewJournal
              isOpen={true}
              isInline={true}
              onClose={() => {}}
              trackMode={trackMode}
              activeMethod={activeMethod}
              cupCount={cupCount}
              cupMl={cupMl}
              customRatio={customRatio}
              unitSystem={unitSystem}
              onOpenScanner={onOpenScanner}
              onBrewAgain={onBrewAgain}
            />
          </div>
        )}

        {/* Tab 2: Custom Recipes Explorer */}
        {activeTab === 'recipes' && (
          <div className="space-y-6 animate-fade-in">
            <RecipeExplorer
              trackMode={trackMode}
              onOpenRecipeBuilder={onOpenRecipeBuilder}
              onSelectRecipe={onSelectRecipeToBrew}
            />
          </div>
        )}

        {/* Tab 3: Barista Profile & Achievements */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <UserProfileDashboard
              isOpen={true}
              isInline={true}
              onClose={() => {}}
              trackMode={trackMode}
              currentUser={currentUser}
              onOpenAuth={onOpenAuth}
            />
          </div>
        )}

        {/* Tab 4: Partner / Roaster Packaging Studio */}
        {activeTab === 'tools' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-8 rounded-3xl bg-white border border-[#ECE6DC] shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] border border-[#ECD4BD] flex items-center justify-center text-[#A25A24]">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#A25A24] bg-[#FAF0E6] px-2 py-0.5 rounded">
                    Free Tier Partner Tool
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#14110F] mt-1">
                    Specialty Roaster Packaging & Label Studio
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#5C524B] leading-relaxed max-w-2xl">
                Generate crisp 300 DPI thermal labels (4" x 6" and 2.25" x 1.25"), create Smart Bag QR codes for instant customer dial-in, manage roast profiles, and track dial-in telemetry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-1">
                  <div className="font-mono text-xs font-bold text-[#A8622D]">300 DPI Labels</div>
                  <p className="text-[11px] text-[#766A62]">Direct thermal PDF output ready for Rollo & Zebra printers.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-1">
                  <div className="font-mono text-xs font-bold text-[#A8622D]">Smart Bag QR</div>
                  <p className="text-[11px] text-[#766A62]">Customers scan bag to automatically dial in ratio and timer.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-1">
                  <div className="font-mono text-xs font-bold text-[#A8622D]">Lot Traceability</div>
                  <p className="text-[11px] text-[#766A62]">Display authentic farm altitude, varietal, and cupping scores.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  if (onOpenRoasterPortal) onOpenRoasterPortal();
                }}
                className="py-3.5 px-7 rounded-2xl bg-[#14110F] hover:bg-[#2A2421] text-white font-sans font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Store className="w-4 h-4 text-[#E8AF72]" />
                <span>Launch Roaster Packaging Studio</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
