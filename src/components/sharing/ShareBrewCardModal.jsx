import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Coffee,
  Sparkles,
  Star,
  Globe,
  Lock,
  Flame,
  CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';
import { trackEvent } from '../../utils/analytics';
import { hapticTap, hapticSuccess } from '../../utils/haptics';
import { toggleEntryPublicStatus } from '../../utils/journalStorage';

export default function ShareBrewCardModal({
  isOpen,
  onClose,
  brew
}) {
  if (!isOpen || !brew) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isPublic, setIsPublic] = useState(Boolean(brew.isPublic));
  const cardElementRef = useRef(null);

  const beanName = brew.beanName || 'Specialty Single Origin';
  const roaster = brew.roaster || 'Artisan Roastery';
  const methodName = brew.methodName || 'Pour Over';
  const ratio = brew.ratioStr || (brew.ratio ? `1 : ${brew.ratio}` : '1 : 16.5');
  const dose = brew.doseStr || (brew.doseGrams ? `${brew.doseGrams}g` : '18.0g');
  const water = brew.waterStr || (brew.waterMl ? `${brew.waterMl} mL` : '297 mL');
  const temp = brew.tempStr || (brew.tempF ? `${brew.tempF}°F` : '202°F');
  const grind = brew.grindStr || brew.grindName || 'Medium-Fine';
  const duration = brew.durationFormatted || '3:15';
  const rating = Number(brew.rating) || 5;
  const taste = brew.tasteFeedback || 'balanced';
  const remedy = brew.remedy || '';
  const tastingNotes = Array.isArray(brew.tastingNotes) 
    ? brew.tastingNotes 
    : (brew.tastingNotes ? [brew.tastingNotes] : ['Sweet & Balanced']);

  const shareUrl = `https://thebrew.app/?bean=${encodeURIComponent(beanName)}&roaster=${encodeURIComponent(roaster)}&method=${encodeURIComponent(brew.methodId || 'pour_over')}&ratio=${encodeURIComponent(brew.ratio || 16.5)}&grind=${encodeURIComponent(grind)}&rating=${rating}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(shareUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#14100D',
        light: '#F8F5EE'
      }
    }).then((dataUrl) => {
      if (isMounted) setQrCodeDataUrl(dataUrl);
    }).catch((err) => {
      console.warn('QR code generation warning:', err);
    });

    return () => { isMounted = false; };
  }, [shareUrl]);

  const handleCopyLink = () => {
    hapticTap();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
      trackEvent('brew_card_link_copied', { bean: beanName, roaster });
    }
  };

  const handleTogglePublic = () => {
    hapticTap();
    const updated = toggleEntryPublicStatus(brew.id);
    if (updated) {
      setIsPublic(Boolean(updated.isPublic));
    } else {
      setIsPublic(!isPublic);
    }
    trackEvent('brew_card_public_toggled', { isPublic: !isPublic });
  };

  const handleDownloadCardPng = async () => {
    hapticSuccess();
    setDownloading(true);

    try {
      // High-resolution Canvas Rendering of the Brew Card
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1000;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#16100C');
      gradient.addColorStop(0.5, '#0E0907');
      gradient.addColorStop(1, '#050302');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Gold border
      ctx.strokeStyle = 'rgba(200, 138, 75, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // 2. Branding Header
      ctx.fillStyle = '#C88A4B';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('THEBREW.APP • DIAL-IN BREW CARD', 50, 75);

      // 3. Roaster & Bean Title
      ctx.fillStyle = '#E88B35';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(roaster.toUpperCase(), 50, 130);

      ctx.fillStyle = '#FAF7F2';
      ctx.font = 'bold 44px serif';
      const maxBeanLength = 26;
      const displayBean = beanName.length > maxBeanLength ? `${beanName.slice(0, maxBeanLength)}…` : beanName;
      ctx.fillText(displayBean, 50, 185);

      // Method & Rating Bar
      ctx.fillStyle = '#FAF7F2';
      ctx.font = '24px sans-serif';
      ctx.fillText(`Brewed with ${methodName}`, 50, 235);

      let starStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(starStr, 50, 280);

      // 4. Extraction Grid (Card Box)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.fillRect(50, 310, width - 100, 230);
      ctx.strokeRect(50, 310, width - 100, 230);

      const drawSpec = (label, val, x, y) => {
        ctx.fillStyle = '#8C8178';
        ctx.font = '16px monospace';
        ctx.fillText(label.toUpperCase(), x, y);
        ctx.fillStyle = '#FAF7F2';
        ctx.font = 'bold 26px monospace';
        ctx.fillText(val, x, y + 34);
      };

      drawSpec('Dry Dose', dose, 80, 360);
      drawSpec('Total Water', water, 300, 360);
      drawSpec('Golden Ratio', ratio, 520, 360);

      drawSpec('Water Temp', temp, 80, 460);
      drawSpec('Grind Size', grind, 300, 460);
      drawSpec('Drawdown Time', duration, 520, 460);

      // 5. Tasting Notes & Dial-In assistant note
      ctx.fillStyle = '#C88A4B';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('TASTING PROFILE & DIAL-IN NOTES', 50, 585);

      ctx.fillStyle = '#FAF7F2';
      ctx.font = 'italic 24px serif';
      const notesLine = `"${tastingNotes.join(' • ')}"`;
      ctx.fillText(notesLine, 50, 625);

      if (remedy) {
        ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
        ctx.fillRect(50, 660, width - 100, 80);
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
        ctx.strokeRect(50, 660, width - 100, 80);

        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('DIAL-IN ADVICE:', 70, 690);

        ctx.fillStyle = '#FAF7F2';
        ctx.font = '18px sans-serif';
        const displayRemedy = remedy.length > 60 ? `${remedy.slice(0, 60)}…` : remedy;
        ctx.fillText(displayRemedy, 70, 720);
      }

      // 6. QR Code & Footer
      if (qrCodeDataUrl) {
        const qrImg = new Image();
        qrImg.onload = () => {
          ctx.drawImage(qrImg, width - 210, height - 210, 160, 160);

          ctx.fillStyle = '#8C8178';
          ctx.font = '14px monospace';
          ctx.fillText('Scan to dial-in this recipe on', 50, height - 120);
          ctx.fillStyle = '#C88A4B';
          ctx.font = 'bold 22px monospace';
          ctx.fillText('THEBREW.APP', 50, height - 90);

          // Download PNG
          const link = document.createElement('a');
          link.download = `brew-card-${beanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          setDownloading(false);
        };
        qrImg.src = qrCodeDataUrl;
      } else {
        const link = document.createElement('a');
        link.download = `brew-card-${beanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloading(false);
      }
    } catch (err) {
      console.error('Failed to export brew card:', err);
      setDownloading(false);
    }
  };

  const handleDeviceShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${beanName} by ${roaster} • The Brew App`,
          text: `I just brewed ${beanName} (${rating}★, ${ratio}, ${dose}) with TheBrew.App Dial-In Assistant!`,
          url: shareUrl
        });
        hapticSuccess();
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Share error:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-lg bg-[#140F0D] border border-amber-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slide-up text-cream-light"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-gold flex items-center justify-center border border-amber-500/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-cream-light">
                Shareable Brew Card
              </h3>
              <p className="text-[11px] font-mono text-cream-soft/70">
                Aesthetic extraction card for Instagram, Reddit, &amp; Discord
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white transition cursor-pointer"
            title="Close brew card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Card Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-center">
          
          {/* Visual Brew Card Container */}
          <div 
            ref={cardElementRef}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#1C1410] via-[#120C09] to-[#0A0604] border border-amber-gold/40 shadow-xl space-y-4 text-left relative overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-gold">
                TheBrew.App • Dial-In Card
              </span>
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition cursor-pointer ${
                  isPublic 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-white/10 text-stone-300 border-white/20'
                }`}
                title="Toggle between public community card or private journal log"
              >
                {isPublic ? <Globe className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-stone-400" />}
                <span>{isPublic ? 'Public Community' : 'Private Journal'}</span>
              </button>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                {roaster}
              </span>
              <h4 className="font-serif text-2xl font-bold text-cream-light leading-snug">
                {beanName}
              </h4>
              <div className="flex items-center justify-between text-xs text-cream-soft mt-1">
                <span>Brewed with {methodName}</span>
                <span className="text-amber-400 font-bold tracking-wider">
                  {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                </span>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/10 text-center text-xs font-mono">
              <div className="p-1.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-cream-soft/60 uppercase">Dose</div>
                <div className="font-bold text-cream-light mt-0.5">{dose}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-cream-soft/60 uppercase">Water</div>
                <div className="font-bold text-cream-light mt-0.5">{water}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-cream-soft/60 uppercase">Ratio</div>
                <div className="font-bold text-amber-gold mt-0.5">{ratio}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-cream-soft/60 uppercase">Temp</div>
                <div className="font-bold text-cream-light mt-0.5">{temp}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-cream-soft/60 uppercase">Grind</div>
                <div className="font-bold text-cream-light mt-0.5 truncate">{grind}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-white/[0.03]">
                <div className="text-[10px] text-cream-soft/60 uppercase">Time</div>
                <div className="font-bold text-cream-light mt-0.5">{duration}</div>
              </div>
            </div>

            {/* Tasting Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-cream-soft/70 uppercase">Tasting Profile</span>
              <div className="flex flex-wrap gap-1.5">
                {tastingNotes.map((note, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-gold text-xs font-mono font-medium border border-amber-500/30">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Dial In Advice */}
            {remedy && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                <span className="font-mono text-[10px] text-amber-gold font-bold uppercase tracking-wider block">
                  Next Dial-In Tweak:
                </span>
                <span className="text-cream-light mt-0.5 block leading-relaxed">
                  {remedy}
                </span>
              </div>
            )}

            {/* QR Footprint */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="text-left">
                <span className="text-cream-soft/60 text-[10px] block">Dial this recipe:</span>
                <span className="text-amber-gold font-bold">thebrew.app</span>
              </div>
              {qrCodeDataUrl && (
                <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0">
                  <img src={qrCodeDataUrl} alt="Recipe QR Code" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleTogglePublic}
            className="text-xs font-mono text-cream-soft/80 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            {isPublic ? <Globe className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isPublic ? 'Public Note' : 'Private Note'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-cream-light text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleDeviceShare}
              className="sm:hidden px-3.5 py-2 rounded-xl bg-white/[0.08] text-cream-light text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-gold" />
              <span>Share</span>
            </button>

            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadCardPng}
              className="px-4 py-2 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-espresso-950" />
              <span>{downloading ? 'Rendering…' : 'Download PNG'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
