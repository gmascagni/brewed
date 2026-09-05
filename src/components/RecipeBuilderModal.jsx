import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Coffee, Leaf, Scale, Thermometer, Clock } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function RecipeBuilderModal({ isOpen, onClose, trackMode, onRecipeSaved }) {
  if (!isOpen) return null;

  const isCoffee = trackMode === 'coffee';

  const [title, setTitle] = useState('');
  const [methodId, setMethodId] = useState(isCoffee ? 'pour_over' : 'oolong_tea');
  const [beanName, setBeanName] = useState('');
  const [ratio, setRatio] = useState(isCoffee ? 16.0 : 20.0);
  const [dryDoseGrams, setDryDoseGrams] = useState(isCoffee ? 15.0 : 7.5);
  const [waterTempC, setWaterTempC] = useState(isCoffee ? 96 : 92);
  const [grindSetting, setGrindSetting] = useState('');
  const [description, setDescription] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [steps, setSteps] = useState([
    { order: 1, durationSec: 45, waterMl: 50, action: 'Bloom Pour & Swirl' },
    { order: 2, durationSec: 60, waterMl: 150, action: 'Concentric Spiral Pour' }
  ]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { order: steps.length + 1, durationSec: 30, waterMl: 250, action: 'Center Pour & Drawdown' }
    ]);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const methodNames = {
    classic_pour_over: 'Flat-Bottom Pour Over (Kalita)',
    pour_over: 'Hario V60 Dripper',
    chemex: 'Chemex Glass Brewer',
    french_press: 'French Press',
    espresso: 'Espresso (9-Bar)',
    moka_pot: 'Bialetti Moka Pot',
    aeropress: 'AeroPress',
    drip_brewer: 'Batch Precision Brewer',
    oolong_tea: 'Gongfu Oolong Gaiwan',
    matcha_tea: 'Japanese Matcha Whisk',
    green_tea: 'Sencha Green Tea Kyusu',
    english_breakfast: 'Royal English Breakfast',
    darjeeling_tea: 'Darjeeling First Flush',
    chai_masala: 'Masala Spiced Chai',
    ceylon_tea: 'Ceylon Orange Pekoe',
    white_tea: 'Silver Needle White Tea',
    turmeric_tea: 'Turmeric Botanical Tonic'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecipe = {
      id: `custom_rec_${Date.now()}`,
      title: title.trim(),
      technique: 'Custom Personal Recipe',
      badge: 'Personal Recipe',
      methodId,
      methodName: methodNames[methodId] || (isCoffee ? 'Pour Over' : 'Loose Leaf Tea'),
      trackMode,
      beanName: beanName.trim() || (isCoffee ? 'Custom Coffee' : 'Custom Tea'),
      roasterName: 'Personal Roaster / Selection',
      ratio: parseFloat(ratio) || 16.0,
      dryDoseGrams: parseFloat(dryDoseGrams) || 15.0,
      waterAmountMl: Math.round((parseFloat(dryDoseGrams) || 15.0) * (parseFloat(ratio) || 16.0)),
      waterTempC: parseInt(waterTempC, 10) || 96,
      grindSetting: grindSetting.trim() || 'Custom Setting',
      totalTimeSec: steps.reduce((acc, s) => acc + (parseInt(s.durationSec, 10) || 0), 0) || 180,
      description: description.trim() || 'Custom extraction recipe saved in your personal Recipe Box.',
      createdAt: new Date().toLocaleDateString(),
      isCustom: true,
      steps: steps.map((s, idx) => ({
        order: idx + 1,
        durationSec: parseInt(s.durationSec, 10) || 30,
        waterMl: parseInt(s.waterMl, 10) || 200,
        action: s.action || 'Extraction Step'
      }))
    };

    try {
      const existingRaw = localStorage.getItem('the_brew_app_custom_recipes');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newRecipe, ...existing];
      localStorage.setItem('the_brew_app_custom_recipes', JSON.stringify(updated));
      if (onRecipeSaved) onRecipeSaved(newRecipe);
      trackEvent('save_custom_recipe', { title: newRecipe.title, method_id: methodId });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to save custom recipe to localStorage:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative max-w-2xl w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Recipe Studio • Personal Recipe Box</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-cream-light mb-6">
          Create & Save Custom Recipe
        </h3>

        {savedSuccess && (
          <div className="p-3.5 mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
            <span>✓ Recipe saved successfully to your personal Recipe Box!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          <div>
            <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Recipe Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., High-Altitude Ethiopian V60 1:16"
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Brewing Method</label>
              <select
                value={methodId}
                onChange={(e) => setMethodId(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
              >
                {isCoffee ? (
                  <>
                    <option value="pour_over">Hario V60 Dripper</option>
                    <option value="classic_pour_over">Flat-Bottom Pour Over (Kalita)</option>
                    <option value="chemex">Chemex Glass Brewer</option>
                    <option value="french_press">French Press</option>
                    <option value="aeropress">AeroPress</option>
                    <option value="espresso">Espresso (9-Bar)</option>
                    <option value="moka_pot">Bialetti Moka Pot</option>
                    <option value="drip_brewer">Batch Precision Brewer</option>
                  </>
                ) : (
                  <>
                    <option value="oolong_tea">Gongfu Oolong Gaiwan</option>
                    <option value="matcha_tea">Japanese Matcha Whisk</option>
                    <option value="green_tea">Sencha Green Tea Kyusu</option>
                    <option value="english_breakfast">Royal English Breakfast</option>
                    <option value="darjeeling_tea">Darjeeling First Flush</option>
                    <option value="chai_masala">Masala Spiced Chai</option>
                    <option value="ceylon_tea">Ceylon Orange Pekoe</option>
                    <option value="white_tea">Silver Needle White Tea</option>
                    <option value="turmeric_tea">Turmeric Botanical Tonic</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Coffee Bean / Tea Name</label>
              <input
                type="text"
                value={beanName}
                onChange={(e) => setBeanName(e.target.value)}
                placeholder="E.g., Onyx Tropical Weather"
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Ratio (1 : X)</label>
              <input
                type="number"
                step="0.1"
                value={ratio}
                onChange={(e) => setRatio(parseFloat(e.target.value))}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Dose (Grams)</label>
              <input
                type="number"
                step="0.5"
                value={dryDoseGrams}
                onChange={(e) => setDryDoseGrams(parseFloat(e.target.value))}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Temp (°C)</label>
              <input
                type="number"
                value={waterTempC}
                onChange={(e) => setWaterTempC(parseInt(e.target.value))}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Description & Sensory Notes</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe flavor notes, bloom technique, and pour speed..."
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Save Recipe to Recipe Box</span>
          </button>

        </form>

      </div>
    </div>
  );
}
