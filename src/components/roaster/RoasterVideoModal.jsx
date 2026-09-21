import React, { useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetUrl';

export default function RoasterVideoModal({
  isOpen,
  onClose
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-sm w-full bg-[#14110E] border border-amber-gold/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 gap-2">
          <span className="text-xs font-mono font-bold text-amber-gold flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-current text-red-400" />
            <span>60s Partner & Smart Bag Walkthrough</span>
          </span>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
            title="Close Video (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
          <video
            src={getAssetUrl('/videos/smart_bag_scan_demo.mp4')}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src={getAssetUrl('/videos/smart_bag_scan_demo.mp4')} type="video/mp4" />
            <source src={getAssetUrl('/videos/roasters_and_cafes_partner_walkthrough.mp4')} type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>
        </div>

        <div className="p-3.5 bg-black/60 text-center border-t border-white/10 space-y-2">
          <p className="text-xs text-stone-200 font-mono font-bold">From 300 DPI Label to Dialed-In Extraction</p>
          <p className="text-[11px] text-amber-gold/80 font-mono">Camera Barcode Scan • Live Water Slurry Timer</p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold border border-white/10 transition cursor-pointer"
          >
            Close Video
          </button>
        </div>
      </div>
    </div>
  );
}
