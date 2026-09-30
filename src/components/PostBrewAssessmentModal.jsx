import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Star, 
  X, 
  Timer, 
  Coffee, 
  Camera, 
  Check, 
  ArrowRight, 
  Sliders, 
  History, 
  CheckCircle2, 
  Trash2,
  BookOpen
} from 'lucide-react';
import { calculateClosedLoopDialIn, formatSecondsToMmSs, METHOD_DRAWDOWN_TARGETS } from '../utils/dialInEngine.js';
import { logBrewSession, findPreviousBrewsForLot, compressPhotoToThumbnail } from '../utils/journalStorage.js';
import { getSavedGrinderId } from '../data/grinderProfiles.js';
import { trackEvent } from '../utils/analytics.js';
import { hapticTap, hapticSuccess } from '../utils/haptics.js';

export default function PostBrewAssessmentModal({
  isOpen,
  onClose,
  activeMethod,
  dialedInCoffee = null,
  dryDoseGrams = 18,
  totalWaterMl = 288,
  customRatio = 16,
  customGrind = null,
  elapsedSec = 180,
  unitSystem = 'imperial',
  onApplyNextBrewTweak = null,
  onOpenJournal = null,
  currentUser = null
}) {
  if (!isOpen) return null;

  const methodId = activeMethod?.id || 'pour_over';
  const methodName = activeMethod?.name || 'Pour Over';
  const beanName = dialedInCoffee?.beanName || activeMethod?.preferredCoffeeTypes?.split('.')[0] || 'Single-Origin Coffee';
  const roaster = dialedInCoffee?.roaster || 'Specialty Roastery';
  const initialTempF = dialedInCoffee?.tempF || activeMethod?.tempF || 202;
  const initialGrind = dialedInCoffee?.recommendedGrind || dialedInCoffee?.grindSetting || customGrind || activeMethod?.grind || 'Medium-Fine';
  const effectiveRatio = Number(customRatio || activeMethod?.ratio || 16);
  const effectiveDose = Number(dryDoseGrams || (totalWaterMl / effectiveRatio)).toFixed(1);

  // 1. Post-Brew Evaluation State
  const [actualDrawdownSec, setActualDrawdownSec] = useState(() => Math.max(30, Number(elapsedSec) || 180));
  const [tasteFeedback, setTasteFeedback] = useState('balanced'); // 'balanced' | 'sour' | 'bitter' | 'weak' | 'strong'
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [customNotes, setCustomNotes] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  // 2. Query historical brews of this same bag/roaster to enable instant side-by-side comparison
  const previousBrews = useMemo(() => {
    return findPreviousBrewsForLot({
      beanName,
      roaster,
      methodId
    });
  }, [beanName, roaster, methodId]);

  const lastBrew = previousBrews.length > 0 ? previousBrews[0] : null;

  // 3. Dynamic Closed-Loop Dial-In Calculation
  const dialInDiagnosis = useMemo(() => {
    return calculateClosedLoopDialIn({
      methodId,
      actualDrawdownSec,
      tasteProfile: tasteFeedback,
      currentTempF: initialTempF,
      currentRatio: effectiveRatio,
      currentGrindSetting: initialGrind,
      grinderId: getSavedGrinderId()
    });
  }, [methodId, actualDrawdownSec, tasteFeedback, initialTempF, effectiveRatio, initialGrind]);

  // Handle Photo selection with client-side thumbnail compression
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsPhotoLoading(true);
      const thumbnail = await compressPhotoToThumbnail(file, 400, 400, 0.78);
      setPhotoDataUrl(thumbnail);
      hapticTap();
    } catch (err) {
      console.warn('Failed to compress photo:', err);
    } finally {
      setIsPhotoLoading(false);
      e.target.value = '';
    }
  };

  // 4. Save to Tasting Journal
  const handleSaveAndApply = (applyToNext = false) => {
    hapticSuccess();

    const loggedEntry = logBrewSession({
      trackMode: 'coffee',
      methodId,
      methodName,
      beanName,
      roaster,
      doseGrams: parseFloat(effectiveDose),
      waterMl: totalWaterMl,
      ratio: effectiveRatio,
      tempF: initialTempF,
      grindName: initialGrind,
      grinderSetting: initialGrind,
      actualDrawdownSec,
      durationFormatted: formatSecondsToMmSs(actualDrawdownSec),
      tasteFeedback,
      remedy: dialInDiagnosis?.summaryHeadline || '',
      recipePatch: dialInDiagnosis?.recipePatch || null,
      rating,
      tastingNotes: customNotes.trim() ? [customNotes.trim()] : undefined,
      notes: customNotes.trim(),
      photoUrl: photoDataUrl,
      userId: currentUser?.uid || null
    });

    trackEvent('brew_logged_post_assessment', {
      method: methodId,
      taste: tasteFeedback,
      rating,
      applied_tweaks: applyToNext
    });

    if (applyToNext && onApplyNextBrewTweak && dialInDiagnosis?.recipePatch) {
      onApplyNextBrewTweak(dialInDiagnosis.recipePatch);
    }

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const starLabels = {
    1: '1★ Needs Revision',
    2: '2★ Sub-Optimal',
    3: '3★ Decent Cup',
    4: '4★ Very Good',
    5: '5★ Golden Cup'
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-brew-assessment-title"
    >
      <div 
        className="w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#14100D] border-t sm:border border-white/20 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-cream-light animate-slide-up"
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-white/25" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-gold flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                  Dial-In Assistant
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Brew Completed
                </span>
              </div>
              <h3 id="post-brew-assessment-title" className="font-serif text-lg sm:text-xl font-bold text-cream-light leading-tight mt-0.5">
                {beanName}
              </h3>
              <p className="text-[11px] font-mono text-stone-400">
                {roaster} • {methodName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/10 transition cursor-pointer"
            title="Close / Skip"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Assessment Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Section 1: Taste Profile Chips (The core 5 chips) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-cream-light flex items-center gap-1.5">
                <span>1. How does your cup taste?</span>
              </label>
              <span className="text-[10px] font-mono text-stone-400">
                Tap 1 chip (Takes 2s)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
              {/* Sour */}
              <button
                type="button"
                onClick={() => { hapticTap(); setTasteFeedback('sour'); }}
                className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  tasteFeedback === 'sour'
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-md font-bold scale-[1.02]'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5'
                }`}
              >
                <span className="text-lg">🍋</span>
                <span className="text-[11px] font-bold">Sour / Bright</span>
                <span className="text-[9px] text-stone-400">Under-extracted</span>
              </button>

              {/* Bitter */}
              <button
                type="button"
                onClick={() => { hapticTap(); setTasteFeedback('bitter'); }}
                className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  tasteFeedback === 'bitter'
                    ? 'bg-rose-500/30 border-rose-400 text-rose-200 ring-2 ring-rose-400/50 shadow-md font-bold scale-[1.02]'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5'
                }`}
              >
                <span className="text-lg">🪵</span>
                <span className="text-[11px] font-bold">Bitter / Dry</span>
                <span className="text-[9px] text-stone-400">Over-extracted</span>
              </button>

              {/* Weak */}
              <button
                type="button"
                onClick={() => { hapticTap(); setTasteFeedback('weak'); }}
                className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  tasteFeedback === 'weak'
                    ? 'bg-sky-500/30 border-sky-400 text-sky-200 ring-2 ring-sky-400/50 shadow-md font-bold scale-[1.02]'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5'
                }`}
              >
                <span className="text-lg">💧</span>
                <span className="text-[11px] font-bold">Weak / Hollow</span>
                <span className="text-[9px] text-stone-400">Low Strength</span>
              </button>

              {/* Strong */}
              <button
                type="button"
                onClick={() => { hapticTap(); setTasteFeedback('strong'); }}
                className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  tasteFeedback === 'strong'
                    ? 'bg-purple-500/30 border-purple-400 text-purple-200 ring-2 ring-purple-400/50 shadow-md font-bold scale-[1.02]'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5'
                }`}
              >
                <span className="text-lg">⚡</span>
                <span className="text-[11px] font-bold">Strong / Heavy</span>
                <span className="text-[9px] text-stone-400">High Strength</span>
              </button>

              {/* Balanced / Golden Cup */}
              <button
                type="button"
                onClick={() => { hapticTap(); setTasteFeedback('balanced'); }}
                className={`col-span-2 sm:col-span-1 p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  tasteFeedback === 'balanced'
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50 shadow-md font-bold scale-[1.02]'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:bg-white/5'
                }`}
              >
                <span className="text-lg">✨</span>
                <span className="text-[11px] font-bold text-emerald-300">Balanced</span>
                <span className="text-[9px] text-stone-400">Golden Cup</span>
              </button>
            </div>
          </div>

          {/* Section 2: Star Rating & Actual Drawdown Time Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1-5 Star Rating */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-300 mb-2">
                <span>Cup Rating:</span>
                <span className="text-[10px] text-amber-gold font-bold">
                  {starLabels[hoveredStar || rating]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 justify-center py-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isActive = starVal <= (hoveredStar || rating);
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => { hapticTap(); setRating(starVal); }}
                      onMouseEnter={() => setHoveredStar(starVal)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 active:scale-95"
                      title={`${starVal} Star`}
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${
                          isActive 
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                            : 'text-stone-600'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Drawdown Adjuster */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-gold" />
                  <span>Total Drawdown:</span>
                </span>
                <span className="text-[10px] text-stone-400">
                  Target: {METHOD_DRAWDOWN_TARGETS[methodId]?.idealStr || '3:00'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xl font-mono font-black text-amber-gold">
                  {formatSecondsToMmSs(actualDrawdownSec)}
                </span>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setActualDrawdownSec(prev => Math.max(20, prev - 10))}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-cream-light font-bold border border-white/10 active:scale-95"
                  >
                    -10s
                  </button>
                  <button
                    type="button"
                    onClick={() => setActualDrawdownSec(prev => Math.min(600, prev + 10))}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-cream-light font-bold border border-white/10 active:scale-95"
                  >
                    +10s
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dial-In Assistant Recommendation Card */}
          {dialInDiagnosis && (
            <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2.5 animate-fade-in shadow-xl ${
              dialInDiagnosis.tasteProfile === 'balanced' || dialInDiagnosis.tasteProfile === 'sweet'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
                : dialInDiagnosis.tasteProfile === 'bitter'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-100'
                : dialInDiagnosis.tasteProfile === 'weak'
                ? 'bg-sky-500/10 border-sky-500/40 text-sky-100'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-100'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-gold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dial-In Assistant Suggestion:</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                  dialInDiagnosis.diagnosisType === 'golden_cup'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {dialInDiagnosis.headline}
                </span>
              </div>

              <p className="text-[12px] leading-relaxed text-cream-light font-sans font-medium">
                "{dialInDiagnosis.recommendationText}"
              </p>

              {/* Quantitative Tweaks Grid */}
              {dialInDiagnosis.recipePatch && (
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                    <span className="text-[9px] text-stone-400 uppercase block">Next Grind</span>
                    <span className="font-bold text-amber-gold truncate block">
                      {dialInDiagnosis.recipePatch.grindSetting || 'Lock In'}
                    </span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">
                      {dialInDiagnosis.recipePatch.grindShift > 0 
                        ? `+${dialInDiagnosis.recipePatch.grindShift} coarser` 
                        : dialInDiagnosis.recipePatch.grindShift < 0 
                        ? `${dialInDiagnosis.recipePatch.grindShift} finer` 
                        : 'Optimal'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                    <span className="text-[9px] text-stone-400 uppercase block">Water Temp</span>
                    <span className="font-bold text-cream-light block">
                      {dialInDiagnosis.recipePatch.tempF}°F
                    </span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">
                      {dialInDiagnosis.recipePatch.tempShiftF > 0 
                        ? `+${dialInDiagnosis.recipePatch.tempShiftF}° hotter` 
                        : dialInDiagnosis.recipePatch.tempShiftF < 0 
                        ? `${dialInDiagnosis.recipePatch.tempShiftF}° cooler` 
                        : 'Optimal'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                    <span className="text-[9px] text-stone-400 uppercase block">Next Ratio</span>
                    <span className="font-bold text-amber-gold block">
                      1 : {dialInDiagnosis.recipePatch.ratio}
                    </span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">
                      {dialInDiagnosis.recipePatch.ratioShift !== 0 
                        ? `${dialInDiagnosis.recipePatch.ratioShift > 0 ? '+' : ''}${dialInDiagnosis.recipePatch.ratioShift}` 
                        : 'Optimal'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Side-by-Side Comparison with Previous Brew of this Bean */}
          {lastBrew && (
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-300">
                <span className="flex items-center gap-1.5 text-amber-gold">
                  <History className="w-3.5 h-3.5" />
                  <span>Side-by-Side Brew Evolution</span>
                </span>
                <span className="text-[10px] text-stone-400">
                  Previous: {lastBrew.date}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                {/* Previous Brew Card */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">
                    Previous Extraction:
                  </div>
                  <div className="text-stone-300 font-bold">
                    {lastBrew.durationFormatted || lastBrew.time || '3:00'} • {lastBrew.grindStr || 'Med-Fine'}
                  </div>
                  <div className="text-stone-400 text-[10px]">
                    Ratio: {lastBrew.ratioStr || `1:${lastBrew.ratio || 16}`} • {lastBrew.tempStr || `${lastBrew.tempF || 202}°F`}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold pt-0.5">
                    <span>{lastBrew.tasteFeedback || 'Logged'}</span>
                    <span>({lastBrew.rating || 3}★)</span>
                  </div>
                </div>

                {/* Current Brew Card */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">
                    Current Extraction:
                  </div>
                  <div className="text-cream-light font-bold">
                    {formatSecondsToMmSs(actualDrawdownSec)} • {initialGrind}
                  </div>
                  <div className="text-stone-300 text-[10px]">
                    Ratio: 1:{effectiveRatio} • {initialTempF}°F
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-bold pt-0.5">
                    <span>{tasteFeedback}</span>
                    <span>({rating}★)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Free-Text Notes & Optional Photo Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-stone-300">
              <span className="font-bold">Tasting Notes & Photo (Optional):</span>
              <span className="text-[10px] text-stone-500">Private to your journal</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Peach brightness, jasmine florals, sweet caramel..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-cream-light text-xs font-sans placeholder-stone-500 focus:outline-none focus:border-amber-gold transition"
              />

              {/* Photo Upload Trigger */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPhotoLoading}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light transition cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
                title="Attach cup photo"
              >
                <Camera className="w-4 h-4 text-amber-gold" />
              </button>
            </div>

            {/* Photo Thumbnail Preview */}
            {photoDataUrl && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-black/40 border border-white/10">
                <img 
                  src={photoDataUrl} 
                  alt="Brew cup thumbnail" 
                  className="w-12 h-12 object-cover rounded-lg border border-white/20" 
                />
                <div className="flex-1 text-[11px] font-mono text-stone-300">
                  <span>Photo attached (optimized thumbnail)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoDataUrl(null)}
                  className="p-1 text-stone-400 hover:text-rose-400"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/60 space-y-2">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => handleSaveAndApply(true)}
            disabled={isSaved}
            className={`w-full py-3 px-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-500 text-black'
                : 'btn-tactile-amber text-espresso-950 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved & Next Brew Primed!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Log & Apply Tweaks to Next Brew</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-stone-400">
            <button
              type="button"
              onClick={() => handleSaveAndApply(false)}
              className="hover:text-cream-light underline transition cursor-pointer"
            >
              Save to Journal only
            </button>

            {onOpenJournal && (
              <button
                type="button"
                onClick={() => { onClose(); onOpenJournal(); }}
                className="flex items-center gap-1 hover:text-amber-gold transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>View Full Journal</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
