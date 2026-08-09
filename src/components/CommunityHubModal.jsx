import React, { useState } from 'react';
import { Users, X, Sparkles, BookOpen, MessageSquare, Plus, Lock, Coffee, Leaf, ChevronRight } from 'lucide-react';
import RecipeExplorer from './RecipeExplorer';
import BrewMasterCommunity from './BrewMasterCommunity';

export default function CommunityHubModal({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  trackMode,
  onOpenRecipeBuilder
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' | 'forum'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#120F0D] border-2 border-amber-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-amber-950/70 via-[#1A1613] to-espresso-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-gold text-espresso-950 shadow-lg shadow-amber-gold/20 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Brew Master Exclusive Hub</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light">
                Brew Master Community & Shared Recipes 🌐
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-cream-light transition-all active:scale-95"
            title="Close Community Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest Lock Screen Prompt if Not Logged In */}
        {!currentUser ? (
          <div className="p-8 sm:p-12 text-center max-w-xl mx-auto my-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-gold/20 text-amber-gold border-2 border-amber-gold/40 flex items-center justify-center mx-auto shadow-2xl">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-extrabold text-cream-light mb-2">
                Sign In Required to Access Community
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Connect with specialty coffee roasters and tea masters worldwide. Log in to explore member recipes, publish custom extractions, and participate in community discussions.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Sign In / Create Account 🔐</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 text-cream-light font-bold text-xs hover:bg-white/20 border border-white/15 transition-all"
              >
                Back to Brew Calculator
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Community Workspace */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Community Sub-Tab Switcher */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2 p-1 rounded-2xl bg-black/60 border border-white/15 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all ${
                    activeTab === 'recipes'
                      ? 'btn-tactile-amber text-espresso-950 font-extrabold shadow-md scale-102'
                      : 'text-stone-400 hover:text-cream-light'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Shared Community Recipes</span>
                </button>

                <button
                  onClick={() => setActiveTab('forum')}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all ${
                    activeTab === 'forum'
                      ? 'btn-tactile-amber text-espresso-950 font-extrabold shadow-md scale-102'
                      : 'text-stone-400 hover:text-cream-light'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Brew Master Forum Posts</span>
                </button>
              </div>

              {/* Logged-In User Badge Indicator */}
              <div className="hidden md:flex items-center space-x-2 text-xs text-stone-300 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Logged in as <strong className="text-amber-gold">{currentUser.displayName || currentUser.username}</strong></span>
              </div>
            </div>

            {/* TAB 1: COMMUNITY RECIPES */}
            {activeTab === 'recipes' && (
              <div className="animate-fade-in">
                <RecipeExplorer
                  trackMode={trackMode}
                  onOpenRecipeBuilder={onOpenRecipeBuilder}
                />
              </div>
            )}

            {/* TAB 2: BREW MASTER FORUM POSTS */}
            {activeTab === 'forum' && (
              <div className="animate-fade-in">
                <BrewMasterCommunity
                  currentUser={currentUser}
                  onOpenAuth={onOpenAuth}
                />
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
