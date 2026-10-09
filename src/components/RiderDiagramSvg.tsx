import React, { useState } from 'react';
import type { FitResult, RiderMeasurements, UnitSystem } from '../types';
import { formatMeasurement, formatMm } from '../lib/fit/units';

interface RiderDiagramSvgProps {
  results: FitResult;
  measurements: RiderMeasurements;
  unit: UnitSystem;
}

export const RiderDiagramSvg: React.FC<RiderDiagramSvgProps> = ({
  results,
  measurements: _measurements,
  unit,
}) => {
  const [highlightedDimension, setHighlightedDimension] = useState<string | null>(null);

  // Geometry coordinate anchors in SVG space (viewBox 0 0 600 420)
  // Bottom Bracket (BB) Center: (220, 310)
  const bbX = 220;
  const bbY = 310;

  // Rear Dropout (axle): (80, 310)
  const rearAxleX = 80;
  const rearAxleY = 310;

  // Front Dropout (axle): (470, 310)
  const frontAxleX = 470;
  const frontAxleY = 310;

  // Headtube Top: (375, 175)
  const headtubeTopX = 375;
  const headtubeTopY = 175;

  // Seat Tube Junction (Seat cluster): (175, 205)
  const seatClusterX = 175;
  const seatClusterY = 205;

  // Saddle Top: (140, 110)
  const saddleTopX = 140;
  const saddleTopY = 110;

  // Handlebars (Hoods): (405, 155)
  const barX = 405;
  const barY = 155;

  // Pedal at 6 o'clock: (220, 350)
  const pedal6X = 220;
  const pedal6Y = 350;

  // Rider Joint Anchors
  // Hip / Pelvis on saddle: (145, 105)
  const hipX = 145;
  const hipY = 105;

  // Shoulder: (310, 65)
  const shoulderX = 310;
  const shoulderY = 65;

  // Elbow: (350, 115)
  const elbowX = 350;
  const elbowY = 115;

  // Wrist: (405, 150)
  const wristX = 405;
  const wristY = 150;

  // Knee at bottom of stroke: (200, 235)
  const kneeX = 200;
  const kneeY = 235;

  // Ankle / Foot on pedal at 6 o'clock: (220, 345)
  const ankleX = 220;
  const ankleY = 345;

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 space-y-4">
      {/* Top Header & Dimension Quick Select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
            <span>Biomechanical Rider & Geometry Blueprint</span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
              Interactive
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Hover or tap dimensions below to highlight key measurements on the rider.
          </p>
        </div>

        {/* Quick highlight filters */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {[
            { id: 'saddle', label: 'Saddle Height', color: 'bg-emerald-500/20 text-emerald-300' },
            { id: 'stack', label: 'Stack & Reach', color: 'bg-cyan-500/20 text-cyan-300' },
            { id: 'drop', label: 'Bar Drop', color: 'bg-amber-500/20 text-amber-300' },
            { id: 'knee', label: 'Knee Angle', color: 'bg-rose-500/20 text-rose-300' },
          ].map(btn => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setHighlightedDimension(highlightedDimension === btn.id ? null : btn.id)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                highlightedDimension === btn.id
                  ? 'border-white bg-white text-slate-950 font-bold'
                  : 'border-slate-800 bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 600 420"
          className="w-full h-auto max-h-[460px] select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="riderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="bbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ground Line */}
          <line x1="20" y1="375" x2="580" y2="375" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <text x="25" y="390" fill="#64748b" fontSize="10" fontFamily="monospace">
            Ground Plane
          </text>

          {/* 1. Road Bike Wheels */}
          {/* Rear Wheel */}
          <circle cx={rearAxleX} cy={rearAxleY} r="65" stroke="#475569" strokeWidth="3" fill="none" />
          <circle cx={rearAxleX} cy={rearAxleY} r="4" fill="#94a3b8" />
          {/* Front Wheel */}
          <circle cx={frontAxleX} cy={frontAxleY} r="65" stroke="#475569" strokeWidth="3" fill="none" />
          <circle cx={frontAxleX} cy={frontAxleY} r="4" fill="#94a3b8" />

          {/* 2. Bike Frame Geometry */}
          {/* Rear Triangle: Chainstay (Rear Axle -> BB), Seatstay (Rear Axle -> Seat Cluster) */}
          <line x1={rearAxleX} y1={rearAxleY} x2={bbX} y2={bbY} stroke="#64748b" strokeWidth="3.5" />
          <line x1={rearAxleX} y1={rearAxleY} x2={seatClusterX} y2={seatClusterY} stroke="#64748b" strokeWidth="3.5" />

          {/* Front Triangle: Seat Tube (BB -> Seat Cluster) */}
          <line
            x1={bbX}
            y1={bbY}
            x2={seatClusterX}
            y2={seatClusterY}
            stroke={highlightedDimension === 'saddle' ? '#22c55e' : '#64748b'}
            strokeWidth={highlightedDimension === 'saddle' ? '4.5' : '3.5'}
          />

          {/* Down Tube: BB -> Headtube Bottom */}
          <line x1={bbX} y1={bbY} x2="385" y2="215" stroke="#64748b" strokeWidth="4" />

          {/* Top Tube: Seat Cluster -> Headtube Top */}
          <line x1={seatClusterX} y1={seatClusterY} x2={headtubeTopX} y2={headtubeTopY} stroke="#64748b" strokeWidth="3.5" />

          {/* Headtube */}
          <line x1={headtubeTopX} y1={headtubeTopY} x2="385" y2="215" stroke="#94a3b8" strokeWidth="5" />

          {/* Fork: Headtube Bottom -> Front Axle */}
          <line x1="385" y1="215" x2={frontAxleX} y2={frontAxleY} stroke="#64748b" strokeWidth="3.5" />

          {/* Bottom Bracket (BB) Hub */}
          <circle cx={bbX} cy={bbY} r="18" fill="url(#bbGlow)" />
          <circle cx={bbX} cy={bbY} r="9" fill="#0f172a" stroke="#22c55e" strokeWidth="2.5" />
          <text x={bbX - 18} y={bbY + 22} fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">
            BB Center
          </text>

          {/* Seatpost extending above cluster to Saddle Top */}
          <line x1={seatClusterX} y1={seatClusterY} x2={saddleTopX + 15} y2={saddleTopY + 10} stroke="#94a3b8" strokeWidth="4" />
          {/* Saddle */}
          <path
            d={`M${saddleTopX - 25} ${saddleTopY + 5} Q${saddleTopX + 15} ${saddleTopY - 2} ${saddleTopX + 45} ${saddleTopY + 8} L${saddleTopX + 35} ${saddleTopY + 12} L${saddleTopX - 20} ${saddleTopY + 10} Z`}
            fill="#e2e8f0"
          />

          {/* Stem & Handlebar Drop */}
          <line x1={headtubeTopX} y1={headtubeTopY} x2="395" y2="160" stroke="#94a3b8" strokeWidth="4.5" />
          <path d="M395 160 C405 160 415 162 410 180" stroke="#cbd5e1" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* Crank & Pedal (at 6 o'clock position) */}
          <line x1={bbX} y1={bbY} x2={pedal6X} y2={pedal6Y} stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={pedal6X} cy={pedal6Y} r="3" fill="#38bdf8" />
          <rect x={pedal6X - 8} y={pedal6Y - 3} width="16" height="6" rx="2" fill="#94a3b8" />

          {/* 3. Rider Skeleton & Body Silhouette */}
          {/* Head & Helmet */}
          <circle cx="340" cy="35" r="15" fill="#1e293b" stroke="#f8fafc" strokeWidth="2" />
          <path d="M325 35 Q345 20 362 35" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Torso: Spine from Hip to Shoulder */}
          <line
            x1={hipX}
            y1={hipY}
            x2={shoulderX}
            y2={shoulderY}
            stroke={highlightedDimension === 'back' ? '#22c55e' : '#f8fafc'}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Arm: Shoulder -> Elbow -> Wrist */}
          <line x1={shoulderX} y1={shoulderY} x2={elbowX} y2={elbowY} stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
          <line x1={elbowX} y1={elbowY} x2={wristX} y2={wristY} stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />

          {/* Leg: Hip -> Knee -> Ankle at bottom of stroke */}
          <line
            x1={hipX}
            y1={hipY}
            x2={kneeX}
            y2={kneeY}
            stroke={highlightedDimension === 'knee' ? '#fb7185' : '#f8fafc'}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line
            x1={kneeX}
            y1={kneeY}
            x2={ankleX}
            y2={ankleY}
            stroke={highlightedDimension === 'knee' ? '#fb7185' : '#f8fafc'}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Joints */}
          <circle cx={hipX} cy={hipY} r="4" fill="#22c55e" />
          <circle cx={shoulderX} cy={shoulderY} r="4" fill="#06b6d4" />
          <circle cx={elbowX} cy={elbowY} r="3.5" fill="#06b6d4" />
          <circle cx={wristX} cy={wristY} r="3.5" fill="#06b6d4" />
          <circle cx={kneeX} cy={kneeY} r="4.5" fill="#fb7185" />
          <circle cx={ankleX} cy={ankleY} r="3.5" fill="#fb7185" />

          {/* 4. Biomechanical Dimension Overlay Lines */}

          {/* DIMENSION A: Saddle Height (BB to Saddle along line) */}
          <g className={highlightedDimension === 'saddle' ? 'opacity-100' : 'opacity-85'}>
            <line x1={bbX} y1={bbY} x2={saddleTopX + 15} y2={saddleTopY} stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points={`${saddleTopX + 15},${saddleTopY} ${saddleTopX + 22},${saddleTopY + 10} ${saddleTopX + 12},${saddleTopY + 12}`} fill="#10b981" />
            <polygon points={`${bbX},${bbY} ${bbX - 10},${bbY - 5} ${bbX - 5},${bbY - 12}`} fill="#10b981" />
            {/* Badge */}
            <rect x="75" y="195" width="105" height="22" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <text x="127" y="210" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
              Saddle: {formatMeasurement(results.saddleHeightAvg, unit)}
            </text>
          </g>

          {/* DIMENSION B: Stack & Reach */}
          <g className={highlightedDimension === 'stack' ? 'opacity-100' : 'opacity-80'}>
            {/* Stack line: Vertical from BB level to headtube level */}
            <line x1={bbX} y1={bbY} x2={bbX} y2={headtubeTopY} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1={bbX} y1={headtubeTopY} x2={headtubeTopX} y2={headtubeTopY} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Stack Label */}
            <rect x={bbX - 55} y="235" width="50" height="20" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x={bbX - 30} y="249" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Stack
            </text>

            {/* Reach Label */}
            <rect x="270" y={headtubeTopY - 26} width="68" height="20" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x="304" y={headtubeTopY - 13} textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Reach
            </text>
          </g>

          {/* DIMENSION C: Saddle-to-Bar Drop */}
          <g className={highlightedDimension === 'drop' ? 'opacity-100' : 'opacity-85'}>
            <line x1={saddleTopX + 45} y1={saddleTopY + 2} x2="440" y2={saddleTopY + 2} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={barX} y1={barY} x2="440" y2={barY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="435" y1={saddleTopY + 4} x2="435" y2={barY - 2} stroke="#f59e0b" strokeWidth="2" />
            <polygon points={`435,${saddleTopY + 2} 432,${saddleTopY + 9} 438,${saddleTopY + 9}`} fill="#f59e0b" />
            <polygon points={`435,${barY} 432,${barY - 7} 438,${barY - 7}`} fill="#f59e0b" />

            <rect x="445" y={saddleTopY + 12} width="115" height="22" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="502" y={saddleTopY + 27} textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
              Drop: {formatMm(results.saddleToBarDropMinMm, unit, { showUnit: false })}–{formatMm(results.saddleToBarDropMaxMm, unit)}
            </text>
          </g>

          {/* DIMENSION D: Knee Angle at 6 o'clock */}
          <g className={highlightedDimension === 'knee' ? 'opacity-100' : 'opacity-90'}>
            {/* Angle Arc at knee */}
            <path d={`M${kneeX - 6} ${kneeY - 15} Q${kneeX - 16} ${kneeY} ${kneeX} ${kneeY + 18}`} fill="none" stroke="#fb7185" strokeWidth="2.5" />
            <rect x="195" y="260" width="85" height="20" rx="4" fill="#0f172a" stroke="#fb7185" strokeWidth="1.5" />
            <text x="237" y="274" textAnchor="middle" fill="#fda4af" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
              Knee: 140°–150°
            </text>
          </g>

          {/* Torso Angle Callout */}
          <g>
            <rect x="220" y="50" width="85" height="20" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
            <text x="262" y="64" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
              Back ~{results.targetAngles.backAngleDeg.min}°–{results.targetAngles.backAngleDeg.max}°
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & plain-language guide beneath SVG */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Saddle: {formatMeasurement(results.saddleHeightAvg, unit)}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Reach: {formatMm(results.reachMinMm, unit, { showUnit: false })}–{formatMm(results.reachMaxMm, unit)}</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Drop: {formatMm(results.saddleToBarDropMinMm, unit, { showUnit: false })}–{formatMm(results.saddleToBarDropMaxMm, unit)}</span>
        </div>
        <div className="flex items-center gap-2 text-rose-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span>Knee at 6 o&apos;clock: 140°–150°</span>
        </div>
      </div>
    </div>
  );
};
