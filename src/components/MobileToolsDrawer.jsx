import React, { useEffect, useRef } from 'react';
import {
  X,
  ScanLine,
  FlaskConical,
  GraduationCap,
  BookOpen,
  Newspaper,
  QrCode,
  Coffee,
  Volume2,
  VolumeX,
  User,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { hapticTap } from '../utils/haptics';

export default function MobileToolsDrawer({
  isOpen,
  onClose,
  onOpenScanner,
  onOpenWaterLab,
  onOpenVideoAcademy,
  onOpenJournal,
  onOpenNews,
  onOpenRoasterPortal,
  onOpenCafePortal,
  onOpenProfile,
  onOpenAuth,
  isMuted,
  onToggleMute,
  currentUser
}) {
  const sheetRef = useRef(null);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end animate-fade-in">
      {/* Dimmed Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          hapticTap();
          onClose();
        }}
      />

      {/* Slide-Up Bottom Sheet */}
      <div 
        ref={sheetRef}
        className="relative w-full max-h-[88vh] bg-white rounded-t-3xl border-t border-[#ECE6DC] shadow-2xl flex flex-col overflow-hidden pb-safe z-10 animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Barista Tools & Settings"
      >
        {/* Drag Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-[#D6CEBE]" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#ECE6DC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] border border-[#ECD4BD] flex items-center justify-center text-[#A25A24]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-[#14110F]">Barista Tools & Portals</h3>
              <p className="text-[11px] text-[#766A62]">Specialty utilities & partner hubs</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              hapticTap();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#FAF7F2] text-[#766A62] hover:text-[#14110F] border border-[#ECE6DC]"
            title="Close tools menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Tools List */}
        <div className="overflow-y-auto p-4 space-y-2 mobile-scroll-container">

          {/* Quick Sound / Audible Toggle */}
          {onToggleMute && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onToggleMute();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all active:scale-[0.98] ${
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-[#EBF3ED] border-[#C8E0CD] text-[#2F663C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isMuted ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-[#2F663C]'
                }`}>
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <span className="font-sans font-bold text-xs block">
                    {isMuted ? 'Audible Timer: Muted' : 'Audible Timer: Sound ON'}
                  </span>
                  <span className="text-[11px] opacity-80 block">
                    {isMuted ? 'Tap to enable voice & phase chimes' : 'Voice coaching & countdown ticks active'}
                  </span>
                </div>
              </div>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                isMuted ? 'bg-rose-200/50 border-rose-300' : 'bg-emerald-200/50 border-emerald-300'
              }`}>
                {isMuted ? 'MUTED' : 'ACTIVE'}
              </span>
            </button>
          )}

          {/* 1. Scan Bag Barcode */}
          {onOpenScanner && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onClose();
                onOpenScanner();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0E6] border border-[#ECE6DC] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#A8622D]">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs text-[#14110F]">Scan Coffee Bag</h4>
                  <p className="text-[11px] text-[#766A62]">Optical barcode & QR scanner with instant dial-in</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A89F91]" />
            </button>
          )}

          {/* 2. Water Chemistry Lab */}
          {onOpenWaterLab && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onClose();
                onOpenWaterLab();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0E6] border border-[#ECE6DC] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-700">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs text-[#14110F]">Water Chemistry Lab</h4>
                  <p className="text-[11px] text-[#766A62]">SCA target minerals, buffer recipes, GH & KH</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A89F91]" />
            </button>
          )}

          {/* 3. Video Academy */}
          {onOpenVideoAcademy && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onClose();
                onOpenVideoAcademy();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0E6] border border-[#ECE6DC] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs text-[#14110F]">Coffee Video Academy</h4>
                  <p className="text-[11px] text-[#766A62]">16 masterclasses from champion baristas</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A89F91]" />
            </button>
          )}

          {/* 4. Tasting Journal */}
          {onOpenJournal && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onClose();
                onOpenJournal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0E6] border border-[#ECE6DC] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs text-[#14110F]">Tasting Journal</h4>
                  <p className="text-[11px] text-[#766A62]">Log dial-in extractions and cup flavor notes</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A89F91]" />
            </button>
          )}

          {/* 5. World Coffee News */}
          {onOpenNews && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onClose();
                onOpenNews();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0E6] border border-[#ECE6DC] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs text-[#14110F]">World Brew News</h4>
                  <p className="text-[11px] text-[#766A62]">Curated specialty coffee industry dispatches</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A89F91]" />
            </button>
          )}

          {/* Section Divider: Partner Hubs */}
          <div className="pt-2 pb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A89F91] px-1">
              B2B Partner Portals
            </span>
          </div>

          {/* Roaster SaaS Portal */}
          {onOpenRoasterPortal && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onClose();
                onOpenRoasterPortal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0E6] border border-[#ECE6DC] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#A66E38]/20 border border-[#A66E38]/30 flex items-center justify-center text-[#A66E38]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs text-[#14110F]">Roaster Packaging Studio</h4>
                  <p className="text-[11px] text-[#766A62]">300 DPI thermal labels & bag QR generator</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A89F91]" />
            </button>
          )}

          {/* Coffee Shop Portal */}
          {onOpenCafePortal && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                onClose();
                onOpenCafePortal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF0E6] border border-[#ECE6DC] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2F663C]/20 border border-[#2F663C]/30 flex items-center justify-center text-[#2F663C]">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs text-[#14110F]">Coffee Shop Portal</h4>
                  <p className="text-[11px] text-[#766A62]">"On Bar Today" live rotation & local radar</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A89F91]" />
            </button>
          )}

          {/* Profile & Account Bottom Action */}
          <div className="pt-3 border-t border-[#ECE6DC] mt-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  onClose();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF0E6] border border-[#ECD4BD]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#A25A24] text-white flex items-center justify-center text-xs font-bold font-mono">
                    {currentUser.displayName ? currentUser.displayName[0] : 'B'}
                  </div>
                  <div className="text-left">
                    <span className="font-sans text-xs font-bold text-[#14110F] block">
                      {currentUser.displayName || 'Barista'}
                    </span>
                    <span className="text-[10px] text-[#766A62]">Manage Profile & Badges</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A25A24]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  onClose();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#14110F] text-[#FAF7F2] font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
              >
                <User className="w-4 h-4" />
                <span>Barista Profile Login / Sign Up</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
