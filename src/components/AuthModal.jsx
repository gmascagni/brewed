import React, { useState } from 'react';
import { X, User, Mail, Sparkles, CheckCircle2, Edit3, Image, LogOut, AlertCircle, Shield } from 'lucide-react';
import { AVATAR_PRESETS } from '../data/avatarPresets';
import { trackEvent } from '../utils/analytics';

export default function AuthModal({ isOpen, onClose, currentUser, onSaveProfile, onLogout, usersList = [] }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(currentUser ? 'edit' : usersList.length > 0 ? 'login' : 'signup'); // 'login' | 'signup' | 'edit'
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0].url);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // SWITCH / SELECT PROFILE MODE
    if (mode === 'login') {
      const existingUser = usersList.find(
        (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === `@${cleanEmail.replace('@', '')}`
      );

      if (!existingUser) {
        setErrorMessage(`No local profile found for "${email}". Click "Create Profile" to make one!`);
        return;
      }

      onSaveProfile(existingUser);
      trackEvent('user_login', { username: existingUser.username });
      onClose();
      return;
    }

    // CREATE PROFILE MODE
    if (mode === 'signup') {
      const cleanHandle = username.trim().startsWith('@') ? username.trim() : `@${username.trim() || cleanEmail.split('@')[0]}`;
      const duplicateUser = usersList.find(
        (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanHandle.toLowerCase()
      );

      if (duplicateUser) {
        setErrorMessage(`A profile already exists for ${cleanEmail} (${cleanHandle}). Please switch to "Select Profile".`);
        return;
      }

      const newUserObj = {
        email: cleanEmail,
        username: cleanHandle,
        displayName: displayName.trim() || cleanEmail.split('@')[0],
        bio: bio.trim() || 'Specialty Coffee, Fine Tea & Craft Beer Enthusiast',
        avatar: avatar || AVATAR_PRESETS[0].url,
        role: 'user',
        streakDays: 1,
        totalBrewsLogged: 1
      };

      onSaveProfile(newUserObj);
      trackEvent('user_signup', { username: newUserObj.username });
      onClose();
      return;
    }

    // EDIT PROFILE MODE
    if (mode === 'edit') {
      const cleanHandle = username.trim().startsWith('@') ? username.trim() : `@${username.trim() || cleanEmail.split('@')[0]}`;

      const updatedUserObj = {
        ...currentUser,
        email: cleanEmail,
        username: cleanHandle,
        displayName: displayName.trim() || cleanEmail.split('@')[0],
        bio: bio.trim() || 'Specialty Coffee, Fine Tea & Craft Beer Enthusiast',
        avatar: avatar || AVATAR_PRESETS[0].url,
        role: 'user'
      };

      onSaveProfile(updatedUserObj);
      trackEvent('update_profile', { username: updatedUserObj.username });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative max-w-md w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Local Barista Profile • Saved Locally</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-cream-light mb-1">
          {mode === 'edit' ? 'Manage Your Profile' : mode === 'signup' ? 'Create New Profile' : 'Select Active Profile'}
        </h3>

        <p className="text-xs text-stone-400 mb-4">
          Profiles, tasting notes, and custom recipes are saved directly in your browser's local storage.
        </p>

        {currentUser && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-gold/30 text-xs font-mono mb-4 text-amber-gold flex items-center justify-between">
            <span>Active: <strong>{currentUser.displayName} ({currentUser.username})</strong></span>
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1 text-[10px]"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        )}

        {/* Mode Switcher Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/50 border border-white/10 mb-4 text-xs font-bold">
          {usersList.length > 0 && (
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${mode === 'login' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
            >
              Select Profile
            </button>
          )}
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${mode === 'signup' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Create Profile
          </button>
          {currentUser && (
            <button
              type="button"
              onClick={() => { setMode('edit'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${mode === 'edit' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Error / Validation Alert Banner */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Existing Profile Quick Pick (in Select mode) */}
        {mode === 'login' && usersList.length > 0 && (
          <div className="space-y-2 mb-4">
            <label className="block text-stone-400 font-bold uppercase tracking-wider text-[10px]">Saved Local Profiles:</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {usersList.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => {
                    onSaveProfile(u);
                    trackEvent('user_login', { username: u.username });
                    onClose();
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    currentUser?.username === u.username
                      ? 'bg-amber-gold/20 border-amber-gold text-cream-light'
                      : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <img src={u.avatar || AVATAR_PRESETS[0].url} alt={u.displayName} className="w-7 h-7 rounded-full object-cover border border-amber-gold/40" />
                    <div>
                      <div className="font-bold text-xs text-cream-light">{u.displayName}</div>
                      <div className="font-mono text-[10px] text-stone-400">{u.username}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-gold font-bold">Use Profile →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Email / Identifier</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@domain.com"
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
            />
          </div>

          {(mode === 'signup' || mode === 'edit') && (
            <>
              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="E.g., Sarah Parker"
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Username Handle</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="E.g., @sarah_brews"
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
                />
              </div>

              {/* Profile Picture Avatar Library Picker */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cream-light uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-amber-gold" />
                    <span>Choose Profile Icon Avatar</span>
                  </span>
                  <img src={avatar} alt="Active Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-amber-gold" />
                </div>

                {/* Grid of Preset Avatars */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = avatar === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 group ${
                          isSelected ? 'border-amber-gold ring-2 ring-amber-gold/50 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-12 rounded-lg object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-gold/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-espresso-950 fill-amber-gold" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Bio / Favorite Brews</label>
                <textarea
                  rows="2"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your favorite brew method, origins, or gear setup..."
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                ></textarea>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-4 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all"
          >
            {mode === 'edit' ? 'Save Profile Changes' : mode === 'signup' ? 'Create Profile & Save Locally' : 'Switch to Profile'}
          </button>

        </form>

      </div>
    </div>
  );
}
