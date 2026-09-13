import React, { useState, useEffect } from 'react';
import { X, User, Mail, Sparkles, CheckCircle2, Edit3, Image, LogOut, AlertCircle, Shield, Download, Upload, Smartphone, RefreshCw, Coffee, Flame, Award, Store, Lock } from 'lucide-react';
import { AVATAR_PRESETS } from '../data/avatarPresets';
import { trackEvent } from '../utils/analytics';
import { getAssetUrl } from '../utils/assetUrl';
import { registerRoasterAccount, signInRoasterAccount } from '../services/firebase';
import { saveCustomRoasterProfile } from '../data/roasterRegistry';

export default function AuthModal({ isOpen, onClose, currentUser, onSaveProfile, onLogout, usersList = [], initialRole = 'user' }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(currentUser ? 'edit' : usersList.length > 0 ? 'login' : 'signup'); // 'login' | 'signup' | 'edit'
  const [accountType, setAccountType] = useState(currentUser?.role === 'roaster' || initialRole === 'roaster' ? 'roaster' : 'user');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [roasterName, setRoasterName] = useState(currentUser?.roasterName || '');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState((currentUser?.avatar && currentUser.avatar !== '/') ? currentUser.avatar : (currentUser?.role === 'roaster' || initialRole === 'roaster') ? '/avatar_roast_master_emblem.jpg' : AVATAR_PRESETS[0].url);
  const [activeAvatarFailed, setActiveAvatarFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveAvatarFailed(false);
  }, [avatar]);

  useEffect(() => {
    if (initialRole === 'roaster' && !currentUser) {
      setAccountType('roaster');
    }
  }, [initialRole, currentUser]);

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

    // SPECIALTY ROASTER AUTHENTICATION (Firebase + Registry)
    if (accountType === 'roaster') {
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      if (mode === 'signup') {
        if (!roasterName.trim()) {
          setErrorMessage('Please enter your Roastery / Brand Name.');
          return;
        }
        if (!password || password.length < 6) {
          setErrorMessage('Please set a secure password (minimum 6 characters).');
          return;
        }

        setIsSubmitting(true);
        (async () => {
          try {
            const roasterUser = await registerRoasterAccount({
              email: cleanEmail,
              password,
              roasterName: roasterName.trim(),
              displayName: displayName.trim() || roasterName.trim()
            });

            // Register the custom roaster profile in registry
            saveCustomRoasterProfile({
              name: roasterName.trim(),
              slug: roasterUser.roasterSlug,
              email: cleanEmail,
              location: '',
              story: bio.trim() || `Specialty coffee roaster crafted with precision. Verified brand profile on The Brew App.`,
              logo: avatar || '/avatar_roast_master_emblem.jpg',
              ownerEmail: cleanEmail,
              ownerUid: roasterUser.uid
            }, roasterUser);

            onSaveProfile(roasterUser);
            trackEvent('roaster_signup', { email: cleanEmail, roasterName: roasterName.trim() });
            onClose();
          } catch (err) {
            console.error('Roaster registration error:', err);
            setErrorMessage(err.message || 'Could not register roaster account. Please try again.');
          } finally {
            setIsSubmitting(false);
          }
        })();
        return;
      }

      if (mode === 'login') {
        if (!password) {
          setErrorMessage('Please enter your roaster account password.');
          return;
        }

        setIsSubmitting(true);
        (async () => {
          try {
            const roasterUser = await signInRoasterAccount({
              email: cleanEmail,
              password
            });

            onSaveProfile(roasterUser);
            trackEvent('roaster_login', { email: cleanEmail, roasterName: roasterUser.roasterName });
            onClose();
          } catch (err) {
            console.error('Roaster signin error:', err);
            setErrorMessage(err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
              ? 'Invalid roaster email or password. Please verify your credentials.'
              : err.message || 'Authentication failed.');
          } finally {
            setIsSubmitting(false);
          }
        })();
        return;
      }

      if (mode === 'edit') {
        const updatedUserObj = {
          ...currentUser,
          email: cleanEmail,
          roasterName: roasterName.trim() || currentUser.roasterName,
          displayName: displayName.trim() || roasterName.trim() || cleanEmail.split('@')[0],
          bio: bio.trim() || currentUser.bio,
          avatar: avatar || currentUser.avatar || '/avatar_roast_master_emblem.jpg',
          role: 'roaster',
          isVerifiedRoaster: true
        };

        saveCustomRoasterProfile({
          name: updatedUserObj.roasterName,
          slug: updatedUserObj.roasterSlug || updatedUserObj.roasterName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          email: cleanEmail,
          story: updatedUserObj.bio,
          logo: updatedUserObj.avatar,
          ownerEmail: cleanEmail,
          ownerUid: updatedUserObj.uid
        }, updatedUserObj);

        onSaveProfile(updatedUserObj);
        trackEvent('update_roaster_profile', { roasterName: updatedUserObj.roasterName });
        onClose();
        return;
      }
    }

    // SWITCH / SELECT PROFILE MODE (HOME BARISTA)
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

    // CREATE PROFILE MODE (HOME BARISTA)
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

    // EDIT PROFILE MODE (HOME BARISTA)
    if (mode === 'edit') {
      const cleanHandle = username.trim().startsWith('@') ? username.trim() : `@${username.trim() || cleanEmail.split('@')[0]}`;

      const updatedUserObj = {
        ...currentUser,
        email: cleanEmail,
        username: cleanHandle,
        displayName: displayName.trim() || cleanEmail.split('@')[0],
        bio: bio.trim() || 'Specialty Coffee Enthusiast',
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
      <div role="dialog" aria-modal="true" aria-label="Account Authorization" className="relative max-w-md w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light">
        
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

            {/* Account Type Selector (Home Barista vs Specialty Roaster) */}
            {mode !== 'edit' ? (
              <div className="mb-4">
                <label className="block text-stone-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  Select Account Type:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/60 border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('user');
                      setErrorMessage('');
                    }}
                    className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                      accountType === 'user'
                        ? 'bg-amber-gold text-espresso-950 shadow-md font-extrabold'
                        : 'text-stone-400 hover:text-cream-light'
                    }`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Home Barista</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('roaster');
                      setErrorMessage('');
                    }}
                    className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                      accountType === 'roaster'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-espresso-950 shadow-md font-extrabold'
                        : 'text-stone-400 hover:text-cream-light'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Specialty Roaster</span>
                  </button>
                </div>
                <div className="mt-1.5 px-1 text-[11px] text-stone-400 font-mono">
                  {accountType === 'roaster'
                    ? '🛡️ Verified Roaster Account: Authenticate to own recipes, publish brand water specs, and print packaging smart barcodes.'
                    : '☕ Home Barista: On-device local storage for logging brews, journal entries, and custom ratios.'}
                </div>
              </div>
            ) : (
              <div className="mb-3 px-3 py-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-mono">Account Category:</span>
                <span className="font-bold text-amber-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
                  {accountType === 'roaster' ? (
                    <>
                      <Store className="w-3.5 h-3.5 text-amber-500" />
                      <span>Specialty Coffee Roaster</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-3.5 h-3.5 text-amber-400" />
                      <span>Home Barista</span>
                    </>
                  )}
                </span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {/* ROASTERY BRAND NAME (For Roaster accounts) */}
              {accountType === 'roaster' && (mode === 'signup' || mode === 'edit') && (
                <div>
                  <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">
                    Roastery / Brand Name <span className="text-amber-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roasterName}
                    onChange={(e) => setRoasterName(e.target.value)}
                    placeholder="E.g., Brookmill Coffee Roasters"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light font-bold focus:outline-none focus:border-amber-gold"
                  />
                </div>
              )}

              {/* EMAIL FIELD */}
              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">
                  {accountType === 'roaster' ? 'Roaster Work / Brand Email' : 'Email / Identifier'} <span className="text-amber-gold">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={accountType === 'roaster' ? "roaster@yourbrand.com or roaster@gmail.com" : "yourname@domain.com"}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                />
                {accountType === 'roaster' && (
                  <p className="mt-1 text-[10px] text-stone-400 font-mono">
                    Accepts any authentic email domain (Gmail, Outlook, custom domain, etc.). Your recipe rights and packaging barcodes will be bound to this address.
                  </p>
                )}
              </div>

              {/* PASSWORD FIELD (For Roaster signup & login) */}
              {accountType === 'roaster' && (mode === 'signup' || mode === 'login') && (
                <div>
                  <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Account Password <span className="text-amber-gold">*</span></span>
                    <span className="text-[10px] font-mono text-stone-400">Min 6 chars</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 pr-10 rounded-xl bg-black/50 border border-white/10 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
                    />
                    <Lock className="w-4 h-4 text-stone-500 absolute right-3 top-3.5" />
                  </div>
                </div>
              )}

              {/* BARISTA PROFILE FIELDS (Only for Home Barista or Roaster display info) */}
              {(mode === 'signup' || mode === 'edit') && (
                <>
                  <div>
                    <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">
                      {accountType === 'roaster' ? 'Head Roaster / Contact Name' : 'Display Name'}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={accountType === 'roaster' ? "E.g., Master Roaster Alex" : "E.g., Sarah Parker"}
                      className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  {accountType !== 'roaster' && (
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
                  )}

                  {/* Profile Picture Avatar Library Picker */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cream-light uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Image className="w-4 h-4 text-amber-gold" />
                        <span>{accountType === 'roaster' ? 'Roastery Brand Badge / Avatar' : 'Choose Profile Icon Avatar'}</span>
                      </span>
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-gold flex items-center justify-center bg-black/40 shadow-sm shrink-0">
                        {!activeAvatarFailed && avatar && avatar !== '/' ? (
                          <img
                            src={getAssetUrl(avatar)}
                            alt="Active Avatar"
                            onError={() => setActiveAvatarFailed(true)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-amber-gold" />
                        )}
                      </div>
                    </div>

                    {/* Grid of Preset Avatars */}
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {AVATAR_PRESETS.map((preset) => {
                        const isSelected =
                          avatar === preset.url ||
                          avatar === getAssetUrl(preset.url) ||
                          (avatar && preset.url && avatar.endsWith(preset.url.replace(/^\//, ''))) ||
                          avatar === preset.id;
                        return (
                          <PresetAvatarItem
                            key={preset.id}
                            preset={preset}
                            isSelected={isSelected}
                            onSelect={(url) => {
                              setAvatar(url);
                              setActiveAvatarFailed(false);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">
                      {accountType === 'roaster' ? 'Roastery Story & Origin Philosophy' : 'Bio / Favorite Brews'}
                    </label>
                    <textarea
                      rows="2"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={accountType === 'roaster' ? "Tell coffee lovers about your sourcing, roast philosophy, and tasting standards..." : "Share your favorite brew method, origins, or gear setup..."}
                      className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                    ></textarea>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating Roaster...</span>
                  </>
                ) : (
                  accountType === 'roaster'
                    ? (mode === 'signup' ? 'Create Verified Roaster Account' : mode === 'login' ? 'Sign In as Roaster' : 'Save Roaster Profile')
                    : (mode === 'edit' ? 'Save Profile Changes' : mode === 'signup' ? 'Save Profile to Device' : 'Use Profile')
                )}
              </button>

            </form>
            </>
            )}

      </div>
    </div>
  );
}

function PresetAvatarItem({ preset, isSelected, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);
  const resolvedUrl = getAssetUrl(preset.url);

  return (
    <button
      type="button"
      onClick={() => onSelect(preset.url)}
      className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 group aspect-square flex flex-col items-center justify-center ${
        isSelected
          ? 'border-amber-gold ring-2 ring-amber-gold/50 scale-105 shadow-md shadow-amber-gold/20'
          : 'border-white/10 opacity-80 hover:opacity-100 hover:border-white/30'
      }`}
      title={preset.label}
    >
      {!imgFailed ? (
        <img
          src={resolvedUrl}
          alt={preset.label}
          onError={() => setImgFailed(true)}
          className="w-full h-full rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#241710] to-[#120B08] flex flex-col items-center justify-center p-1 text-center">
          {preset.iconType === 'coffee' ? (
            <Coffee className="w-5 h-5 text-amber-gold" />
          ) : preset.iconType === 'flame' ? (
            <Flame className="w-5 h-5 text-amber-gold" />
          ) : preset.iconType === 'award' ? (
            <Award className="w-5 h-5 text-amber-gold" />
          ) : (
            <User className="w-5 h-5 text-amber-gold" />
          )}
        </div>
      )}
      {isSelected && (
        <div className="absolute inset-0 bg-amber-gold/25 flex items-center justify-center rounded-lg pointer-events-none">
          <CheckCircle2 className="w-5 h-5 text-espresso-950 fill-amber-gold drop-shadow" />
        </div>
      )}
    </button>
  );
}
