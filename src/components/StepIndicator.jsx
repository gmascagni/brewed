import React from 'react';
import { Coffee, Leaf, Scale, Gauge, Timer, CheckCircle2 } from 'lucide-react';

export default function StepIndicator({ currentStep, setCurrentStep, trackMode }) {
  const isCoffee = trackMode === 'coffee';

  const STEPS = [
    { id: 1, title: 'Choose Method', subtitle: isCoffee ? '6 Specialty Devices' : '5 Loose Teas', icon: isCoffee ? Coffee : Leaf },
    { id: 2, title: 'Ratio & Scaler', subtitle: 'Cups & Water Volume', icon: Scale },
    { id: 3, title: 'Grind & Beans', subtitle: 'Micron & Roasts', icon: Gauge },
    { id: 4, title: 'Guided Brew', subtitle: 'Timer & Extraction', icon: Timer }
  ];

  return (
    <nav className="sticky top-[73px] z-40 mb-10 backdrop-blur-2xl bg-[#0D0B0A]/90 border-y border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-4 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* Background Connecting Timeline Line */}
        <div className="absolute top-1/2 left-6 right-6 h-[1.5px] bg-white/10 -translate-y-1/2 z-0 hidden md:block" />

        {STEPS.map((step) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative z-10 flex-1 flex justify-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`group flex items-center space-x-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 active:scale-95 ${
                  isActive
                    ? isCoffee
                      ? 'bg-amber-500/15 border-amber-400/60 text-cream-light font-extrabold shadow-[0_0_25px_rgba(212,140,70,0.25)] ring-1 ring-amber-400/40 backdrop-blur-md'
                      : 'bg-emerald-500/15 border-emerald-400/60 text-cream-light font-extrabold shadow-[0_0_25px_rgba(143,168,153,0.25)] ring-1 ring-emerald-400/40 backdrop-blur-md'
                    : isCompleted
                    ? 'bg-[#181412]/80 border-emerald-500/30 text-emerald-300 hover:bg-[#201B18]'
                    : 'bg-[#12100E]/70 border-white/[0.08] text-stone-400 hover:text-cream-light hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                {/* Node Icon Circle */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? isCoffee
                      ? 'bg-amber-gold text-espresso-950 shadow-[0_0_15px_rgba(212,140,70,0.6)] font-bold'
                      : 'bg-sage-300 text-slate-950 shadow-[0_0_15px_rgba(143,168,153,0.6)] font-bold'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/[0.05] text-stone-400 group-hover:text-cream-light border border-white/[0.08]'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>

                {/* Step Metadata & Title */}
                <div className="text-left hidden lg:block">
                  <div className="text-[10px] uppercase font-mono tracking-[0.2em] font-extrabold text-amber-gold/90 mb-0.5">
                    0{step.id} • {isCompleted ? 'Complete' : isActive ? 'In Progress' : 'Pending'}
                  </div>
                  <div className="text-xs font-serif font-bold tracking-wide text-cream-light whitespace-nowrap">
                    {step.title}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
