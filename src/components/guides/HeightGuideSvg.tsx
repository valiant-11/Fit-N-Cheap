import React from 'react';

export const HeightGuideSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-h-64' }) => {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration: Measuring total rider height standing barefoot against a flat wall"
    >
      {/* Background Grid & Ground Line */}
      <line x1="20" y1="260" x2="300" y2="260" stroke="currentColor" strokeWidth="3" className="text-slate-400 dark:text-slate-600" />
      <text x="30" y="275" className="fill-slate-500 text-[10px] font-mono">Floor Level (Barefoot)</text>

      {/* Wall (Vertical Reference on the Left) */}
      <line x1="80" y1="20" x2="80" y2="260" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" className="text-slate-400 dark:text-slate-600" />
      <text x="45" y="35" className="fill-slate-500 text-[10px] font-mono -rotate-90">Flat Wall</text>

      {/* Rider Silhouette standing upright against wall */}
      {/* Head */}
      <circle cx="115" cy="55" r="18" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-100 dark:fill-slate-800" strokeWidth="2.5" />
      {/* Neck */}
      <path d="M110 73 L110 85 M120 73 L120 85" stroke="currentColor" strokeWidth="2.5" className="text-slate-800 dark:text-slate-200" />
      {/* Torso & Pelvis touching wall at back */}
      <path
        d="M85 85 C85 85 105 85 125 85 C132 105 130 145 122 170 C110 172 95 172 85 170 Z"
        className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200/80 dark:fill-slate-700/60"
        strokeWidth="2.5"
      />
      {/* Legs & Bare Feet */}
      <path
        d="M90 170 L88 258 M115 170 L115 258"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-slate-800 dark:text-slate-200"
      />
      {/* Feet touching floor */}
      <path d="M86 258 L75 258 M115 258 L128 258" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-800 dark:text-slate-200" />

      {/* Headtop level ruler/book indicator */}
      <rect x="75" y="34" width="70" height="6" rx="2" className="fill-amber-500 shadow-sm" />
      <text x="150" y="40" className="fill-amber-600 dark:fill-amber-400 text-[11px] font-bold font-sans">Level book/ruler</text>

      {/* Measurement Dimension Line (Floor to Top of Head) */}
      <g className="text-brand-500">
        {/* Top tick */}
        <line x1="190" y1="37" x2="230" y2="37" stroke="currentColor" strokeWidth="2" />
        {/* Bottom tick */}
        <line x1="190" y1="260" x2="230" y2="260" stroke="currentColor" strokeWidth="2" />
        {/* Vertical arrow line */}
        <line x1="210" y1="39" x2="210" y2="258" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Arrows */}
        <polygon points="210,36 206,46 214,46" fill="currentColor" />
        <polygon points="210,260 206,250 214,250" fill="currentColor" />

        {/* Measurement Label Badge */}
        <rect x="180" y="130" width="105" height="28" rx="6" className="fill-brand-500 text-slate-950" />
        <text x="232" y="148" textAnchor="middle" className="fill-slate-950 font-black text-[12px] font-sans">
          TOTAL HEIGHT
        </text>
      </g>

      {/* Contact Points Callouts */}
      <circle cx="82" cy="55" r="4" className="fill-rose-500" />
      <circle cx="82" cy="115" r="4" className="fill-rose-500" />
      <circle cx="82" cy="165" r="4" className="fill-rose-500" />
      <circle cx="82" cy="256" r="4" className="fill-rose-500" />
      <text x="88" y="118" className="fill-rose-600 dark:fill-rose-400 text-[9px] font-bold font-mono">Back flat against wall</text>
    </svg>
  );
};
