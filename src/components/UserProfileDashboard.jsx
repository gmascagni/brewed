import React, { useState } from 'react';
import { X, User, Flame, Award, Sparkles, Coffee, Leaf, Shield, CheckCircle2, Bookmark, Edit3, LogOut, HelpCircle, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';

export default function UserProfileDashboard({ isOpen, onClose, trackMode, currentUser, onOpenAuth, onLogout }) {
  if (!isOpen) return null;

  const [showInstructions, setShowInstructions] = useState(false);
  const isCoffee = trackMode === 'coffee';

  // Use active logged-in user profile, fallback to default if not set
  const profile = currentUser || {
    username: '@barista_master',
    displayName: 'Specialty Brew Master',
    avatar: '/',
    bio: 'Specialty Coffee & Fine Tea Enthusiast',
    location: 'Global Atelier',
    streakDays: 7,
    totalBrewsLogged: 42,
    unlockedBadgeIds: ['first_brew', 'golden_ratio_master', 'streak_3_days', 'streak_7_days', 'pour_over_aficionado']
  };

  // Strict Ownership Security: Only allow editing if currentUser matches the profile
  const isOwnProfile = currentUser && (currentUser.username === profile.username || currentUser.email === profile.email);
  const unlockedBadgeIds = profile.unlockedBadgeIds || ['first_brew', 'golden_ratio_master', 'streak_3_days', 'streak_7_days', 'pour_over_aficionado'];

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
          <img
            src={profile.avatar || '/'}
            alt={profile.displayName}
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-gold shadow-xl"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-2xl font-bold text-cream-light flex items-center justify-center sm:justify-start gap-2">
                  <span>{profile.displayName}</span>
                  <Shield className="w-4 h-4 text-amber-gold fill-current" />
                </h3>
                <span className="text-xs font-mono text-amber-gold font-bold">{profile.username} • On-Device Profile</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-gold border border-amber-400/40 text-xs font-mono font-bold">
                  Active Profile
                </span>
                {isOwnProfile && onOpenAuth && (
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
                {isOwnProfile && onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="p-1.5 px-3 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/40 transition-all flex items-center gap-1 text-xs font-bold font-mono"
                    title="Sign Out of Your Account"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-300 mt-2 leading-relaxed font-normal">
              {profile.bio || 'Specialty Coffee & Fine Tea Enthusiast'}
            </p>
          </div>
        </div>

        {/* Stats Grid: Brew Streak, Total Brews, Badges */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-center font-mono">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="flex items-center justify-center space-x-1 text-amber-gold text-lg font-bold">
              <Flame className="w-5 h-5 text-amber-gold animate-bounce" />
              <span>{profile.streakDays || 1} Days</span>
            </div>
            <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block mt-1">Daily Brew Streak</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="text-lg font-bold text-cream-light">{profile.totalBrewsLogged || 1}</div>
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
                Earn badges and level up your tastemaker status by performing daily brewing activities across the platform:
              </p>
              <ul className="space-y-1.5 list-disc list-inside font-mono text-[11px] text-stone-300">
                <li><strong className="text-amber-gold">☕ First Extraction:</strong> Log your very first brew in the Personal Tasting Journal or Guided Brew Timer.</li>
                <li><strong className="text-amber-gold">✨ Golden Ratio Master:</strong> Scale any coffee brew to the exact SCA standard 1:16 ratio.</li>
                <li><strong className="text-amber-gold">🔥 3-Day & 7-Day Streaks:</strong> Log at least 1 brew daily for consecutive days to maintain your active streak.</li>
                <li><strong className="text-amber-gold">🌊 Pour Over Aficionado:</strong> Complete 5 V60 pour-over brews using the multi-phase timer.</li>
                <li><strong className="text-amber-gold">🏺 Immersion Master:</strong> Complete 5 French Press immersion brews.</li>
                <li><strong className="text-amber-gold">🌍 Terroir Atlas Explorer:</strong> Explore terroirs & agronomy in the Knowledge Base across 5 growing origins.</li>
                <li><strong className="text-amber-gold">📜 Master Alchemist:</strong> Build and publish a custom recipe in the Community Recipe Builder.</li>
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
