import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';
import BrewShopSection from './BrewShopSection';

export default function ShopDrawer({ trackMode, activeMethod }) {
  const isCoffee = trackMode === 'coffee';
  const [isOpen, setIsOpen] = useState(true); // Open by default for easy discovery

  return (
    <div className="mt-14">
      {/* Expand/Collapse Toggle Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 rounded-3xl bg-[#14110E]/90 border border-amber-gold/30 hover:border-amber-gold/60 text-left flex items-center justify-between shadow-2xl transition-all group backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-gold border border-amber-400/30 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl md:text-2xl font-bold text-cream-light">
                Brew Essentials Kit & Shop
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 font-extrabold">
                Amazon Affiliate Store
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Curated gear, water testing kits, kettles, burr grinders, and specialty beans for {activeMethod?.name || 'Selected Method'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-amber-gold font-mono font-bold text-xs">
          <span className="hidden sm:inline uppercase tracking-wider">{isOpen ? 'Hide Shop' : 'Shop Gear'}</span>
          <div className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.1]">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Drawer Content */}
      {isOpen && (
        <div className="animate-fade-in">
          <BrewShopSection trackMode={trackMode} activeMethod={activeMethod} />
        </div>
      )}
    </div>
  );
}
