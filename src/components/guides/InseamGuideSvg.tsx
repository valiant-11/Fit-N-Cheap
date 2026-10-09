import React from 'react';

export const InseamGuideSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-h-64' }) => {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration: Measuring inseam barefoot with book spine pulled firmly up into crotch"
    >
      {/* Floor line */}
      <line x1="20" y1="260" x2="300" y2="260" stroke="currentColor" strokeWidth="3" className="text-slate-400 dark:text-slate-600" />
      <text x="30" y="275" className="fill-slate-500 text-[10px] font-mono">Floor Level</text>

      {/* Rider Lower Body Silhouette (Pelvis & legs spread ~20 cm apart) */}
      {/* Torso bottom / hips */}
      <path
        d="M85 70 C95 65 145 65 155 70 L150 115 L90 115 Z"
        className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200/80 dark:fill-slate-700/60"
        strokeWidth="2.5"
      />
      {/* Left Leg */}
      <path
        d="M90 115 L80 258"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-slate-800 dark:text-slate-200"
      />
      {/* Right Leg */}
      <path
        d="M150 115 L160 258"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-slate-800 dark:text-slate-200"
      />
      {/* Bare feet */}
      <path d="M78 258 L65 258 M160 258 L173 258" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-800 dark:text-slate-200" />

      {/* Feet stance dimension callout (~20 cm apart) */}
      <g className="text-slate-400">
        <line x1="78" y1="267" x2="160" y2="267" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <polygon points="78,267 82,265 82,269" fill="currentColor" />
        <polygon points="160,267 156,265 156,269" fill="currentColor" />
        <text x="120" y="276" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[9px] font-mono">
          feet ~20 cm (8 in) apart
        </text>
      </g>

      {/* Hardcover Book Pressed Firmly into Crotch */}
      <g>
        {/* Book spine horizontal pressed into perineum */}
        <rect
          x="92"
          y="110"
          width="56"
          height="14"
          rx="3"
          className="fill-amber-500 stroke-amber-600 shadow-sm"
          strokeWidth="1.5"
        />
        {/* Upward pressure arrows */}
        <polygon points="120,98 116,106 124,106" className="fill-amber-500" />
        <line x1="120" y1="106" x2="120" y2="114" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
        <text x="120" y="93" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-bold font-sans">
          Pull book up firmly
        </text>
        <text x="120" y="103" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 text-[8px] font-mono">
          (saddle pressure)
        </text>
      </g>

      {/* Inseam Dimension Arrow (Floor to top edge of book spine) */}
      <g className="text-brand-500">
        {/* Top tick from top of book */}
        <line x1="150" y1="110" x2="235" y2="110" stroke="currentColor" strokeWidth="2" />
        {/* Floor tick */}
        <line x1="175" y1="260" x2="235" y2="260" stroke="currentColor" strokeWidth="2" />
        {/* Vertical arrow */}
        <line x1="210" y1="113" x2="210" y2="257" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        <polygon points="210,110 206,120 214,120" fill="currentColor" />
        <polygon points="210,260 206,250 214,250" fill="currentColor" />

        {/* Badge */}
        <rect x="175" y="170" width="105" height="28" rx="6" className="fill-brand-500 text-slate-950" />
        <text x="227" y="188" textAnchor="middle" className="fill-slate-950 font-black text-[12px] font-sans">
          INSEAM
        </text>
      </g>
    </svg>
  );
};
