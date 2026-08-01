import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Filter, ShieldCheck, ExternalLink, CheckCircle2, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import { PRODUCTS_DATA, PRODUCT_CATEGORIES } from '../data/productsData';

export default function BrewShopSection({ trackMode, activeMethod }) {
  const isCoffee = trackMode === 'coffee';
  const [activeCategory, setActiveCategory] = useState('method_kit');

  // Filter products by selected category
  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    if (activeCategory === 'method_kit') {
      return product.methodIds && activeMethod && product.methodIds.includes(activeMethod.id);
    }
    if (activeCategory === 'top_rated') {
      return product.topRated || product.rating >= 4.9;
    }
    return product.category === activeCategory;
  });

  // Fallback to universal essentials if selected method has no direct method_kit match
  const displayProducts = (activeCategory === 'method_kit' && filteredProducts.length === 0)
    ? PRODUCTS_DATA.filter(p => p.category === 'universal' || p.category === 'grinders_scales')
    : filteredProducts;

  return (
    <section className="mt-14 p-7 md:p-10 lg:p-12 rounded-3xl glass-panel shadow-2xl transition-all duration-500 relative">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-amber-gold mb-2">
            <ShoppingBag className="w-4 h-4 animate-pulse" />
            <span>Curated Gear • Brew Essentials Kit & Shop</span>
          </div>
          
          <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md">
            The Ultimate {activeMethod?.name || 'Brew'} Gear Kit
          </h3>

          <p className="text-xs md:text-sm text-stone-300 mt-2 max-w-3xl leading-relaxed">
            Handpicked specialty equipment, water TDS testing meters, precision micro-gram scales, heavy-duty scoops, temperature goosenecks, burr grinders, and specialty beans & teas.
          </p>
        </div>

        {/* Amazon Associate Disclosure Pill */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md max-w-xs flex-shrink-0">
          <div className="flex items-center space-x-2 text-amber-gold text-xs font-mono font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-gold" />
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
          <button
            onClick={() => setActiveCategory('method_kit')}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border flex items-center gap-2 ${
              activeCategory === 'method_kit'
                ? isCoffee
                  ? 'bg-amber-gold text-espresso-950 border-amber-gold shadow-[0_0_20px_rgba(212,140,70,0.3)]'
                  : 'bg-sage-300 text-slate-950 border-sage-300 shadow-[0_0_20px_rgba(143,168,153,0.3)]'
                : 'bg-black/30 text-stone-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-cream-light'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeMethod?.name} Kit</span>
          </button>

          {PRODUCT_CATEGORIES.filter(c => c.id !== 'method_kit').map((cat) => {
            const isSelected = activeCategory === cat.id;
            const isTopRatedPill = cat.id === 'top_rated';
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? isCoffee
                      ? 'bg-amber-gold text-espresso-950 border-amber-gold shadow-[0_0_20px_rgba(212,140,70,0.3)]'
                      : 'bg-sage-300 text-slate-950 border-sage-300 shadow-[0_0_20px_rgba(143,168,153,0.3)]'
                    : isTopRatedPill
                    ? 'bg-amber-500/10 text-amber-gold border-amber-400/40 hover:bg-amber-400/20'
                    : 'bg-black/30 text-stone-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-cream-light'
                }`}
              >
                {isTopRatedPill && <Star className="w-3.5 h-3.5 fill-current text-amber-gold" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProducts.map((product) => (
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
