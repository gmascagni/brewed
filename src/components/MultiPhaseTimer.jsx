import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Timer as TimerIcon, Volume2, VolumeX, Sparkles, CheckCircle2, ChevronLeft } from 'lucide-react';
import { playPhaseChime, playCompletionChime } from '../utils/audioSynth';

export default function MultiPhaseTimer({ trackMode, activeMethod, dryDoseGrams, isMuted, onPrevStep }) {
  const isCoffee = trackMode === 'coffee';
  const phases = activeMethod?.phases || [];

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0]?.durationSec || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const activePhase = phases[currentPhaseIndex] || phases[0];
  const totalPhaseTime = activePhase?.durationSec || 60;

  // Reset timer when method changes
  useEffect(() => {
    setCurrentPhaseIndex(0);
    setTimeLeft(phases[0]?.durationSec || 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [activeMethod]);

  // Main Timer Countdown Loop
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Phase finish handler
      if (currentPhaseIndex < phases.length - 1) {
        // Move to next phase
        playPhaseChime(isMuted);
        const nextIdx = currentPhaseIndex + 1;
        setCurrentPhaseIndex(nextIdx);
        setTimeLeft(phases[nextIdx].durationSec);
      } else {
        // All phases complete!
        playCompletionChime(isMuted);
        setIsRunning(false);
        setIsCompleted(true);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPhaseIndex, phases, isMuted]);

  // Skip Phase handler
  const handleSkipPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      const nextIdx = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIdx);
      setTimeLeft(phases[nextIdx].durationSec);
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  };

  // Reset Timer handler
  const handleReset = () => {
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

  return (
    <div className={`p-7 rounded-3xl ${isCoffee ? 'glass-panel-amber' : 'glass-panel-sage'} shadow-2xl transition-all duration-500`}>
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 className="font-serif text-2xl font-bold text-cream-light flex items-center gap-2.5 drop-shadow-md">
            <TimerIcon className={`w-6 h-6 ${isCoffee ? 'text-amber-gold' : 'text-sage-300'}`} />
            <span>Step 04 • Multi-Phase Extraction Timer</span>
          </h3>
          <p className="text-xs text-cream-soft/70 mt-0.5">Audio/visual countdown guiding blooming & steep phases</p>
        </div>

        <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full border shadow-inner ${
          isRunning 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse shadow-emerald-500/10' 
            : 'bg-white/10 text-cream-soft border-white/15'
        }`}>
          {isCompleted ? 'Brew Complete ✨' : isRunning ? 'Phase Active...' : 'Ready'}
        </span>
      </div>

      {/* Main Timer Dial Area with Glowing Ring */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        
        {/* SVG Circular Progress Ring */}
        <div className={`relative w-60 h-60 flex items-center justify-center rounded-full p-2 ${
          isRunning ? (isCoffee ? 'animate-pulse-glow' : 'animate-pulse-glow') : ''
        }`}>
          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="stroke-slate-900/90"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Active Animated Progress Arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className={`transition-all duration-500 ease-linear ${
                isCoffee ? 'stroke-amber-gold' : 'stroke-sage-300'
              }`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Timer Display */}
          <div className="absolute flex flex-col items-center text-center">
            <div className="text-xs font-mono uppercase tracking-widest font-extrabold text-cream-soft/70 mb-0.5">
              Phase {currentPhaseIndex + 1} / {phases.length}
            </div>

            <div className={`text-5xl md:text-6xl font-extrabold font-mono tracking-tight drop-shadow-lg ${
              isCompleted ? 'text-emerald-400' : 'text-cream-light'
            }`}>
              {formatTime(timeLeft)}
            </div>

            <div className="text-xs font-mono font-extrabold text-cream-soft/70 mt-1 bg-black/30 px-2.5 py-0.5 rounded-full border border-white/10">
              {Math.floor(timeLeft / 60)}m {timeLeft % 60}s remaining
            </div>

            <div className="text-xs font-bold text-amber-gold mt-1.5 max-w-[150px] truncate">
              {activePhase?.name}
            </div>
          </div>
        </div>

        {/* Phase Action Raised Card */}
        <div className="w-full mt-6 p-5 rounded-2xl bg-espresso-950/90 border border-white/15 text-center shadow-2xl">
          <div className="text-xs font-extrabold uppercase tracking-wider text-cream-soft/70 mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-gold animate-pulse" />
            <span>Current Phase Instruction</span>
          </div>

          <p className="text-sm font-semibold text-cream-light leading-relaxed">
            {isCompleted 
              ? '🎉 Brew process complete! Pour into your pre-heated mug and enjoy.' 
              : activePhase?.instruction
            }
          </p>

          {targetPhaseWaterMl > 0 && !isCompleted && (
            <div className="mt-3 text-xs font-mono font-extrabold text-amber-gold bg-amber-gold/15 py-1 px-4 rounded-full inline-block border border-amber-gold/30 shadow">
              Target Pour Water: ~{targetPhaseWaterMl} mL
            </div>
          )}
        </div>

      </div>

      {/* Timer Controls Row with Tactile 3D Buttons */}
      <div className="flex items-center justify-center space-x-5 mt-7">
        
        <button
          onClick={handleReset}
          className="p-4 rounded-2xl bg-white/10 text-cream-soft hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-10 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 ${
            isRunning
              ? 'bg-amber-600 text-cream-light border border-amber-500 shadow-amber-600/30'
              : isCoffee
              ? 'btn-tactile-amber text-espresso-950'
              : 'btn-tactile-sage text-cream-light'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Pause Timer' : 'Start Extraction'}</span>
        </button>

        <button
          onClick={handleSkipPhase}
          className="p-4 rounded-2xl bg-white/10 text-cream-soft hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95"
          title="Skip to Next Phase"
        >
          <FastForward className="w-5 h-5" />
        </button>

      </div>

      {/* Phase Roadmap Progress Timeline */}
      <div className="mt-9 pt-6 border-t border-white/10">
        <label className="block text-xs uppercase tracking-widest font-extrabold text-cream-soft/70 mb-3.5">
          Extraction Phase Roadmap:
        </label>
        
        <div className="space-y-2.5">
          {phases.map((phase, idx) => {
            const isPast = idx < currentPhaseIndex || isCompleted;
            const isCurrent = idx === currentPhaseIndex && !isCompleted;
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  isCurrent
                    ? 'bg-amber-gold/20 border-amber-gold text-cream-light font-bold shadow-lg shadow-amber-gold/10'
                    : isPast
                    ? 'bg-white/5 border-white/5 text-cream-soft/50 line-through'
                    : 'bg-slate-900/60 border-white/10 text-cream-soft/70 shadow'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow ${
                    isCurrent ? 'bg-amber-gold text-espresso-950' : 'bg-slate-800 text-cream-soft/70 border border-white/10'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold">{phase.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[11px] bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 font-bold shadow-inner">
                    {formatDuration(phase.durationSec)}
                  </span>
                  {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Navigation Controls */}
      {onPrevStep && (
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
          <button
            onClick={onPrevStep}
            className="py-3 px-6 rounded-2xl bg-white/10 text-cream-light font-extrabold text-xs flex items-center gap-2 hover:bg-white/20 transition-all border border-white/15"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Step 03: Grind & Beans</span>
          </button>
        </div>
      )}

    </div>
  );
}
