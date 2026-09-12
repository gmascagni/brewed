import React from 'react';
import { Coffee, CheckCircle2, Circle } from 'lucide-react';

/**
 * OnBarSwitcher
 * Real-time barista switcher for active pour-over and espresso offerings.
 */
export default function OnBarSwitcher({
  beanName,
  roaster,
  origin,
  category = 'pour_over', // 'pour_over' | 'espresso'
  isOnBar = false,
  onToggle,
  disabled = false
}) {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
        isOnBar 
          ? 'bg-[#FFFFFF] border-[#C8E0CD] shadow-sm' 
          : 'bg-[#FAF7F2]/60 border-[#ECE6DC] opacity-75'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
            isOnBar
              ? 'bg-[#EBF3ED] border-[#C8E0CD] text-[#2F663C]'
              : 'bg-[#ECE6DC]/60 border-[#DFD7CB] text-[#8C8178]'
          }`}
        >
          <Coffee className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-sans font-bold text-sm text-[#14110F] truncate">
              {beanName}
            </h4>
            <span
              className={`text-[10px] font-mono font-semibold px-2 py-0.2 rounded-full uppercase ${
                category === 'espresso'
                  ? 'bg-[#FAF0E6] text-[#A25A24]'
                  : 'bg-[#F5EFE8] text-[#5C524B]'
              }`}
            >
              {category === 'espresso' ? 'Espresso' : 'Pour-Over'}
            </span>
          </div>
          <p className="text-xs text-[#766A62] font-sans truncate">
            {roaster} • <span className="text-[#5C524B]">{origin}</span>
          </p>
        </div>
      </div>

      {/* Toggle Control */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C88A4B] focus:ring-offset-2 ${
          isOnBar ? 'bg-[#2F663C]' : 'bg-[#D5CDC5]'
        }`}
        role="switch"
        aria-checked={isOnBar}
        aria-label={`Toggle ${beanName} on bar today`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            isOnBar ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
