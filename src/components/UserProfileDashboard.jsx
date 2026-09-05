import React, { useState } from 'react';
import { X, User, Flame, Award, Sparkles, Coffee, Leaf, Shield, CheckCircle2, Bookmark, Edit3, LogOut, HelpCircle, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';

export default function UserProfileDashboard({ isOpen, onClose, trackMode, currentUser, onOpenAuth, onLogout }) {
  if (!isOpen) return null;

  const [showInstructions, setShowInstructions] = useState(false);
  const isCoffee = trackMode === 'coffee';

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
  if (journalLogs.filter((l) => l.methodId === 'french_press' || l.methodId === 'french_press_expert').length >= 5) unlockedBadgeIds.push('french_press:expert');
  if (new Set(journalLogs.map((l) => l.origin).filter(Boolean)).size >= 5) unlockedBadgeIds.push('terroir_explorer');
  if (customRecipes.length >= 1) unlockedBadgeIds.push('recipe_creator');

  const profile = currentUser;
  const isOwnProfile = !!currentUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative max-w-3xl w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Header Profile Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 mb-8 pb-6 border-b border-white/10">
          {profile?.avatar && profile.avatar !== '/' ? (
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-amber-gold shadow-xl"
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
                  <span>{profile ? profile.displayName : 'Guest Barista'}</span>
                  {profile && <Shield className="w-4 h-4 text-amber-gold fill-current" />}
                </h3>
                <span className="text-xs font-mono text-amber-gold font-bold">
                  {profile ? `${profile.username} • On-Device Profile` : '@guest • On-Device Session'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                {profile ? (
                  <>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-gold border border-amber-400/40 text-xs font-mono font-bold">
                      Active Profile
                    </span>
                    {onOpenAuth && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAuth();
                        }}
                        className="p-1.5 px-3 rounded-xl bg-white/10 text-amber-gold hover:bg-white/20 border border-amber-gold/30 transition-all flex items-center gap-1 text-xs font-bold font-mono"
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
                        className="p-1.5 px-3 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/40 transition-all flex items-center gap-1 text-xs font-bold font-mono"
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
                      className="py-2 px-4 rounded-xl btn-tactile-amber text-espresso-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Create Profile</span>
                    </button>
                  )
                )}
              </div>
            </div>

            <p className="text-xs text-stone-300 mt-2 leading-relaxed font-normal">
              {profile?.bio || 'You are brewing as an anonymous guest. All tasting notes and custom recipes save directly to your browser.'}
            </p>
          </div>
        </div>

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
            className="w-full flex items-center justify-between text-left font-bold text-cream-light text-xs uppercase tracking-wider"
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
    </div>
  );
}
