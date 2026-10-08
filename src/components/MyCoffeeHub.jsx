import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  User, 
  Sliders, 
  QrCode, 
  Coffee, 
  Clock, 
  Award, 
  Plus, 
  Layers,
  ChevronRight,
  Flame,
  Store,
  Package,
  ScanLine,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import BrewJournal from './BrewJournal';
import RecipeExplorer from './RecipeExplorer';
import UserProfileDashboard from './UserProfileDashboard';
import { hapticTap, hapticSuccess } from '../utils/haptics';
import { 
  getInventoryBags, 
  removeBagFromInventory, 
  calculateBagFreshness, 
  INVENTORY_UPDATED_EVENT 
} from '../utils/bagInventoryStorage';
import {
  getFollowedRoasters,
  FOLLOWED_ROASTERS_EVENT
} from '../utils/followRoasterStorage';

export default function MyCoffeeHub({
  trackMode = 'coffee',
  activeMethod,
  cupCount,
  cupMl,
  customRatio,
  customWaterMl = null,
  customGrind = null,
  unitSystem = 'imperial',
  currentUser,
  onOpenAuth,
  onOpenScanner,
  onOpenRecipeBuilder,
  onSelectRecipeToBrew,
  onSelectRecipe,
  onBrewAgain,
  onOpenRoasterPortal,
  initialTab = 'journal'
}) {
  const handleRecipeSelect = onSelectRecipeToBrew || onSelectRecipe;
  const [activeTab, setActiveTab] = useState(initialTab); // 'journal' | 'stash' | 'recipes' | 'profile' | 'tools'
  const [inventoryBags, setInventoryBags] = useState(() => getInventoryBags());
  const [followedRoasters, setFollowedRoasters] = useState(() => getFollowedRoasters());

  useEffect(() => {
    const handleUpdate = () => {
      setInventoryBags(getInventoryBags());
    };
    const handleFollowUpdate = () => {
      setFollowedRoasters(getFollowedRoasters());
    };

    window.addEventListener(INVENTORY_UPDATED_EVENT, handleUpdate);
    window.addEventListener(FOLLOWED_ROASTERS_EVENT, handleFollowUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('storage', handleFollowUpdate);
    return () => {
      window.removeEventListener(INVENTORY_UPDATED_EVENT, handleUpdate);
      window.removeEventListener(FOLLOWED_ROASTERS_EVENT, handleFollowUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('storage', handleFollowUpdate);
    };
  }, []);

  const handleBrewBag = (bag) => {
    hapticTap();
    const recipeToBrew = {
      ...bag,
      bagId: bag.id,
      id: bag.id,
      beanName: bag.beanName,
      roaster: bag.roaster,
      origin: bag.origin,
      process: bag.process,
      roastLevel: bag.roastLevel,
      methodId: bag.brewMethod || 'pour_over',
      ratio: Number(bag.recommendedRatio) || 16,
      grindSetting: bag.recommendedGrind || 'Medium-Fine',
      tempF: Number(bag.tempF) || 202,
      tempC: Number(bag.tempC) || 94,
      doseGrams: bag.targetDose || 18.0
    };
    if (onBrewAgain) {
      onBrewAgain(recipeToBrew);
    } else if (handleRecipeSelect) {
      handleRecipeSelect(recipeToBrew);
    }
  };

  const handleRemoveBag = (bagId) => {
    hapticTap();
    removeBagFromInventory(bagId);
    setInventoryBags(getInventoryBags());
  };

  const handleTabChange = (tabId) => {
    hapticTap();
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-6xl mx-auto" data-view="recipes" id="recipe-vault-section">
      
      {/* 1. Header: My Coffee Personal Studio */}
      <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE8] border border-[#ECE6DC] shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] text-xs font-sans font-semibold">
            <Coffee className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Personal Barista Studio & Vault</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14110F] leading-tight">
            My Coffee Companion
          </h2>

          <p className="text-sm text-[#5C524B] leading-relaxed font-sans">
            Your personal hub for logged tasting extractions, custom recipes, barista achievement badges, and quick 1-click brew replay.
          </p>

          {followedRoasters.length > 0 && (
            <div id="followed-roasters-banner" className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#766A62] uppercase tracking-wider">
                Followed Roasters ({followedRoasters.length}):
              </span>
              {followedRoasters.map((r) => (
                <span
                  key={r.id || r.slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#ECE6DC] text-xs font-mono text-[#14110F] shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <strong>{r.name}</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Primary My Coffee Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DC] w-full overflow-x-auto">
        <button
          id="my-coffee-tab-journal"
          data-tab="journal"
          type="button"
          onClick={() => handleTabChange('journal')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#A8622D]" />
            <span>Tasting Journal</span>
          </span>
        </button>

        <button
          id="my-coffee-tab-stash"
          data-tab="stash"
          type="button"
          onClick={() => handleTabChange('stash')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'stash'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Package className="w-4 h-4 text-[#A8622D]" />
            <span>Coffee Stash</span>
            {inventoryBags.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#A25A24] text-[10px] font-mono font-bold">
                {inventoryBags.length}
              </span>
            )}
          </span>
        </button>

        <button
          id="my-coffee-tab-recipes"
          data-tab="recipes"
          type="button"
          onClick={() => handleTabChange('recipes')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'recipes'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2F663C]" />
            <span>Recipe Vault</span>
          </span>
        </button>

        <button
          id="my-coffee-tab-profile"
          data-tab="profile"
          type="button"
          onClick={() => handleTabChange('profile')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <User className="w-4 h-4 text-[#C88A4B]" />
            <span>Barista Profile</span>
          </span>
        </button>

        <button
          id="my-coffee-tab-tools"
          data-tab="tools"
          type="button"
          onClick={() => handleTabChange('tools')}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl text-xs font-sans font-bold transition-all text-center cursor-pointer ${
            activeTab === 'tools'
              ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
              : 'text-[#766A62] hover:text-[#14110F]'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Store className="w-4 h-4 text-[#A25A24]" />
            <span>Roaster Studio</span>
          </span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      <div>
        {/* Tab 1: Tasting Journal (Inlined) */}
        {activeTab === 'journal' && (
          <div className="space-y-6 animate-fade-in">
            <BrewJournal
              isOpen={true}
              isInline={true}
              onClose={() => {}}
              trackMode={trackMode}
              activeMethod={activeMethod}
              cupCount={cupCount}
              cupMl={cupMl}
              customRatio={customRatio}
              customGrind={customGrind}
              customWaterMl={customWaterMl}
              unitSystem={unitSystem}
              onOpenScanner={onOpenScanner}
              onBrewAgain={onBrewAgain}
              currentUser={currentUser}
            />
          </div>
        )}

        {/* Tab: Coffee Stash & Bag Inventory */}
        {activeTab === 'stash' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Stash Action Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#ECE6DC] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#A8622D]" />
                  <h3 className="font-editorial text-2xl font-bold text-[#14110F]">
                    Coffee Stash &amp; Bags
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#A25A24] text-xs font-mono font-bold">
                    {inventoryBags.length} active {inventoryBags.length === 1 ? 'bag' : 'bags'}
                  </span>
                </div>
                <p className="text-xs text-[#5C524B] font-sans">
                  Track degassing freshness, remaining grams, and link authentic bags to your dial-in brew logs.
                </p>
              </div>

              {onOpenScanner && (
                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    onOpenScanner();
                  }}
                  className="py-3 px-5 rounded-2xl bg-[#14110F] hover:bg-[#2A2421] text-white font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                >
                  <ScanLine className="w-4 h-4 text-[#E8AF72]" />
                  <span>Scan New Coffee Bag</span>
                </button>
              )}
            </div>

            {/* Inventory Overview Metrics (if bags present) */}
            {inventoryBags.length > 0 && (() => {
              const totalRemainingGrams = inventoryBags.reduce((sum, b) => sum + (Number(b.remainingGrams) || 0), 0);
              const estCups = Math.floor(totalRemainingGrams / 18);
              const peakBags = inventoryBags.filter(b => calculateBagFreshness(b.roastDate).status === 'peak').length;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC]">
                    <span className="text-[10px] font-mono uppercase text-[#766A62] block">Total Stock</span>
                    <span className="text-xl font-editorial font-bold text-[#14110F] mt-0.5 block">{totalRemainingGrams}g</span>
                    <span className="text-[10px] text-[#A8622D] font-mono">~{estCups} cups of coffee</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC]">
                    <span className="text-[10px] font-mono uppercase text-[#766A62] block">Freshness Peak</span>
                    <span className="text-xl font-editorial font-bold text-[#2F663C] mt-0.5 block">{peakBags} {peakBags === 1 ? 'Bag' : 'Bags'}</span>
                    <span className="text-[10px] text-[#2F663C] font-mono">In golden extraction window</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC]">
                    <span className="text-[10px] font-mono uppercase text-[#766A62] block">Average Dose</span>
                    <span className="text-xl font-editorial font-bold text-[#14110F] mt-0.5 block">18.0g</span>
                    <span className="text-[10px] text-[#766A62] font-mono">Auto-deducted on post-brew</span>
                  </div>
                </div>
              );
            })()}

            {/* Empty State */}
            {inventoryBags.length === 0 ? (
              <div className="p-10 sm:p-12 rounded-3xl bg-white border border-[#ECE6DC] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#A8622D] flex items-center justify-center mx-auto border border-[#ECD4BD]">
                  <Package className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h4 className="font-editorial text-2xl font-bold text-[#14110F]">
                    Your Coffee Stash is Empty
                  </h4>
                  <p className="text-xs text-[#5C524B] leading-relaxed">
                    Scan the barcode, QR code, or text label of any specialty coffee bag. We'll automatically identify the roaster, origin, roast date, calculate its degassing window, and tailor 3 precision brew recipes.
                  </p>
                </div>
                {onOpenScanner && (
                  <button
                    type="button"
                    onClick={() => {
                      hapticTap();
                      onOpenScanner();
                    }}
                    className="py-3 px-6 rounded-2xl bg-[#C88A4B] hover:bg-[#D69550] text-[#14110F] font-sans font-bold text-xs inline-flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Scan Your First Bag</span>
                  </button>
                )}
              </div>
            ) : (
              /* Bags Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventoryBags.map((bag) => {
                  const freshness = calculateBagFreshness(bag.roastDate);
                  const initialG = Number(bag.initialGrams) || 340;
                  const remainG = Number(bag.remainingGrams) || 0;
                  const pct = Math.max(0, Math.min(100, Math.round((remainG / initialG) * 100)));
                  const cupsLeft = Math.floor(remainG / 18);

                  const badgeClass =
                    freshness.badgeColor === 'emerald' ? 'bg-[#EBF5EE] text-[#2F663C] border-[#B7E1C3]' :
                    freshness.badgeColor === 'amber' ? 'bg-[#FFF8EE] text-[#A8622D] border-[#F6D8B0]' :
                    freshness.badgeColor === 'blue' ? 'bg-[#EEF6FF] text-[#1D4ED8] border-[#BFDBFE]' :
                    'bg-[#F5EFE8] text-[#5C524B] border-[#ECE6DC]';

                  return (
                    <div 
                      key={bag.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border border-[#ECE6DC] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="px-2 py-0.5 rounded-md bg-[#FAF0E6] text-[#A25A24] text-[10px] font-mono font-bold uppercase">
                              {bag.roaster}
                            </span>
                            <h4 className="font-editorial text-xl font-bold text-[#14110F] mt-1">
                              {bag.beanName}
                            </h4>
                            <p className="text-xs text-[#766A62] font-mono mt-0.5">
                              {bag.origin || 'Specialty Lot'} • {bag.process || 'Washed'} • {bag.roastLevel || 'Medium-Light'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveBag(bag.id)}
                            className="p-2 rounded-xl text-[#766A62] hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Remove from Stash"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Freshness Badge & Scientific Guidance */}
                        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${badgeClass}`}>
                              {freshness.label}
                            </span>
                            {bag.roastDate && (
                              <span className="text-[10px] text-[#766A62] font-mono">
                                Roasted: {new Date(bag.roastDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5C524B] leading-relaxed">
                            {freshness.recommendation}
                          </p>
                        </div>

                        {/* Remaining Weight Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-[#5C524B] font-bold">{remainG}g / {initialG}g remaining</span>
                            <span className="text-[#A8622D] font-bold">~{cupsLeft} brews</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#FAF0E6] overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#A8622D] to-[#C88A4B] rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Tasting Notes */}
                        {bag.tastingNotes && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(Array.isArray(bag.tastingNotes) ? bag.tastingNotes : [bag.tastingNotes]).map((note, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#766A62] text-[10px] font-medium border border-[#ECE6DC]">
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-[#ECE6DC] flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-[#766A62]">
                          Ratio: 1:{bag.recommendedRatio || 16} • {bag.tempF || 202}°F
                        </span>
                        <button
                          type="button"
                          onClick={() => handleBrewBag(bag)}
                          className="py-2 px-4 rounded-xl bg-[#14110F] hover:bg-[#2A2421] text-white font-sans font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                        >
                          <span>Brew This Bag</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#E8AF72]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Custom Recipes Explorer */}
        {activeTab === 'recipes' && (
          <div className="space-y-6 animate-fade-in">
            <RecipeExplorer
              trackMode={trackMode}
              onOpenRecipeBuilder={onOpenRecipeBuilder}
              onSelectRecipe={handleRecipeSelect}
            />
          </div>
        )}

        {/* Tab 3: Barista Profile & Achievements */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <UserProfileDashboard
              isOpen={true}
              isInline={true}
              onClose={() => {}}
              trackMode={trackMode}
              currentUser={currentUser}
              onOpenAuth={onOpenAuth}
            />
          </div>
        )}

        {/* Tab 4: Partner / Roaster Packaging Studio */}
        {activeTab === 'tools' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-8 rounded-3xl bg-white border border-[#ECE6DC] shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] border border-[#ECD4BD] flex items-center justify-center text-[#A25A24]">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#A25A24] bg-[#FAF0E6] px-2 py-0.5 rounded">
                    Free Tier Partner Tool
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#14110F] mt-1">
                    Specialty Roaster Packaging & Label Studio
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#5C524B] leading-relaxed max-w-2xl">
                Generate crisp 300 DPI thermal labels (4" x 6" and 2.25" x 1.25"), create Smart Bag QR codes for instant customer dial-in, manage roast profiles, and track dial-in telemetry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-1">
                  <div className="font-mono text-xs font-bold text-[#A8622D]">300 DPI Labels</div>
                  <p className="text-[11px] text-[#766A62]">Direct thermal PDF output ready for Rollo & Zebra printers.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-1">
                  <div className="font-mono text-xs font-bold text-[#A8622D]">Smart Bag QR</div>
                  <p className="text-[11px] text-[#766A62]">Customers scan bag to automatically dial in ratio and timer.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-1">
                  <div className="font-mono text-xs font-bold text-[#A8622D]">Lot Traceability</div>
                  <p className="text-[11px] text-[#766A62]">Display authentic farm altitude, varietal, and cupping scores.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  if (onOpenRoasterPortal) onOpenRoasterPortal();
                }}
                className="py-3.5 px-7 rounded-2xl bg-[#14110F] hover:bg-[#2A2421] text-white font-sans font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Store className="w-4 h-4 text-[#E8AF72]" />
                <span>Launch Roaster Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
