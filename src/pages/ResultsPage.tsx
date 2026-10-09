import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import { calculateBikeFit } from '../lib/fit/engine';
import { formatMeasurement, formatMm } from '../lib/fit/units';
import { RiderDiagramSvg } from '../components/RiderDiagramSvg';
import type { RiderMeasurements } from '../types';
import {
  Compass,
  Printer,
  BookmarkPlus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Bike,
  Activity,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { measurements, unit, saveCurrentFit, loadSampleMeasurements, strings } = useFit();

  // Save Modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNotes, setSaveNotes] = useState('');
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(false);

  // Check if all required measurements are present
  const isComplete =
    measurements.height !== undefined &&
    measurements.inseam !== undefined &&
    measurements.torso !== undefined &&
    measurements.arm !== undefined &&
    measurements.shoulder !== undefined &&
    measurements.flexibility !== undefined &&
    measurements.ridingStyle !== undefined;

  const results = isComplete
    ? calculateBikeFit(measurements as RiderMeasurements)
    : null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveFit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!results) return;

    saveCurrentFit(saveName.trim() || `Fit Profile (${new Date().toLocaleDateString()})`, results, saveNotes.trim());
    setIsSaveModalOpen(false);
    setSavedSuccessMessage(true);
    setTimeout(() => setSavedSuccessMessage(false), 4000);
  };

  // If incomplete, prompt user to complete wizard or load sample
  if (!results) {
    return (
      <div className="max-w-2xl mx-auto w-full py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {strings.results.emptyNotice}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            We need your body measurements to calculate your custom saddle height, frame reach, stack, and cockpit setup.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            to="/wizard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
          >
            <span>Start Fit Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={loadSampleMeasurements}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Load Sample Measurements</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 py-2 sm:py-6 print:py-0 print:space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Biomechanical Summary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {strings.results.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Rider: {measurements.height} cm • Inseam: {measurements.inseam} cm • Style:{' '}
            <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{measurements.ridingStyle}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => setIsSaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{strings.common.saveThisFit}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{strings.common.print}</span>
          </button>
        </div>
      </div>

      {/* Success alert when saved */}
      {savedSuccessMessage && (
        <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>{strings.results.saveModal.success}</span>
          </div>
          <Link to="/saved" className="underline font-semibold">
            View in Saved Fits
          </Link>
        </div>
      )}

      {/* SECTION 1: INTERACTIVE RIDER BLUEPRINT SVG */}
      <section className="space-y-3">
        <RiderDiagramSvg
          results={results}
          measurements={measurements as RiderMeasurements}
          unit={unit}
        />
      </section>

      {/* SECTION 2: SADDLE SETUP CARDS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Bike className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {strings.results.sections.saddle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Saddle Height */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {strings.results.cards.saddleHeight.title}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold">
                BB to Saddle Top
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-brand-600 dark:text-brand-400 font-mono tracking-tight">
                {formatMeasurement(results.saddleHeightAvg, unit)}
              </span>
              <span className="text-xs text-slate-400">
                (recommended starting average)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Greg LeMond Method
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {formatMeasurement(results.saddleHeightLeMond, unit)}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Inseam × 0.883</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Hamley Method
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {formatMeasurement(results.saddleHeightHamley, unit)}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Inseam × 1.09 - crank</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              {strings.results.cards.saddleHeight.explanation}
            </p>
          </div>

          {/* Card: Saddle Setback (KOPS) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {strings.results.cards.saddleSetback.title}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                Fore / Aft
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                ~{formatMm(results.saddleSetbackMm, unit)}
              </span>
              <span className="text-xs text-slate-400">behind bottom bracket</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold block mb-0.5">Baseline Starting Point:</span>
              <p className="leading-relaxed">
                {results.saddleSetbackDescription}
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {strings.results.cards.saddleSetback.note}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: FRAME & COCKPIT TARGETS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {strings.results.sections.cockpit}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Frame Size Seat Tube */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {strings.results.cards.frameSize.title}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {formatMeasurement(results.frameSizeSeatTubeCT, unit)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Classical road seat tube center-to-top frame estimate.
            </p>
          </div>

          {/* Card: Target Reach */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
              {strings.results.cards.reach.title}
            </div>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {formatMm(results.reachMinMm, unit, { showUnit: false })} – {formatMm(results.reachMaxMm, unit)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              {results.reachMinMm}–{results.reachMaxMm} mm horizontal distance from BB to headtube top.
            </p>
          </div>

          {/* Card: Target Stack */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
              {strings.results.cards.stack.title}
            </div>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {formatMm(results.stackMinMm, unit, { showUnit: false })} – {formatMm(results.stackMaxMm, unit)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              {results.stackMinMm}–{results.stackMaxMm} mm vertical height from BB to headtube top.
            </p>
          </div>

          {/* Card: Saddle-to-Bar Drop */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              {strings.results.cards.drop.title}
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {formatMm(results.saddleToBarDropMinMm, unit, { showUnit: false })} – {formatMm(results.saddleToBarDropMaxMm, unit)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Vertical drop based on {measurements.flexibility} flexibility and {measurements.ridingStyle} style.
            </p>
          </div>
        </div>

        {/* Handlebars and Cranks row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Handlebar Width */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {strings.results.cards.handlebarWidth.title}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {results.handlebarWidthCm} cm (c-c)
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Matched to {measurements.shoulder} cm shoulder width.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
              {results.handlebarWidthCm}
            </div>
          </div>

          {/* Crank Length */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {strings.results.cards.crankLength.title}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {results.crankLengthMm} mm
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Optimal hip angle clearance at top dead center.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
              {results.crankLengthMm}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TARGET ANGLES CHECKLIST */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {strings.results.sections.angles}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Knee Angle */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
              Knee (6 o&apos;clock)
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {results.targetAngles.kneeBottomDeg.min}° – {results.targetAngles.kneeBottomDeg.max}°
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Interior angle at bottom dead center to protect the patella.
            </p>
          </div>

          {/* Back Angle */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
              Torso Angle vs Ground
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {results.targetAngles.backAngleDeg.min}° – {results.targetAngles.backAngleDeg.max}°
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Ideal incline for {measurements.ridingStyle} aerodynamics and back relief.
            </p>
          </div>

          {/* Elbow Angle */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
              Elbow Bend
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {results.targetAngles.elbowDeg.min}° – {results.targetAngles.elbowDeg.max}°
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Gentle bend absorbs road vibration and prevents numb fingers.
            </p>
          </div>

          {/* Shoulder Angle */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
              Shoulder-to-Torso
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {results.targetAngles.shoulderDeg.min}° – {results.targetAngles.shoulderDeg.max}°
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Arms comfortably support upper body weight.
            </p>
          </div>
        </div>
      </section>

      {/* Next Step CTA Banner */}
      <section className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-white">
            Want to verify your angles on the bike?
          </h3>
          <p className="text-xs text-slate-400">
            Take a side-view photo or video on your trainer and analyze your actual joint angles (Phase 2).
          </p>
        </div>
        <Link
          to="/posture"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md transition-colors whitespace-nowrap"
        >
          <span>Check Posture Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* SAVE THIS FIT MODAL */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {strings.results.saveModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {strings.results.saveModal.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={strings.results.saveModal.namePlaceholder}
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {strings.results.saveModal.notesLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={strings.results.saveModal.notesPlaceholder}
                  value={saveNotes}
                  onChange={e => setSaveNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {strings.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  {strings.results.saveModal.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
