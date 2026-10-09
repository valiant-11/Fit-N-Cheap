import React from 'react';

export const SetupGuideSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-h-72' }) => {
  return (
    <svg
      viewBox="0 0 540 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustration: Phone camera tripod setup 2-3 meters perpendicular to road bike on trainer"
    >
      {/* Floor Line */}
      <line x1="20" y1="230" x2="520" y2="230" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 dark:text-slate-600" />
      <text x="30" y="245" className="fill-slate-400 text-[10px] font-mono">Floor Level</text>

      {/* 1. Tripod with Smartphone on the Left */}
      <g>
        {/* Tripod Legs */}
        <line x1="70" y1="120" x2="45" y2="230" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 dark:text-slate-400" />
        <line x1="70" y1="120" x2="70" y2="230" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 dark:text-slate-400" />
        <line x1="70" y1="120" x2="95" y2="230" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 dark:text-slate-400" />

        {/* Tripod Mount & Phone */}
        <rect x="62" y="90" width="16" height="30" rx="3" className="fill-slate-800 dark:fill-slate-200 stroke-slate-900" strokeWidth="1.5" />
        {/* Phone Lens */}
        <circle cx="70" cy="100" r="3" className="fill-cyan-400" />

        {/* Camera Field of View (Perpendicular Cone) */}
        <polygon points="75,100 340,30 340,225" className="fill-cyan-500/10 dark:fill-cyan-400/10" />
        <line x1="75" y1="100" x2="340" y2="30" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="75" y1="100" x2="340" y2="225" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        <text x="70" y="78" textAnchor="middle" className="fill-slate-800 dark:fill-slate-200 text-[10px] font-bold font-sans">
          Phone / Tripod
        </text>
        <text x="70" y="88" textAnchor="middle" className="fill-slate-500 text-[8px] font-mono">
          (Crank / Hip Height)
        </text>
      </g>

      {/* Distance Callout (2-3 meters) */}
      <g className="text-amber-500">
        <line x1="75" y1="215" x2="380" y2="215" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="75,215 85,212 85,218" fill="currentColor" />
        <polygon points="380,215 370,212 370,218" fill="currentColor" />
        <rect x="190" y="205" width="80" height="18" rx="4" className="fill-amber-500 text-slate-950" />
        <text x="230" y="218" textAnchor="middle" className="fill-slate-950 font-black text-[10px] font-sans">
          2 – 3 METERS
        </text>
      </g>

      {/* 2. Bike & Rider on Indoor Trainer on the Right */}
      <g>
        {/* Indoor Trainer Base on Rear Wheel */}
        <polygon points="340,230 365,170 380,230" className="fill-slate-700/60 dark:fill-slate-600/40" />

        {/* Wheels */}
        <circle cx="365" cy="180" r="45" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 dark:text-slate-500" fill="none" />
        <circle cx="480" cy="180" r="45" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 dark:text-slate-500" fill="none" />

        {/* Bike Frame */}
        <path
          d="M365 180 L400 155 L420 180 L365 180 M400 155 L455 155 L465 145 L480 180 M420 180 L455 155"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-slate-600 dark:text-slate-400"
        />

        {/* Crank at 6 o'clock (Vertical Down) */}
        <line x1="420" y1="180" x2="420" y2="205" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <circle cx="420" cy="205" r="3" className="fill-brand-500" />
        <text x="420" y="222" textAnchor="middle" className="fill-brand-600 dark:fill-brand-400 text-[9px] font-bold font-sans">
          Crank 6 o&apos;clock
        </text>

        {/* Saddle & Seatpost */}
        <line x1="400" y1="155" x2="395" y2="135" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
        <rect x="382" y="132" width="24" height="4" rx="2" className="fill-slate-800 dark:fill-slate-200" />

        {/* Rider Silhouette with Landmark Sticker Dots */}
        {/* Hip */}
        <circle cx="395" cy="133" r="4" className="fill-rose-500" />
        {/* Knee at 6 o'clock */}
        <circle cx="410" cy="170" r="4" className="fill-rose-500" />
        {/* Ankle */}
        <circle cx="420" cy="205" r="4" className="fill-rose-500" />
        {/* Torso */}
        <line x1="395" y1="133" x2="435" y2="105" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-800 dark:text-slate-200" />
        {/* Shoulder */}
        <circle cx="435" cy="105" r="4" className="fill-rose-500" />
        {/* Elbow */}
        <circle cx="450" cy="125" r="3.5" className="fill-rose-500" />
        {/* Wrist on Hoods */}
        <circle cx="465" cy="140" r="3.5" className="fill-rose-500" />
        {/* Head */}
        <circle cx="445" cy="95" r="9" className="stroke-slate-800 dark:stroke-slate-200 fill-slate-200 dark:fill-slate-700" strokeWidth="1.5" />
        {/* Arms */}
        <path d="M435 105 L450 125 L465 140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-slate-700 dark:text-slate-300" />
        {/* Legs */}
        <path d="M395 133 L410 170 L420 205" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-slate-700 dark:text-slate-300" />

        {/* Landmark sticker callout */}
        <rect x="440" y="55" width="90" height="20" rx="4" className="fill-rose-500 text-white" />
        <text x="485" y="69" textAnchor="middle" className="fill-white font-bold text-[9px] font-sans">
          Optional stickers
        </text>
        <line x1="440" y1="75" x2="435" y2="101" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
      </g>
    </svg>
  );
};

export const GoodVsBadPhotoSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {/* GOOD PHOTO EXAMPLE */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-brand-500/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            GOOD PHOTO
          </span>
          <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-semibold">
            High Accuracy
          </span>
        </div>

        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-slate-50 dark:bg-slate-950 rounded-xl">
          {/* Level guidelines */}
          <line x1="10" y1="120" x2="230" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Side view schematic */}
          <circle cx="60" cy="95" r="24" stroke="#64748b" strokeWidth="2" fill="none" />
          <circle cx="170" cy="95" r="24" stroke="#64748b" strokeWidth="2" fill="none" />
          <path d="M60 95 L100 75 L115 95 M100 75 L150 75 L160 65 L170 95 M115 95 L150 75" stroke="#64748b" strokeWidth="2" />
          {/* Crank 6 o'clock */}
          <line x1="115" y1="95" x2="115" y2="114" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          {/* Rider */}
          <line x1="95" y1="62" x2="135" y2="35" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M95 62 L110 88 L115 114" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="140" cy="28" r="8" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1.5" />
          {/* Joint highlight points */}
          <circle cx="95" cy="62" r="3" fill="#22c55e" />
          <circle cx="135" cy="35" r="3" fill="#22c55e" />
          <circle cx="110" cy="88" r="3" fill="#22c55e" />
          <circle cx="115" cy="114" r="3" fill="#22c55e" />
        </svg>

        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
          <li>Phone is strictly level and 90° perpendicular.</li>
          <li>Drive-side facing camera with crank at 6 o&apos;clock.</li>
          <li>Fitted cycling kit (joints clearly visible).</li>
        </ul>
      </div>

      {/* BAD PHOTO EXAMPLE */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-500/40 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            BAD PHOTO
          </span>
          <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-semibold">
            Perspective Error
          </span>
        </div>

        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-slate-50 dark:bg-slate-950 rounded-xl">
          {/* Skewed / tilted ground line */}
          <line x1="10" y1="130" x2="230" y2="105" stroke="#fda4af" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Distorted angled perspective */}
          <ellipse cx="70" cy="100" rx="15" ry="24" stroke="#94a3b8" strokeWidth="1.5" transform="rotate(-15 70 100)" />
          <ellipse cx="160" cy="90" rx="20" ry="22" stroke="#94a3b8" strokeWidth="1.5" transform="rotate(-15 160 90)" />
          {/* Angled bike */}
          <path d="M70 100 L110 70 L120 90 M110 70 L150 65 L160 90" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Wrong crank angle */}
          <line x1="120" y1="90" x2="135" y2="82" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          {/* Loose baggy clothes */}
          <path d="M100 60 C90 70 105 85 110 88" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          {/* Red X */}
          <line x1="20" y1="20" x2="40" y2="40" stroke="#f43f5e" strokeWidth="2.5" />
          <line x1="40" y1="20" x2="20" y2="40" stroke="#f43f5e" strokeWidth="2.5" />
        </svg>

        <ul className="text-xs text-rose-600 dark:text-rose-400 space-y-1 list-disc list-inside">
          <li>Angled from above, behind, or too close.</li>
          <li>Crank is NOT at bottom dead center (6 o&apos;clock).</li>
          <li>Baggy clothes or loose jacket hiding knee/hip joints.</li>
        </ul>
      </div>
    </div>
  );
};
