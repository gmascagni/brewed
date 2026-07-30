import React from 'react';
import { Coffee, Leaf, Scale, Gauge, Timer, CheckCircle2, ChevronRight } from 'lucide-react';

export default function StepIndicator({ currentStep, setCurrentStep, trackMode }) {
  const isCoffee = trackMode === 'coffee';

  const STEPS = [
    { id: 1, title: 'Choose Method', subtitle: isCoffee ? '6 Devices' : '5 Teas', icon: isCoffee ? Coffee : Leaf },
    { id: 2, title: 'Ratio & Scaler', subtitle: 'Cups & Water', icon: Scale },
    { id: 3, title: 'Grind & Beans', subtitle: 'Microns & Roasts', icon: Gauge },
    { id: 4, title: 'Guided Brew', subtitle: 'Timer & Pour', icon: Timer }
  ];

  return (
    <div className="sticky top-[73px] z-40 mb-8 backdrop-blur-xl bg-espresso-950/90 border-y border-white/10 shadow-2xl py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 flex-shrink-0 group active:scale-95 ${
                  isActive
                    ? isCoffee
                      ? 'btn-tactile-amber text-espresso-950 font-extrabold shadow-lg shadow-amber-gold/20 scale-105 ring-2 ring-amber-gold'
                      : 'btn-tactile-sage text-cream-light font-extrabold shadow-lg shadow-sage-500/20 scale-105 ring-2 ring-sage-400'
                    : isCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-black/40 border-white/10 text-cream-soft/60 hover:text-cream-light hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-xl flex items-center justify-center ${
                  isActive
                    ? 'bg-black/20 text-current'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-cream-soft/70 group-hover:text-cream-light'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>

                <div className="text-left">
                  <div className="text-[10px] uppercase font-mono tracking-widest font-extrabold opacity-70">
                    Step 0{step.id}
                  </div>
                  <div className="text-xs font-bold font-serif tracking-wide whitespace-nowrap">
                    {step.title}
                  </div>
                </div>
              </button>

              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-cream-soft/30 flex-shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
