import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  Store,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  ArrowRight,
  Globe,
  FileText,
  Sparkles,
  Lock,
  Building
} from 'lucide-react';
import { 
  saveRoasterClaim, 
  isRoasterClaimed 
} from '../../utils/roasterClaimStorage';
import { extractDomainFromUrl } from '../../utils/roasterVerification';
import { hapticTap, hapticSuccess } from '../../utils/haptics';

export default function RoasterClaimModal({
  isOpen,
  onClose,
  roaster,
  currentUser = null,
  onClaimSuccess = null,
  onOpenRoasterPortal = null
}) {
  if (!isOpen || !roaster) return null;

  const roasterDomain = extractDomainFromUrl(roaster.website);
  const [claimMode, setClaimMode] = useState('domain'); // 'domain' | 'manual'
  const [claimantEmail, setClaimantEmail] = useState(currentUser?.email || '');
  const [claimantName, setClaimantName] = useState(currentUser?.displayName || currentUser?.username || '');
  const [socialHandle, setSocialHandle] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!claimantEmail || !claimantEmail.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }

    try {
      const result = saveRoasterClaim({
        roasterSlug: roaster.slug || roaster.id,
        roasterName: roaster.name,
        claimantEmail,
        claimantName,
        roasterWebsite: roaster.website,
        verificationType: claimMode,
        proofNotes,
        socialHandle
      });

      setClaimResult(result);
      hapticSuccess();

      if (onClaimSuccess) {
        onClaimSuccess(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit claim. Please try again.');
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl bg-espresso-950/95 border-2 border-amber-gold/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh] pb-safe"
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-gold/40 flex items-center justify-center text-amber-gold shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-gold">
                  Brand Ownership &amp; Marketplace
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                  Verification Portal
                </span>
              </div>
              <h2 id="claim-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-light">
                Claim {roaster.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition cursor-pointer"
            title="Close claim modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-left">
          
          {/* Claim Success State */}
          {claimResult ? (
            <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 space-y-4 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-cream-light">
                  {claimResult.status === 'verified' ? 'Brand Ownership Verified!' : 'Claim Request Submitted'}
                </h3>
                <p className="text-xs text-cream-soft/80 mt-1 max-w-md mx-auto leading-relaxed">
                  {claimResult.verificationMessage}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-cream-light text-left space-y-1">
                <div><strong>Roaster:</strong> {claimResult.roasterName}</div>
                <div><strong>Claimant:</strong> {claimResult.claimantName} ({claimResult.claimantEmail})</div>
                <div><strong>Status:</strong> <span className={claimResult.status === 'verified' ? 'text-emerald-400 font-bold' : 'text-amber-gold font-bold'}>{claimResult.status.toUpperCase()}</span></div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onOpenRoasterPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenRoasterPortal(roaster.slug || roaster.id);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Store className="w-4 h-4" />
                    <span>Open Roaster Hub &amp; Add Recipes</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-cream-light text-xs font-mono font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Roaster Overview Banner */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-cream-soft/60 uppercase block">Official Website</span>
                  <a 
                    href={roaster.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-amber-gold hover:underline font-bold flex items-center gap-1 mt-0.5"
                  >
                    <span>{roasterDomain || roaster.website || 'Official Domain'}</span>
                    <Globe className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-cream-soft/60 uppercase block">Location</span>
                  <span className="text-cream-light font-bold mt-0.5 block">{roaster.city || 'Specialty Roastery'}</span>
                </div>
              </div>

              {/* Mode Toggle: Corporate Domain vs Manual Verification */}
              <div className="grid grid-cols-2 p-1 bg-black/60 rounded-2xl border border-white/10 shadow-inner text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setClaimMode('domain');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    claimMode === 'domain'
                      ? 'bg-amber-gold text-espresso-950 shadow-md'
                      : 'text-cream-soft/70 hover:text-cream-light'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Domain Verification</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setClaimMode('manual');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    claimMode === 'manual'
                      ? 'bg-amber-gold text-espresso-950 shadow-md'
                      : 'text-cream-soft/70 hover:text-cream-light'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Manual Roaster Review</span>
                </button>
              </div>

              {/* Error Message Banner */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-cream-soft/70 uppercase text-[10px] block mb-1">
                    Your Full Name &amp; Title <span className="text-amber-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="e.g. Christian Picken (Founder &amp; Head Roaster)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-cream-soft/70 uppercase text-[10px]">
                      {claimMode === 'domain' ? `Corporate Email (@${roasterDomain || 'domain'})` : 'Your Direct Contact Email'} <span className="text-amber-gold">*</span>
                    </label>
                    {claimMode === 'domain' && roasterDomain && (
                      <span className="text-[10px] text-emerald-400 font-bold">Instant Instant Match</span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                    placeholder={claimMode === 'domain' && roasterDomain ? `alex@${roasterDomain}` : 'roaster@gmail.com'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold text-xs"
                  />
                  {claimMode === 'domain' && roasterDomain && (
                    <p className="text-[10px] text-cream-soft/60 mt-1">
                      Must match @{roasterDomain}. Public consumer emails (gmail, yahoo) will require Manual Roaster Review.
                    </p>
                  )}
                </div>

                {claimMode === 'manual' && (
                  <>
                    <div>
                      <label className="text-cream-soft/70 uppercase text-[10px] block mb-1">
                        Instagram Handle or Website Shop Link
                      </label>
                      <input
                        type="text"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        placeholder="e.g. @brookmillcoffeeroasters or https://brookmill.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-cream-soft/70 uppercase text-[10px] block mb-1">
                        Proof of Ownership / Roaster Verification Note
                      </label>
                      <textarea
                        rows={3}
                        value={proofNotes}
                        onChange={(e) => setProofNotes(e.target.value)}
                        placeholder="e.g. We are the founders of Brookmill Coffee Roasters. Wholesale license or invoice available upon request."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold text-xs"
                      />
                    </div>
                  </>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-cream-light text-xs font-mono font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-espresso-950" />
                    <span>{claimMode === 'domain' ? 'Verify & Claim Profile' : 'Submit Manual Claim'}</span>
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
