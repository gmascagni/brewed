import React from 'react';
import { Coffee, Leaf, Scale, Gauge, Timer, CheckCircle2 } from 'lucide-react';

export default function StepIndicator({ currentStep, setCurrentStep, trackMode }) {
  const isCoffee = trackMode === 'coffee';

  const STEPS = [
    { id: 1, title: 'Choose Method', subtitle: isCoffee ? '8 Devices' : '10 Teas', icon: isCoffee ? Coffee : Leaf },
    { id: 2, title: 'Ratio & Scaler', subtitle: 'Cups & Volume', icon: Scale },
    { id: 3, title: 'Grind & Specs', subtitle: isCoffee ? 'Micron & Roasts' : 'Leaf & Steeps', icon: Gauge },
    { id: 4, title: 'Guided Brew', subtitle: 'Timer & Extr.', icon: Timer }
  ];

  return (
    <nav className="w-full py-2 px-2 sm:px-4 lg:px-8 transition-colors duration-400 border-t border-b bg-[#FAF7F2] border-[#ECE6DC] relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative gap-1 sm:gap-3">
        
        {/* Background Connecting Timeline Line */}
        <div className="absolute top-1/2 left-6 right-6 h-[1.5px] bg-[#ECE6DC] -translate-y-1/2 z-0 hidden md:block" />

        {STEPS.map((step) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative z-1 flex-1 flex justify-center min-w-0">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`w-full group flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-[#14110F] text-[#FAF7F2] font-extrabold shadow-sm scale-[1.02] border-[#14110F]'
                    : isCompleted
                    ? 'bg-[#EBF3ED] border-[#C8E0CD] text-[#2F663C] hover:bg-[#DDF0E2]'
                    : 'bg-white/90 border-[#ECE6DC] text-[#766A62] hover:text-[#14110F] hover:bg-white'
                }`}
              >
                {/* Node Icon Circle */}
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-black/30 text-current font-bold'
                    : isCompleted
                    ? isCoffee
                      ? 'bg-[#A66E38]/20 text-[#D2A06E] border border-[#A66E38]/40'
                      : 'bg-sage-500/20 text-sage-300 border border-sage-500/40'
                    : 'bg-white/10 text-stone-400 group-hover:text-cream-light'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <StepIcon className="w-3 h-3" />}
                </div>

                {/* Step Metadata & Title */}
                <div className="text-left min-w-0">
                  <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-extrabold truncate opacity-90">
                    0{step.id} • <span className="hidden sm:inline">{step.title}</span><span className="sm:hidden">{step.title.split(' ')[0]}</span>
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
