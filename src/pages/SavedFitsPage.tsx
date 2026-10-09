import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import { formatMeasurement, formatMm } from '../lib/fit/units';
import { calculateBikeFit } from '../lib/fit/engine';
import type { SavedFit } from '../types';
import {
  FolderArchive,
  Trash2,
  ArrowRight,
  Compass,
  Calendar,
  GitCompare,
  Sparkles,
  X,
  Plus,
} from 'lucide-react';

export const SavedFitsPage: React.FC = () => {
  const { savedFits, deleteSavedFit, setMeasurements, unit, saveCurrentFit, strings } = useFit();
  const navigate = useNavigate();

  // Comparison state
  const [isComparing, setIsComparing] = useState(false);
  const [selectedFitIdA, setSelectedFitIdA] = useState<string>('');
  const [selectedFitIdB, setSelectedFitIdB] = useState<string>('');

  // Default selection for comparison when opening
  const handleOpenComparison = () => {
    if (savedFits.length >= 2) {
      setSelectedFitIdA(savedFits[0].id);
      setSelectedFitIdB(savedFits[1].id);
    } else if (savedFits.length === 1) {
      setSelectedFitIdA(savedFits[0].id);
      setSelectedFitIdB('');
    }
    setIsComparing(true);
  };

  const handleLoadSavedFit = (fit: SavedFit) => {
    setMeasurements({ ...fit.measurements });
    navigate('/results');
  };

  // Helper to create demo comparison fits if user wants to test
  const handleCreateDemoProfiles = () => {
    const demoA = {
      height: 178,
      inseam: 83,
      torso: 62,
      arm: 60,
      shoulder: 42,
      foot: 27,
      flexibility: 'medium' as const,
      ridingStyle: 'balanced' as const,
    };
    const resultsA = calculateBikeFit(demoA);
    saveCurrentFit('Road Club Setup (Balanced 54cm)', resultsA, 'Daily sportive setup with 100mm stem and 15mm spacers');

    const demoB = {
      height: 178,
      inseam: 83,
      torso: 62,
      arm: 60,
      shoulder: 42,
      foot: 27,
      flexibility: 'high' as const,
      ridingStyle: 'race' as const,
    };
    const resultsB = calculateBikeFit(demoB);
    saveCurrentFit('Aero Race Setup (Aggressive)', resultsB, 'Slammed stem with 110mm reach and deeper handlebar drop');

    setIsComparing(true);
  };

  const fitA = savedFits.find(f => f.id === selectedFitIdA) || savedFits[0];
  const fitB = savedFits.find(f => f.id === selectedFitIdB) || (savedFits.length > 1 ? savedFits[1] : undefined);

  // Helper to format numeric delta
  const renderDelta = (valA: number, valB: number, unitLabel: string, decimals = 1) => {
    const diff = valB - valA;
    if (Math.abs(diff) < 0.05) {
      return (
        <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
          Identical
        </span>
      );
    }
    const isPositive = diff > 0;
    const sign = isPositive ? '+' : '';
    return (
      <span
        className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
          isPositive
            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
            : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
        }`}
      >
        {sign}
        {diff.toFixed(decimals)} {unitLabel}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 py-4 sm:py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Browser Profiles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {strings.nav.saved}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Profiles saved locally on your device in localStorage. Never uploaded to any external server.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {savedFits.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                if (!isComparing) handleOpenComparison();
                else setIsComparing(false);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isComparing
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>{isComparing ? 'Close Comparison' : 'Compare 2 Fits'}</span>
            </button>
          )}

          <Link
            to="/wizard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Fit</span>
          </Link>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal / Section */}
      {isComparing && fitA && fitB && (
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Side-by-Side Fit Comparison
                </h2>
                <p className="text-xs text-slate-500">
                  Compare geometric blueprints, cockpit setups, and angles between two profiles.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsComparing(false)}
              className="self-end sm:self-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Dismiss comparison"
              aria-label="Dismiss comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-2">
              <label htmlFor="fit-profile-a-select" className="block text-xs font-black uppercase text-indigo-700 dark:text-indigo-300">
                Profile A (Baseline)
              </label>
              <select
                id="fit-profile-a-select"
                aria-label="Profile A (Baseline)"
                value={selectedFitIdA}
                onChange={e => setSelectedFitIdA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {savedFits.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.measurements.ridingStyle})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500">
                Created: {new Date(fitA.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
              <label htmlFor="fit-profile-b-select" className="block text-xs font-black uppercase text-amber-700 dark:text-amber-300">
                Profile B (Comparison)
              </label>
              <select
                id="fit-profile-b-select"
                aria-label="Profile B (Comparison)"
                value={selectedFitIdB}
                onChange={e => setSelectedFitIdB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {savedFits.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.measurements.ridingStyle})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500">
                Created: {new Date(fitB.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3 w-1/3">Parameter</th>
                  <th className="p-3 w-1/4 text-indigo-700 dark:text-indigo-400">Profile A: {fitA.name}</th>
                  <th className="p-3 w-1/4 text-amber-700 dark:text-amber-400">Profile B: {fitB.name}</th>
                  <th className="p-3 w-1/6 text-right">Difference (B vs A)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Rider Style & Flex */}
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <td colSpan={4} className="p-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-slate-500">
                    Rider Profile & Style
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Riding Style</td>
                  <td className="p-3 font-bold capitalize text-slate-900 dark:text-white">{fitA.measurements.ridingStyle}</td>
                  <td className="p-3 font-bold capitalize text-slate-900 dark:text-white">{fitB.measurements.ridingStyle}</td>
                  <td className="p-3 text-right">
                    {fitA.measurements.ridingStyle === fitB.measurements.ridingStyle ? (
                      <span className="text-[11px] text-slate-400">Same</span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600">Different style</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Flexibility</td>
                  <td className="p-3 font-bold capitalize text-slate-900 dark:text-white">{fitA.measurements.flexibility}</td>
                  <td className="p-3 font-bold capitalize text-slate-900 dark:text-white">{fitB.measurements.flexibility}</td>
                  <td className="p-3 text-right">
                    {fitA.measurements.flexibility === fitB.measurements.flexibility ? (
                      <span className="text-[11px] text-slate-400">Same</span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600">Different flex</span>
                    )}
                  </td>
                </tr>

                {/* Rider Measurements */}
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <td colSpan={4} className="p-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-slate-500">
                    Body Measurements
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Inseam</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitA.measurements.inseam, unit)}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitB.measurements.inseam, unit)}</td>
                  <td className="p-3 text-right">{renderDelta(fitA.measurements.inseam, fitB.measurements.inseam, unit)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Height</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitA.measurements.height, unit)}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitB.measurements.height, unit)}</td>
                  <td className="p-3 text-right">{renderDelta(fitA.measurements.height, fitB.measurements.height, unit)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Torso Length</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitA.measurements.torso, unit)}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitB.measurements.torso, unit)}</td>
                  <td className="p-3 text-right">{renderDelta(fitA.measurements.torso, fitB.measurements.torso, unit)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Arm Length</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitA.measurements.arm, unit)}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitB.measurements.arm, unit)}</td>
                  <td className="p-3 text-right">{renderDelta(fitA.measurements.arm, fitB.measurements.arm, unit)}</td>
                </tr>

                {/* Fit Blueprint Targets */}
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <td colSpan={4} className="p-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-slate-500">
                    Recommended Bike Fit Geometry
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">Saddle Height (Recommended)</td>
                  <td className="p-3 font-bold text-brand-600 dark:text-brand-400">{formatMeasurement(fitA.results.saddleHeightAvg, unit)}</td>
                  <td className="p-3 font-bold text-brand-600 dark:text-brand-400">{formatMeasurement(fitB.results.saddleHeightAvg, unit)}</td>
                  <td className="p-3 text-right">{renderDelta(fitA.results.saddleHeightAvg, fitB.results.saddleHeightAvg, unit)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Saddle Setback (KOPS mm)</td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">{fitA.results.saddleSetbackMm} mm</td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">{fitB.results.saddleSetbackMm} mm</td>
                  <td className="p-3 text-right">{renderDelta(fitA.results.saddleSetbackMm, fitB.results.saddleSetbackMm, 'mm', 0)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Seat Tube Frame Size (C-T)</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitA.results.frameSizeSeatTubeCT, unit)}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{formatMeasurement(fitB.results.frameSizeSeatTubeCT, unit)}</td>
                  <td className="p-3 text-right">{renderDelta(fitA.results.frameSizeSeatTubeCT, fitB.results.frameSizeSeatTubeCT, unit)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Target Reach Range</td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">
                    {formatMm(fitA.results.reachMinMm, unit)} – {formatMm(fitA.results.reachMaxMm, unit)}
                  </td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">
                    {formatMm(fitB.results.reachMinMm, unit)} – {formatMm(fitB.results.reachMaxMm, unit)}
                  </td>
                  <td className="p-3 text-right">
                    {renderDelta((fitA.results.reachMinMm + fitA.results.reachMaxMm) / 2, (fitB.results.reachMinMm + fitB.results.reachMaxMm) / 2, 'mm', 0)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Target Stack Range</td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">
                    {formatMm(fitA.results.stackMinMm, unit)} – {formatMm(fitA.results.stackMaxMm, unit)}
                  </td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">
                    {formatMm(fitB.results.stackMinMm, unit)} – {formatMm(fitB.results.stackMaxMm, unit)}
                  </td>
                  <td className="p-3 text-right">
                    {renderDelta((fitA.results.stackMinMm + fitA.results.stackMaxMm) / 2, (fitB.results.stackMinMm + fitB.results.stackMaxMm) / 2, 'mm', 0)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Saddle-to-Bar Drop</td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">
                    {formatMm(fitA.results.saddleToBarDropMinMm, unit)} – {formatMm(fitA.results.saddleToBarDropMaxMm, unit)}
                  </td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">
                    {formatMm(fitB.results.saddleToBarDropMinMm, unit)} – {formatMm(fitB.results.saddleToBarDropMaxMm, unit)}
                  </td>
                  <td className="p-3 text-right">
                    {renderDelta(
                      (fitA.results.saddleToBarDropMinMm + fitA.results.saddleToBarDropMaxMm) / 2,
                      (fitB.results.saddleToBarDropMinMm + fitB.results.saddleToBarDropMaxMm) / 2,
                      'mm',
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Handlebar Width</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{fitA.results.handlebarWidthCm} cm</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{fitB.results.handlebarWidthCm} cm</td>
                  <td className="p-3 text-right">{renderDelta(fitA.results.handlebarWidthCm, fitB.results.handlebarWidthCm, 'cm', 0)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">Crank Arm Length</td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">{fitA.results.crankLengthMm} mm</td>
                  <td className="p-3 font-mono text-slate-900 dark:text-white">{fitB.results.crankLengthMm} mm</td>
                  <td className="p-3 text-right">{renderDelta(fitA.results.crankLengthMm, fitB.results.crankLengthMm, 'mm', 1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Main List */}
      {savedFits.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FolderArchive className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No saved fits yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Run the measurement wizard and click &quot;Save this fit&quot; on the results page to keep a permanent record here, or create demo profiles to test the side-by-side comparison tool.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/wizard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-slate-950 font-bold text-xs shadow-xs"
            >
              <span>Start Fit Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={handleCreateDemoProfiles}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Create Demo Profiles to Compare</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {savedFits.map(fit => (
            <div
              key={fit.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {fit.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(fit.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{fit.measurements.ridingStyle} style</span>
                    <span>•</span>
                    <span className="capitalize">{fit.measurements.flexibility} flexibility</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadSavedFit(fit)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>View Blueprint</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSavedFit(fit.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Delete saved fit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Key Metrics Pill Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Saddle Height
                  </span>
                  <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                    {formatMeasurement(fit.results.saddleHeightAvg, unit)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Seat Tube (C-T)
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {formatMeasurement(fit.results.frameSizeSeatTubeCT, unit)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Bars / Crank
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {fit.results.handlebarWidthCm}cm / {fit.results.crankLengthMm}mm
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Rider Inseam
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {formatMeasurement(fit.measurements.inseam, unit)}
                  </span>
                </div>
              </div>

              {fit.notes && (
                <div className="text-xs text-slate-500 italic bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  &ldquo;{fit.notes}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
