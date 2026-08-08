import React from 'react';
import { Coffee, Leaf, Scale, Gauge, Timer, CheckCircle2 } from 'lucide-react';

export default function StepIndicator({ currentStep, setCurrentStep, trackMode }) {
  const isCoffee = trackMode === 'coffee';

  const STEPS = [
    { id: 1, title: 'Choose Method', subtitle: isCoffee ? '6 Specialty Devices' : '5 Loose Teas', icon: isCoffee ? Coffee : Leaf },
    { id: 2, title: 'Ratio & Scaler', subtitle: 'Cups & Volume', icon: Scale },
    { id: 3, title: 'Grind & Beans', subtitle: 'Micron & Roasts', icon: Gauge },
    { id: 4, title: 'Guided Brew', subtitle: 'Timer & Extraction', icon: Timer }
  ];

  return (
    <nav className="sticky top-[108px] md:top-[70px] z-40 mb-6 backdrop-blur-2xl bg-[#0D0B0A]/95 border-y border-amber-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.85)] py-2.5 px-2 sm:px-4 lg:px-8 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative gap-1.5 sm:gap-3">
        
        {/* Background Connecting Timeline Line */}
        <div className="absolute top-1/2 left-6 right-6 h-[1.5px] bg-white/10 -translate-y-1/2 z-0 hidden md:block" />

        {STEPS.map((step) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative z-10 flex-1 flex justify-center min-w-0">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`w-full group flex items-center justify-center sm:justify-start space-x-1.5 sm:space-x-2.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-300 active:scale-95 ${
                  isActive
                    ? isCoffee
                      ? 'btn-tactile-amber text-espresso-950 font-extrabold shadow-[0_0_22px_rgba(212,140,70,0.5)] scale-[1.03] border-amber-gold'
                      : 'btn-tactile-sage text-slate-950 font-extrabold shadow-[0_0_22px_rgba(143,168,153,0.5)] scale-[1.03] border-sage-300'
                    : isCompleted
                    ? 'bg-[#181412]/90 border-emerald-500/40 text-emerald-300 hover:bg-[#201B18]'
                    : 'bg-[#12100E]/80 border-white/15 text-stone-300 hover:text-cream-light hover:bg-white/[0.08] hover:border-white/25'
                }`}
              >
                {/* Node Icon Circle */}
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-black/30 text-current font-bold'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/10 text-stone-400 group-hover:text-cream-light'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
                </div>

                {/* Step Metadata & Title (Visible on Mobile & Desktop) */}
                <div className="text-left min-w-0">
                  <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-extrabold truncate opacity-90">
                    0{step.id} • <span className="hidden xs:inline">{step.title}</span><span className="xs:hidden">{step.title.split(' ')[0]}</span>
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
