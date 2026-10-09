import React from 'react';

export const FootGuideSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-h-64' }) => {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration: Measuring foot length from heel against wall to longest toe"
    >
      {/* Floor & Wall Line */}
      <line x1="20" y1="210" x2="300" y2="210" stroke="currentColor" strokeWidth="3" className="text-slate-400 dark:text-slate-600" />
      <line x1="60" y1="50" x2="60" y2="210" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" className="text-slate-400 dark:text-slate-600" />
      <text x="35" y="70" className="fill-slate-500 text-[10px] font-mono -rotate-90">Wall</text>

      {/* Side Profile of Bare Foot resting flat */}
      <path
        d="M60 140 C60 180 62 205 75 208 C85 210 115 210 160 210 C185 210 215 208 245 206 C255 204 260 195 255 185 C248 175 235 170 205 160 C175 150 150 145 130 110 C120 90 115 70 110 50 L85 50 C85 70 80 90 70 115 C64 125 60 130 60 140 Z"
        className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200/80 dark:fill-slate-700/60"
        strokeWidth="2.5"
      />

      {/* Heel touching wall marker */}
      <circle cx="60" cy="180" r="5" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
      <text x="70" y="175" className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-sans">
        Heel to wall
      </text>

      {/* Longest Toe Marker */}
      <circle cx="255" cy="195" r="5" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
      <line x1="255" y1="130" x2="255" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" className="text-rose-500" />
      <text x="255" y="120" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-sans">
        Tip of Longest Toe
      </text>

      {/* Measurement Dimension (Wall/Heel to Tip of Longest Toe) */}
      <g className="text-brand-500">
        <line x1="60" y1="235" x2="60" y2="255" stroke="currentColor" strokeWidth="2" />
        <line x1="255" y1="235" x2="255" y2="255" stroke="currentColor" strokeWidth="2" />

        <line x1="63" y1="245" x2="252" y2="245" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        <polygon points="60,245 70,241 70,249" fill="currentColor" />
        <polygon points="255,245 245,241 245,249" fill="currentColor" />

        <rect x="110" y="230" width="100" height="28" rx="6" className="fill-brand-500 text-slate-950" />
        <text x="160" y="248" textAnchor="middle" className="fill-slate-950 font-black text-[12px] font-sans">
          FOOT LENGTH
        </text>
      </g>
    </svg>
  );
};
