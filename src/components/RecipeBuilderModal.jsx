import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Coffee, Leaf, Scale, Thermometer, Clock } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function RecipeBuilderModal({ isOpen, onClose, trackMode }) {
  if (!isOpen) return null;

  const isCoffee = trackMode === 'coffee';

  const [title, setTitle] = useState('');
  const [methodId, setMethodId] = useState('pour_over');
  const [beanName, setBeanName] = useState('');
  const [ratio, setRatio] = useState(16.0);
  const [dryDoseGrams, setDryDoseGrams] = useState(15.0);
  const [waterTempC, setWaterTempC] = useState(96);
  const [grindSetting, setGrindSetting] = useState('');
  const [description, setDescription] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    trackEvent('publish_custom_recipe', { title, method_id: methodId, ratio });
    alert(`Recipe "${title}" published successfully to the Community Recipe Explorer!`);
    onClose();
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
          <span>Recipe Studio • Publish Public Recipe</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-cream-light mb-6">
          Create & Publish Brew Recipe
        </h3>

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
                <option value="classic_pour_over">Flat-Bottom Pour Over (Kalita)</option>
                <option value="pour_over">Hario V60 Dripper</option>
                <option value="chemex">Chemex Glass Brewer</option>
                <option value="french_press">French Press</option>
                <option value="espresso">Espresso</option>
                <option value="moka_pot">Moka Pot</option>
                <option value="aeropress">AeroPress</option>
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
            className="w-full py-4 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all"
          >
            Publish Recipe to Community
          </button>

        </form>

      </div>
    </div>
  );
}
