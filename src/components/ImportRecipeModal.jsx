import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  DownloadCloud, 
  Play, 
  Check, 
  Sliders, 
  Coffee, 
  Timer, 
  Scale, 
  Thermometer, 
  FileText,
  Link,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { parseFreeTextRecipe } from '../utils/recipeParser';
import { trackEvent } from '../utils/analytics';
import { hapticTap, hapticSuccess } from '../utils/haptics';

const EXAMPLE_RECIPES = [
  {
    label: 'V60 5-Pour (YouTube)',
    text: `James Hoffmann V60 Technique
Dose: 15g coffee
Water: 250g water (1:16.6 ratio)
Water Temp: 96°C / 205°F
Grind: Medium-Fine (Comandante 22 clicks)

0:00 - 50g bloom (45s gentle swirl)
0:45 - Pour to 100g in 15s
1:00 - Pour to 150g in 15s
1:15 - Pour to 200g in 15s
1:30 - Final pour to 250g
3:00 - Complete flat drawdown`
  },
  {
    label: 'AeroPress Inverted (Instagram)',
    text: `AeroPress Championship Inverted
16g light roast coffee, fine grind (14 clicks Timemore).
Water: 224g at 90C.
Inverted setup:
0:00 - Pour 60g bloom water, vigorous 10s stir.
0:30 - Top off to 224g, screw cap.
1:00 - Invert onto server and press gently for 30s.
1:30 - Finish press at gentle hiss.`
  },
  {
    label: 'Kalita Flat-Bed (Blog)',
    text: `Kalita Wave 185 Triple Pour
20g coffee to 320g water at 202°F. Medium grind.
Step 1: 60g bloom for 40 seconds.
Step 2: Pulse pour to 180g in concentric spirals.
Step 3: Pulse pour to 320g and let drawdown finish around 3:15.`
  }
];

export default function ImportRecipeModal({
  isOpen,
  onClose,
  onRecipeSaved,
  onSelectRecipeToBrew
}) {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [parsedRecipe, setParsedRecipe] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleParse = (textToParse = rawText) => {
    hapticTap();
    setParseError(null);
    if (!textToParse.trim()) {
      setParseError('Please paste some recipe text or a URL to import.');
      return;
    }

    try {
      const result = parseFreeTextRecipe(textToParse);
      if (!result) {
        setParseError('Could not recognize coffee recipe metrics. Try entering dose (e.g. 15g) and water (e.g. 250g).');
        return;
      }
      setParsedRecipe(result);
      trackEvent('import_recipe_parsed', { method: result.methodId });
    } catch (err) {
      console.warn('Failed to parse text recipe:', err);
      setParseError('An error occurred during recipe parsing. Check the format and try again.');
    }
  };

  const handleSaveToBox = () => {
    if (!parsedRecipe) return;
    hapticSuccess();

    try {
      const existingRaw = localStorage.getItem('the_brew_app_custom_recipes');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [parsedRecipe, ...existing.filter(r => r.id !== parsedRecipe.id)];
      localStorage.setItem('the_brew_app_custom_recipes', JSON.stringify(updated));

      if (onRecipeSaved) onRecipeSaved(parsedRecipe);
      trackEvent('save_imported_recipe', { id: parsedRecipe.id, method: parsedRecipe.methodId });

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to save recipe:', err);
    }
  };

  const handleBrewNow = () => {
    if (!parsedRecipe) return;
    hapticTap();
    handleSaveToBox();
    if (onSelectRecipeToBrew) {
      onSelectRecipeToBrew(parsedRecipe);
    }
    onClose();
  };

  const handleSelectExample = (ex) => {
    setRawText(ex.text);
    handleParse(ex.text);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-recipe-modal-title"
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#14100D] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-cream-light animate-slide-up">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-gold flex items-center justify-center shrink-0">
              <DownloadCloud className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                  Smart Recipe Importer
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Universal Parser
                </span>
              </div>
              <h3 id="import-recipe-modal-title" className="font-serif text-lg sm:text-xl font-bold text-cream-light leading-tight mt-0.5">
                Import from YouTube, Instagram, or Text
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/10 transition cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-left">
          
          {!parsedRecipe ? (
            <>
              {/* Instructions */}
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Paste any recipe text from social media captions, video descriptions, blog posts, or paste a recipe URL. Our engine automatically parses the method, brew ratio, temperature, and extraction step timeline.
              </p>

              {/* Example Sample Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">
                  Quick Sample Templates:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_RECIPES.map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectExample(ex)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-200 transition active:scale-95 cursor-pointer"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>Paste Recipe Text or Link:</span>
                  <span>Supports markdown, bullets & timelines</span>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste recipe text here... e.g.:&#10;V60 15g coffee : 250g water at 96°C&#10;Medium-fine grind&#10;0:00 50g bloom (45s)&#10;0:45 pour to 150g&#10;1:30 pour to 250g"
                  rows={8}
                  className="w-full p-4 rounded-2xl bg-black/50 border border-white/15 text-cream-light font-mono text-xs focus:outline-none focus:border-amber-gold transition leading-relaxed placeholder-stone-600"
                />
              </div>

              {parseError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Parse Button */}
              <button
                type="button"
                onClick={() => handleParse()}
                disabled={!rawText.trim()}
                className="w-full py-3.5 px-4 rounded-2xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Parse & Analyze Recipe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Parsed Recipe Tuning & Verification View */
            <div className="space-y-5 animate-fade-in">
              {/* Recipe Headline Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase">
                    {parsedRecipe.methodName}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {parsedRecipe.steps.length} Structured Phases
                  </span>
                </div>

                <input 
                  type="text"
                  value={parsedRecipe.title}
                  onChange={(e) => setParsedRecipe({ ...parsedRecipe, title: e.target.value })}
                  className="w-full bg-transparent font-serif text-lg font-bold text-cream-light border-b border-white/10 pb-1 focus:outline-none focus:border-amber-gold"
                  title="Recipe Title"
                />

                <p className="text-xs text-stone-300 font-sans italic line-clamp-2">
                  "{parsedRecipe.description}"
                </p>
              </div>

              {/* Extraction Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-[9px] text-stone-400 uppercase block font-semibold">Dry Dose</span>
                  <strong className="text-base text-cream-light block mt-0.5">{parsedRecipe.dryDoseGrams}g</strong>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-[9px] text-stone-400 uppercase block font-semibold">Water Amount</span>
                  <strong className="text-base text-cream-light block mt-0.5">{parsedRecipe.waterAmountMl} mL</strong>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-[9px] text-stone-400 uppercase block font-semibold">Brew Ratio</span>
                  <strong className="text-base text-amber-gold block mt-0.5">1 : {parsedRecipe.ratio}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-[9px] text-stone-400 uppercase block font-semibold">Water Temp</span>
                  <strong className="text-base text-cream-light block mt-0.5">{parsedRecipe.waterTempF}°F</strong>
                </div>
              </div>

              {/* Grind & Time Banner */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-stone-400 block">Grind Calibration:</span>
                  <strong className="text-stone-200">{parsedRecipe.grindSetting}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Estimated Extraction:</span>
                  <strong className="text-amber-gold">{Math.floor(parsedRecipe.totalTimeSec / 60)}m {parsedRecipe.totalTimeSec % 60}s</strong>
                </div>
              </div>

              {/* Step Timeline Breakdown */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-amber-gold font-bold block">
                  Extraction Step Schedule:
                </label>
                <div className="space-y-2">
                  {parsedRecipe.steps.map((st, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                          {i + 1}
                        </span>
                        <span className="text-stone-300">{st.action}</span>
                      </div>
                      <div className="flex items-center gap-3 text-stone-400 shrink-0">
                        <span>~{st.waterMl}g</span>
                        <span className="text-amber-gold font-bold">{st.durationSec}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSaveToBox}
                    disabled={isSaved}
                    className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <DownloadCloud className="w-4 h-4 text-amber-gold" />}
                    <span>{isSaved ? 'Saved to Box!' : 'Save to Recipe Box'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBrewNow}
                    className="py-3 px-4 rounded-2xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Guided Brew</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setParsedRecipe(null)}
                  className="w-full text-center text-xs font-mono text-stone-400 hover:text-white underline cursor-pointer py-1"
                >
                  ← Edit or Paste Different Recipe
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
