import React from 'react';

export const TorsoGuideSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-h-64' }) => {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration: Measuring torso length from suprasternal throat notch to top of pubic bone"
    >
      {/* Front Torso Silhouette */}
      {/* Head & Neck */}
      <circle cx="110" cy="35" r="16" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-100 dark:fill-slate-800" strokeWidth="2" />
      <path d="M102 51 L102 65 M118 51 L118 65" stroke="currentColor" strokeWidth="2" className="text-slate-800 dark:text-slate-200" />

      {/* Shoulders, Chest, Waist, and Pelvis */}
      <path
        d="M65 80 C80 72 100 68 120 68 C140 68 160 72 175 80 C165 115 160 150 165 190 C155 210 145 225 135 230 C120 230 100 230 85 230 C75 225 65 210 55 190 C60 150 55 115 65 80 Z"
        className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200/80 dark:fill-slate-700/60"
        strokeWidth="2.5"
      />

      {/* Suprasternal Notch (Throat Hollow Dip) */}
      <g>
        <circle cx="110" cy="72" r="5" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
        {/* Collarbone contours */}
        <path d="M85 75 Q105 78 110 73 Q115 78 135 75" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
        <line x1="110" y1="72" x2="35" y2="72" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-rose-500" />
        <text x="30" y="66" className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-sans">
          Throat Dip (Notch)
        </text>
      </g>

      {/* Top of Pubic Bone Marker */}
      <g>
        <circle cx="110" cy="225" r="5" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
        <line x1="110" y1="225" x2="35" y2="225" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-rose-500" />
        <text x="30" y="240" className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-sans">
          Top of Pubic Bone
        </text>
      </g>

      {/* Measurement Dimension (Notch down to Pubic Bone) */}
      <g className="text-brand-500">
        <line x1="130" y1="72" x2="225" y2="72" stroke="currentColor" strokeWidth="2" />
        <line x1="135" y1="225" x2="225" y2="225" stroke="currentColor" strokeWidth="2" />

        <line x1="200" y1="75" x2="200" y2="222" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        <polygon points="200,72 196,82 204,82" fill="currentColor" />
        <polygon points="200,225 196,215 204,215" fill="currentColor" />

        <rect x="165" y="135" width="105" height="28" rx="6" className="fill-brand-500 text-slate-950" />
        <text x="217" y="153" textAnchor="middle" className="fill-slate-950 font-black text-[12px] font-sans">
          TORSO LENGTH
        </text>
      </g>
    </svg>
  );
};
