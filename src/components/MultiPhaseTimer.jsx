import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Timer as TimerIcon, Volume2, VolumeX, Sparkles, CheckCircle2, ChevronLeft, BookOpen } from 'lucide-react';
import { playPhaseChime, playCompletionChime, stopCompletionChime } from '../utils/audioSynth';
import V60ProTipModal from './V60ProTipModal';

export default function MultiPhaseTimer({ trackMode, activeMethod, dryDoseGrams, isMuted, onPrevStep, onOpenJournal }) {
  const isCoffee = trackMode === 'coffee';
  const phases = activeMethod?.phases || [];

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0]?.durationSec || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const activePhase = phases[currentPhaseIndex] || phases[0] || { name: 'Brew Extraction', durationSec: 60, waterMultiplier: 1.0, instruction: 'Begin brewing.' };
  const totalPhaseTime = activePhase?.durationSec || 60;

  // Reset timer when method or track mode changes
  useEffect(() => {
    stopCompletionChime();
    setCurrentPhaseIndex(0);
    setTimeLeft(phases[0]?.durationSec || 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [activeMethod, trackMode]);

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
        // Move to next phase safely
        playPhaseChime(isMuted);
        const nextIdx = currentPhaseIndex + 1;
        if (phases[nextIdx]) {
          setCurrentPhaseIndex(nextIdx);
          setTimeLeft(phases[nextIdx].durationSec || 60);
        } else {
          playCompletionChime(isMuted);
          setIsRunning(false);
          setIsCompleted(true);
        }
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
      if (phases[nextIdx]) {
        setCurrentPhaseIndex(nextIdx);
        setTimeLeft(phases[nextIdx].durationSec || 60);
        setIsRunning(true);
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
    <div className={`p-8 md:p-10 lg:p-12 rounded-3xl ${isCoffee ? 'glass-panel-amber' : 'glass-panel-sage'} shadow-2xl transition-all duration-500 relative overflow-hidden`}>
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <h3 className="font-serif text-3xl font-bold text-cream-light flex items-center gap-3 drop-shadow-md">
            <TimerIcon className={`w-7 h-7 ${isCoffee ? 'text-amber-gold' : 'text-sage-300'}`} />
            <span>Step 04 • Multi-Phase Extraction Timer</span>
          </h3>
          <p className="text-xs md:text-sm text-stone-300 mt-1">Audio/visual countdown guiding blooming, steep, and drawdown phases</p>
        </div>

        {/* Pro Tip Button for Pour-Over */}
        {isPourOver && (
          <button
            onClick={() => setIsProTipOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-gold text-espresso-950 hover:bg-amber-gold/90 font-extrabold text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap animate-pulse"
            title="Open 1-Cup V60 Pro Tip Technique & Temperature Guide"
          >
            <span>Pro Tip 💡</span>
          </button>
        )}

        <span className={`text-xs font-mono font-extrabold tracking-wider uppercase px-4 py-1.5 rounded-full border shadow-inner ${
          isRunning 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse shadow-emerald-500/10' 
            : 'bg-white/10 text-stone-300 border-white/15'
        }`}>
          {isCompleted ? 'Brew Complete ✨' : isRunning ? 'Extraction Active...' : 'Ready'}
        </span>
      </div>

      {/* Main Timer Dial Area with Glowing Ring */}
      <div className="flex flex-col items-center justify-center my-6 relative">
        
        {/* SVG Circular Progress Ring */}
        <div className={`relative w-64 h-64 flex items-center justify-center rounded-full p-2 ${
          isRunning ? 'animate-pulse-glow' : ''
        }`}>
          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="stroke-[#14110E]"
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
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] font-extrabold text-amber-gold mb-1">
              Phase {currentPhaseIndex + 1} / {phases.length}
            </div>

            <div className={`text-5xl md:text-6xl font-extrabold font-mono tracking-tight drop-shadow-lg ${
              isCompleted ? 'text-emerald-400' : 'text-cream-light'
            }`}>
              {formatTime(timeLeft)}
            </div>

            <div className="text-xs font-mono font-bold text-stone-400 mt-1 bg-black/40 px-3 py-1 rounded-full border border-white/[0.08]">
              {Math.floor(timeLeft / 60)}m {timeLeft % 60}s remaining
            </div>

            <div className="text-xs font-serif font-bold text-amber-gold mt-2 max-w-[170px] truncate">
              {activePhase?.name}
            </div>
          </div>
        </div>

        {/* Phase Action Raised Card */}
        <div className="w-full mt-8 p-6 rounded-3xl bg-[#120F0D]/95 border border-white/[0.12] text-center shadow-2xl backdrop-blur-xl">
          <div className="text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-amber-gold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-gold animate-pulse" />
            <span>Active Extraction Instruction</span>
          </div>

          <p className="text-sm md:text-base font-semibold text-cream-light leading-relaxed">
            {isCompleted 
              ? '🎉 Brew process complete! Pour into your pre-heated ceramic vessel and savor.' 
              : activePhase?.instruction
            }
          </p>

          {targetPhaseWaterMl > 0 && !isCompleted && (
            <div className="mt-3.5 text-xs font-mono font-extrabold text-amber-gold bg-amber-400/15 py-1.5 px-5 rounded-full inline-block border border-amber-400/30 shadow">
              Target Pour Water: ~{targetPhaseWaterMl} mL
            </div>
          )}
        </div>

      </div>

      {/* Timer Controls Row with Tactile 3D Buttons */}
      <div className="flex items-center justify-center space-x-5 mt-8">
        
        <button
          onClick={handleReset}
          className="p-4 rounded-2xl bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-10 py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 ${
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
          className="p-4 rounded-2xl bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all border border-white/15 shadow-xl active:scale-95"
          title="Skip to Next Phase"
        >
          <FastForward className="w-5 h-5" />
        </button>

      </div>

      {/* Phase Roadmap Progress Timeline */}
      <div className="mt-10 pt-8 border-t border-white/[0.08]">
        <label className="block text-[11px] font-mono uppercase tracking-[0.2em] font-extrabold text-amber-gold mb-4">
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
                    ? 'bg-amber-500/20 border-amber-400/60 text-cream-light font-bold shadow-lg shadow-amber-gold/10 backdrop-blur-md'
                    : isPast
                    ? 'bg-white/[0.03] border-white/[0.04] text-stone-500 line-through'
                    : 'bg-[#120F0D] border-white/[0.08] text-stone-300 shadow'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-extrabold shadow ${
                    isCurrent ? 'bg-amber-gold text-espresso-950' : 'bg-slate-800 text-stone-400 border border-white/10'
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

      {/* Contextual Amazon Affiliate Recommendation Box for Gooseneck Kettles with Built-in Timers */}
      <div className="mt-8 p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-stone-300">
          <TimerIcon className="w-4 h-4 text-amber-gold flex-shrink-0 animate-pulse" />
          <span>Precision pour-overs require electric gooseneck kettles with built-in timers & degree PID control (Fellow Stagg EKG, COSORI Smart Kettle).</span>
        </div>
        <a
          href="https://www.amazon.com/s?k=Electric+Gooseneck+Kettle+with+Timer+and+Variable+Temperature&tag=thebrewapp13-20"
          target="_blank"
          rel="nofollow sponsored noopener"
          data-product-name="Electric Gooseneck Kettles with Timers"
          data-link-id="gooseneck_kettles_with_timers"
          data-context="step4_guided_timer_kettle"
          className="px-4 py-2 rounded-xl bg-amber-400/20 text-amber-gold hover:bg-amber-400/30 border border-amber-400/40 font-extrabold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0"
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
            <span>Step 03: Grind & Beans</span>
          </button>
        )}

        {onOpenJournal && (
          <button
            onClick={onOpenJournal}
            className="w-full sm:w-auto py-4 px-9 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all"
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
