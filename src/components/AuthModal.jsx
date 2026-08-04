import React, { useState } from 'react';
import { X, User, Mail, Lock, Shield, Sparkles, CheckCircle2, Edit3, Camera } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function AuthModal({ isOpen, onClose, currentUser, onSaveProfile }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(currentUser ? 'edit' : 'login'); // 'login' | 'signup' | 'edit'
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      email,
      username: username || `@${email.split('@')[0]}`,
      displayName: displayName || email.split('@')[0],
      bio: bio || 'Specialty Coffee & Fine Tea Enthusiast',
      avatar,
      streakDays: currentUser?.streakDays || 1,
      totalBrewsLogged: currentUser?.totalBrewsLogged || 1
    };

    onSaveProfile(updatedUser);
    trackEvent(mode === 'signup' ? 'user_signup' : 'update_profile', { username: updatedUser.username });
    alert(mode === 'signup' ? 'Account created successfully! Welcome to Brew Master Community.' : 'Profile updated successfully!');
    onClose();
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
          <span>Brew Master Identity</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-cream-light mb-6">
          {mode === 'edit' ? 'Manage Brew Master Profile' : mode === 'signup' ? 'Create Brew Master Account' : 'Sign In to Brew Master'}
        </h3>

        {/* Mode Switcher Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/50 border border-white/10 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl transition-all ${mode === 'login' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-xl transition-all ${mode === 'signup' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
          >
            Create Account
          </button>
          {currentUser && (
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`flex-1 py-2 rounded-xl transition-all ${mode === 'edit' ? 'bg-amber-gold text-espresso-950 shadow' : 'text-stone-400 hover:text-cream-light'}`}
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          
          {(mode === 'signup' || mode === 'edit') && (
            <>
              {/* Avatar Preview */}
              <div className="flex items-center space-x-4 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <img src={avatar} alt="Avatar Preview" className="w-14 h-14 rounded-full object-cover border border-amber-gold" />
                <div className="flex-1">
                  <label className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="E.g., Clara Vance"
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
                  placeholder="E.g., @barista_clara"
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Bio / Bio Quote</label>
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

          <div>
            <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
            />
          </div>

          {mode !== 'edit' && (
            <div>
              <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-4 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all"
          >
            {mode === 'edit' ? 'Save Profile Changes' : mode === 'signup' ? 'Create Account & Start Brewing' : 'Sign In'}
          </button>

        </form>

      </div>
    </div>
  );
}
