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
  Loader2
} from 'lucide-react';

const SCENES = [
  {
    step: 1,
    id: 'print',
    title: 'Thermal Print Smart QR Sticker',
    subtitle: 'Generate crisp, high-contrast 300 DPI vector QR labels with your exact dialed-in recipe embedded.',
    detail: 'Printed on direct-thermal roll stock (Dymo / Zebra). Error Correction Level H ensures reliable scanning even with creased paper.',
    badge: '1. ROASTERY WORKBENCH',
    duration: 6, // seconds
    image: '/images/demo/step1_print.jpg',
    icon: Printer,
    tags: ['Dymo / Zebra 300 DPI', 'Thermal Roll Stock', 'Error Correction H (30%)']
  },
  {
    step: 2,
    id: 'affix',
    title: 'Affix Sticker to Retail Bag',
    subtitle: 'Artisan roaster smoothes the moisture-resistant label onto the front of the specialty craft coffee bag.',
    detail: 'Affixed right below the one-way degassing valve. Sleek, tactile craft sticker complements premium artisan packaging.',
    badge: '2. ARTISAN PACKAGING',
    duration: 6,
    image: '/images/demo/step2_affix.jpg',
    icon: QrCode,
    tags: ['Degassing Valve Adjacent', 'Moisture Resistant', 'Retail Shelf Ready']
  },
  {
    step: 3,
    id: 'scan',
    title: 'Customer Scans with Smartphone',
    subtitle: 'Zero app installation friction. Customer points any iPhone or Android camera at the QR sticker.',
    detail: 'Native camera viewfinder locks on instantly and prompts "Open in The Brew App" to unlock the roaster recipe.',
    badge: '3. POINT & SHOOT',
    duration: 6,
    image: '/images/demo/step3_scan.jpg',
    icon: Camera,
    tags: ['Native iOS / Android Camera', 'Zero App Store Barrier', 'Instant Optical Recognition']
  },
  {
    step: 4,
    id: 'brew',
    title: 'Instant Dial-In Recipe & Live Timer',
    subtitle: 'The Brew App webpage opens directly with golden ratio 1:16.5, water temp 202°F, and synchronized multi-phase timer.',
    detail: 'Eliminates bitter or sour guesswork. Customer taps Start Timer for step-by-step bloom and pour audio coaching.',
    badge: '4. GOLDEN RATIO DIALED-IN',
    duration: 6,
    image: '/images/demo/step4_brew.jpg',
    icon: Coffee,
    tags: ['Golden Ratio 1:16.5', 'Water Temp 202°F / 94.4°C', 'Synchronized Pour Timer']
  }
];

const TOTAL_DURATION = SCENES.reduce((acc, s) => acc + s.duration, 0); // 24s

export default function RoasterVideoPlayer({ onOpenLiveDemo = null, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100% of entire video
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100% of active scene
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const currentScene = SCENES[currentSceneIndex];

  // Synthesize pleasant sound effects via Web Audio API
  const playSound = (type) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'print') {
        // Subtle printer mechanical feed ticks
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'affix') {
        // Soft tactile tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'scan') {
        // Crisp two-tone camera chime (E5 -> G#5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(830.61, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.29);
      } else if (type === 'brew') {
        // Barista bell / warm golden ratio chime (C5 + G5 harmonic)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.52);
      }
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  };

  // Main playback timer loop (50ms tick rate for smooth 20fps progress)
  useEffect(() => {
    if (!isPlaying) {
      clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 50;
    const totalMs = TOTAL_DURATION * 1000;
    const sceneMs = (TOTAL_DURATION / SCENES.length) * 1000; // 6000ms

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalMs / totalMs) * 100;
        if (next >= 100) {
          setIsPlaying(false);
          setCurrentSceneIndex(0);
          setSceneProgress(0);
          return 0;
        }

        const elapsedSec = (next / 100) * TOTAL_DURATION;
        const newIndex = Math.min(
          SCENES.length - 1,
          Math.floor(elapsedSec / (TOTAL_DURATION / SCENES.length))
        );

        if (newIndex !== currentSceneIndex) {
          setCurrentSceneIndex(newIndex);
          const soundMap = ['print', 'affix', 'scan', 'brew'];
          playSound(soundMap[newIndex]);
        }

        const elapsedInScene = elapsedSec % (TOTAL_DURATION / SCENES.length);
        setSceneProgress((elapsedInScene / (TOTAL_DURATION / SCENES.length)) * 100);

        return next;
      });
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentSceneIndex, isMuted]);

  const handleTogglePlay = () => {
    if (!isPlaying && progress >= 99) {
      setProgress(0);
      setCurrentSceneIndex(0);
      setSceneProgress(0);
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      const soundMap = ['print', 'affix', 'scan', 'brew'];
      playSound(soundMap[currentSceneIndex]);
    }
  };

  const handleJumpToScene = (idx) => {
    setCurrentSceneIndex(idx);
    const scenePct = (idx / SCENES.length) * 100;
    setProgress(scenePct);
    setSceneProgress(0);
    const soundMap = ['print', 'affix', 'scan', 'brew'];
    playSound(soundMap[idx]);
  };

  const handlePrevScene = () => {
    const prevIdx = currentSceneIndex > 0 ? currentSceneIndex - 1 : SCENES.length - 1;
    handleJumpToScene(prevIdx);
  };

  const handleNextScene = () => {
    const nextIdx = currentSceneIndex < SCENES.length - 1 ? currentSceneIndex + 1 : 0;
    handleJumpToScene(nextIdx);
  };

  const handleScrubberChange = (e) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    const elapsedSec = (val / 100) * TOTAL_DURATION;
    const newIndex = Math.min(
      SCENES.length - 1,
      Math.floor(elapsedSec / (TOTAL_DURATION / SCENES.length))
    );
    setCurrentSceneIndex(newIndex);
    const elapsedInScene = elapsedSec % (TOTAL_DURATION / SCENES.length);
    setSceneProgress((elapsedInScene / (TOTAL_DURATION / SCENES.length)) * 100);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Authentic Video Exporter: Renders all 4 scenes to an offscreen HTML5 canvas & captures native WebM
  const handleExportWebm = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      // Preload all 4 images
      const loadedImages = await Promise.all(
        SCENES.map((scene) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load ${scene.image}`));
            img.src = scene.image;
          });
        })
      );

      const stream = canvas.captureStream(30); // 30 FPS
      const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
      let supportedType = mimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';

      const recorder = new MediaRecorder(stream, supportedType ? { mimeType: supportedType } : undefined);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const renderComplete = new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: supportedType || 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'smart_bag_roaster_onboarding_walkthrough.webm';
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 10000);
          resolve();
        };
      });

      recorder.start();

      // Render 16-second video (4 seconds per scene @ 30 FPS = 480 frames total)
      const fps = 30;
      const secPerScene = 4;
      const totalFrames = fps * secPerScene * SCENES.length;

      for (let frame = 0; frame < totalFrames; frame++) {
        const sceneIdx = Math.floor(frame / (fps * secPerScene));
        const frameInScene = frame % (fps * secPerScene);
        const sceneRatio = frameInScene / (fps * secPerScene);
        const img = loadedImages[sceneIdx];
        const sceneData = SCENES[sceneIdx];

        // Draw Ken Burns subtle zoom
        const scale = 1.0 + sceneRatio * 0.08;
        const dw = canvas.width * scale;
        const dh = canvas.height * scale;
        const dx = (canvas.width - dw) / 2;
        const dy = (canvas.height - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);

        // Dark gradient overlay on bottom for crisp text
        const grad = ctx.createLinearGradient(0, canvas.height - 240, 0, canvas.height);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.4, 'rgba(10,8,6,0.85)');
        grad.addColorStop(1, 'rgba(10,8,6,0.98)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, canvas.height - 240, canvas.width, 240);

        // Top brand watermark badge
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(40, 35, 340, 42);
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('THE BREW APP • ROASTER ONBOARDING', 55, 62);

        // Scene Badge
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(sceneData.badge, 50, canvas.height - 150);

        // Scene Title
        ctx.fillStyle = '#FDFBF7';
        ctx.font = 'bold 32px serif';
        ctx.fillText(sceneData.title, 50, canvas.height - 105);

        // Scene Subtitle
        ctx.fillStyle = 'rgba(253,251,247,0.85)';
        ctx.font = '18px sans-serif';
        ctx.fillText(sceneData.subtitle, 50, canvas.height - 65);

        // Progress Bar
        const overallProgress = (frame + 1) / totalFrames;
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(0, canvas.height - 8, canvas.width, 8);
        ctx.fillStyle = '#D4A373';
        ctx.fillRect(0, canvas.height - 8, canvas.width * overallProgress, 8);

        // Update progress state every 15 frames
        if (frame % 15 === 0) {
          setExportProgress(Math.round(overallProgress * 100));
        }

        // Yield to allow UI repaint
        await new Promise((r) => setTimeout(r, 1000 / fps));
      }

      recorder.stop();
      await renderComplete;
    } catch (err) {
      console.error('Export video failed:', err);
      alert('Video export could not complete in this browser context: ' + err.message);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const currentSeconds = ((progress / 100) * TOTAL_DURATION).toFixed(0);
  const formattedTime = `0:${currentSeconds.padStart(2, '0')} / 0:${TOTAL_DURATION}`;

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl bg-espresso-950/95 border border-[#A66E38]/40 shadow-2xl overflow-hidden flex flex-col text-cream-light ${className}`}
    >
      {/* Top Video Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-black/50 border-b border-white/10 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-gold">
            Smart Bag Onboarding Journey
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/[0.06] text-cream-soft text-[10px] font-mono border border-white/10">
            4K Photorealistic Walkthrough
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-mono ${
              isMuted
                ? 'bg-white/[0.04] border-white/10 text-cream-soft hover:text-white'
                : 'bg-amber-gold/20 border-amber-gold/40 text-amber-gold'
            }`}
            title={isMuted ? 'Unmute Barista Audio SFX' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          {/* Export Video Button */}
          <button
            onClick={handleExportWebm}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-cream-soft hover:text-white transition flex items-center gap-1.5 text-xs font-mono font-medium disabled:opacity-50"
            title="Render and download high-definition .webm video"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-gold" />
                <span>Exporting {exportProgress}%</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-gold" />
                <span className="hidden sm:inline">Download Video</span>
              </>
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-cream-soft hover:text-white transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 16:9 Video Canvas / Frame */}
      <div className="relative aspect-video w-full bg-black overflow-hidden group select-none flex items-center justify-center">
        
        {/* Layer 1: Background Photographic Scene with Ken Burns Motion */}
        {SCENES.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-0 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                src={scene.image}
                alt={scene.title}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                  isActive && isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Radial gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />
            </div>
          );
        })}

        {/* Layer 2: Interactive Dynamic Overlays per Scene */}
        {currentSceneIndex === 0 && (
          // Scene 1: Label Printer Feed Simulation
          <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-amber-gold/40 text-amber-gold font-mono text-xs backdrop-blur-md animate-fade-in shadow-lg">
            <Printer className="w-4 h-4 animate-bounce" />
            <span>THERMAL FEED: 300 DPI VECTOR QR DISPENSED</span>
          </div>
        )}

        {currentSceneIndex === 1 && (
          // Scene 2: Packaging Alignment Overlay
          <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs backdrop-blur-md animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>ALIGNED: VALVE ADJACENT • TACTILE CRAFT ADHESION</span>
          </div>
        )}

        {currentSceneIndex === 2 && (
          // Scene 3: Camera Scanning HUD
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 border-2 border-dashed border-amber-gold/70 rounded-3xl animate-pulse flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-gold" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-gold" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-gold" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-gold" />

              {/* Animated Laser Scan Bar */}
              <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-amber-gold to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_12px_#D4A373]" />

              <div className="px-3 py-1 rounded-full bg-black/80 border border-amber-gold/50 text-amber-gold font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                Optical Lock: 100%
              </div>
            </div>
          </div>
        )}

        {currentSceneIndex === 3 && (
          // Scene 4: Dial-In Floating Stats
          <div className="absolute top-6 right-6 z-10 hidden md:flex flex-col gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-amber-gold/40 text-amber-gold font-mono text-xs backdrop-blur-md shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>RATIO: 1:16.5 GOLDEN</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-amber-gold/40 text-amber-gold font-mono text-xs backdrop-blur-md shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>WATER: 202°F / 94.4°C</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-amber-gold/40 text-amber-gold font-mono text-xs backdrop-blur-md shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>BLOOM: 45s • 3 POURS</span>
            </div>
          </div>
        )}

        {/* Center Big Play/Pause Splash (Click to toggle) */}
        <button
          onClick={handleTogglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center bg-transparent cursor-pointer group focus:outline-none"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/60 border border-amber-gold/60 backdrop-blur-md flex items-center justify-center text-amber-gold shadow-2xl transition-all duration-300 ${
              isPlaying
                ? 'opacity-0 group-hover:opacity-90 scale-90'
                : 'opacity-100 scale-100 hover:scale-105 hover:bg-black/80'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-9 h-9 sm:w-11 sm:h-11 fill-current" />
            ) : (
              <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current ml-1" />
            )}
          </div>
        </button>

        {/* Prev / Next Floating Scene Chevrons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevScene();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-cream-soft hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition"
          title="Previous Scene"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextScene();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-cream-soft hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition"
          title="Next Scene"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Subtitle / Narration Banner */}
        <div className="absolute bottom-0 inset-x-0 z-15 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
          <div className="max-w-3xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-gold/20 text-amber-gold font-mono text-[10px] sm:text-xs font-bold border border-amber-gold/30">
                {currentScene.badge}
              </span>
              <span className="text-[11px] font-mono text-cream-soft/80">
                Step {currentScene.step} of {SCENES.length}
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-cream-light leading-tight drop-shadow">
              {currentScene.title}
            </h3>
            <p className="text-xs sm:text-sm text-cream-soft/90 line-clamp-2 max-w-2xl font-sans drop-shadow">
              {currentScene.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Scrubber Timeline Bar */}
      <div className="relative w-full bg-black/70 px-4 sm:px-6 pt-3 pb-2 border-t border-white/10 space-y-2">
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleScrubberChange}
            className="w-full h-1.5 sm:h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4A373] focus:outline-none"
            aria-label="Timeline scrubber"
          />
        </div>

        {/* Controls & Time Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-cream-soft">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-amber-gold transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={() => {
                setProgress(0);
                setCurrentSceneIndex(0);
                setSceneProgress(0);
              }}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-cream-soft hover:text-white transition"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono">{formattedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentSceneIndex === 3 && onOpenLiveDemo && (
              <button
                onClick={onOpenLiveDemo}
                className="px-3 py-1 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-bold text-xs flex items-center gap-1.5 shadow transition animate-pulse pointer-events-auto"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Test Dial-In Recipe</span>
              </button>
            )}
            <span className="hidden sm:inline text-[11px] text-cream-soft/60">
              Click any step below to jump
            </span>
          </div>
        </div>
      </div>

      {/* Chapter Steps Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 sm:p-4 bg-black/40 border-t border-white/5">
        {SCENES.map((scene, idx) => {
          const isSelected = idx === currentSceneIndex;
          const IconComponent = scene.icon;

          return (
            <button
              key={scene.id}
              onClick={() => handleJumpToScene(idx)}
              className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-amber-gold/15 border-amber-gold/60 shadow-md ring-1 ring-amber-gold/30'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isSelected ? 'text-amber-gold' : 'text-cream-soft/60'
                  }`}
                >
                  Step {scene.step}
                </span>
                <IconComponent
                  className={`w-4 h-4 ${isSelected ? 'text-amber-gold' : 'text-cream-soft/50'}`}
                />
              </div>

              <div className="font-serif font-bold text-xs sm:text-sm text-cream-light leading-snug line-clamp-1">
                {scene.title}
              </div>

              {/* Mini Scene Progress Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-100 ${
                    isSelected ? 'bg-amber-gold' : idx < currentSceneIndex ? 'bg-amber-gold/40' : 'bg-transparent'
                  }`}
                  style={{
                    width: isSelected ? `${sceneProgress}%` : idx < currentSceneIndex ? '100%' : '0%'
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scene Technical Detail Box */}
      <div className="p-4 sm:p-5 bg-[#17100B] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-gold" />
            <span className="font-mono font-bold text-amber-gold uppercase tracking-wider text-[11px]">
              Roastery Implementation Insight:
            </span>
          </div>
          <p className="text-cream-soft leading-relaxed font-sans text-xs">
            {currentScene.detail}
          </p>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {currentScene.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] font-mono text-cream-light"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
