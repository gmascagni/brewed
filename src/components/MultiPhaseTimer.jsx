import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, FastForward, Timer as TimerIcon, Volume2, VolumeX, Sparkles, CheckCircle2, ChevronLeft, BookOpen, Thermometer } from 'lucide-react';
import { playTimerStartChime, announcePhase, stopSpeechAnnouncement, playPhaseChime, playCompletionChime, stopCompletionChime, unlockAudio } from '../utils/audioSynth';
import V60ProTipModal from './V60ProTipModal';

export default function MultiPhaseTimer({ trackMode, activeMethod, dryDoseGrams, unitSystem = 'imperial', isMuted, setIsMuted, onPrevStep, onOpenJournal }) {
  const isCoffee = trackMode === 'coffee';

  // Default fallback phases if method phases are not loaded
  const defaultPhases = [
    { name: 'Bloom Phase', durationSec: 45, waterMultiplier: 3, instruction: 'Saturate grounds evenly in gentle circular motions. Allow bed to expand and de-gas.' },
    { name: 'Main Concentric Pour', durationSec: 60, waterMultiplier: 0.6, instruction: 'Pour in steady spirals from center outward. Maintain consistent slurry level.' },
    { name: 'Final Drawdown', durationSec: 60, waterMultiplier: 1.0, instruction: 'Gently top up remaining water in center. Allow full even drawdown.' }
  ];

  const rawPhases = activeMethod?.phases && activeMethod.phases.length > 0 ? activeMethod.phases : defaultPhases;
  const phases = rawPhases;

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0]?.durationSec || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Local muted state synced with prop
  const [localMuted, setLocalMuted] = useState(isMuted ?? false);

  // High-precision timing refs to prevent drift and guarantee mobile background wake resilience
  const endTimeRef = useRef(null);
  const remainingAtPauseRef = useRef(null);
  const currentPhaseIndexRef = useRef(0);
  const phasesRef = useRef(phases);

  useEffect(() => {
    currentPhaseIndexRef.current = currentPhaseIndex;
  }, [currentPhaseIndex]);

  useEffect(() => {
    phasesRef.current = phases;
  }, [phases]);

  useEffect(() => {
    if (isMuted !== undefined) {
      setLocalMuted(isMuted);
    }
  }, [isMuted]);

  const toggleMute = () => {
    unlockAudio();
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
      try {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            try { window.speechSynthesis.getVoices(); } catch (e) {}
          };
        }
      } catch (e) {}
    }
  }, []);

  const activePhase = phases[currentPhaseIndex] || phases[0] || defaultPhases[0];
  const totalPhaseTime = activePhase?.durationSec || 60;

  // Reset timer when method or track mode changes
  useEffect(() => {
    stopCompletionChime();
    stopSpeechAnnouncement();
    setCurrentPhaseIndex(0);
    currentPhaseIndexRef.current = 0;
    const initialTime = phases[0]?.durationSec || 60;
    setTimeLeft(initialTime);
    endTimeRef.current = null;
    remainingAtPauseRef.current = null;
    setIsRunning(false);
    setIsAnnouncing(false);
    setIsCompleted(false);
  }, [activeMethod?.id, trackMode]);

  // Advance to next phase safely or complete extraction
  const handlePhaseAdvance = useCallback(() => {
    const currentIdx = currentPhaseIndexRef.current;
    const activePhases = phasesRef.current;

    if (currentIdx < activePhases.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextPhase = activePhases[nextIdx];
      const nextDuration = nextPhase?.durationSec || 60;

      setCurrentPhaseIndex(nextIdx);
      currentPhaseIndexRef.current = nextIdx;
      setTimeLeft(nextDuration);
      endTimeRef.current = Date.now() + nextDuration * 1000;
      remainingAtPauseRef.current = null;

      // Bell chime for phase transition
      playTimerStartChime(localMuted);

      if (!localMuted) {
        setIsAnnouncing(true);
        const nameToSay = nextPhase?.name || `Phase ${nextIdx + 1}`;
        setAnnouncementText(`${nameToSay}, ${nextDuration}s`);
        announcePhase(nameToSay, nextDuration, localMuted, () => {
          setIsAnnouncing(false);
        });
      }
    } else {
      // All phases complete!
      setIsRunning(false);
      setIsAnnouncing(false);
      setIsCompleted(true);
      endTimeRef.current = null;
      remainingAtPauseRef.current = null;
      playCompletionChime(localMuted);
    }
  }, [localMuted]);

  // Main High-Precision Countdown Loop (Wall-clock accurate, immune to background mobile sleep)
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const diffSec = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));

      setTimeLeft(diffSec);

      if (diffSec <= 0) {
        handlePhaseAdvance();
      }
    };

    tick();
    const intervalId = setInterval(tick, 250);

    return () => clearInterval(intervalId);
  }, [isRunning, handlePhaseAdvance]);

  // Toggle Timer Handler (Start / Resume / Pause)
  const handleToggleTimer = () => {
    unlockAudio();

    if (isRunning) {
      // Pause action
      setIsRunning(false);
      setIsAnnouncing(false);
      stopSpeechAnnouncement();

      if (endTimeRef.current) {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        remainingAtPauseRef.current = remaining;
        setTimeLeft(remaining);
      }
    } else {
      // Start or Resume action
      let secondsToRun = timeLeft;

      if (isCompleted) {
        setIsCompleted(false);
        setCurrentPhaseIndex(0);
        currentPhaseIndexRef.current = 0;
        secondsToRun = phases[0]?.durationSec || 60;
        setTimeLeft(secondsToRun);
        remainingAtPauseRef.current = null;
      } else if (remainingAtPauseRef.current !== null && remainingAtPauseRef.current > 0) {
        secondsToRun = remainingAtPauseRef.current;
      } else if (timeLeft <= 0) {
        secondsToRun = activePhase?.durationSec || 60;
        setTimeLeft(secondsToRun);
      }

      // 1. Play authentic barista bell chime immediately
      playTimerStartChime(localMuted);

      // 2. Set wall-clock target timestamp
      endTimeRef.current = Date.now() + secondsToRun * 1000;
      remainingAtPauseRef.current = null;

      // 3. Mark running immediately - NEVER BLOCK COUNTDOWN
      setIsRunning(true);

      // 4. Asynchronous Spoken Voice Guidance ("Bloom Phase, 45 seconds")
      const phaseDuration = activePhase?.durationSec || 60;
      const isFreshPhase = secondsToRun === phaseDuration;

      if (!localMuted && isFreshPhase) {
        setIsAnnouncing(true);
        const nameToSay = activePhase?.name || 'Bloom Phase';
        setAnnouncementText(`${nameToSay}, ${phaseDuration}s`);

        announcePhase(nameToSay, phaseDuration, localMuted, () => {
          setIsAnnouncing(false);
        });
      } else {
        setIsAnnouncing(false);
      }
    }
  };

  // Skip Phase handler
  const handleSkipPhase = () => {
    unlockAudio();
    stopSpeechAnnouncement();
    setIsAnnouncing(false);

    const currentIdx = currentPhaseIndex;
    if (currentIdx < phases.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextPhase = phases[nextIdx];
      const nextDuration = nextPhase?.durationSec || 60;

      setCurrentPhaseIndex(nextIdx);
      currentPhaseIndexRef.current = nextIdx;
      setTimeLeft(nextDuration);
      playTimerStartChime(localMuted);

      if (isRunning) {
        endTimeRef.current = Date.now() + nextDuration * 1000;
        remainingAtPauseRef.current = null;
      } else {
        remainingAtPauseRef.current = nextDuration;
      }

      if (!localMuted) {
        setIsAnnouncing(true);
        const nameToSay = nextPhase?.name || `Phase ${nextIdx + 1}`;
        setAnnouncementText(`${nameToSay}, ${nextDuration}s`);
        announcePhase(nameToSay, nextDuration, localMuted, () => {
          setIsAnnouncing(false);
        });
      }
    } else {
      setIsRunning(false);
      setIsCompleted(true);
      endTimeRef.current = null;
      remainingAtPauseRef.current = null;
      playCompletionChime(localMuted);
    }
  };

  // Reset Timer handler
  const handleReset = () => {
    unlockAudio();
    stopCompletionChime();
    stopSpeechAnnouncement();
    setIsAnnouncing(false);
    setIsRunning(false);
    setIsCompleted(false);
    endTimeRef.current = null;
    remainingAtPauseRef.current = null;
    setCurrentPhaseIndex(0);
    currentPhaseIndexRef.current = 0;
    setTimeLeft(phases[0]?.durationSec || 60);
  };

  // Format MM:SS display
  const formatTime = (seconds) => {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = totalPhaseTime > 0 
    ? ((totalPhaseTime - timeLeft) / totalPhaseTime) * circumference
    : 0;

  const targetPhaseWaterMl = (dryDoseGrams > 0 && activePhase?.waterMultiplier) 
    ? Math.round(dryDoseGrams * activePhase.waterMultiplier) 
    : null;

  const [isProTipOpen, setIsProTipOpen] = useState(false);

  return (
    <div className={`p-5 sm:p-8 md:p-10 lg:p-12 rounded-3xl ${
      isCoffee ? 'glass-panel-coffee border-[#A66E38]/40' : 'glass-panel-tea border-sage-500/40'
    } shadow-2xl transition-all duration-500 relative overflow-hidden`}>
      
      {/* Background Radial Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isCoffee ? 'bg-[#A66E38]/10' : 'bg-emerald-500/10'
      }`} />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10 relative z-10">
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
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5">
          {/* Status Badge */}
          <div>
            {isCompleted ? (
              <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Extraction Complete! ☕</span>
              </span>
            ) : isRunning ? (
              <span className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>Pouring in Progress</span>
              </span>
            ) : (!isRunning && remainingAtPauseRef.current !== null && timeLeft < totalPhaseTime) ? (
              <span className="px-4 py-2 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono font-bold text-xs flex items-center gap-1.5 shadow-md">
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Timer Paused</span>
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
            type="button"
            onClick={toggleMute}
            style={{ touchAction: 'manipulation' }}
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
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 my-6 relative z-10">
        
        {/* Circular Countdown Ring - Clickable to Start / Chime / Pause */}
        <div 
          onClick={handleToggleTimer}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleToggleTimer();
            }
          }}
          style={{ touchAction: 'manipulation' }}
          className="relative w-56 h-56 flex items-center justify-center flex-shrink-0 cursor-pointer group select-none transition-transform active:scale-95"
          title={isRunning ? "Click to Pause Timer" : "Click to Chime & Start Countdown"}
          aria-label={isRunning ? "Pause extraction timer" : "Start extraction timer"}
        >
          <svg className="w-full h-full transform -rotate-90 pointer-events-none group-hover:scale-102 transition-transform duration-300" viewBox="0 0 200 200">
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
              className={`transition-all duration-300 ${
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className={`font-mono text-5xl font-black tracking-tight drop-shadow-lg transition-colors ${
              isRunning ? 'text-amber-300' : 'text-cream-light group-hover:text-amber-300'
            }`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 mt-1 font-semibold px-2 truncate max-w-[180px]">
              {isAnnouncing ? (
                <span className="text-amber-300 animate-pulse flex items-center justify-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>{activePhase?.name}</span>
                </span>
              ) : (
                activePhase?.name
              )}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {isRunning ? 'Tap to Pause' : 'Tap to Chime & Start'}
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

            {/* Subtle Voice Announcement Notice */}
            {isAnnouncing && announcementText && (
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-amber-300/90 animate-pulse">
                <Volume2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Voice Guidance: "{announcementText}"</span>
              </div>
            )}
          </div>

          {/* Target Water Pour & Water Temp Indicator */}
          {(targetPhaseWaterMl || activeMethod?.tempC || activeMethod?.tempF) && (
            <div className="space-y-2">
              {targetPhaseWaterMl && (
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
              )}

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
      <div className="flex items-center justify-center space-x-3 sm:space-x-5 mt-8">
        
        <button
          type="button"
          onClick={handleReset}
          style={{ touchAction: 'manipulation' }}
          className="p-4 rounded-2xl bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95 cursor-pointer"
          title="Reset Timer"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleToggleTimer}
          style={{ touchAction: 'manipulation' }}
          className={`px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isRunning
              ? 'bg-amber-600 text-cream-light border border-amber-500 shadow-amber-600/30'
              : isCoffee
              ? 'btn-tactile-coffee text-[#140C08]'
              : 'btn-tactile-tea text-white'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Pause Timer' : (!isRunning && remainingAtPauseRef.current !== null && timeLeft < totalPhaseTime) ? 'Resume Timer' : 'Start Extraction'}</span>
        </button>

        <button
          type="button"
          onClick={handleSkipPhase}
          style={{ touchAction: 'manipulation' }}
          className="p-4 rounded-2xl bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95 cursor-pointer"
          title="Skip to Next Phase"
          aria-label="Skip to Next Phase"
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
            type="button"
            onClick={onPrevStep}
            style={{ touchAction: 'manipulation' }}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-white/[0.08] text-cream-light font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 hover:bg-white/[0.15] transition-all border border-white/[0.12]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Step 03: Grind & Specs</span>
          </button>
        )}

        {onOpenJournal && (
          <button
            type="button"
            onClick={onOpenJournal}
            style={{ touchAction: 'manipulation' }}
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

