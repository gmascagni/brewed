import React, { useState } from 'react';
import { BookOpen, Star, Sparkles, Plus, Bookmark, Share2, Flame, Sliders, Coffee, Leaf, ChevronRight, User } from 'lucide-react';
import { COMMUNITY_RECIPES } from '../data/communityRecipesData';
import { trackEvent } from '../utils/analytics';

export default function RecipeExplorer({ trackMode, onOpenRecipeBuilder }) {
  const isCoffee = trackMode === 'coffee';
  const [selectedMethodFilter, setSelectedMethodFilter] = useState('all');
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);

  const toggleSaveRecipe = (id) => {
    setSavedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
    trackEvent('toggle_save_recipe', { recipe_id: id });
  };

  const filteredRecipes = COMMUNITY_RECIPES.filter((r) => {
    if (r.trackMode !== trackMode) return false;
    if (selectedMethodFilter !== 'all' && r.methodId !== selectedMethodFilter) return false;
    return true;
  });

  return (
    <section className="mt-14 p-7 md:p-9 rounded-3xl glass-panel shadow-2xl transition-all duration-500">
      
      {/* Section Header & Create Recipe Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Community Recipe Exchange & User Submissions</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
            {isCoffee ? 'Specialty Coffee Community Brew Recipes' : 'Fine Tea Community Steeping Recipes'}
          </h3>
          <p className="text-xs md:text-sm text-cream-soft/70 mt-1">
            Explore, clone, and publish custom multi-step extraction recipes created by world baristas & tea masters.
          </p>
        </div>

        <button
          onClick={onOpenRecipeBuilder}
          className="px-5 py-3 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Recipe</span>
        </button>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const isSaved = savedRecipeIds.includes(recipe.id);
          return (
            <div
              key={recipe.id}
              className="p-6 rounded-3xl bg-[#14110E]/90 border border-white/10 hover:border-amber-gold/50 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                {/* Author Info & Bookmark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={recipe.authorAvatar}
                      alt={recipe.author}
                      className="w-8 h-8 rounded-full object-cover border border-amber-gold/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-cream-light block">{recipe.author}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{recipe.methodName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSaveRecipe(recipe.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      isSaved
                        ? 'bg-amber-gold text-espresso-950 border-amber-gold'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:text-cream-light'
                    }`}
                    title={isSaved ? "Saved to Recipe Box" : "Save Recipe"}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Recipe Title & Rating */}
                <h4 className="font-serif text-lg font-bold text-cream-light mb-2 leading-snug group-hover:text-amber-gold transition-colors">
                  {recipe.title}
                </h4>

                <p className="text-xs text-stone-400 leading-relaxed mb-4">
                  {recipe.description}
                </p>

                {/* Ratio & Specs Badges */}
                <div className="flex flex-wrap gap-2 mb-4 font-mono text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-gold/15 text-amber-gold border border-amber-gold/30 font-bold">
                    Ratio 1:{recipe.ratio}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-stone-300 border border-white/10">
                    Dose: {recipe.dryDoseGrams}g
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-stone-300 border border-white/10">
                    Temp: {recipe.waterTempC}°C
                  </span>
                </div>
              </div>

              {/* Footer Stats & Ratings */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-amber-gold font-mono font-bold">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-gold" />
                  <span>{recipe.rating}</span>
                  <span className="text-stone-500 font-normal">({recipe.reviewsCount})</span>
                </div>

                <span className="text-[11px] text-stone-400 font-mono">
                  {recipe.savesCount} saves
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
