import React from 'react';

export const ArmGuideSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-h-64' }) => {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration: Measuring arm length from shoulder acromion bone to wrist crease"
    >
      {/* Upper body profile with arm extended forward-down at ~45° */}
      {/* Torso & Head silhouette */}
      <circle cx="65" cy="50" r="16" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-100 dark:fill-slate-800" strokeWidth="2" />
      <path
        d="M50 75 C60 70 80 70 85 75 L80 180 C70 185 55 185 45 180 Z"
        className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200/80 dark:fill-slate-700/60"
        strokeWidth="2.5"
      />

      {/* Shoulder Joint / Acromion Process Landmark */}
      <circle cx="85" cy="80" r="6" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
      <text x="85" y="65" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-sans">
        Bony Tip of Shoulder (Acromion)
      </text>

      {/* Arm extended straight down-forward */}
      {/* Upper arm & Forearm */}
      <path
        d="M85 80 L160 145 L225 200"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-300 dark:text-slate-600"
      />
      <path
        d="M85 80 L160 145 L225 200"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-800 dark:text-slate-200"
      />

      {/* Wrist Crease Landmark */}
      <circle cx="225" cy="200" r="6" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="2" />
      <line x1="225" y1="200" x2="265" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-rose-500" />
      <text x="268" y="204" className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-sans">
        Wrist Crease
      </text>

      {/* Hand / Palm */}
      <path
        d="M225 200 L245 215"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        className="text-slate-400 dark:text-slate-500"
      />

      {/* Measurement Dimension (Along the Arm Line) */}
      <g className="text-brand-500">
        {/* Dimension line parallel to arm, offset slightly */}
        <line x1="100" y1="65" x2="115" y2="52" stroke="currentColor" strokeWidth="1.5" />
        <line x1="240" y1="185" x2="255" y2="172" stroke="currentColor" strokeWidth="1.5" />

        <line x1="110" y1="58" x2="250" y2="180" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        <polygon points="107,55 118,58 113,67" fill="currentColor" />
        <polygon points="250,180 244,171 239,180" fill="currentColor" />

        {/* Badge */}
        <rect x="135" y="100" width="100" height="28" rx="6" className="fill-brand-500 text-slate-950" />
        <text x="185" y="118" textAnchor="middle" className="fill-slate-950 font-black text-[12px] font-sans">
          ARM LENGTH
        </text>
      </g>
    </svg>
  );
};
