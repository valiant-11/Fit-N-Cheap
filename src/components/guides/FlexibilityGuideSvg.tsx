import React from 'react';
import type { FlexibilityLevel } from '../../types';

interface FlexibilityGuideSvgProps {
  level: FlexibilityLevel;
  className?: string;
}

export const FlexibilityGuideSvg: React.FC<FlexibilityGuideSvgProps> = ({
  level,
  className = 'w-full h-auto max-h-40',
}) => {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Flexibility level illustration: ${level}`}
    >
      {/* Floor line */}
      <line x1="10" y1="140" x2="190" y2="140" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-600" />

      {/* Upright / Leaning legs (standing forward bend) */}
      {/* Straight legs */}
      <path
        d="M60 140 L65 80"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className="text-slate-700 dark:text-slate-300"
      />
      {/* Pelvis */}
      <circle cx="65" cy="80" r="8" className="fill-slate-400 dark:fill-slate-600" />

      {/* Feet */}
      <path d="M60 140 L75 140" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-slate-700 dark:text-slate-300" />

      {level === 'low' && (
        <g>
          {/* Stiff spine, reaching only to mid-shin (~45 deg) */}
          {/* Torso */}
          <path
            d="M65 80 L105 50"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-slate-700 dark:text-slate-300"
          />
          {/* Head */}
          <circle cx="115" cy="42" r="10" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
          {/* Arms reaching down to knee/shin */}
          <path
            d="M100 55 L75 95"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-amber-500"
          />
          {/* Reach target marker at mid-shin */}
          <circle cx="75" cy="95" r="4" className="fill-amber-500" />
          <text x="85" y="100" className="fill-amber-600 dark:fill-amber-400 text-[9px] font-bold font-sans">
            Mid-shin (~20 cm away)
          </text>
        </g>
      )}

      {level === 'medium' && (
        <g>
          {/* Average spine, fingertips touch toes (~75 deg forward bend) */}
          {/* Torso */}
          <path
            d="M65 80 L95 85"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-slate-700 dark:text-slate-300"
          />
          {/* Head */}
          <circle cx="105" cy="85" r="10" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
          {/* Arms reaching to toes */}
          <path
            d="M90 85 L75 136"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-cyan-500"
          />
          {/* Reach target marker at toes */}
          <circle cx="75" cy="136" r="4" className="fill-cyan-500" />
          <text x="85" y="132" className="fill-cyan-600 dark:fill-cyan-400 text-[9px] font-bold font-sans">
            Touches toes
          </text>
        </g>
      )}

      {level === 'high' && (
        <g>
          {/* Supple spine, folded flat, hands flat on floor past feet */}
          {/* Torso */}
          <path
            d="M65 80 L75 105"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-slate-700 dark:text-slate-300"
          />
          {/* Head folded down near knees */}
          <circle cx="75" cy="115" r="10" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
          {/* Arms reaching flat onto floor */}
          <path
            d="M75 105 L88 140"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-brand-500"
          />
          {/* Palms flat on floor */}
          <circle cx="88" cy="140" r="4" className="fill-brand-500" />
          <text x="96" y="135" className="fill-brand-600 dark:fill-brand-400 text-[9px] font-bold font-sans">
            Palms flat on floor
          </text>
        </g>
      )}
    </svg>
  );
};
