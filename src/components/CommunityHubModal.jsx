import React from 'react';
import { BookOpen, X, Sparkles, Plus, Coffee, Leaf } from 'lucide-react';
import RecipeExplorer from './RecipeExplorer';

export default function CommunityHubModal({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  trackMode,
  onOpenRecipeBuilder,
  onSelectRecipe
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#120F0D] border-2 border-amber-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-amber-950/70 via-[#1A1613] to-espresso-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-gold text-espresso-950 shadow-lg shadow-amber-gold/20 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Extraction Vault & Personal Studio</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light">
                Master Recipe Vault & Personal Studio
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-cream-light transition-all active:scale-95"
            title="Close Recipe Vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Recipe & Personal Studio Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <RecipeExplorer
            trackMode={trackMode}
            onOpenRecipeBuilder={onOpenRecipeBuilder}
            onSelectRecipe={onSelectRecipe}
          />
        </div>

      </div>
    </div>
  );
}
