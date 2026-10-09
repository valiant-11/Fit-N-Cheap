import React from 'react';
import type { RidingStyle } from '../../types';

interface RidingStyleGuideSvgProps {
  style: RidingStyle;
  className?: string;
}

export const RidingStyleGuideSvg: React.FC<RidingStyleGuideSvgProps> = ({
  style,
  className = 'w-full h-auto max-h-40',
}) => {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Riding style posture on bike: ${style}`}
    >
      {/* Ground line */}
      <line x1="10" y1="140" x2="230" y2="140" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-600" />

      {/* Schematic Bike Wheels */}
      <circle cx="50" cy="115" r="22" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-600" />
      <circle cx="180" cy="115" r="22" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-600" />

      {/* Simplified Bike Frame (BB at 115,115) */}
      <path
        d="M50 115 L95 85 L115 115 L50 115 M95 85 L155 85 L165 75 L180 115 M115 115 L155 85"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-500 dark:text-slate-500"
      />
      {/* Seatpost and Saddle (top of saddle at 90, 75) */}
      <line x1="115" y1="115" x2="90" y2="75" stroke="currentColor" strokeWidth="2" className="text-slate-700 dark:text-slate-300" />
      <rect x="75" y="72" width="30" height="5" rx="2" className="fill-slate-800 dark:fill-slate-200" />

      {/* Handlebars / Stem (varies slightly by style) */}
      {style === 'endurance' && (
        <g>
          {/* Taller stem/spacers */}
          <line x1="155" y1="85" x2="160" y2="60" stroke="currentColor" strokeWidth="3" className="text-slate-600" />
          <path d="M160 60 C165 60 170 65 168 72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-slate-700 dark:text-slate-300" />

          {/* Upright rider (~48° back angle) */}
          {/* Hip on saddle */}
          <circle cx="92" cy="73" r="5" className="fill-brand-500" />
          {/* Torso */}
          <line x1="92" y1="73" x2="132" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-brand-500" />
          {/* Head */}
          <circle cx="140" cy="32" r="9" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
          {/* Arm to hood */}
          <path d="M132 40 L165 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-brand-600 dark:text-brand-400" />
          {/* Angle note badge */}
          <text x="110" y="24" className="fill-brand-600 dark:fill-brand-400 text-[10px] font-bold font-sans">
            Back ~48° (Upright)
          </text>
        </g>
      )}

      {style === 'balanced' && (
        <g>
          {/* Moderate stem */}
          <line x1="155" y1="85" x2="163" y2="68" stroke="currentColor" strokeWidth="3" className="text-slate-600" />
          <path d="M163 68 C168 68 174 72 172 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-slate-700 dark:text-slate-300" />

          {/* Sporty rider (~43° back angle) */}
          <circle cx="92" cy="73" r="5" className="fill-cyan-500" />
          {/* Torso */}
          <line x1="92" y1="73" x2="138" y2="45" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-cyan-500" />
          {/* Head */}
          <circle cx="148" cy="38" r="9" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
          {/* Arm to hood */}
          <path d="M138 45 L170 72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-cyan-600 dark:text-cyan-400" />
          {/* Angle note badge */}
          <text x="110" y="24" className="fill-cyan-600 dark:fill-cyan-400 text-[10px] font-bold font-sans">
            Back ~43° (Sportive)
          </text>
        </g>
      )}

      {style === 'race' && (
        <g>
          {/* Slammed stem, zero spacers */}
          <line x1="155" y1="85" x2="165" y2="76" stroke="currentColor" strokeWidth="3" className="text-slate-600" />
          <path d="M165 76 C170 76 177 80 175 88" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-slate-700 dark:text-slate-300" />

          {/* Aggressive flat back (~34° back angle) */}
          <circle cx="92" cy="73" r="5" className="fill-rose-500" />
          {/* Torso */}
          <line x1="92" y1="73" x2="145" y2="52" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-rose-500" />
          {/* Head */}
          <circle cx="156" cy="46" r="9" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
          {/* Arm reaching to drops */}
          <path d="M145 52 L172 82" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-rose-600 dark:fill-rose-400" />
          {/* Angle note badge */}
          <text x="110" y="24" className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-sans">
            Back ~34° (Aero Race)
          </text>
        </g>
      )}
    </svg>
  );
};
