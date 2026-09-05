import React, { useState } from 'react';
import { X, User, Mail, Sparkles, CheckCircle2, Edit3, Image, LogOut, AlertCircle, Shield, Download, Upload, Smartphone, RefreshCw } from 'lucide-react';
import { AVATAR_PRESETS } from '../data/avatarPresets';
import { trackEvent } from '../utils/analytics';

export default function AuthModal({ isOpen, onClose, currentUser, onSaveProfile, onLogout, usersList = [] }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(currentUser ? 'edit' : usersList.length > 0 ? 'login' : 'signup'); // 'login' | 'signup' | 'edit'
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState((currentUser?.avatar && currentUser.avatar !== '/') ? currentUser.avatar : AVATAR_PRESETS[0].url);
  const [errorMessage, setErrorMessage] = useState('');

  const handleExportFullBackup = () => {
    try {
      const backupData = {
        app: 'The Brew App',
        version: 1,
        exportedAt: new Date().toISOString(),
        currentUser,
        usersList,
        journal: JSON.parse(localStorage.getItem('the_brew_app_journal_v1') || '[]'),
        customRecipes: JSON.parse(localStorage.getItem('the_brew_app_custom_recipes') || '[]'),
        savedRecipes: JSON.parse(localStorage.getItem('the_brew_app_saved_recipes') || '[]')
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `the_brew_app_full_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      trackEvent('export_full_backup');
    } catch (err) {
      console.error('Backup export failed:', err);
    }
  };

  const handleImportFullBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (backup && (backup.journal || backup.customRecipes || backup.usersList || backup.currentUser)) {
          if (backup.journal) localStorage.setItem('the_brew_app_journal_v1', JSON.stringify(backup.journal));
          if (backup.customRecipes) localStorage.setItem('the_brew_app_custom_recipes', JSON.stringify(backup.customRecipes));
          if (backup.savedRecipes) localStorage.setItem('the_brew_app_saved_recipes', JSON.stringify(backup.savedRecipes));
          if (backup.usersList) localStorage.setItem('the_brew_app_local_users', JSON.stringify(backup.usersList));
          if (backup.currentUser) {
            onSaveProfile(backup.currentUser);
          }
          trackEvent('import_full_backup');
          alert('Backup restored successfully! All journal logs, custom recipes, and profile data have been loaded.');
          window.location.reload();
        } else {
          alert('Invalid backup file. Please provide a valid The Brew App backup JSON.');
        }
      } catch (err) {
        alert('Could not parse backup file. Please ensure it is valid JSON.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

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
        bio: bio.trim() || 'Specialty Coffee & Fine Tea Enthusiast',
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
        bio: bio.trim() || 'Specialty Coffee & Fine Tea Enthusiast',
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
          <span>Local Barista Profile & Data Studio</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-cream-light mb-1">
          {mode === 'backup'
            ? 'Backup & Cross-Device Transfer'
            : mode === 'edit'
            ? 'Manage Your Profile'
            : mode === 'signup'
            ? 'Create Local Barista Profile'
            : 'Select Active Profile'}
        </h3>

        <p className="text-xs text-stone-400 mb-4 leading-relaxed">
          {mode === 'backup'
            ? 'Export your full brewing journal, custom recipes, and profile to a portable JSON file, or restore from another phone or device.'
            : "Profiles, tasting notes, and custom recipes are saved directly in your browser's local storage. Zero servers, 100% private."}
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
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/50 border border-white/10 mb-4 text-xs font-bold overflow-x-auto">
          {usersList.length > 0 && (
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${mode === 'login' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
            >
              Select Profile
            </button>
          )}
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${mode === 'signup' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Create Profile
          </button>
          {currentUser && (
            <button
              type="button"
              onClick={() => { setMode('edit'); setErrorMessage(''); }}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${mode === 'edit' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
            >
              Edit Profile
            </button>
          )}
          <button
            type="button"
            onClick={() => { setMode('backup'); setErrorMessage(''); }}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${mode === 'backup' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Backup & Sync</span>
          </button>
        </div>

        {/* Error / Validation Alert Banner */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE: BACKUP & DATA PORTABILITY */}
        {mode === 'backup' ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-300 font-mono uppercase tracking-wider text-[11px] mb-0.5">
                  100% On-Device • Zero Remote Tracking
                </div>
                <div className="text-stone-300 leading-relaxed">
                  The Brew App runs entirely in your browser with no cloud databases or external telemetry. You have total data sovereignty and privacy.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-gold uppercase tracking-wider">
                <Download className="w-4 h-4" />
                <span>Export Full Data Backup (.json)</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Save an archival snapshot of your entire journal logs, custom recipe studio creations, bookmarked recipes, and local barista profile.
              </p>
              <button
                type="button"
                onClick={handleExportFullBackup}
                className="w-full py-3 rounded-xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Backup (JSON)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-gold uppercase tracking-wider">
                <Upload className="w-4 h-4" />
                <span>Restore / Transfer from Backup</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Switching devices, clearing browser cache, or restoring from a previous export? Load your backup file here.
              </p>
              <label className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-cream-light font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-white/10 active:scale-95 transition-all">
                <Upload className="w-4 h-4 text-amber-gold" />
                <span>Select Backup File to Restore</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFullBackup}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-stone-400 font-mono">
              <Smartphone className="w-4 h-4 text-amber-gold flex-shrink-0" />
              <span>Cross-Device Tip: AirDrop, email, or save your JSON backup to iCloud/Drive to keep multiple devices in sync!</span>
            </div>
          </div>
        ) : (
          <>
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
            {mode === 'edit' ? 'Save Profile Changes' : mode === 'signup' ? 'Save Profile to Device' : 'Use Profile'}
          </button>

        </form>
        </>
        )}

      </div>
    </div>
  );
}
