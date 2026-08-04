import React, { useState } from 'react';
import { Search, X, Coffee, Leaf, ShoppingBag, BookOpen, GraduationCap, HelpCircle, ChevronRight, Star } from 'lucide-react';
import { BREW_METHODS, TERROIR_ATLAS } from '../data/brewData';
import { PRODUCTS_DATA } from '../data/productsData';
import { COMMUNITY_RECIPES } from '../data/communityRecipesData';
import { trackEvent } from '../utils/analytics';

export default function GlobalSearchModal({ isOpen, onClose, onSelectMethod, onSelectProduct, onSelectRecipe }) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'recipes' | 'methods' | 'gear' | 'origins'

  const searchQuery = query.trim().toLowerCase();

  // 1. Search Methods
  const matchingMethods = [];
  Object.keys(BREW_METHODS).forEach((track) => {
    BREW_METHODS[track].forEach((method) => {
      if (
        !searchQuery ||
        method.name.toLowerCase().includes(searchQuery) ||
        method.description.toLowerCase().includes(searchQuery) ||
        (method.grind && method.grind.toLowerCase().includes(searchQuery))
      ) {
        matchingMethods.push(method);
      }
    });
  });

  // 2. Search Products / Gear
  const matchingProducts = PRODUCTS_DATA.filter((prod) => {
    if (!searchQuery) return true;
    return (
      prod.name.toLowerCase().includes(searchQuery) ||
      prod.description.toLowerCase().includes(searchQuery) ||
      prod.category.toLowerCase().includes(searchQuery)
    );
  });

  // 3. Search Community Recipes
  const matchingRecipes = COMMUNITY_RECIPES.filter((rec) => {
    if (!searchQuery) return true;
    return (
      rec.title.toLowerCase().includes(searchQuery) ||
      rec.beanName.toLowerCase().includes(searchQuery) ||
      rec.author.toLowerCase().includes(searchQuery)
    );
  });

  // 4. Search Terroirs & Origins
  const matchingOrigins = [];
  Object.keys(TERROIR_ATLAS).forEach((track) => {
    TERROIR_ATLAS[track].forEach((orig) => {
      if (
        !searchQuery ||
        orig.country.toLowerCase().includes(searchQuery) ||
        (orig.macroRegion && orig.macroRegion.toLowerCase().includes(searchQuery))
      ) {
        matchingOrigins.push(orig);
      }
    });
  });

  const handleSelectProduct = (product) => {
    trackEvent('search_select_product', { product_id: product.id, product_name: product.name });
    if (onSelectProduct) onSelectProduct(product);
    onClose();
  };

  const handleSelectMethod = (method) => {
    trackEvent('search_select_method', { method_id: method.id, method_name: method.name });
    if (onSelectMethod) onSelectMethod(method);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      
      <div className="relative max-w-3xl w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 shadow-2xl overflow-hidden text-cream-light flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center gap-3 bg-black/40">
          <Search className="w-6 h-6 text-amber-gold flex-shrink-0 animate-pulse" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, grind sizes, gear, V60, kettles, origins..."
            className="w-full bg-transparent text-lg sm:text-xl font-serif text-cream-light placeholder-stone-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 overflow-x-auto text-xs font-mono font-bold bg-black/20">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-xl transition-all ${activeCategory === 'all' ? 'bg-amber-gold text-espresso-950 shadow-md' : 'text-stone-400 hover:text-cream-light'}`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveCategory('recipes')}
            className={`px-3 py-1 rounded-xl transition-all ${activeCategory === 'recipes' ? 'bg-amber-gold text-espresso-950 shadow-md' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Recipes ({matchingRecipes.length})
          </button>
          <button
            onClick={() => setActiveCategory('methods')}
            className={`px-3 py-1 rounded-xl transition-all ${activeCategory === 'methods' ? 'bg-amber-gold text-espresso-950 shadow-md' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Methods ({matchingMethods.length})
          </button>
          <button
            onClick={() => setActiveCategory('gear')}
            className={`px-3 py-1 rounded-xl transition-all ${activeCategory === 'gear' ? 'bg-amber-gold text-espresso-950 shadow-md' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Gear ({matchingProducts.length})
          </button>
          <button
            onClick={() => setActiveCategory('origins')}
            className={`px-3 py-1 rounded-xl transition-all ${activeCategory === 'origins' ? 'bg-amber-gold text-espresso-950 shadow-md' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Terroirs ({matchingOrigins.length})
          </button>
        </div>

        {/* Search Results Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* 1. Shared Community Recipes */}
          {(activeCategory === 'all' || activeCategory === 'recipes') && matchingRecipes.length > 0 && (
            <div>
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Community Recipes</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {matchingRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-gold/50 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div>
                      <div className="font-serif font-bold text-cream-light text-sm group-hover:text-amber-gold transition-colors">
                        {recipe.title}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {recipe.methodName} • {recipe.beanName} • <strong className="text-amber-gold font-mono">Ratio 1:{recipe.ratio}</strong>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-gold font-mono font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-gold/30">
                      <Star className="w-3 h-3 fill-current text-amber-gold" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Brewing Methods */}
          {(activeCategory === 'all' || activeCategory === 'methods') && matchingMethods.length > 0 && (
            <div>
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-3 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" />
                <span>Brewing Devices & Varietals</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-gold/50 transition-all flex items-center justify-between gap-2 group cursor-pointer"
                  >
                    <div>
                      <div className="font-serif font-bold text-cream-light group-hover:text-amber-gold transition-colors">
                        {method.name}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                        Temp: {method.tempF}°F • Ratio: 1:{method.ratio}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-gold transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Gear & Amazon Affiliate Products */}
          {(activeCategory === 'all' || activeCategory === 'gear') && matchingProducts.length > 0 && (
            <div>
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-3 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Curated Brew Gear & Beans</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingProducts.map((prod) => (
                  <a
                    key={prod.id}
                    href={prod.amazonUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    data-product-name={prod.name}
                    data-link-id={prod.id}
                    data-context="global_search"
                    className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-gold/50 transition-all flex items-center gap-3 group"
                  >
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    <div className="overflow-hidden">
                      <div className="font-serif font-bold text-cream-light truncate group-hover:text-amber-gold transition-colors text-xs">
                        {prod.name}
                      </div>
                      <div className="text-[10px] font-mono text-amber-gold mt-0.5">
                        {prod.priceRange} • ⭐ {prod.rating}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
