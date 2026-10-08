import React, { useState, useEffect } from 'react';
import { 
  X, User, Flame, Award, Sparkles, Coffee, Leaf, Shield, CheckCircle2, 
  Bookmark, Edit3, LogOut, HelpCircle, ChevronDown, ChevronUp, Target, 
  Store, QrCode, ArrowRight, Plus, Droplets, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';
import { getAssetUrl } from '../utils/assetUrl';
import { getRoasterOwnedBrandsAndCoffees } from '../data/roasterRegistry';

export default function UserProfileDashboard({ 
  isOpen, 
  onClose, 
  trackMode, 
  currentUser, 
  onOpenAuth, 
  onOpenRoasterPortal, 
  onNavigateToRoaster,
  onSelectBeanToBrew,
  onOpenWaterLab,
  onLogout, 
  isInline = false 
}) {
  if (!isOpen && !isInline) return null;

  const [showInstructions, setShowInstructions] = useState(false);
  const [userAvatarFailed, setUserAvatarFailed] = useState(false);
  const [viewMode, setViewMode] = useState('roaster'); // 'roaster' | 'consumer'
  const scrollContainerRef = React.useRef(null);

  // Reset scroll position to top whenever modal opens
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Resolve roaster brand and coffee ownership
  const { ownedRoasters, primaryRoaster, ownedCoffees } = getRoasterOwnedBrandsAndCoffees(currentUser);
  const isRoaster = Boolean(
    currentUser && (currentUser.role === 'roaster' || currentUser.isVerifiedRoaster || ownedRoasters.length > 0)
  );

  useEffect(() => {
    setUserAvatarFailed(false);
  }, [currentUser?.avatar]);

  // 1. Read actual brew logs from device's private journal
  const journalLogs = (() => {
    try {
      const raw = localStorage.getItem('the_brew_app_journal_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  // 2. Read custom recipes created on this device
  const customRecipes = (() => {
    try {
      const raw = localStorage.getItem('the_brew_app_custom_recipes');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  // 3. Compute real streak from consecutive brew dates
  const calculateStreak = (logs) => {
    if (!logs || logs.length === 0) return 0;
    const dates = Array.from(
      new Set(
        logs
          .map((l) => l.date || l.createdAt)
          .filter(Boolean)
          .map((d) => {
            const dt = new Date(d);
            return isNaN(dt.getTime()) ? null : dt.toISOString().slice(0, 10);
          })
          .filter(Boolean)
      )
    ).sort().reverse();

    if (dates.length === 0) return 0;

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (dates[0] !== todayStr && dates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const realStreak = calculateStreak(journalLogs);
  const totalBrewsLogged = journalLogs.length;

  // 4. Compute genuinely unlocked badges based on actual user activity
  const unlockedBadgeIds = [];
  if (totalBrewsLogged >= 1) unlockedBadgeIds.push('first_brew');
  if (journalLogs.some((l) => (l.ratio >= 15.8 && l.ratio <= 16.2) || l.ratio === 16)) unlockedBadgeIds.push('golden_ratio_master');
  if (realStreak >= 3) unlockedBadgeIds.push('streak_3_days');
  if (realStreak >= 7) unlockedBadgeIds.push('streak_7_days');
  if (journalLogs.filter((l) => l.methodId === 'pour_over' || l.methodId === 'classic_pour_over').length >= 5) unlockedBadgeIds.push('pour_over_aficionado');
  if (journalLogs.filter((l) => l.methodId === 'french_press' || l.methodId === 'french_press_expert').length >= 5) unlockedBadgeIds.push('french_press_expert');
  if (new Set(journalLogs.map((l) => l.origin).filter(Boolean)).size >= 5) unlockedBadgeIds.push('terroir_explorer');
  if (customRecipes.length >= 1) unlockedBadgeIds.push('recipe_creator');

  const profile = currentUser;
  const showRoasterWorkspace = isRoaster && viewMode === 'roaster';

  const content = (
    <div 
      ref={scrollContainerRef}
      role={isInline ? "region" : "dialog"} 
      aria-modal={!isInline} 
      aria-label="User Profile Dashboard" 
      className={`relative max-w-3xl w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 p-6 md:p-8 shadow-2xl text-cream-light ${isInline ? 'my-2' : ''}`}
    >
      {/* Modal Close Button */}
      {!isInline && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* User Header Profile Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 mb-6 pb-6 border-b border-white/10">
        {showRoasterWorkspace && primaryRoaster?.logoImage ? (
          <img
            src={primaryRoaster.logoImage}
            alt={primaryRoaster.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-gold shadow-xl flex-shrink-0"
          />
        ) : showRoasterWorkspace ? (
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-gold/60 flex items-center justify-center shadow-xl flex-shrink-0 text-amber-gold font-serif text-3xl font-bold">
            {primaryRoaster?.monogram || primaryRoaster?.name?.charAt(0) || 'B'}
          </div>
        ) : profile?.avatar && profile.avatar !== '/' && !userAvatarFailed ? (
          <img
            src={getAssetUrl(profile.avatar)}
            alt={profile.displayName}
            onError={() => setUserAvatarFailed(true)}
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-gold shadow-xl flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-amber-500/15 border-2 border-amber-gold/60 flex items-center justify-center shadow-xl flex-shrink-0">
            <User className="w-10 h-10 text-amber-gold" />
          </div>
        )}

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-2xl font-bold text-cream-light flex items-center justify-center sm:justify-start gap-2">
                <span>
                  {showRoasterWorkspace
                    ? (primaryRoaster?.name || profile?.roasterName || profile?.displayName)
                    : (profile ? profile.displayName : 'Guest Barista')}
                </span>
                {showRoasterWorkspace ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 fill-current" />
                ) : profile ? (
                  <Shield className="w-4 h-4 text-amber-gold fill-current" />
                ) : null}
              </h3>
              
              <div className="text-xs font-mono text-amber-gold font-bold flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-1">
                {showRoasterWorkspace ? (
                  <>
                    <span>@{profile?.username?.replace(/^@/, '')}</span>
                    <span>•</span>
                    <span className="text-emerald-300">Verified Brand Owner</span>
                    {Boolean(primaryRoaster?.location || (primaryRoaster?.city ? `${primaryRoaster.city}, ${primaryRoaster.state || ''}`.trim() : null) || 'Alpharetta, GA') && (
                      <>
                        <span>•</span>
                        <span className="text-stone-300 font-normal">
                          {primaryRoaster?.location || (primaryRoaster?.city ? `${primaryRoaster.city}, ${primaryRoaster.state || ''}`.trim() : null) || 'Alpharetta, GA'}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span>{profile ? `${profile.username} • On-Device Profile` : '@guest • On-Device Session'}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {profile ? (
                <>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-gold border border-amber-400/40 text-xs font-mono font-bold">
                    {showRoasterWorkspace ? 'Roaster Active' : 'Active Profile'}
                  </span>
                  {onOpenAuth && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="p-1.5 px-3 rounded-xl bg-white/10 text-amber-gold hover:bg-white/20 border border-amber-gold/30 transition-all flex items-center gap-1 text-xs font-bold font-mono cursor-pointer"
                      title="Edit Your Profile Info & Avatar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="p-1.5 px-3 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/40 transition-all flex items-center gap-1 text-xs font-bold font-mono cursor-pointer"
                      title="Sign Out of Your Profile"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </>
              ) : (
                onOpenAuth && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="py-2 px-4 rounded-xl btn-tactile-amber text-espresso-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Profile</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Roaster Brand Verified Banner */}
          {showRoasterWorkspace ? (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Active Roaster Brand: <strong className="text-white">{primaryRoaster?.name || 'Brookmill Coffee Roasters'}</strong>
                  {profile?.email && <span className="text-emerald-400/80 ml-1.5 font-normal">({profile.email})</span>}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {onNavigateToRoaster && primaryRoaster?.slug && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToRoaster(primaryRoaster.slug);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-cream-light text-[11px] font-mono flex items-center gap-1 border border-white/15 transition cursor-pointer"
                    title="View public brand showcase page"
                  >
                    <ExternalLink className="w-3 h-3 text-amber-gold" />
                    <span>Showcase</span>
                  </button>
                )}
                {onOpenRoasterPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRoasterPortal(null, 'catalog');
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-gold hover:bg-amber-400 text-espresso-950 text-[11px] font-mono font-bold flex items-center gap-1 shadow transition cursor-pointer"
                  >
                    <span>Roaster Hub →</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-300 mt-2 leading-relaxed font-normal">
              {profile?.bio || 'You are brewing as an anonymous guest. All tasting notes and custom recipes save directly to your browser.'}
            </p>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROASTER WORKSPACE VIEW (Active for Authenticated Roaster Brand Owners)    */}
      {/* ========================================================================= */}
      {showRoasterWorkspace ? (
        <div className="space-y-6 animate-fade-in">
          {/* Operations Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30">
              <div className="text-xl font-bold text-amber-gold">{ownedCoffees.length}</div>
              <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-0.5">
                Active Craft Lots
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-sm font-bold text-emerald-300 mt-1">Tier 1 Certified</div>
              <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-1">
                Provenance Status
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-sm font-bold text-cream-light mt-1">Brother QL & SVG</div>
              <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-1">
                Packaging Studio
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-sm font-bold text-amber-gold mt-1">
                {primaryRoaster?.recommendedWater?.targetTds ? `${primaryRoaster.recommendedWater.targetTds} TDS` : '140 TDS'}
              </div>
              <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-1">
                Water Chemistry Spec
              </span>
            </div>
          </div>

          {/* Active Coffee Lots & Barista Dial-In Recipes */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div>
                <h4 className="font-serif text-lg font-bold text-cream-light flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-gold" />
                  <span>Your Roastery Lots & Dial-In Recipes ({ownedCoffees.length})</span>
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Manage extraction recipes, tune ratio & grind size, or generate thermal Smart Bag packaging QR labels.
                </p>
              </div>
              {onOpenRoasterPortal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenRoasterPortal(null, 'onboard');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-gold hover:bg-amber-400 text-espresso-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Coffee Lot</span>
                </button>
              )}
            </div>

            {ownedCoffees.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-white/20 text-center space-y-3 bg-black/30">
                <Coffee className="w-8 h-8 text-amber-gold/50 mx-auto" />
                <p className="text-sm font-serif font-bold text-cream-light">No Coffee Lots Registered Yet</p>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Register your first roast lot to unlock customized packaging stickers and barista dial-in recommendations.
                </p>
                {onOpenRoasterPortal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRoasterPortal(null, 'onboard');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-gold text-espresso-950 font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    + Onboard First Coffee Lot
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {ownedCoffees.map((coffee) => (
                  <div
                    key={coffee.id}
                    className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/40 transition space-y-3 shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-serif text-lg font-bold text-cream-light">
                            {coffee.beanName}
                          </h5>
                          {coffee.roastLevel && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-gold font-mono font-bold text-[10px]">
                              {coffee.roastLevel}
                            </span>
                          )}
                          {coffee.cuppingScore && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                              {coffee.cuppingScore} SCA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-cream-soft/80 mt-1">
                          {coffee.origin} {coffee.process ? `• ${coffee.process}` : ''} {coffee.elevation ? `• ${coffee.elevation}` : ''}
                        </p>
                        {Array.isArray(coffee.tastingNotes) && coffee.tastingNotes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {coffee.tastingNotes.map((note, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300 font-mono text-[10px]">
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-stone-300 font-mono text-[10px] font-bold">
                          {coffee.upc || 'LOT-SMART-BAG'}
                        </span>
                      </div>
                    </div>

                    {/* Dial-In Extraction Parameters Bar */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-3 text-stone-300">
                        <div>
                          <span className="text-stone-500 text-[9px] uppercase tracking-wider block">Ratio</span>
                          <span className="text-amber-gold font-bold">1:{coffee.recommendedRatio || '16.5'}</span>
                        </div>
                        <div className="h-6 w-px bg-white/10" />
                        <div>
                          <span className="text-stone-500 text-[9px] uppercase tracking-wider block">Temp</span>
                          <span className="text-cream-light font-bold">{coffee.tempF || '202'}°F</span>
                        </div>
                        <div className="h-6 w-px bg-white/10" />
                        <div>
                          <span className="text-stone-500 text-[9px] uppercase tracking-wider block">Grind Size</span>
                          <span className="text-cream-light font-bold">{coffee.recommendedGrind || 'Medium-Fine'}</span>
                        </div>
                        <div className="h-6 w-px bg-white/10" />
                        <div>
                          <span className="text-stone-500 text-[9px] uppercase tracking-wider block">Method</span>
                          <span className="text-cream-light capitalize">{(coffee.brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
                        </div>
                      </div>

                      {/* Quick Lot Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {onOpenRoasterPortal && (
                          <>
                            <button
                              onClick={() => {
                                onClose();
                                onOpenRoasterPortal(coffee, 'sticker');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-gold border border-amber-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Open Smart Bag Packaging Studio for this lot"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Packaging Studio</span>
                            </button>
                            <button
                              onClick={() => {
                                onClose();
                                onOpenRoasterPortal(coffee, 'onboard');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-cream-light border border-white/15 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Edit Recipe & Dial-In for this lot"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-gold" />
                              <span>Edit Recipe</span>
                            </button>
                          </>
                        )}
                        {onSelectBeanToBrew && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectBeanToBrew(coffee);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-gold hover:bg-amber-400 text-espresso-950 text-[11px] font-mono font-bold flex items-center gap-1 shadow transition cursor-pointer"
                            title="Brew using this roaster recipe"
                          >
                            <span>Dial-In</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Roaster Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {onOpenRoasterPortal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRoasterPortal(null, 'profile');
                }}
                className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-gold/40 text-left transition flex items-center gap-3 cursor-pointer"
              >
                <Store className="w-5 h-5 text-amber-gold shrink-0" />
                <div>
                  <span className="font-bold text-cream-light block">Roastery Profile & Story</span>
                  <span className="text-[10px] text-stone-400 block">Edit machines, bio & story</span>
                </div>
              </button>
            )}
            {onOpenWaterLab && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWaterLab();
                }}
                className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-gold/40 text-left transition flex items-center gap-3 cursor-pointer"
              >
                <Droplets className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold text-cream-light block">Water Chemistry Lab</span>
                  <span className="text-[10px] text-stone-400 block">140 TDS Brookmill Spec</span>
                </div>
              </button>
            )}
            {onOpenRoasterPortal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRoasterPortal(null, 'telemetry');
                }}
                className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-gold/40 text-left transition flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-gold shrink-0" />
                <div>
                  <span className="font-bold text-cream-light block">QR Telemetry & Scans</span>
                  <span className="text-[10px] text-stone-400 block">Real-time scan analytics</span>
                </div>
              </button>
            )}
          </div>

          {/* Footer Barista Mode Switcher */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
            <span>🛡️ Roaster Brand Operations Console</span>
            <button
              onClick={() => setViewMode('consumer')}
              className="hover:text-amber-gold transition underline text-[11px] cursor-pointer"
            >
              Switch to Barista Journal Mode →
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CONSUMER BARISTA VIEW (Streaks, Badges, Tastemaker Achievements)           */
        /* ========================================================================= */
        <div className="space-y-6 animate-fade-in">
          {isRoaster && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-2 text-xs font-mono">
              <span className="text-amber-200">Viewing Consumer Barista Tasting Mode</span>
              <button
                onClick={() => setViewMode('roaster')}
                className="px-3 py-1 rounded-lg bg-amber-gold text-espresso-950 font-bold transition cursor-pointer"
              >
                ← Return to Roaster Hub
              </button>
            </div>
          )}

          {/* Stats Grid: Real Brew Streak, Real Total Brews, Real Badges */}
          <div className="grid grid-cols-3 gap-3 mb-8 text-center font-mono">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
              <div className="flex items-center justify-center space-x-1 text-amber-gold text-lg font-bold">
                <Flame className="w-5 h-5 text-amber-gold animate-bounce" />
                <span>{realStreak} {realStreak === 1 ? 'Day' : 'Days'}</span>
              </div>
              <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-1">Daily Brew Streak</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-lg font-bold text-cream-light">{totalBrewsLogged}</div>
              <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-1">Total Brews Logged</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-lg font-bold text-amber-gold">{unlockedBadgeIds.length} / {BADGES_DATA.length}</div>
              <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-1">Badges Unlocked</span>
            </div>
          </div>

          {/* Badges Unlock Guide Accordion Header */}
          <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-gold/30 p-4">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between text-left font-bold text-cream-light text-xs uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center gap-2 text-amber-gold">
                <Target className="w-4 h-4" />
                <span>📖 How to Unlock Badges & Achievements Guide</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                <span>{showInstructions ? 'Hide Instructions' : 'View Instructions'}</span>
                {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showInstructions && (
              <div className="mt-4 pt-3 border-t border-amber-gold/20 space-y-2 text-xs font-sans text-stone-300 leading-relaxed animate-fade-in">
                <p className="font-semibold text-cream-light">
                  Earn badges and level up your tastemaker status by performing real brewing activities across the platform:
                </p>
                <ul className="space-y-1.5 list-disc list-inside font-mono text-[11px] text-stone-300">
                  <li><strong className="text-amber-gold">☕ First Extraction:</strong> Log your very first brew in the Personal Tasting Journal or Guided Brew Timer.</li>
                  <li><strong className="text-amber-gold">✨ Golden Ratio Master:</strong> Scale any coffee brew to the exact SCA standard 1:16 ratio.</li>
                  <li><strong className="text-amber-gold">🔥 3-Day & 7-Day Streaks:</strong> Log at least 1 brew daily for consecutive days to maintain your active streak.</li>
                  <li><strong className="text-amber-gold">🌊 Pour Over Aficionado:</strong> Complete 5 V60 pour-over brews using the multi-phase timer.</li>
                  <li><strong className="text-amber-gold">🏺 Immersion Master:</strong> Complete 5 French Press immersion brews.</li>
                  <li><strong className="text-amber-gold">🌍 Terroir Atlas Explorer:</strong> Explore terroirs & agronomy across 5 growing origins.</li>
                  <li><strong className="text-amber-gold">📜 Master Alchemist:</strong> Design and save a custom recipe in the Personal Recipe Studio.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Gamification Achievements & Badges Grid */}
          <div className="mb-8">
            <div className="font-bold text-cream-light text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-gold" />
              <span>Tastemaker Achievements & Badges ({unlockedBadgeIds.length} Unlocked)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BADGES_DATA.map((badge) => {
                const isUnlocked = unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-500/15 border-amber-gold/50 text-cream-light shadow-lg'
                        : 'bg-black/30 border-white/10 opacity-40 grayscale'
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="font-extrabold text-xs truncate">{badge.name}</div>
                    <div className="text-[9px] text-stone-400 mt-1 leading-tight line-clamp-2">{badge.description}</div>
                    <div className="mt-2 text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/50 border border-white/10 text-amber-gold">
                      {isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="min-h-full flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 pb-16">
        {content}
      </div>
    </div>
  );
}
