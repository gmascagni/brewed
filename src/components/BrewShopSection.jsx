import React, { useState } from 'react';
import { ShoppingBag, Sparkles, ShieldCheck, Star, Zap, Crown, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';
import { PRODUCTS_DATA, PRODUCT_CATEGORIES, PRODUCT_TIERS } from '../data/productsData';

export default function BrewShopSection({ trackMode = 'coffee', activeMethod }) {
  const isCoffee = trackMode === 'coffee';
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTier, setActiveTier] = useState('all');

  // STAGE 1 FILTER: 100% STRICT TRACK ISOLATION (Only show items where product.track === active trackMode)
  const trackProducts = PRODUCTS_DATA.filter(product => product.track === trackMode);

  // STAGE 2 FILTER: CATEGORY SELECTION WITHIN TRACK
  const categoriesForTrack = PRODUCT_CATEGORIES[trackMode] || PRODUCT_CATEGORIES.coffee;

  const displayProducts = trackProducts.filter((product) => {
    // Tier filter (best, good, budget)
    if (activeTier !== 'all' && product.tier !== activeTier) {
      return false;
    }

    if (activeCategory === 'all') return true;
    if (activeCategory === 'method_kit') {
      return product.methodIds && activeMethod && product.methodIds.includes(activeMethod.id);
    }
    if (activeCategory === 'top_rated') {
      return product.topRated || product.rating >= 4.9;
    }
    return product.category === activeCategory;
  });

  const finalProducts = displayProducts;

  return (
    <section className={`mt-14 p-7 md:p-10 lg:p-12 rounded-3xl shadow-2xl transition-all duration-500 relative border ${
      isCoffee ? 'glass-panel-coffee border-[#A66E38]/40' : 'glass-panel-tea border-sage-500/40'
    }`}>
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className={`inline-flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] mb-2 ${
            isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`}>
            <ShoppingBag className="w-4 h-4 animate-pulse" />
            <span>{isCoffee ? 'Coffee Lab Equipment Store ☕' : 'Tea Room Equipment Store 🍃'}</span>
          </div>
          
          <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md">
            {isCoffee
              ? `The Ultimate ${activeMethod?.name || 'Coffee'} Gear Kit`
              : `The Ultimate ${activeMethod?.name || 'Tea'} Steeping Kit`}
          </h3>

          <p className="text-xs md:text-sm text-stone-300 mt-2 max-w-3xl leading-relaxed">
            {isCoffee
              ? 'Handpicked specialty coffee drippers, 0.01g micro-gram scales, PID goosenecks, European alloy burr grinders, and single-origin roast beans.'
              : 'Handpicked Gongfu ceramic gaiwans, Uji bamboo whisks, variable-temperature kettles, and imperial single-estate loose leaf teas.'}
          </p>
        </div>

        {/* Amazon Associate Disclosure Pill */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md max-w-xs flex-shrink-0">
          <div className={`flex items-center space-x-2 text-xs font-mono font-bold mb-1 ${
            isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
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
      <div className="mb-4 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center space-x-3">
          {categoriesForTrack.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? isCoffee
                      ? 'btn-tactile-coffee text-[#140C08] font-extrabold shadow-lg scale-102'
                      : 'btn-tactile-tea text-white font-extrabold shadow-lg scale-102'
                    : 'bg-black/40 text-stone-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-cream-light'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Tier Selector (Best / Good / Budget) */}
      <div className="mb-8 flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-black/40 border border-white/[0.08] max-w-fit">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold px-2 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3 text-amber-gold" />
          <span>Budget Tier:</span>
        </span>
        {PRODUCT_TIERS.map((tier) => {
          const isSelected = activeTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setActiveTier(tier.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                isSelected
                  ? tier.id === 'best'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-sm'
                    : tier.id === 'budget'
                    ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/60 shadow-sm'
                    : 'bg-white/20 text-cream-light border-white/40 shadow-sm'
                  : 'bg-transparent text-stone-400 border-transparent hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              {tier.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {finalProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-400 font-sans">
            <p className="text-sm">No equipment found matching this category and price tier.</p>
            <button
              type="button"
              onClick={() => { setActiveCategory('all'); setActiveTier('all'); }}
              className="mt-3 text-xs font-mono font-bold text-amber-gold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : finalProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            trackMode={trackMode}
            isMethodMatched={Boolean(product.methodIds && activeMethod && product.methodIds.includes(activeMethod.id))}
          />
        ))}
      </div>

    </section>
  );
}
