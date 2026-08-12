import React, { useState } from 'react';
import { ShoppingBag, Sparkles, ShieldCheck, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import { PRODUCTS_DATA, PRODUCT_CATEGORIES } from '../data/productsData';

export default function BrewShopSection({ trackMode = 'coffee', activeMethod }) {
  const isCoffee = trackMode === 'coffee';
  const isTea = trackMode === 'tea';
  const isBeer = trackMode === 'beer';
  const [activeCategory, setActiveCategory] = useState('all');

  // STAGE 1 FILTER: 100% STRICT TRACK ISOLATION (Only show items where product.track === active trackMode)
  const trackProducts = PRODUCTS_DATA.filter(product => product.track === trackMode);

  // STAGE 2 FILTER: CATEGORY SELECTION WITHIN TRACK
  const categoriesForTrack = PRODUCT_CATEGORIES[trackMode] || PRODUCT_CATEGORIES.coffee;

  const displayProducts = trackProducts.filter((product) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'method_kit') {
      return product.methodIds && activeMethod && product.methodIds.includes(activeMethod.id);
    }
    if (activeCategory === 'top_rated') {
      return product.topRated || product.rating >= 4.9;
    }
    return product.category === activeCategory;
  });

  const finalProducts = displayProducts.length > 0 ? displayProducts : trackProducts;

  return (
    <section className={`mt-14 p-7 md:p-10 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500 relative border ${
      isBeer ? 'glass-panel-beer border-amber-500/40' : isCoffee ? 'glass-panel-coffee border-[#A66E38]/40' : 'glass-panel-tea border-sage-500/40'
    }`}>
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className={`inline-flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] mb-2 ${
            isBeer ? 'text-amber-400' : isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`}>
            <ShoppingBag className="w-4 h-4 animate-pulse" />
            <span>{isBeer ? 'Craft Cellar Equipment Store 🍺' : isCoffee ? 'Coffee Lab Equipment Store ☕' : 'Tea Room Equipment Store 🍃'}</span>
          </div>
          
          <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md">
            {isBeer
              ? 'The Craft Homebrew Equipment Store'
              : isCoffee
              ? `The Ultimate ${activeMethod?.name || 'Coffee'} Gear Kit`
              : `The Ultimate ${activeMethod?.name || 'Tea'} Steeping Kit`}
          </h3>

          <p className="text-xs md:text-sm text-stone-300 mt-2 max-w-3xl leading-relaxed">
            {isBeer
              ? 'Handpicked 5-gallon carboy homebrew kits, 2-roller grain mills (0.038" gap), gravity hydrometers, and Spiegelau lead-free crystal glassware.'
              : isCoffee
              ? 'Handpicked specialty coffee drippers, 0.01g micro-gram scales, PID goosenecks, European alloy burr grinders, and single-origin roast beans.'
              : 'Handpicked Gongfu ceramic gaiwans, Uji bamboo whisks, variable-temperature kettles, and imperial single-estate loose leaf teas.'}
          </p>
        </div>

        {/* Amazon Associate Disclosure Pill */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md max-w-xs flex-shrink-0">
          <div className={`flex items-center space-x-2 text-xs font-mono font-bold mb-1 ${
            isBeer ? 'text-amber-400' : isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Amazon Associate Partner</span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono leading-tight">
            As an Amazon Associate, The Brew App earns from qualifying purchases made through our links.
          </p>
        </div>
      </div>

      {/* Filter Category Tabs Bar */}
      <div className="mb-8 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center space-x-3">
          {categoriesForTrack.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const isTopRatedPill = cat.id === 'top_rated';
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? isBeer
                      ? 'btn-tactile-beer text-[#0F0C05] shadow-[0_0_20px_rgba(245,158,11,0.4)] font-extrabold'
                      : isCoffee
                      ? 'btn-tactile-coffee text-[#140C08] shadow-[0_0_20px_rgba(166,110,56,0.4)] font-extrabold'
                      : 'btn-tactile-tea text-white shadow-[0_0_20px_rgba(81,158,100,0.4)] font-extrabold'
                    : isTopRatedPill
                    ? isBeer
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : isCoffee
                      ? 'bg-[#A66E38]/10 text-[#D2A06E] border-[#A66E38]/30'
                      : 'bg-sage-500/10 text-sage-300 border-sage-500/30'
                    : 'bg-black/40 text-stone-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-cream-light'
                }`}
              >
                {isTopRatedPill && <Star className={`w-3.5 h-3.5 fill-current ${
                  isBeer ? 'text-amber-400' : isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
                }`} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {finalProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            activeMethod={activeMethod}
          />
        ))}
      </div>

    </section>
  );
}
