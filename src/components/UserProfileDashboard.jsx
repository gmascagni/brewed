import React, { useState } from 'react';
import { X, User, Flame, Award, Sparkles, Coffee, Leaf, Shield, CheckCircle2, Bookmark, Edit3 } from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';

export default function UserProfileDashboard({ isOpen, onClose, trackMode, currentUser, onOpenAuth }) {
  if (!isOpen) return null;

  const isCoffee = trackMode === 'coffee';

  // Use active logged-in user profile, fallback to default if not set
  const profile = currentUser || {
    username: '@barista_master',
    displayName: 'Specialty Brew Master',
    avatar: './avatar_cartoon_female_barista.jpg',
    bio: 'Specialty Coffee & Fine Tea Enthusiast',
    location: 'Global Atelier',
    streakDays: 7,
    totalBrewsLogged: 42,
    unlockedBadgeIds: ['first_brew', 'golden_ratio_master', 'streak_3_days', 'streak_7_days', 'pour_over_aficionado']
  };

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
            src={profile.avatar || './avatar_cartoon_female_barista.jpg'}
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
                <span className="text-xs font-mono text-amber-gold font-bold">{profile.username} • {profile.email || 'Verified Account'}</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-gold border border-amber-400/40 text-xs font-mono font-bold">
                  Tastemaker Status
                </span>
                {onOpenAuth && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="p-1.5 rounded-xl bg-white/10 text-amber-gold hover:bg-white/20 border border-amber-gold/30 transition-all"
                    title="Edit Profile Info & Avatar"
                  >
                    <Edit3 className="w-4 h-4" />
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

        {/* Gamification Achievements & Badges Grid */}
        <div className="mb-8">
          <div className="font-bold text-cream-light text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-gold" />
            <span>Unlocked Achievements & Badges</span>
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
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
