import React from 'react';
import {
  Coffee,
  BookOpen,
  Compass,
  Store,
  SlidersHorizontal
} from 'lucide-react';
import { hapticTap } from '../utils/haptics';

export default function MobileBottomNav({
  currentView,
  isShopsView = false,
  onSelectView,
  onOpenLocalCoffee,
  onOpenRoasterShowcase,
  onOpenTools,
  isToolsOpen
}) {
  const isBrew = (currentView === 'brew_station' || currentView === 'discovery') && !isShopsView && currentView !== 'shops' && currentView !== 'recipes' && currentView !== 'roasters' && currentView !== 'learn';
  const isRecipes = currentView === 'recipes';
  const isShops = currentView === 'shops' || isShopsView;
  const isRoasters = currentView === 'roasters';

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#ECE6DC] shadow-lg flex items-center justify-around px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] text-[#766A62] select-none"
      role="navigation"
      aria-label="Mobile Navigation Bar"
    >
      {/* 1. Brew Station */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) onSelectView('discovery');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isBrew && !isToolsOpen
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Brew Station"
        aria-label="Brew Station"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isBrew && !isToolsOpen ? 'bg-[#FAF0E6]' : ''
        }`}>
          <Coffee className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Brew</span>
      </button>

      {/* 2. Recipes Vault */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) onSelectView('recipes');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isRecipes && !isToolsOpen
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Master Recipes Vault"
        aria-label="Master Recipes Vault"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isRecipes && !isToolsOpen ? 'bg-[#FAF0E6]' : ''
        }`}>
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Recipes</span>
      </button>

      {/* 3. Shop Local Radar */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) {
            onSelectView('shops');
          } else if (onOpenLocalCoffee) {
            onOpenLocalCoffee();
          }
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isShops && !isToolsOpen
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Shop Local Specialty Coffee Radar"
        aria-label="Shop Local Specialty Coffee Radar"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isShops && !isToolsOpen ? 'bg-[#FAF0E6]' : ''
        }`}>
          <Compass className="w-5 h-5 text-[#C88A4B]" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Local</span>
      </button>

      {/* 4. Roaster Showcase */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onOpenRoasterShowcase) onOpenRoasterShowcase();
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isRoasters && !isToolsOpen
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Specialty Roasters"
        aria-label="Specialty Roasters"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isRoasters && !isToolsOpen ? 'bg-[#FAF0E6]' : ''
        }`}>
          <Store className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Roasters</span>
      </button>

      {/* 5. Tools & Portals */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onOpenTools) onOpenTools();
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isToolsOpen
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Tools & Portals Menu"
        aria-label="Tools and Settings"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isToolsOpen ? 'bg-[#FAF0E6]' : ''
        }`}>
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Tools</span>
      </button>
    </nav>
  );
}
