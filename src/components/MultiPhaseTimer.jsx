import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Timer as TimerIcon, Volume2, VolumeX, Sparkles, CheckCircle2, ChevronLeft, BookOpen, Thermometer } from 'lucide-react';
import { playTimerStartChime, announcePhase, stopSpeechAnnouncement, playPhaseChime, playCompletionChime, stopCompletionChime } from '../utils/audioSynth';
import V60ProTipModal from './V60ProTipModal';

export default function MultiPhaseTimer({ trackMode, activeMethod, dryDoseGrams, unitSystem = 'imperial', isMuted, setIsMuted, onPrevStep, onOpenJournal }) {
  const isCoffee = trackMode === 'coffee';
  const phases = activeMethod?.phases || [];

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0]?.durationSec || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Local muted state synced with prop
  const [localMuted, setLocalMuted] = useState(isMuted ?? false);

  useEffect(() => {
    if (isMuted !== undefined) {
      setLocalMuted(isMuted);
    }
  }, [isMuted]);

  const toggleMute = () => {
    const next = !localMuted;
    setLocalMuted(next);
    if (setIsMuted) {
      setIsMuted(next);
    }
    if (next) {
      stopSpeechAnnouncement();
      stopCompletionChime();
    }
  };

  // Preload speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const activePhase = phases[currentPhaseIndex] || phases[0] || { name: 'Brew Extraction', durationSec: 60, waterMultiplier: 1.0, instruction: 'Begin brewing.' };
  const totalPhaseTime = activePhase?.durationSec || 60;

  // Reset timer when method or track mode changes
  useEffect(() => {
    stopCompletionChime();
    stopSpeechAnnouncement();
    setCurrentPhaseIndex(0);
    setTimeLeft(phases[0]?.durationSec || 60);
    setIsRunning(false);
    setIsAnnouncing(false);
    setIsCompleted(false);
  }, [activeMethod, trackMode]);

  // Main Timer Countdown Loop
  useEffect(() => {
    let interval = null;
    if (isRunning && !isAnnouncing && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && !isAnnouncing && timeLeft === 0) {
      // Phase finish handler
      if (currentPhaseIndex < phases.length - 1) {
        // Move to next phase safely
        const nextIdx = currentPhaseIndex + 1;
        const nextPhase = phases[nextIdx];
        if (nextPhase) {
          setCurrentPhaseIndex(nextIdx);
          setTimeLeft(nextPhase.durationSec || 60);
          playTimerStartChime(localMuted);

          if (!localMuted) {
            setIsAnnouncing(true);
            setAnnouncementText(`${nextPhase.name}, ${nextPhase.durationSec}s`);
            announcePhase(nextPhase.name, nextPhase.durationSec, localMuted, () => {
              setIsAnnouncing(false);
            });
          }
        } else {
          playCompletionChime(localMuted);
          setIsRunning(false);
          setIsCompleted(true);
        }
      } else {
        // All phases complete!
        playCompletionChime(localMuted);
        setIsRunning(false);
        setIsCompleted(true);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, isAnnouncing, timeLeft, currentPhaseIndex, phases, localMuted]);

  // Toggle Timer Handler (Start / Announce / Pause / Resume)
  const handleToggleTimer = () => {
    if (isRunning || isAnnouncing) {
      // Pause
      setIsRunning(false);
      setIsAnnouncing(false);
      stopSpeechAnnouncement();
    } else {
      // Start or Resume
      if (isCompleted) {
        setIsCompleted(false);
        setCurrentPhaseIndex(0);
        setTimeLeft(phases[0]?.durationSec || 60);
      }

      // 1. Play real mechanical timer bell chime
      playTimerStartChime(localMuted);

      // 2. Announce phase name and seconds (e.g. "Bloom Phase, 45 seconds") before counting down
      const phaseDuration = activePhase?.durationSec || 60;
      const isFreshPhase = timeLeft === phaseDuration;

      if (!localMuted && isFreshPhase) {
        setIsAnnouncing(true);
        const nameToSay = activePhase?.name || 'Bloom Phase';
        setAnnouncementText(`${nameToSay}, ${phaseDuration}s`);

        announcePhase(nameToSay, phaseDuration, localMuted, () => {
          setIsAnnouncing(false);
          setIsRunning(true);
        });
      } else {
        setIsAnnouncing(false);
        setIsRunning(true);
      }
    }
  };

  // Skip Phase handler
  const handleSkipPhase = () => {
    stopSpeechAnnouncement();
    setIsAnnouncing(false);
    if (currentPhaseIndex < phases.length - 1) {
      const nextIdx = currentPhaseIndex + 1;
      const nextPhase = phases[nextIdx];
      if (nextPhase) {
        setCurrentPhaseIndex(nextIdx);
        setTimeLeft(nextPhase.durationSec || 60);
        playTimerStartChime(localMuted);

        if (!localMuted) {
          setIsAnnouncing(true);
          setAnnouncementText(`${nextPhase.name}, ${nextPhase.durationSec}s`);
          announcePhase(nextPhase.name, nextPhase.durationSec, localMuted, () => {
            setIsAnnouncing(false);
            setIsRunning(true);
          });
        } else {
          setIsRunning(true);
        }
      } else {
        setIsRunning(false);
        setIsCompleted(true);
      }
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  };

  // Reset Timer handler
  const handleReset = () => {
    stopCompletionChime();
    stopSpeechAnnouncement();
    setIsAnnouncing(false);
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentPhaseIndex(0);
    setTimeLeft(phases[0]?.durationSec || 60);
  };

  // Format MM:SS display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  const strokeDashoffset = totalPhaseTime > 0 
    ? ((totalPhaseTime - timeLeft) / totalPhaseTime) * (2 * Math.PI * 80)
    : 0;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const targetPhaseWaterMl = activePhase?.waterMultiplier ? Math.round(dryDoseGrams * activePhase.waterMultiplier) : null;

  const isPourOver = activeMethod?.id === 'pour_over' || activeMethod?.id === 'chemex' || activeMethod?.id === 'classic_pour_over';
  const [isProTipOpen, setIsProTipOpen] = useState(false);

  return (
    <div className={`p-8 md:p-10 lg:p-12 rounded-3xl ${
      isCoffee ? 'glass-panel-coffee border-[#A66E38]/40' : 'glass-panel-tea border-sage-500/40'
    } shadow-2xl transition-all duration-500 relative overflow-hidden`}>
      
      {/* Background Radial Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isCoffee ? 'bg-[#A66E38]/10' : 'bg-emerald-500/10'
      }`} />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10 relative z-10">
        <div>
          <div className={`inline-flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] mb-1.5 ${
            isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Step 04 of 04 • Multi-Phase Extraction Timer</span>
          </div>

          <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md">
            {activeMethod?.name || 'Guided Extraction'}
          </h3>
          <p className="text-xs md:text-sm text-stone-300 mt-1">
            Phase {currentPhaseIndex + 1} of {phases.length || 1}: <strong className="text-cream-light font-bold">{activePhase?.name}</strong>
          </p>
        </div>

        {/* Status Badge & Speaker / Mute Toggle Column */}
        <div className="flex flex-col items-end gap-2.5">
          {/* Status Badge */}
          <div>
            {isCompleted ? (
              <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Extraction Complete! ☕</span>
              </span>
            ) : isAnnouncing ? (
              <span className="px-4 py-2 rounded-2xl bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 font-mono font-bold text-xs flex items-center gap-2 shadow-lg animate-pulse">
                <Volume2 className="w-4 h-4 text-indigo-400 animate-bounce" />
                <span>Announcing: {announcementText || activePhase?.name}</span>
              </span>
            ) : isRunning ? (
              <span className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>Pouring in Progress</span>
              </span>
            ) : (
              <span className="px-4 py-2 rounded-2xl bg-white/10 text-stone-300 border border-white/15 font-mono font-bold text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Timer Ready</span>
              </span>
            )}
          </div>

          {/* Speaker / Mute Button Under Timer Ready Box */}
          <button
            onClick={toggleMute}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
              localMuted
                ? 'bg-rose-500/15 border-rose-500/35 text-rose-300 hover:bg-rose-500/25 shadow-rose-900/20'
                : 'bg-white/10 border-white/15 text-stone-300 hover:text-cream-light hover:bg-white/20'
            }`}
            title={localMuted ? "Unmute Timer Chime & Voice Guidance" : "Mute Timer Chime & Voice Guidance"}
          >
            {localMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span>Audio: Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Audio: On</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 my-6 relative z-10">
        
        {/* Circular Countdown Ring - Clickable to Start / Chime / Pause */}
        <div 
          onClick={handleToggleTimer}
          className="relative w-56 h-56 flex items-center justify-center flex-shrink-0 cursor-pointer group select-none transition-transform active:scale-95"
          title={isRunning || isAnnouncing ? "Click to Pause Timer" : "Click to Chime & Start Countdown"}
        >
          <svg className="w-full h-full transform -rotate-90 group-hover:scale-102 transition-transform duration-300" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="text-white/10 group-hover:text-white/15 transition-colors"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Fill */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className={`transition-all duration-500 ${
                isCoffee ? 'text-[#D2A06E]' : 'text-sage-400'
              } drop-shadow-[0_0_12px_rgba(210,160,110,0.3)]`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-5xl font-black text-cream-light tracking-tight drop-shadow-lg group-hover:text-amber-300 transition-colors">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 mt-1 font-semibold">
              {isAnnouncing ? (
                <span className="text-amber-300 animate-pulse">Announcing...</span>
              ) : (
                activePhase?.name
              )}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
              {isRunning || isAnnouncing ? 'Click to Pause' : 'Click to Chime & Start'}
            </span>
          </div>
        </div>

        {/* Phase Instruction & Active Target Pour Box */}
        <div className="max-w-md w-full space-y-4 text-center lg:text-left">
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 shadow-inner space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-extrabold flex items-center justify-center lg:justify-start gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
              <span>Active Extraction Instruction</span>
            </div>
            
            <p className="text-sm md:text-base text-cream-light font-medium leading-relaxed">
              {activePhase?.instruction || 'Follow standard extraction pulse pouring technique.'}
            </p>
          </div>

          {/* Target Water Pour & Water Temp Indicator */}
          {targetPhaseWaterMl && (
            <div className="space-y-2">
              <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono font-bold shadow-md ${
                isCoffee
                  ? 'bg-[#A66E38]/15 text-[#D2A06E] border-[#A66E38]/30'
                  : 'bg-sage-500/15 text-sage-300 border-sage-500/30'
              }`}>
                <span>Target Pour Water:</span>
                <span className="text-cream-light text-sm font-black">
                  ~{targetPhaseWaterMl} mL ({Math.round(targetPhaseWaterMl / 29.5735 * 10) / 10} fl oz)
                </span>
              </div>

              {/* Water Temperature Indicator */}
              {(activeMethod?.tempC || activeMethod?.tempF) && (
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-mono font-bold shadow-md ${
                  isCoffee
                    ? 'bg-[#A66E38]/15 text-[#D2A06E] border-[#A66E38]/30'
                    : 'bg-sage-500/15 text-sage-300 border-sage-500/30'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Water Temp:</span>
                  </div>
                  <span className="text-cream-light font-black">
                    {unitSystem === 'metric'
                      ? `${activeMethod?.tempC || 93}°C (${activeMethod?.tempF || 200}°F)`
                      : `${activeMethod?.tempF || 200}°F (${activeMethod?.tempC || 93}°C)`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Timer Controls Row with Tactile 3D Buttons */}
      <div className="flex items-center justify-center space-x-5 mt-8">
        
        <button
          onClick={handleReset}
          className="p-4 rounded-2xl bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95 cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleToggleTimer}
          className={`px-10 py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isRunning || isAnnouncing
              ? 'bg-amber-600 text-cream-light border border-amber-500 shadow-amber-600/30'
              : isCoffee
              ? 'btn-tactile-coffee text-[#140C08]'
              : 'btn-tactile-tea text-white'
          }`}
        >
          {isRunning || isAnnouncing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isAnnouncing ? 'Announcing...' : isRunning ? 'Pause Timer' : 'Start Extraction'}</span>
        </button>

        <button
          onClick={handleSkipPhase}
          className="p-4 rounded-2xl bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95 cursor-pointer"
          title="Skip to Next Phase"
        >
          <FastForward className="w-5 h-5" />
        </button>

      </div>

      {/* Phase Roadmap Progress Timeline */}
      <div className="mt-10 pt-8 border-t border-white/[0.08]">
        <label className={`block text-[11px] font-mono uppercase tracking-[0.2em] font-extrabold mb-4 ${
          isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
        }`}>
          Extraction Phase Roadmap:
        </label>
        
        <div className="space-y-3">
          {phases.map((phase, idx) => {
            const isPast = idx < currentPhaseIndex || isCompleted;
            const isCurrent = idx === currentPhaseIndex && !isCompleted;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  isCurrent
                    ? isCoffee
                      ? 'bg-[#A66E38]/20 border-[#C48B56]/60 text-cream-light font-bold shadow-lg shadow-[#A66E38]/10 backdrop-blur-md'
                      : 'bg-emerald-500/20 border-emerald-400/60 text-cream-light font-bold shadow-lg shadow-emerald-500/10 backdrop-blur-md'
                    : isPast
                    ? 'bg-white/[0.03] border-white/[0.04] text-stone-500 line-through'
                    : 'bg-[#120F0D] border-white/[0.08] text-stone-300 shadow'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-extrabold shadow ${
                    isCurrent
                      ? isCoffee
                        ? 'bg-[#C48B56] text-[#140C08]'
                        : 'bg-sage-300 text-slate-950'
                      : 'bg-slate-800 text-stone-400 border border-white/10'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold">{phase.name}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[11px] bg-black/50 px-3 py-1 rounded-xl border border-white/10 font-bold shadow-inner text-cream-light">
                    {formatDuration(phase.durationSec)}
                  </span>
                  {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contextual Amazon Affiliate Recommendation Box */}
      <div className="mt-8 p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-stone-300">
          <TimerIcon className={`w-4 h-4 flex-shrink-0 animate-pulse ${
            isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`} />
          <span>Precision extractions require electric gooseneck kettles with built-in timers & degree PID control (Fellow Stagg EKG, COSORI Smart Kettle).</span>
        </div>
        <a
          href="https://www.amazon.com/s?k=Electric+Gooseneck+Kettle+with+Timer+and+Variable+Temperature&tag=thebrewapp13-20"
          target="_blank"
          rel="nofollow sponsored noopener"
          data-product-name="Electric Gooseneck Kettles with Timers"
          data-link-id="gooseneck_kettles_with_timers"
          data-context="step4_guided_timer_kettle"
          className={`px-4 py-2 rounded-xl border font-extrabold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0 ${
            isCoffee
              ? 'bg-[#A66E38]/20 text-[#D2A06E] hover:bg-[#A66E38]/30 border-[#A66E38]/40'
              : 'bg-sage-500/20 text-sage-300 hover:bg-sage-500/30 border-sage-500/40'
          }`}
        >
          Check Kettles with Timers on Amazon ↗
        </a>
      </div>

      {/* Step Navigation & Journal Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-white/[0.08]">
        {onPrevStep && (
          <button
            onClick={onPrevStep}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-white/[0.08] text-cream-light font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 hover:bg-white/[0.15] transition-all border border-white/[0.12]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Step 03: Grind & Specs</span>
          </button>
        )}

        {onOpenJournal && (
          <button
            onClick={onOpenJournal}
            className={`w-full sm:w-auto py-4 px-9 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all ${
              isCoffee ? 'btn-tactile-coffee text-[#140C08]' : 'btn-tactile-tea text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Log This Brew to Journal</span>
          </button>
        )}
      </div>

      {/* V60 Pro Tip Masterclass Modal Popup */}
      <V60ProTipModal
        isOpen={isProTipOpen}
        onClose={() => setIsProTipOpen(false)}
      />

    </div>
  );
}
