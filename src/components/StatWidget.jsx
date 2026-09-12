import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

/**
 * StatWidget
 * Minimal Linear-inspired metric card with trend indicator and editorial styling.
 */
export default function StatWidget({
  label,
  value,
  change,
  subtext,
  icon: Icon,
  trend = 'up',
  className = ''
}) {
  return (
    <div className={`editorial-card p-5 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-sans font-semibold tracking-wider text-[#766A62] uppercase">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center text-[#A8622D]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5 mb-1">
        <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
          {value}
        </span>
        {change && (
          <span className="inline-flex items-center text-xs font-mono font-bold text-[#2F663C] bg-[#EBF3ED] px-1.5 py-0.5 rounded-md">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[11px] font-sans text-[#8C8178] line-clamp-1">
          {subtext}
        </p>
      )}
    </div>
  );
}
