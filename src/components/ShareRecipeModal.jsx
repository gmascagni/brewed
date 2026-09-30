import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  Coffee, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { encodeRecipeToShareUrl } from '../utils/recipeParser';
import { trackEvent } from '../utils/analytics';
import { hapticTap, hapticSuccess } from '../utils/haptics';

export default function ShareRecipeModal({
  isOpen,
  onClose,
  recipe
}) {
  if (!isOpen || !recipe) return null;

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const shareUrl = encodeRecipeToShareUrl(recipe);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(shareUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#14110F',
        light: '#FAF7F2'
      }
    }).then(url => {
      if (isMounted) setQrCodeDataUrl(url);
    }).catch(err => {
      console.warn('Failed to render QR Code:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [shareUrl]);

  const handleCopyLink = () => {
    hapticSuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
    trackEvent('share_recipe_copy_link', { title: recipe.title, method: recipe.methodId });
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    hapticTap();
    const anchor = document.createElement('a');
    anchor.href = qrCodeDataUrl;
    anchor.download = `recipe_${recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_qr.png`;
    anchor.click();
    trackEvent('share_recipe_download_qr', { title: recipe.title });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipe.title} • The Brew App`,
          text: `Check out this dialed-in ${recipe.methodName || 'coffee'} recipe on TheBrew.App: ${recipe.dryDoseGrams}g, 1:${recipe.ratio} ratio.`,
          url: shareUrl
        });
        trackEvent('share_recipe_native', { title: recipe.title });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share failed:', err);
        }
      }
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-recipe-modal-title"
    >
      <div className="w-full max-w-md bg-[#14100D] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-cream-light animate-slide-up">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-gold flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                  Share Recipe
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant Deep-Link
                </span>
              </div>
              <h3 id="share-recipe-modal-title" className="font-serif text-lg font-bold text-cream-light leading-tight mt-0.5 truncate max-w-[240px]">
                {recipe.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/10 transition cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-center flex flex-col items-center">
          
          {/* Recipe Snapshot Banner */}
          <div className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono flex items-center justify-between">
            <span className="text-stone-300">{recipe.methodName || 'Pour Over'}</span>
            <span className="text-amber-gold font-bold">{recipe.dryDoseGrams}g : {recipe.waterAmountMl}mL (1:{recipe.ratio})</span>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-[#FAF7F2] rounded-3xl shadow-xl border-4 border-amber-500/30 flex flex-col items-center">
            {qrCodeDataUrl ? (
              <img 
                src={qrCodeDataUrl} 
                alt="Recipe QR Code" 
                className="w-48 h-48 rounded-xl object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs font-mono text-stone-600">
                Generating QR...
              </div>
            )}
            <span className="text-[11px] font-mono font-bold text-stone-900 mt-2">
              Scan with Phone Camera to Brew
            </span>
          </div>

          {/* Share Link Row with Copy Button */}
          <div className="w-full space-y-2 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-semibold">
              Shareable Direct Web Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-stone-300 text-xs font-mono truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-gold" />
              <span>Save QR Image</span>
            </button>

            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Share Externally</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
