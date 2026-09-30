import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  Bookmark, 
  Coffee, 
  Leaf, 
  Trash2, 
  Award, 
  Clock, 
  Flame, 
  DownloadCloud, 
  Share2, 
  Sliders, 
  QrCode,
  Check,
  Play
} from 'lucide-react';
import { CURATED_MASTER_RECIPES } from '../data/communityRecipesData';
import ImportRecipeModal from './ImportRecipeModal';
import ShareRecipeModal from './ShareRecipeModal';
import GrindTranslatorModal from './GrindTranslatorModal';
import { decodeRecipeFromSharePayload } from '../utils/recipeParser';
import { trackEvent } from '../utils/analytics';
import { hapticTap, hapticSuccess } from '../utils/haptics';

export default function RecipeExplorer({ 
  trackMode, 
  onOpenRecipeBuilder, 
  onSelectRecipe,
  onSelectRecipeToBrew 
}) {
  const isCoffee = trackMode === 'coffee';
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'custom'
  const [selectedMethodFilter, setSelectedMethodFilter] = useState('all');
  
  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGrindTranslatorOpen, setIsGrindTranslatorOpen] = useState(false);
  const [activeShareRecipe, setActiveShareRecipe] = useState(null);
  const [sharedBannerRecipe, setSharedBannerRecipe] = useState(null);

  const [savedRecipeIds, setSavedRecipeIds] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_saved_recipes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customRecipes, setCustomRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_custom_recipes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const reloadCustomRecipes = () => {
    try {
      const saved = localStorage.getItem('the_brew_app_custom_recipes');
      setCustomRecipes(saved ? JSON.parse(saved) : []);
    } catch {
      setCustomRecipes([]);
    }
  };

  // Inspect URL for shared recipe deep link on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const recipeParam = params.get('recipe');
      if (recipeParam) {
        const decoded = decodeRecipeFromSharePayload(recipeParam);
        if (decoded) {
          setSharedBannerRecipe(decoded);
          setActiveTab('custom');
          // Add to custom recipes if not already present
          setCustomRecipes(prev => {
            const exists = prev.some(r => r.id === decoded.id || r.title === decoded.title);
            if (!exists) {
              const updated = [decoded, ...prev];
              localStorage.setItem('the_brew_app_custom_recipes', JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    reloadCustomRecipes();
  }, [trackMode]);

  const toggleSaveRecipe = (id) => {
    hapticTap();
    setSavedRecipeIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id];
      try {
        localStorage.setItem('the_brew_app_saved_recipes', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save recipe preference:', e);
      }
      return updated;
    });
    trackEvent('toggle_save_recipe', { recipe_id: id });
  };

  const handleDeleteCustomRecipe = (id) => {
    hapticTap();
    const updated = customRecipes.filter((r) => r.id !== id);
    setCustomRecipes(updated);
    try {
      localStorage.setItem('the_brew_app_custom_recipes', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update custom recipes:', e);
    }
  };

  const handleRecipeSaved = (newRecipe) => {
    reloadCustomRecipes();
    setActiveTab('custom');
  };

  const handleStartBrewing = (recipe) => {
    hapticSuccess();
    const handler = onSelectRecipeToBrew || onSelectRecipe;
    if (handler) {
      handler(recipe);
    }
  };

  const displayedCurated = CURATED_MASTER_RECIPES.filter((r) => {
    if (r.trackMode !== trackMode) return false;
    if (selectedMethodFilter !== 'all' && r.methodId !== selectedMethodFilter) return false;
    return true;
  });

  const displayedCustom = customRecipes.filter((r) => {
    if (r.trackMode !== trackMode) return false;
    if (selectedMethodFilter !== 'all' && r.methodId !== selectedMethodFilter) return false;
    return true;
  });

  return (
    <section className="mt-6 p-6 md:p-8 rounded-3xl glass-panel shadow-2xl transition-all duration-500 text-left">
      
      {/* Shared Deep-Link Banner */}
      {sharedBannerRecipe && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-cream-light flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 text-amber-gold flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-gold font-bold">
                  Shared Recipe Discovered
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold">
                  Saved to Your Box
                </span>
              </div>
              <h4 className="font-serif text-base font-bold text-cream-light">
                {sharedBannerRecipe.title} • {sharedBannerRecipe.methodName} ({sharedBannerRecipe.dryDoseGrams}g, 1:{sharedBannerRecipe.ratio})
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStartBrewing(sharedBannerRecipe)}
              className="py-2 px-4 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Brew Now</span>
            </button>
            <button
              type="button"
              onClick={() => setSharedBannerRecipe(null)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Master Extraction Guides & Personal Studio</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
            {isCoffee ? 'Specialty Coffee Recipe Vault & Studio' : 'Fine Tea Steeping Vault'}
          </h3>
          <p className="text-xs md:text-sm text-cream-soft/70 mt-1 max-w-2xl">
            Explore verified benchmark extraction guides for all brew methods, import recipes from YouTube or Instagram, translate grind settings, and create custom profiles saved offline.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grind Translator Button */}
          <button
            type="button"
            onClick={() => { hapticTap(); setIsGrindTranslatorOpen(true); }}
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-stone-200 border border-white/15 font-mono text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Translate grind sizes across common grinders"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-gold" />
            <span>Grind Translator</span>
          </button>

          {/* Import Recipe Button */}
          <button
            type="button"
            onClick={() => { hapticTap(); setIsImportModalOpen(true); }}
            className="px-3.5 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-mono text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Import recipe from YouTube, Instagram, blog, or text"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-amber-400" />
            <span>Import Recipe</span>
          </button>

          {/* Create Custom Recipe */}
          <button
            type="button"
            onClick={onOpenRecipeBuilder}
            className="px-4 py-2.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Recipe</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Curated Guides vs My Custom Recipes */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2 p-1 rounded-2xl bg-black/50 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => { hapticTap(); setActiveTab('curated'); }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'curated'
                ? 'bg-amber-gold text-espresso-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-cream-light'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Curated Master Guides ({displayedCurated.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { hapticTap(); setActiveTab('custom'); }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-amber-gold text-espresso-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-cream-light'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Custom Recipes ({displayedCustom.length})</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-stone-400">
          {activeTab === 'curated' ? 'Verified Standards (V60, Kalita, Chemex, AeroPress, French Press, Moka, Espresso)' : 'Saved Locally on Device & Offline-Ready'}
        </span>
      </div>

      {/* TAB 1: CURATED MASTER GUIDES */}
      {activeTab === 'curated' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCurated.map((recipe) => {
            const isSaved = savedRecipeIds.includes(recipe.id);
            return (
              <div
                key={recipe.id}
                className="p-6 rounded-3xl bg-[#14110E]/90 border border-white/10 hover:border-amber-gold/50 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Header Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-gold border border-amber-400/30 text-[10px] font-mono font-bold">
                        {recipe.badge}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">{recipe.methodName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Share Recipe Button */}
                      <button
                        type="button"
                        onClick={() => { hapticTap(); setActiveShareRecipe(recipe); }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-amber-300 border border-white/10 transition cursor-pointer"
                        title="Share Recipe (Link & QR)"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => toggleSaveRecipe(recipe.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-amber-gold text-espresso-950 border-amber-gold'
                            : 'bg-white/5 border-white/10 text-stone-400 hover:text-cream-light'
                        }`}
                        title={isSaved ? "Saved to Recipe Box" : "Save Recipe"}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Technique */}
                  <h4 className="font-serif text-lg font-bold text-cream-light mb-1.5 leading-snug group-hover:text-amber-gold transition-colors">
                    {recipe.title}
                  </h4>

                  <div className="text-[11px] text-amber-gold/90 font-mono mb-2">
                    {recipe.technique}
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed mb-4 line-clamp-3">
                    {recipe.description}
                  </p>

                  {/* Ratio & Parameters */}
                  <div className="flex flex-wrap gap-2 mb-4 font-mono text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-gold/15 text-amber-gold border border-amber-gold/30 font-bold">
                      Ratio 1:{recipe.ratio}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-stone-300 border border-white/10">
                      Dose: {recipe.dryDoseGrams}g
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-stone-300 border border-white/10">
                      Temp: {recipe.waterTempF ? `${recipe.waterTempF}°F` : `${recipe.waterTempC}°C`}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-stone-400 mb-3 bg-black/40 p-2 rounded-xl border border-white/5">
                    Grind: <strong className="text-stone-300">{recipe.grindSetting}</strong>
                  </div>
                </div>

                {/* Steps Accordion / Details */}
                <div>
                  <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-stone-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-gold" />
                      <span>Total Time: ~{Math.ceil(recipe.totalTimeSec / 60)} min</span>
                    </span>
                    <span className="text-stone-500">{recipe.steps?.length || 0} Phases</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartBrewing(recipe)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-amber-gold/10 hover:bg-amber-gold hover:text-espresso-950 text-amber-gold font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-amber-gold/30 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Brew with this Guide →</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MY CUSTOM RECIPES */}
      {activeTab === 'custom' && (
        <div>
          {displayedCustom.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-black/40 border border-white/10">
              <BookOpen className="w-10 h-10 text-stone-600 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-cream-light mb-1">
                No Custom Recipes Saved Yet
              </h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
                Design custom pour schedules or import recipes from YouTube and Instagram. All recipes are stored offline on your device.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="py-2.5 px-5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold uppercase tracking-wider"
                >
                  Import External Recipe
                </button>
                <button
                  type="button"
                  onClick={onOpenRecipeBuilder}
                  className="py-2.5 px-5 rounded-xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider"
                >
                  Create Custom Recipe
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCustom.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-6 rounded-3xl bg-[#14110E]/90 border border-amber-gold/30 shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold">
                        {recipe.badge || 'Personal Custom Recipe'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Share Custom Recipe */}
                        <button
                          type="button"
                          onClick={() => { hapticTap(); setActiveShareRecipe(recipe); }}
                          className="p-1.5 rounded-lg bg-white/5 text-stone-400 hover:text-amber-300 hover:bg-white/10 transition-all border border-white/10 cursor-pointer"
                          title="Share Recipe (Link & QR)"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCustomRecipe(recipe.id)}
                          className="p-1.5 rounded-lg bg-white/5 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/10 cursor-pointer"
                          title="Delete Custom Recipe"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-cream-light mb-1.5 leading-snug">
                      {recipe.title}
                    </h4>

                    <div className="text-[11px] text-stone-400 font-mono mb-2">
                      Method: {recipe.methodName} • {recipe.beanName}
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed mb-4 line-clamp-3">
                      {recipe.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4 font-mono text-[11px]">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-gold/15 text-amber-gold border border-amber-gold/30 font-bold">
                        Ratio 1:{recipe.ratio}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 text-stone-300 border border-white/10">
                        Dose: {recipe.dryDoseGrams}g
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 text-stone-300 border border-white/10">
                        Temp: {recipe.waterTempF ? `${recipe.waterTempF}°F` : `${recipe.waterTempC}°C`}
                      </span>
                    </div>

                    {recipe.grindSetting && (
                      <div className="text-[10px] font-mono text-stone-400 mb-3 bg-black/40 p-2 rounded-xl border border-white/5">
                        Grind: <strong className="text-stone-300">{recipe.grindSetting}</strong>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-stone-400 flex items-center justify-between">
                      <span>Created: {recipe.createdAt || 'Recent'}</span>
                      <span className="text-stone-500">{recipe.steps?.length || 0} Phases</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartBrewing(recipe)}
                      className="mt-3 w-full py-2.5 rounded-xl bg-amber-gold/10 hover:bg-amber-gold hover:text-espresso-950 text-amber-gold font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-amber-gold/30 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Brew with this Recipe →</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Import Recipe Modal */}
      <ImportRecipeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onRecipeSaved={handleRecipeSaved}
        onSelectRecipeToBrew={handleStartBrewing}
      />

      {/* Share Recipe Modal */}
      <ShareRecipeModal
        isOpen={Boolean(activeShareRecipe)}
        onClose={() => setActiveShareRecipe(null)}
        recipe={activeShareRecipe}
      />

      {/* Grind Translator Modal */}
      <GrindTranslatorModal
        isOpen={isGrindTranslatorOpen}
        onClose={() => setIsGrindTranslatorOpen(false)}
      />

    </section>
  );
}
