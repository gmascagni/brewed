import React from 'react';
import { Store, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RoasterAuthGate({ onOpenAuth, onReturnToVideo }) {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1E140F] to-[#120B08] border-2 border-amber-gold/40 text-center space-y-6 shadow-2xl animate-fade-in my-6 max-w-2xl mx-auto">
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

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onOpenAuth && onOpenAuth({ role: 'roaster', mode: 'signup' })}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>Create Verified Roaster Account</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAuth && onOpenAuth({ role: 'roaster', mode: 'login' })}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-light font-bold text-xs uppercase tracking-wider border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Sign In as Existing Roaster</span>
        </button>
      </div>

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
