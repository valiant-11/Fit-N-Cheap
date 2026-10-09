import React from 'react';

export const ShoulderGuideSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-h-64' }) => {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration: Measuring shoulder width across upper back from bone to bone"
    >
      {/* Back View of Rider Shoulders & Neck */}
      {/* Head rear view */}
      <circle cx="160" cy="45" r="18" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-100 dark:fill-slate-800" strokeWidth="2" />
      <path d="M152 63 L152 75 M168 63 L168 75" stroke="currentColor" strokeWidth="2" className="text-slate-800 dark:text-slate-200" />

      {/* Broad Upper Back / Shoulders Silhouette */}
      <path
        d="M60 115 C75 92 110 80 152 78 C158 78 162 78 168 78 C210 80 245 92 260 115 C250 145 240 190 235 220 C205 225 115 225 85 220 C80 190 70 145 60 115 Z"
        className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200/80 dark:fill-slate-700/60"
        strokeWidth="2.5"
      />

      {/* Spine line subtle dashed */}
      <line x1="160" y1="80" x2="160" y2="215" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-slate-400 dark:text-slate-500" />

      {/* Left Acromion Landmark (bony edge) */}
      <g>
        <circle cx="68" cy="112" r="6" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
        <line x1="68" y1="112" x2="68" y2="155" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" className="text-rose-500" />
        <text x="68" y="170" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 text-[9px] font-bold font-sans">
          Left Acromion
        </text>
        <text x="68" y="180" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 text-[8px] font-mono">
          (Bone Tip)
        </text>
      </g>

      {/* Right Acromion Landmark (bony edge) */}
      <g>
        <circle cx="252" cy="112" r="6" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
        <line x1="252" y1="112" x2="252" y2="155" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" className="text-rose-500" />
        <text x="252" y="170" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 text-[9px] font-bold font-sans">
          Right Acromion
        </text>
        <text x="252" y="180" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 text-[8px] font-mono">
          (Bone Tip)
        </text>
      </g>

      {/* Measurement Dimension (Across Top of Back) */}
      <g className="text-brand-500">
        <line x1="68" y1="90" x2="68" y2="105" stroke="currentColor" strokeWidth="2" />
        <line x1="252" y1="90" x2="252" y2="105" stroke="currentColor" strokeWidth="2" />

        <line x1="72" y1="95" x2="248" y2="95" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        <polygon points="68,95 78,91 78,99" fill="currentColor" />
        <polygon points="252,95 242,91 242,99" fill="currentColor" />

        {/* Badge */}
        <rect x="95" y="80" width="130" height="28" rx="6" className="fill-brand-500 text-slate-950" />
        <text x="160" y="98" textAnchor="middle" className="fill-slate-950 font-black text-[12px] font-sans">
          SHOULDER WIDTH
        </text>
      </g>

      <text x="160" y="245" textAnchor="middle" className="fill-slate-500 text-[10px] font-sans">
        Determines Handlebar Width (38, 40, 42, or 44 cm)
      </text>
    </svg>
  );
};
