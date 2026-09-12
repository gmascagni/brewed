import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sparkles,
  Printer,
  QrCode,
  Camera,
  Coffee,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Film,
  Compass,
  BarChart3
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetUrl';

const CHAPTERS = [
  {
    step: 1,
    id: 'hook',
    startTime: 0,
    endTime: 16.1,
    badge: '1. PARTNER ECOSYSTEM',
    title: 'Dual-Sided Specialty Coffee Platform',
    subtitle: 'Connecting artisan roasters, specialty cafes, and home baristas with zero app friction.',
    detail: 'Eliminates bitter or sour guesswork after retail purchase with verified recipes and local cafe radar.',
    icon: Sparkles,
    tags: ['100% Free Partner Tier', 'Roasters & Cafes', 'Zero App Friction']
  },
  {
    step: 2,
    id: 'roaster_studio',
    startTime: 16.1,
    endTime: 31.4,
    badge: '2. ROASTER STUDIO',
    title: '300 DPI Thermal Labels & QR Studio',
    subtitle: 'Generate high-contrast vector QR & barcode stickers for Dymo and Zebra thermal roll printers.',
    detail: 'Error Correction Level H (30%) ensures retail bags scan reliably even with handling creases or wrinkles.',
    icon: Printer,
    tags: ['Dymo / Zebra 300 DPI', 'Thermal Roll Stock', 'Error Correction Level H']
  },
  {
    step: 3,
    id: 'scan_timer',
    startTime: 31.4,
    endTime: 46.0,
    badge: '3. SMART BAG SCAN',
    title: 'Point & Shoot Optical Scan & Timer',
    subtitle: 'Customer scans bag with native phone camera. Exact ratio, temp, and live timer load instantly.',
    detail: 'No App Store download required. Mechanical clockwork ticking and step-by-step pour coaching.',
    icon: Camera,
    tags: ['Instant Mobile Web', 'Ratio 1:16.5', 'Live Slurry Timer']
  },
  {
    step: 4,
    id: 'cafe_portal',
    startTime: 46.0,
    endTime: 62.0,
    badge: '4. COFFEE SHOP PORTAL',
    title: 'Live Menu Switcher & Local Radar',
    subtitle: '5-second "On Bar Today" rotation switcher, precision equipment showcase, and local radar discovery.',
    detail: 'Attracts local coffee lovers, drives walk-in foot-traffic, and promotes community cupping events.',
    icon: Coffee,
    tags: ['On Bar Today Switcher', 'Local Coffee Radar', 'Commercial Gear Showcase']
  },
  {
    step: 5,
    id: 'telemetry_cta',
    startTime: 62.0,
    endTime: 76.2,
    badge: '5. MARKET TELEMETRY',
    title: 'Partner Intelligence & Free Profile',
    subtitle: 'Track real customer brew method telemetry, extraction curves, and claim your free partner profile.',
    detail: 'Free packaging studio, live menu switcher, and verified market analytics for independent coffee businesses.',
    icon: BarChart3,
    tags: ['Customer Telemetry', 'Roaster Analytics', 'Free Forever']
  }
];

export default function RoasterVideoPlayer({ onOpenLiveDemo = null, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(76.2);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Sync video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
      setVideoError(false);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };
    const onError = () => {
      console.warn('HTML5 video encountered load error, checking fallback sources...');
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
    };
  }, []);

  // Compute active chapter dynamically from currentTime
  const currentChapterIndex = (() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (currentTime >= CHAPTERS[i].startTime - 0.5) {
        return i;
      }
    }
    return 0;
  })();
  const currentChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleScrubberChange = (e) => {
    const pct = parseFloat(e.target.value);
    setProgress(pct);
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = (pct / 100) * video.duration;
    }
  };

  const handleJumpToChapter = (idx) => {
    const chap = CHAPTERS[idx];
    if (!chap) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = chap.startTime;
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handlePrevChapter = () => {
    const prevIdx = currentChapterIndex > 0 ? currentChapterIndex - 1 : CHAPTERS.length - 1;
    handleJumpToChapter(prevIdx);
  };

  const handleNextChapter = () => {
    const nextIdx = currentChapterIndex < CHAPTERS.length - 1 ? currentChapterIndex + 1 : 0;
    handleJumpToChapter(nextIdx);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCopyShareLink = () => {
    const videoPath = getAssetUrl('/videos/roasters_and_cafes_partner_walkthrough.mp4');
    const shareUrl = `${window.location.origin}${videoPath}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {});
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl bg-espresso-950/95 border border-[#A66E38]/40 shadow-2xl overflow-hidden flex flex-col text-cream-light ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-black/60 border-b border-white/10 z-10 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-gold">
            Roaster & Cafe Partner Walkthrough
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-gold/20 text-amber-gold text-[10px] font-mono font-bold border border-amber-gold/40">
            9:16 Social Ready (1080x1920)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
              isMuted
                ? 'bg-white/[0.04] border-white/10 text-cream-soft hover:text-white'
                : 'bg-amber-gold/20 border-amber-gold/40 text-amber-gold'
            }`}
            title={isMuted ? 'Unmute Audio Voiceover' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          {/* Direct MP4 Download Button for Social Media & Marketing */}
          <a
            href={getAssetUrl('/videos/roasters_and_cafes_partner_walkthrough.mp4')}
            download="thebrew_roaster_and_cafe_partner_walkthrough_9x16.mp4"
            className="px-3 py-1.5 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 transition flex items-center gap-1.5 text-xs font-mono font-bold shadow-md hover:scale-105 active:scale-95"
            title="Download Broadcast 1080x1920 9:16 MP4 for TikTok, Instagram Reels, and YouTube Shorts"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download MP4 (Social)</span>
          </a>

          {/* Copy Share Link */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-cream-soft hover:text-white transition cursor-pointer"
            title="Copy Video Direct Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-cream-soft hover:text-white transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Theater Body: Split View on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-black/80">
        
        {/* Left: 9:16 Phone Aspect Theater Frame (lg:col-span-5) */}
        <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-b from-black/60 to-black/90 border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-amber-gold/50 shadow-[0_0_35px_rgba(212,163,115,0.25)] bg-black group select-none flex items-center justify-center">
            
            {/* Native HTML5 Video Element */}
            <video
              ref={videoRef}
              src={getAssetUrl('/videos/roasters_and_cafes_partner_walkthrough.mp4')}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onClick={handleTogglePlay}
            >
              <source src={getAssetUrl('/videos/roasters_and_cafes_partner_walkthrough.mp4')} type="video/mp4" />
              <source src={getAssetUrl('/videos/roasters_and_cafes_partner_walkthrough.webm')} type="video/webm" />
              <source src={getAssetUrl('/videos/smart_bag_scan_demo.mp4')} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>

            {/* Click to Play / Pause Splash Overlay */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center bg-transparent cursor-pointer group focus:outline-none"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 border border-amber-gold/70 backdrop-blur-md flex items-center justify-center text-amber-gold shadow-2xl transition-all duration-300 ${
                  isPlaying
                    ? 'opacity-0 group-hover:opacity-90 scale-90'
                    : 'opacity-100 scale-100 hover:scale-105 hover:bg-black/80'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </div>
            </button>

            {/* Prev / Next Scene Nav Overlay */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevChapter();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-25 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-cream-soft hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
              title="Previous Scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextChapter();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-25 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-cream-soft hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
              title="Next Scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Current Chapter Pill in Video Frame */}
            <div className="absolute bottom-3 inset-x-3 z-20 p-2.5 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md pointer-events-none text-left">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-gold font-bold uppercase tracking-wider">
                <span>{currentChapter.badge}</span>
                <span className="text-cream-soft/70">Step {currentChapter.step}/5</span>
              </div>
              <div className="font-serif text-xs font-bold text-cream-light truncate mt-0.5">
                {currentChapter.title}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Interactive Chapter Breakdown & Marketing Hub (lg:col-span-7) */}
        <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-6">
          
          {/* Active Chapter Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-gold/20 text-amber-gold font-mono text-xs font-bold border border-amber-gold/30">
                {currentChapter.badge}
              </span>
              <span className="text-xs font-mono text-cream-soft/70">
                Current Time: {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light leading-tight">
                {currentChapter.title}
              </h3>
              <p className="text-sm sm:text-base text-cream-soft/90 font-sans mt-2 leading-relaxed">
                {currentChapter.subtitle}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-gold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Operational Implementation Insight:</span>
              </div>
              <p className="text-xs sm:text-sm text-cream-soft font-sans leading-relaxed">
                {currentChapter.detail}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentChapter.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono text-cream-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social Media & Marketing Campaign Pack Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2A1810] to-[#1E110A] border border-amber-gold/40 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-gold" />
                <span className="text-xs font-mono font-bold text-amber-gold uppercase tracking-wider">
                  Social Media & Marketing Campaign Asset
                </span>
              </div>
              <span className="text-[10px] font-mono text-cream-soft/60">
                1080x1920 • 30 FPS • Broadcast Audio
              </span>
            </div>

            <p className="text-xs text-cream-soft/80 leading-relaxed">
              This video is pre-rendered in native 9:16 vertical orientation, optimized for immediate posting on Instagram Reels, TikTok, YouTube Shorts, and partner pitch campaigns.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={getAssetUrl('/videos/roasters_and_cafes_partner_walkthrough.mp4')}
                download="thebrew_partner_walkthrough_short_9x16.mp4"
                className="px-4 py-2 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition hover:scale-105 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4 File</span>
              </a>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-cream-light font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-gold" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Direct URL'}</span>
              </button>

              {onOpenLiveDemo && (
                <button
                  type="button"
                  onClick={onOpenLiveDemo}
                  className="px-3 py-2 rounded-xl bg-[#2F663C] hover:bg-[#255230] text-emerald-100 font-mono text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Launch Label Studio</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Scrubber Timeline Bar */}
      <div className="relative w-full bg-black/90 px-5 pt-3 pb-3 border-t border-white/10 space-y-2">
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleScrubberChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4A373] focus:outline-none"
            aria-label="Timeline scrubber"
          />
        </div>

        {/* Controls & Time Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-cream-soft">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-amber-gold transition cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current;
                if (video) {
                  video.currentTime = 0;
                  video.play().catch(() => {});
                }
              }}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-cream-soft hover:text-white transition cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-cream-soft/60">
              Select any scene below to jump directly
            </span>
          </div>
        </div>
      </div>

      {/* 5-Step Chapter Navigator Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-3 sm:p-4 bg-black/60 border-t border-white/10">
        {CHAPTERS.map((chap, idx) => {
          const isSelected = idx === currentChapterIndex;
          const IconComponent = chap.icon;

          return (
            <button
              type="button"
              key={chap.id}
              onClick={() => handleJumpToChapter(idx)}
              className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-amber-gold/15 border-amber-gold/70 shadow-lg ring-1 ring-amber-gold/40'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isSelected ? 'text-amber-gold' : 'text-cream-soft/60'
                  }`}
                >
                  Step {chap.step}
                </span>
                <IconComponent
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-gold' : 'text-cream-soft/50'}`}
                />
              </div>

              <div className="font-serif font-bold text-xs text-cream-light leading-snug line-clamp-1">
                {chap.title}
              </div>

              <span className="text-[10px] font-mono text-cream-soft/50">
                {formatTime(chap.startTime)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
