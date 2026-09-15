import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Timer as TimerIcon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  BookOpen, 
  Thermometer, 
  Scale,
  Check,
  X,
  ArrowRight
} from 'lucide-react';
import { 
  playTimerStartChime, 
  announcePhase, 
  speakActiveInstruction,
  stopSpeechAnnouncement, 
  playPhaseChime, 
  playCompletionChime, 
  stopCompletionChime, 
  unlockAudio,
  playClockTick,
  playMechanicalClick
} from '../utils/audioSynth';
import { requestScreenWakeLock, releaseScreenWakeLock } from '../utils/wakeLock';
import { hapticStart, hapticPhaseChange, hapticComplete, hapticTap } from '../utils/haptics';
import { getBloomScalingMetrics, BLOOM_SCALING_TABLE } from '../utils/bloomScaling';
import V60ProTipModal from './V60ProTipModal';
import { logBrewSession } from '../utils/journalStorage';
import { getSavedGrinderId, getGrinderSetting } from '../data/grinderProfiles';
import { calculateClosedLoopDialIn, formatSecondsToMmSs, METHOD_DRAWDOWN_TARGETS } from '../utils/dialInEngine';

export default function MultiPhaseTimer({ 
  trackMode, 
  activeMethod, 
  dryDoseGrams, 
  unitSystem = 'imperial', 
  isMuted, 
  setIsMuted, 
  onPrevStep, 
  onOpenJournal,
  dialedInCoffee = null,
  totalWaterMl = null,
  customRatio = null,
  onApplyNextBrewTweak = null
}) {
  const isCoffee = trackMode === 'coffee';

  // Default fallback phases if method phases are not loaded
  const defaultPhases = [
    { name: 'Bloom Phase', durationSec: 45, waterMultiplier: 3, instruction: 'Saturate grounds evenly in gentle circular motions. Allow bed to expand and de-gas.' },
    { name: 'Main Concentric Pour', durationSec: 60, waterMultiplier: 0.6, instruction: 'Pour in steady spirals from center outward. Maintain consistent slurry level.' },
    { name: 'Final Drawdown', durationSec: 60, waterMultiplier: 1.0, instruction: 'Gently top up remaining water in center. Allow full even drawdown.' }
  ];

  const rawPhases = activeMethod?.phases && activeMethod.phases.length > 0 ? activeMethod.phases : defaultPhases;

  // The Two Scaling Variables: Small Dose (12–15g), Standard Dose (20–30g), Large Dose (45–60g+)
  const effectiveDose = Math.max(8, Number(dryDoseGrams) || 18);
  const bloomMetrics = getBloomScalingMetrics(effectiveDose);

  // Scaled dynamic phases based on active dose
  const phases = useMemo(() => {
    return rawPhases.map((phase, idx) => {
      const isBloom = idx === 0 || (phase.name && phase.name.toLowerCase().includes('bloom'));
      if (isBloom && isCoffee) {
        return {
          ...phase,
          durationSec: bloomMetrics.durationSec,
          waterGrams: bloomMetrics.targetWaterGrams,
          waterRangeStr: bloomMetrics.waterRangeStr,
          timeRangeStr: bloomMetrics.bloomTimeRange,
          tierName: bloomMetrics.tierName,
          doseRange: bloomMetrics.doseRange,
          instruction: `Saturate grounds evenly with ${bloomMetrics.targetWaterGrams}g water (${bloomMetrics.waterRangeStr}). Let coffee bloom and de-gas for ${bloomMetrics.durationSec}s.`
        };
      }
      return phase;
    });
  }, [rawPhases, effectiveDose, isCoffee, bloomMetrics]);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0]?.durationSec || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [tasteFeedback, setTasteFeedback] = useState(null); // 'sour' | 'sweet' | 'bitter'
  const [isSavedToLog, setIsSavedToLog] = useState(false);
  const [isEvaluationSkipped, setIsEvaluationSkipped] = useState(false);

  // Closed-Loop Recipe Adjustment (Dial-In Engine) State
  const scheduledTotalDurationSec = useMemo(() => {
    return phases.reduce((acc, p) => acc + (p.durationSec || 0), 0);
  }, [phases]);

  const [actualDrawdownSec, setActualDrawdownSec] = useState(() => {
    return phases.reduce((acc, p) => acc + (p.durationSec || 0), 0);
  });
  const brewStartedTimeRef = useRef(null);

  // Synchronize initial default drawdown duration when method / dose changes
  useEffect(() => {
    if (!isRunning && !isCompleted) {
      setActualDrawdownSec(scheduledTotalDurationSec);
    }
  }, [scheduledTotalDurationSec, isRunning, isCompleted]);

  // Dynamic Closed-Loop Dial-In Engine calculation
  const dialInDiagnosis = useMemo(() => {
    if (!isCompleted || !tasteFeedback) return null;
    const savedGrinderId = getSavedGrinderId();
    const ratio = customRatio || activeMethod?.ratio || 16;
    const tempF = dialedInCoffee?.tempF || activeMethod?.tempF || 204;
    const currentGrind = dialedInCoffee?.recommendedGrind || activeMethod?.grind || 'Medium-Fine';

    return calculateClosedLoopDialIn({
      methodId: activeMethod?.id || 'pour_over',
      actualDrawdownSec: actualDrawdownSec,
      tasteProfile: tasteFeedback,
      currentTempF: tempF,
      currentRatio: ratio,
      currentGrindSetting: currentGrind,
      grinderId: savedGrinderId
    });
  }, [isCompleted, tasteFeedback, actualDrawdownSec, customRatio, activeMethod, dialedInCoffee]);

  // Local muted state synced with prop
  const [localMuted, setLocalMuted] = useState(isMuted ?? false);

  // High-precision timing refs to prevent drift and guarantee mobile background wake resilience
  const endTimeRef = useRef(null);
  const remainingAtPauseRef = useRef(null);
  const currentPhaseIndexRef = useRef(0);
  const phasesRef = useRef(phases);
  const lastTickedSecRef = useRef(null);
  // Track which phases have already spoken during this brew session
  const announcedPhasesRef = useRef(new Set());

  useEffect(() => {
    currentPhaseIndexRef.current = currentPhaseIndex;
  }, [currentPhaseIndex]);

  useEffect(() => {
    phasesRef.current = phases;
  }, [phases]);

  // Keep timeLeft in sync when not running and phases duration changes (e.g. dose scaling)
  useEffect(() => {
    if (!isRunning && remainingAtPauseRef.current === null) {
      const activeDuration = phases[currentPhaseIndex]?.durationSec || 60;
      setTimeLeft(activeDuration);
    }
  }, [phases, currentPhaseIndex, isRunning]);

  useEffect(() => {
    if (isMuted !== undefined) {
      setLocalMuted(isMuted);
    }
  }, [isMuted]);

  const toggleMute = () => {
    unlockAudio();
    playMechanicalClick(false); // Tactile click feedback on mute/unmute
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

  const isBloomPhase = (currentPhaseIndex === 0 || activePhase?.name?.toLowerCase().includes('bloom')) && isCoffee;

  const targetPhaseWaterMl = (() => {
    if (!isCoffee) return null;
    if (isBloomPhase) {
      return bloomMetrics.targetWaterGrams;
    }
    if (activePhase?.waterGrams) {
      return activePhase.waterGrams;
    }
    if (activePhase?.waterMultiplier && effectiveDose) {
      return Math.round(effectiveDose * (activeMethod?.ratio || 16) * (activePhase.waterMultiplier || 1));
    }
    return null;
  })();

  // Reset timer when method, track mode, or dry dose changes
  useEffect(() => {
    stopCompletionChime();
    stopSpeechAnnouncement();
    setCurrentPhaseIndex(0);
    currentPhaseIndexRef.current = 0;
    announcedPhasesRef.current.clear();
    const initialTime = phases[0]?.durationSec || 60;
    setTimeLeft(initialTime);
    endTimeRef.current = null;
    remainingAtPauseRef.current = null;
    setIsRunning(false);
    setIsAnnouncing(false);
    setIsCompleted(false);
  }, [activeMethod?.id, trackMode, dryDoseGrams]);

  // Release wake lock safely on unmount
  useEffect(() => {
    return () => {
      releaseScreenWakeLock();
    };
  }, []);

  // Advance to next phase safely or complete extraction
  const handlePhaseAdvance = useCallback(() => {
    lastTickedSecRef.current = null;
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

      // Bell chime for phase transition + mobile haptic feedback
      playTimerStartChime(localMuted);
      hapticPhaseChange();

      if (!localMuted) {
        announcedPhasesRef.current.add(nextIdx);
        setIsAnnouncing(true);
        const nameToSay = nextPhase?.name || `Phase ${nextIdx + 1}`;
        const instructionToSay = nextPhase?.instruction || '';
        setAnnouncementText(instructionToSay || nameToSay);
        announcePhase(
          nameToSay, 
          nextDuration, 
          localMuted, 
          () => {
            setIsAnnouncing(false);
          },
          instructionToSay,
          activeMethod?.id,
          nextIdx
        );
      }
    } else {
      // All phases complete!
      setIsRunning(false);
      setIsAnnouncing(false);
      setIsCompleted(true);
      const totalPlanned = phases.reduce((acc, p) => acc + (p.durationSec || 0), 0);
      const elapsedTotal = brewStartedTimeRef.current 
        ? Math.round((Date.now() - brewStartedTimeRef.current) / 1000) 
        : totalPlanned;
      setActualDrawdownSec(elapsedTotal > 30 && elapsedTotal < 900 ? elapsedTotal : totalPlanned);
      endTimeRef.current = null;
      remainingAtPauseRef.current = null;
      releaseScreenWakeLock();
      hapticComplete();
      playCompletionChime(localMuted);
    }
  }, [localMuted, phases]);

  // Main High-Precision Countdown Loop (Wall-clock accurate, immune to background mobile sleep)
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const diffSec = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));

      // Play authentic mechanical clockwork tick on every second of countdown
      if (lastTickedSecRef.current !== diffSec) {
        lastTickedSecRef.current = diffSec;
        playClockTick(localMuted);
      }

      if (diffSec <= 0) {
        handlePhaseAdvance();
      } else {
        setTimeLeft(diffSec);
      }
    };

    // Run tick immediately on effect invocation
    tick();

    // High frequency interval (100ms) to ensure no sub-second stutter or frame dropping
    const intervalId = setInterval(tick, 100);

    return () => clearInterval(intervalId);
  }, [isRunning, handlePhaseAdvance, localMuted]);

  // Toggle Timer Handler (Start / Resume / Pause)
  const handleToggleTimer = () => {
    unlockAudio();
    playMechanicalClick(localMuted);

    if (isRunning) {
      // Pause action
      setIsRunning(false);
      setIsAnnouncing(false);
      stopSpeechAnnouncement();
      releaseScreenWakeLock();
      hapticTap();

      if (endTimeRef.current) {
        const now = Date.now();
        const rem = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
        remainingAtPauseRef.current = rem;
        setTimeLeft(rem);
      }
    } else {
      // Start or Resume action: Request screen wake lock & trigger start haptic vibration
      requestScreenWakeLock();
      hapticStart();

      if (!brewStartedTimeRef.current) {
        brewStartedTimeRef.current = Date.now();
      }

      let secondsToRun = timeLeft;

      if (isCompleted) {
        setIsCompleted(false);
        setTasteFeedback(null);
        setIsSavedToLog(false);
        setIsEvaluationSkipped(false);
        setCurrentPhaseIndex(0);
        currentPhaseIndexRef.current = 0;
        announcedPhasesRef.current.clear();
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
      lastTickedSecRef.current = secondsToRun;

      // 3. Mark running immediately - NEVER BLOCK COUNTDOWN
      setIsRunning(true);

      // 4. Asynchronous Spoken Voice Guidance:
      // When the clock starts, speak the Active Extraction Instruction for the current phase!
      // If user pauses and resumes within the same phase, do NOT re-read from start repeatedly.
      const phaseIdx = currentPhaseIndex;
      const hasAnnounced = announcedPhasesRef.current.has(phaseIdx);

      if (!localMuted && !hasAnnounced) {
        announcedPhasesRef.current.add(phaseIdx);
        setIsAnnouncing(true);
        const nameToSay = activePhase?.name || 'Extraction Phase';
        const instructionToSay = activePhase?.instruction || '';
        setAnnouncementText(instructionToSay || nameToSay);

        announcePhase(
          nameToSay, 
          activePhase?.durationSec || 60, 
          localMuted, 
          () => {
            setIsAnnouncing(false);
          },
          instructionToSay,
          activeMethod?.id,
          phaseIdx
        );
      }
    }
  };

  // Skip Phase handler
  const handleSkipPhase = () => {
    unlockAudio();
    playMechanicalClick(localMuted);
    stopSpeechAnnouncement();
    hapticTap();
    setIsAnnouncing(false);
    lastTickedSecRef.current = null;

    const currentIdx = currentPhaseIndexRef.current;
    if (currentIdx < phases.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextPhase = phases[nextIdx];
      const nextDuration = nextPhase?.durationSec || 60;

      setCurrentPhaseIndex(nextIdx);
      currentPhaseIndexRef.current = nextIdx;
      setTimeLeft(nextDuration);
      playTimerStartChime(localMuted);
      hapticPhaseChange();

      if (isRunning) {
        endTimeRef.current = Date.now() + nextDuration * 1000;
        remainingAtPauseRef.current = null;
      } else {
        remainingAtPauseRef.current = nextDuration;
      }

      if (!localMuted) {
        announcedPhasesRef.current.add(nextIdx);
        setIsAnnouncing(true);
        const nameToSay = nextPhase?.name || `Phase ${nextIdx + 1}`;
        const instructionToSay = nextPhase?.instruction || '';
        setAnnouncementText(instructionToSay || nameToSay);
        announcePhase(
          nameToSay, 
          nextDuration, 
          localMuted, 
          () => {
            setIsAnnouncing(false);
          },
          instructionToSay,
          activeMethod?.id,
          nextIdx
        );
      }
    } else {
      setIsRunning(false);
      setIsCompleted(true);
      const totalPlanned = phases.reduce((acc, p) => acc + (p.durationSec || 0), 0);
      const elapsedTotal = brewStartedTimeRef.current 
        ? Math.round((Date.now() - brewStartedTimeRef.current) / 1000) 
        : totalPlanned;
      setActualDrawdownSec(elapsedTotal > 30 && elapsedTotal < 900 ? elapsedTotal : totalPlanned);
      endTimeRef.current = null;
      remainingAtPauseRef.current = null;
      releaseScreenWakeLock();
      hapticComplete();
      playCompletionChime(localMuted);
    }
  };

  // Reset Timer handler
  const handleReset = () => {
    unlockAudio();
    playMechanicalClick(localMuted);
    stopCompletionChime();
    stopSpeechAnnouncement();
    releaseScreenWakeLock();
    hapticTap();
    setIsAnnouncing(false);
    setIsRunning(false);
    setIsCompleted(false);
    setTasteFeedback(null);
    setIsSavedToLog(false);
    setIsEvaluationSkipped(false);
    brewStartedTimeRef.current = null;
    endTimeRef.current = null;
    remainingAtPauseRef.current = null;
    lastTickedSecRef.current = null;
    setCurrentPhaseIndex(0);
    currentPhaseIndexRef.current = 0;
    announcedPhasesRef.current.clear();
    setTimeLeft(phases[0]?.durationSec || 60);
    setActualDrawdownSec(scheduledTotalDurationSec);
  };

  const handleSaveToLog = () => {
    const savedGrinderId = getSavedGrinderId();
    const grindSetting = getGrinderSetting(savedGrinderId, activeMethod?.id === 'espresso' ? 'extra_fine' : activeMethod?.id === 'french_press' ? 'coarse' : 'medium_fine');
    const ratio = customRatio || activeMethod?.ratio || 16;
    const water = totalWaterMl || Math.round(effectiveDose * ratio);
    const remedyText = dialInDiagnosis?.recommendationText || (tasteFeedback === 'sour'
      ? `Under-extracted (sour/weak). Suggested: Grind 1 step finer on ${grindSetting.grinderName} or increase water temp by 2°F.`
      : tasteFeedback === 'sweet'
      ? `Golden Cup! Dialed in at 1:${ratio} on ${grindSetting.grinderName} setting ${grindSetting.setting}.`
      : tasteFeedback === 'bitter'
      ? `Over-extracted (bitter/dry). Suggested: Grind 1 step coarser on ${grindSetting.grinderName} or lower water temp by 2°F.`
      : 'Completed multi-phase timed extraction.');

    logBrewSession({
      trackMode,
      methodId: activeMethod?.id || 'pour_over',
      methodName: activeMethod?.name || 'Guided Extraction',
      beanName: dialedInCoffee?.beanName || activeMethod?.preferredCoffeeTypes?.split('.')[0] || 'Single-Origin Coffee',
      roaster: dialedInCoffee?.roaster || 'Specialty Roastery',
      doseGrams: effectiveDose,
      waterMl: water,
      ratio: ratio,
      tempF: dialInDiagnosis?.recipePatch?.tempF || activeMethod?.tempF || 202,
      grindName: activeMethod?.grind || 'Medium-Fine',
      grinderModel: grindSetting.grinderName,
      grinderSetting: grindSetting.setting,
      tasteFeedback: tasteFeedback || 'skipped',
      remedy: remedyText,
      elapsedSec: actualDrawdownSec || scheduledTotalDurationSec
    });

    setIsSavedToLog(true);
  };

  const handleApplyDialInTweak = () => {
    if (!dialInDiagnosis) return;
    if (onApplyNextBrewTweak) {
      onApplyNextBrewTweak(dialInDiagnosis.recipePatch);
    }
    if (!isSavedToLog) {
      handleSaveToLog();
    }
    handleReset();
  };

  // Replay Active Extraction Instruction out loud on demand
  const handleReplayInstruction = () => {
    unlockAudio();
    playMechanicalClick(localMuted);
    setIsAnnouncing(true);
    const nameToSay = activePhase?.name || 'Active Phase';
    const instructionToSay = activePhase?.instruction || '';
    const phaseDuration = activePhase?.durationSec || 60;
    setAnnouncementText(instructionToSay || nameToSay);

    // Mark as announced so timer resume won't clash
    announcedPhasesRef.current.add(currentPhaseIndex);

    announcePhase(
      nameToSay,
      phaseDuration,
      false, // Force audio playback on explicit user request
      () => {
        setIsAnnouncing(false);
      },
      instructionToSay,
      activeMethod?.id,
      currentPhaseIndex
    );
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
        <div className="flex flex-col items-start sm:items-end gap-2.5">
          {/* Status Badge */}
          <div>
            {isCompleted ? (
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs flex items-center gap-2 shadow-lg animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Extraction Complete! ☕</span>
              </div>
            ) : isRunning ? (
              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center gap-2 shadow-lg animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>Pouring in Progress</span>
              </div>
            ) : (!isRunning && remainingAtPauseRef.current !== null && timeLeft < totalPhaseTime) ? (
              <div className="px-4 py-2 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono font-bold text-xs flex items-center gap-2 shadow-md">
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Timer Paused</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-white/10 text-stone-200 border border-white/20 font-mono font-bold text-xs flex items-center gap-2 shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Timer Ready</span>
              </div>
            )}
          </div>

          {/* Speaker / Mute Button Directly Under Timer Ready Box */}
          <button
            type="button"
            onClick={toggleMute}
            style={{ touchAction: 'manipulation' }}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              localMuted
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30 shadow-rose-900/30 ring-1 ring-rose-500/30'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-emerald-900/20 ring-1 ring-emerald-500/30'
            }`}
            title={localMuted ? "Click to Unmute Audio & Spoken Guidance" : "Click to Mute Audio"}
            aria-label={localMuted ? "Unmute Timer Audio" : "Mute Timer Audio"}
          >
            {localMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Audio Muted (Click to Unmute)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                <span>Audio & Voice: ON (Mute)</span>
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

        {/* Phase Instruction & Active Target Pour Box OR Post-Brew Extraction Feedback Card */}
        <div className="max-w-md w-full space-y-4 text-center lg:text-left">
          {isCompleted ? (
            isEvaluationSkipped ? (
              /* Bypassed state (Clean celebration card) */
              <div className="p-6 rounded-3xl bg-black/50 border border-white/15 space-y-4 text-center animate-fade-in shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-cream-light">
                    Brewing Complete!
                  </h4>
                  <p className="text-xs text-stone-300 mt-1">
                    Enjoy your fresh cup of {activeMethod?.name || 'specialty coffee'}.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-mono font-bold shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    Reset Timer
                  </button>
                  {onOpenJournal && (
                    <button
                      type="button"
                      onClick={onOpenJournal}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream-light text-xs font-mono font-bold border border-white/15 transition cursor-pointer"
                    >
                      View Tasting Journal
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Post-Brew Extraction Feedback & Dial-In Card (with Skip option) */
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1C130D] to-black border-2 border-amber-gold/50 space-y-4 shadow-2xl animate-fade-in text-left relative overflow-hidden">
                {/* Header with Skip button */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Post-Brew Dial-In Engine</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-cream-light mt-0.5">
                      Dial In Your Next Extraction
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEvaluationSkipped(true)}
                    className="text-xs font-mono text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer flex items-center gap-1"
                    title="Skip extraction feedback and finish"
                  >
                    <X className="w-3 h-3" />
                    <span>Skip</span>
                  </button>
                </div>

                {/* Input 1: Actual Drawdown Time Stepper */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cream-light">
                      <TimerIcon className="w-3.5 h-3.5 text-amber-gold" />
                      <span>1. Total Drawdown Time:</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">
                      Target for {activeMethod?.name || 'V60'}: <strong className="text-amber-gold">{METHOD_DRAWDOWN_TARGETS[activeMethod?.id || 'pour_over']?.idealStr || '2:45 – 3:30'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-mono font-black text-amber-gold tracking-wider">
                        {formatSecondsToMmSs(actualDrawdownSec)}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        ({actualDrawdownSec}s)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setActualDrawdownSec(prev => Math.max(30, prev - 15))}
                        className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-cream-light font-bold border border-white/10 active:scale-95 transition"
                        title="Decrease drawdown by 15 seconds"
                      >
                        -15s
                      </button>
                      <button
                        type="button"
                        onClick={() => setActualDrawdownSec(prev => Math.max(30, prev - 5))}
                        className="px-2 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-cream-light font-bold border border-white/10 active:scale-95 transition"
                        title="Decrease drawdown by 5 seconds"
                      >
                        -5s
                      </button>
                      <button
                        type="button"
                        onClick={() => setActualDrawdownSec(prev => Math.min(600, prev + 5))}
                        className="px-2 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-cream-light font-bold border border-white/10 active:scale-95 transition"
                        title="Increase drawdown by 5 seconds"
                      >
                        +5s
                      </button>
                      <button
                        type="button"
                        onClick={() => setActualDrawdownSec(prev => Math.min(600, prev + 15))}
                        className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-cream-light font-bold border border-white/10 active:scale-95 transition"
                        title="Increase drawdown by 15 seconds"
                      >
                        +15s
                      </button>
                    </div>
                  </div>
                </div>

                {/* Input 2: Taste Evaluation Chips */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-cream-light px-0.5">
                    <span>2. Cup Taste Profile:</span>
                    <span className="text-[10px] text-stone-400 font-normal">Tap to diagnose extraction physics</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setTasteFeedback('sour')}
                      className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        tasteFeedback === 'sour'
                          ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-lg scale-102 font-bold'
                          : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">🍋</span>
                      <span className="text-[10px] sm:text-[11px] font-bold leading-tight">Sour / Bright</span>
                      <span className="text-[8px] sm:text-[9px] text-stone-400">Under-extracted</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTasteFeedback('sweet')}
                      className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        tasteFeedback === 'sweet'
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50 shadow-lg scale-102 font-bold'
                          : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">✨</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-300 leading-tight">Sweet & Balanced</span>
                      <span className="text-[8px] sm:text-[9px] text-stone-400">Golden Cup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTasteFeedback('bitter')}
                      className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        tasteFeedback === 'bitter'
                          ? 'bg-rose-500/30 border-rose-400 text-rose-200 ring-2 ring-rose-400/50 shadow-lg scale-102 font-bold'
                          : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">🪵</span>
                      <span className="text-[10px] sm:text-[11px] font-bold leading-tight">Bitter / Dry</span>
                      <span className="text-[8px] sm:text-[9px] text-stone-400">Over-extracted</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Closed-Loop Diagnosis & Next-Brew Quantitative Tweaks */}
                {dialInDiagnosis && (
                  <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2.5 animate-fade-in shadow-xl ${
                    dialInDiagnosis.tasteProfile === 'sweet'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
                      : dialInDiagnosis.tasteProfile === 'bitter'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-100'
                      : 'bg-amber-500/10 border-amber-500/40 text-amber-100'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-gold text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Closed-Loop Dial-In Recommendation:</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                        dialInDiagnosis.diagnosisType === 'sweet_spot'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {dialInDiagnosis.headline}
                      </span>
                    </div>

                    {/* Plain English user recommendation */}
                    <p className="text-[12px] leading-relaxed text-cream-light font-sans font-medium">
                      "{dialInDiagnosis.recommendationText}"
                    </p>

                    {/* Quantitative Tweaks Grid */}
                    {dialInDiagnosis.recipePatch && (
                      <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                        <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                          <span className="text-[9px] text-stone-400 uppercase block">Grind Adjustment</span>
                          <span className="font-bold text-amber-gold truncate block">
                            {dialInDiagnosis.recipePatch.grindSetting || 'Keep setting'}
                          </span>
                          <span className="text-[9px] text-stone-400 block mt-0.5">
                            {dialInDiagnosis.recipePatch.grindShift > 0 
                              ? `+${dialInDiagnosis.recipePatch.grindShift} clicks coarser` 
                              : dialInDiagnosis.recipePatch.grindShift < 0 
                              ? `${dialInDiagnosis.recipePatch.grindShift} clicks finer` 
                              : 'Locked in'}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                          <span className="text-[9px] text-stone-400 uppercase block">Water Temp</span>
                          <span className="font-bold text-cream-light block">
                            {dialInDiagnosis.recipePatch.tempF}°F
                          </span>
                          <span className="text-[9px] text-stone-400 block mt-0.5">
                            {dialInDiagnosis.recipePatch.tempShiftF > 0 
                              ? `+${dialInDiagnosis.recipePatch.tempShiftF}°F hotter` 
                              : dialInDiagnosis.recipePatch.tempShiftF < 0 
                              ? `${dialInDiagnosis.recipePatch.tempShiftF}°F cooler` 
                              : 'Locked in'}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                          <span className="text-[9px] text-stone-400 uppercase block">Target Ratio</span>
                          <span className="font-bold text-amber-gold block">
                            1 : {dialInDiagnosis.recipePatch.ratio}
                          </span>
                          <span className="text-[9px] text-stone-400 block mt-0.5">
                            {dialInDiagnosis.recipePatch.ratioShift !== 0
                              ? `${dialInDiagnosis.recipePatch.ratioShift > 0 ? '+' : ''}${dialInDiagnosis.recipePatch.ratioShift}`
                              : 'Locked in'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 1-Click Apply Tweaks Button */}
                    {onApplyNextBrewTweak && dialInDiagnosis.recipePatch && (
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={handleApplyDialInTweak}
                          className="w-full py-2.5 px-4 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-98 transition cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>Apply Tweaks to Next Brew</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Dial-In Summary & 1-Click Save */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-[10px] font-mono text-stone-400">
                    <div>Bean: <strong className="text-cream-light">{dialedInCoffee?.beanName || activeMethod?.preferredCoffeeTypes?.split('.')[0] || 'Single-Origin Lot'}</strong></div>
                    <div>Dose & Water: <strong className="text-cream-light">{effectiveDose}g • ~{totalWaterMl || Math.round(effectiveDose * (customRatio || activeMethod?.ratio || 16))} mL</strong></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveToLog}
                      disabled={isSavedToLog}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                        isSavedToLog
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                          : 'btn-tactile-amber text-espresso-950 hover:scale-105'
                      }`}
                    >
                      {isSavedToLog ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Logged to Journal!</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Save to Brew Log</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEvaluationSkipped(true)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white text-xs font-mono font-medium border border-white/15 transition cursor-pointer"
                      title="Skip feedback evaluation"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Normal In-Flight Phase Instructions */
            <>
              <div className={`p-6 rounded-3xl bg-black/40 border shadow-inner space-y-3 transition-all duration-300 ${
                isAnnouncing
                  ? 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/30'
                  : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-extrabold flex items-center gap-1.5">
                    <Sparkles className={`w-3.5 h-3.5 ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
                    <span>Active Extraction Instruction</span>
                  </div>

                  {/* Dedicated Listen / Replay Instruction Button */}
                  <button
                    type="button"
                    onClick={handleReplayInstruction}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                      isAnnouncing
                        ? 'bg-amber-500/25 border-amber-400/60 text-amber-200 animate-pulse ring-1 ring-amber-400/40'
                        : 'bg-white/10 hover:bg-white/20 border-white/15 text-stone-200 hover:text-white'
                    }`}
                    title="Tap to hear Active Extraction Instruction spoken aloud"
                    aria-label="Hear Active Extraction Instruction"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isAnnouncing ? 'text-amber-300 animate-bounce' : 'text-stone-300'}`} />
                    <span>{isAnnouncing ? 'Speaking...' : '🔊 Listen'}</span>
                  </button>
                </div>
                
                <p className="text-sm md:text-base text-cream-light font-medium leading-relaxed">
                  {activePhase?.instruction || 'Follow standard extraction pulse pouring technique.'}
                </p>

                {/* Active Voice Guidance Banner */}
                {isAnnouncing && (
                  <div className="pt-2 flex items-center gap-2 text-xs font-mono text-amber-300 animate-pulse border-t border-white/10">
                    <Volume2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                    <span className="font-semibold">Speaking Active Instruction: "{announcementText || activePhase?.instruction}"</span>
                  </div>
                )}
              </div>

              {/* The Two Scaling Variables Indicator (Bloom Phase) */}
              {isBloomPhase && (
                <div className="p-4 rounded-3xl bg-[#A66E38]/15 border border-[#A66E38]/40 text-xs font-mono space-y-3 shadow-md text-left">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-gold uppercase tracking-wider text-[11px]">
                      <Scale className="w-4 h-4 text-amber-gold" />
                      <span>The Two Scaling Variables (Bloom Phase)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                      {bloomMetrics.tierName} ({effectiveDose}g)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wide block font-semibold">1. Bloom Water Weight</span>
                      <span className="text-cream-light font-bold text-base block font-mono">~{bloomMetrics.targetWaterGrams}g</span>
                      <span className="text-amber-gold/90 text-[10px] block font-mono">{bloomMetrics.waterRangeStr}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wide block font-semibold">2. Bloom Time</span>
                      <span className="text-cream-light font-bold text-base block font-mono">{bloomMetrics.durationSec}s</span>
                      <span className="text-amber-gold/90 text-[10px] block font-mono">{bloomMetrics.bloomTimeRange}</span>
                    </div>
                  </div>

                  {/* Benchmark Reference Grid */}
                  <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-1.5 text-[9px] text-stone-400 text-center font-mono">
                    <div className={`p-1.5 rounded-xl border transition ${bloomMetrics.tier === 'small' ? 'bg-amber-500/20 text-amber-200 font-bold border-amber-500/40 shadow-sm' : 'bg-black/30 border-white/5 opacity-70'}`}>
                      <div>Small (12–15g)</div>
                      <div className="text-[8.5px] mt-0.5">35–45g • 30–40s</div>
                    </div>
                    <div className={`p-1.5 rounded-xl border transition ${bloomMetrics.tier === 'standard' ? 'bg-amber-500/20 text-amber-200 font-bold border-amber-500/40 shadow-sm' : 'bg-black/30 border-white/5 opacity-70'}`}>
                      <div>Standard (20–30g)</div>
                      <div className="text-[8.5px] mt-0.5">60–90g • 40–45s</div>
                    </div>
                    <div className={`p-1.5 rounded-xl border transition ${bloomMetrics.tier === 'large' ? 'bg-amber-500/20 text-amber-200 font-bold border-amber-500/40 shadow-sm' : 'bg-black/30 border-white/5 opacity-70'}`}>
                      <div>Large (45–60g+)</div>
                      <div className="text-[8.5px] mt-0.5">135–180g • 45–60+s</div>
                    </div>
                  </div>

                  {/* View Full Scaling Guide Button */}
                  <button
                    type="button"
                    onClick={() => setIsProTipOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <span>View Full V60 Technique & Scaling Guide</span>
                    <span>↗</span>
                  </button>
                </div>
              )}

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
            </>
          )}
        </div>

      </div>

      {/* Timer Controls Row with Tactile 3D Buttons */}
      <div className="flex items-center justify-center space-x-3 sm:space-x-4 mt-8 flex-wrap gap-y-3">
        
        <button
          type="button"
          onClick={handleReset}
          style={{ touchAction: 'manipulation' }}
          className="p-4 rounded-2xl bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95 cursor-pointer"
          title="Reset Timer (R)"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleToggleTimer}
          style={{ touchAction: 'manipulation' }}
          className={`px-7 sm:px-10 py-4 sm:py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
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

        {/* Dedicated Speaker / Mute Toggle Button in Control Row */}
        <button
          type="button"
          onClick={toggleMute}
          style={{ touchAction: 'manipulation' }}
          className={`p-4 rounded-2xl border transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center ${
            localMuted
              ? 'bg-rose-500/25 border-rose-500/50 text-rose-300 hover:bg-rose-500/35 ring-2 ring-rose-500/30'
              : 'bg-white/10 border-white/15 text-stone-300 hover:text-cream-light hover:bg-white/20'
          }`}
          title={localMuted ? "Audio is Muted — Click to Unmute (Ticks, Chimes & Spoken Guidance)" : "Audio is ON — Click to Mute"}
          aria-label={localMuted ? "Unmute Timer Audio" : "Mute Timer Audio"}
        >
          {localMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
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

