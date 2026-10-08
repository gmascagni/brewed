import React, { useState } from 'react';
import { Store, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Lock, Mail, AlertCircle, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { registerRoasterAccount, signInRoasterAccount } from '../../services/firebase';
import { saveCustomRoasterProfile } from '../../data/roasterRegistry';

export default function RoasterAuthGate({ onOpenAuth, onReturnToVideo, onAuthenticated }) {
  const [showInline, setShowInline] = useState(false);
  const [inlineMode, setInlineMode] = useState('signup'); // 'signup' | 'login'
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenSignUpModal = () => {
    if (onOpenAuth) {
      onOpenAuth({ role: 'roaster', mode: 'signup' });
    }
    window.dispatchEvent(new CustomEvent('the_brew_app_open_auth', { detail: { role: 'roaster', mode: 'signup' } }));
  };

  const handleOpenSignInModal = () => {
    if (onOpenAuth) {
      onOpenAuth({ role: 'roaster', mode: 'login' });
    }
    window.dispatchEvent(new CustomEvent('the_brew_app_open_auth', { detail: { role: 'roaster', mode: 'login' } }));
  };

  const handleInlineSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid roastery email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      if (inlineMode === 'signup') {
        const cleanBrand = brandName.trim();
        if (!cleanBrand) {
          setErrorMessage('Please enter your Roastery / Brand Name.');
          setIsLoading(false);
          return;
        }

        const roasterUser = await registerRoasterAccount({
          email: cleanEmail,
          password,
          roasterName: cleanBrand,
          displayName: cleanBrand
        });

        saveCustomRoasterProfile({
          name: cleanBrand,
          slug: roasterUser.roasterSlug,
          email: cleanEmail,
          location: '',
          story: `Specialty coffee roaster crafted with precision. Verified brand profile on The Brew App.`,
          logo: '/avatar_roast_beans.jpg',
          ownerEmail: cleanEmail,
          ownerUid: roasterUser.uid
        }, roasterUser);

        window.dispatchEvent(new CustomEvent('the_brew_app_roaster_authenticated', { detail: roasterUser }));
        if (onAuthenticated) onAuthenticated(roasterUser);
      } else {
        const roasterUser = await signInRoasterAccount({
          email: cleanEmail,
          password
        });

        window.dispatchEvent(new CustomEvent('the_brew_app_roaster_authenticated', { detail: roasterUser }));
        if (onAuthenticated) onAuthenticated(roasterUser);
      }
    } catch (err) {
      console.error('Roaster authentication error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Switch to "Sign In" to enter your password.');
        setInlineMode('login');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password or email. Please check your credentials.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#1E140F] to-[#120B08] border-2 border-amber-gold/40 text-center space-y-6 shadow-2xl animate-fade-in my-6 max-w-2xl mx-auto">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-gold flex items-center justify-center text-amber-gold shadow-lg shadow-amber-500/10">
        <Store className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/20 text-amber-gold text-xs font-mono font-bold uppercase tracking-widest border border-amber-gold/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Roaster Identity Required</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light">
          Authenticate Your Roastery Account
        </h3>
        <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
          To protect intellectual property and recipe integrity, every recipe, water specification, brew profile, and retail packaging barcode strictly belongs to the authenticated roaster.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-black/50 border border-white/10 text-left space-y-3 max-w-lg mx-auto text-xs font-mono text-stone-300">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Authentic Email Authentication:</strong> Register using any email address you own (e.g., @gmail.com, @yourroastery.com, etc.).</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Exclusive Recipe & Water Control:</strong> Dial-in recipes, grinder microns, and water specs remain strictly owned by your roastery.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Authorized Packaging Barcodes:</strong> Only verified brand owners can generate packaging barcodes, vector SVGs, and thermal stickers.</span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleOpenSignUpModal}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
        >
          <Store className="w-4 h-4" />
          <span>Create Verified Roaster Account</span>
        </button>

        <button
          type="button"
          onClick={handleOpenSignInModal}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-light font-bold text-xs uppercase tracking-wider border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Sign In as Existing Roaster</span>
        </button>
      </div>

      {/* Inline Direct Authentication Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowInline(!showInline)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-gold hover:text-amber-300 transition cursor-pointer px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20"
        >
          <span>{showInline ? 'Hide direct login form' : 'Or enter credentials directly right here'}</span>
          {showInline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Inline Direct Form */}
      {showInline && (
        <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-amber-gold/30 max-w-lg mx-auto text-left animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-gold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>{inlineMode === 'signup' ? 'Direct Roaster Registration' : 'Direct Roaster Sign In'}</span>
            </div>
            <div className="flex gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => { setInlineMode('signup'); setErrorMessage(''); }}
                className={`px-2.5 py-1 rounded transition ${inlineMode === 'signup' ? 'bg-amber-gold text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setInlineMode('login'); setErrorMessage(''); }}
                className={`px-2.5 py-1 rounded transition ${inlineMode === 'login' ? 'bg-amber-gold text-stone-950 font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                Sign In
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleInlineSubmit} className="space-y-3">
            {inlineMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
                  Roastery / Brand Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-amber-gold absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="E.g., Brookmill Coffee Roasters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-gold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
                Roastery Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amber-gold absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@yourroastery.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
                Password {inlineMode === 'signup' ? '(min 6 chars)' : ''} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-gold absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl btn-tactile-amber text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : inlineMode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Roastery & Unlock Hub</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In & Unlock Hub</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={onReturnToVideo}
          className="text-xs text-stone-400 hover:text-amber-gold transition underline font-mono cursor-pointer"
        >
          ← Return to Educational Walkthrough Video
        </button>
      </div>
    </div>
  );
}
