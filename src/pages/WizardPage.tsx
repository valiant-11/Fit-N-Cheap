import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import { FIT_CONSTANTS } from '../lib/fit/constants';
import { cmToInches, inchesToCm } from '../lib/fit/units';
import type { FlexibilityLevel, RidingStyle, RiderMeasurements } from '../types';
import {
  HeightGuideSvg,
  InseamGuideSvg,
  TorsoGuideSvg,
  ArmGuideSvg,
  ShoulderGuideSvg,
  FootGuideSvg,
  FlexibilityGuideSvg,
  RidingStyleGuideSvg,
} from '../components/guides';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const WizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { measurements, updateMeasurement, unit, loadSampleMeasurements, resetMeasurements, strings } = useFit();

  // Wizard state: current step index (0 to 7)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Total 8 steps
  const TOTAL_STEPS = 8;

  // Step definitions
  const stepKeys = [
    'height',
    'inseam',
    'torso',
    'arm',
    'shoulder',
    'foot',
    'flexibility',
    'ridingStyle',
  ] as const;

  const activeKey = stepKeys[currentStep];

  // Sync input value whenever currentStep or unit changes
  useEffect(() => {
    setErrorMessage(null);
    setWarningMessage(null);

    if (activeKey === 'flexibility' || activeKey === 'ridingStyle') {
      return;
    }

    const currentCm = measurements[activeKey as keyof RiderMeasurements] as number | undefined;
    if (currentCm !== undefined && currentCm > 0) {
      if (unit === 'in') {
        setInputValue(cmToInches(currentCm, 1).toString());
      } else {
        setInputValue(currentCm.toString());
      }
    } else {
      setInputValue('');
    }
  }, [currentStep, unit, activeKey, measurements]);

  // Helper: Get typical range in active unit
  const getTypicalRange = (key: 'height' | 'inseam' | 'torso' | 'arm' | 'shoulder' | 'foot') => {
    const range = FIT_CONSTANTS.RANGES[key];
    if (unit === 'in') {
      return {
        min: cmToInches(range.min, 1),
        max: cmToInches(range.max, 1),
      };
    }
    return {
      min: range.min,
      max: range.max,
    };
  };

  // Validate numeric input step
  const validateNumericInput = (
    valStr: string,
    key: 'height' | 'inseam' | 'torso' | 'arm' | 'shoulder' | 'foot'
  ): { valid: boolean; cmValue?: number } => {
    const isOptional = key === 'foot';

    if (!valStr.trim()) {
      if (isOptional) {
        return { valid: true, cmValue: undefined };
      }
      setErrorMessage(strings.validation.required);
      return { valid: false };
    }

    const num = parseFloat(valStr);
    if (isNaN(num) || num <= 0) {
      setErrorMessage(strings.validation.number);
      return { valid: false };
    }

    // Convert to cm
    const cmValue = unit === 'in' ? inchesToCm(num, 1) : num;

    // Hard anatomical boundary check (prevent crazy typos like 10cm height or 999cm)
    const bounds = FIT_CONSTANTS.RANGES[key];
    if (cmValue < bounds.min * 0.7 || cmValue > bounds.max * 1.3) {
      setErrorMessage(
        `Value appears physically implausible (${num} ${unit}). Please check your tape measurement.`
      );
      return { valid: false };
    }

    // Soft warning if outside typical adult cycling range
    if (cmValue < bounds.min || cmValue > bounds.max) {
      const typical = getTypicalRange(key);
      setWarningMessage(
        strings.validation.outOfRange
          .replace('{min}', typical.min.toString())
          .replace('{max}', typical.max.toString())
          .replace('{unit}', unit)
      );
    } else {
      setWarningMessage(null);
    }

    return { valid: true, cmValue };
  };

  // Handle Next or Submit
  const handleNext = () => {
    setErrorMessage(null);

    // If on a numeric step
    if (activeKey !== 'flexibility' && activeKey !== 'ridingStyle') {
      const result = validateNumericInput(inputValue, activeKey);
      if (!result.valid) return;

      if (result.cmValue !== undefined) {
        updateMeasurement(activeKey, result.cmValue);
      }
    } else if (activeKey === 'flexibility') {
      if (!measurements.flexibility) {
        setErrorMessage('Please select a flexibility level.');
        return;
      }
    } else if (activeKey === 'ridingStyle') {
      if (!measurements.ridingStyle) {
        setErrorMessage('Please choose your preferred riding style.');
        return;
      }
    }

    // Advance step or navigate to results
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/results');
    }
  };

  // Handle Back
  const handleBack = () => {
    setErrorMessage(null);
    setWarningMessage(null);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  // Handle form submission via Enter key
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  const handleQuickSample = () => {
    loadSampleMeasurements();
    setErrorMessage(null);
    setWarningMessage(null);
  };

  const progressPercent = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100);

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 py-2 sm:py-4">
      {/* Top Header & Progress Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            {strings.common.step} {currentStep + 1} {strings.common.of} {TOTAL_STEPS}
          </span>
          <div className="flex items-center gap-2">
            {currentStep === 0 && (
              <button
                type="button"
                onClick={handleQuickSample}
                className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{strings.wizard.quickFillSample}</span>
              </button>
            )}
            <button
              type="button"
              onClick={resetMeasurements}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
              title="Reset all measurements"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{strings.common.reset}</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: HEIGHT */}
          {activeKey === 'height' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.height.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.height.shortDesc}
                </p>
              </div>

              {/* Inline SVG Illustration */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                <HeightGuideSvg className="w-full max-h-56" />
              </div>

              {/* Instruction Note */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.height.instruction}</span>
              </div>

              {/* Numeric Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="height-input" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {strings.wizard.steps.height.fieldLabel}
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    {strings.common.typicalRange}: {getTypicalRange('height').min} – {getTypicalRange('height').max} {unit}
                  </span>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <input
                    id="height-input"
                    type="number"
                    step={unit === 'in' ? '0.1' : '1'}
                    placeholder={strings.wizard.steps.height.placeholder}
                    value={inputValue}
                    onChange={e => {
                      setInputValue(e.target.value);
                      setErrorMessage(null);
                    }}
                    autoFocus
                    className="w-full text-2xl font-black px-4 py-3.5 pr-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold uppercase text-sm">
                    {unit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INSEAM */}
          {activeKey === 'inseam' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.inseam.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.inseam.shortDesc}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                <InseamGuideSvg className="w-full max-h-56" />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.inseam.instruction}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="inseam-input" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {strings.wizard.steps.inseam.fieldLabel}
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    {strings.common.typicalRange}: {getTypicalRange('inseam').min} – {getTypicalRange('inseam').max} {unit}
                  </span>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <input
                    id="inseam-input"
                    type="number"
                    step={unit === 'in' ? '0.1' : '1'}
                    placeholder={strings.wizard.steps.inseam.placeholder}
                    value={inputValue}
                    onChange={e => {
                      setInputValue(e.target.value);
                      setErrorMessage(null);
                    }}
                    autoFocus
                    className="w-full text-2xl font-black px-4 py-3.5 pr-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold uppercase text-sm">
                    {unit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TORSO */}
          {activeKey === 'torso' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.torso.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.torso.shortDesc}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                <TorsoGuideSvg className="w-full max-h-56" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.torso.instruction}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="torso-input" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {strings.wizard.steps.torso.fieldLabel}
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    {strings.common.typicalRange}: {getTypicalRange('torso').min} – {getTypicalRange('torso').max} {unit}
                  </span>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <input
                    id="torso-input"
                    type="number"
                    step={unit === 'in' ? '0.1' : '1'}
                    placeholder={strings.wizard.steps.torso.placeholder}
                    value={inputValue}
                    onChange={e => {
                      setInputValue(e.target.value);
                      setErrorMessage(null);
                    }}
                    autoFocus
                    className="w-full text-2xl font-black px-4 py-3.5 pr-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold uppercase text-sm">
                    {unit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ARM LENGTH */}
          {activeKey === 'arm' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.arm.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.arm.shortDesc}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                <ArmGuideSvg className="w-full max-h-56" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.arm.instruction}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="arm-input" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {strings.wizard.steps.arm.fieldLabel}
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    {strings.common.typicalRange}: {getTypicalRange('arm').min} – {getTypicalRange('arm').max} {unit}
                  </span>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <input
                    id="arm-input"
                    type="number"
                    step={unit === 'in' ? '0.1' : '1'}
                    placeholder={strings.wizard.steps.arm.placeholder}
                    value={inputValue}
                    onChange={e => {
                      setInputValue(e.target.value);
                      setErrorMessage(null);
                    }}
                    autoFocus
                    className="w-full text-2xl font-black px-4 py-3.5 pr-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold uppercase text-sm">
                    {unit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SHOULDER WIDTH */}
          {activeKey === 'shoulder' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.shoulder.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.shoulder.shortDesc}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                <ShoulderGuideSvg className="w-full max-h-56" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.shoulder.instruction}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="shoulder-input" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {strings.wizard.steps.shoulder.fieldLabel}
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    {strings.common.typicalRange}: {getTypicalRange('shoulder').min} – {getTypicalRange('shoulder').max} {unit}
                  </span>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <input
                    id="shoulder-input"
                    type="number"
                    step={unit === 'in' ? '0.1' : '1'}
                    placeholder={strings.wizard.steps.shoulder.placeholder}
                    value={inputValue}
                    onChange={e => {
                      setInputValue(e.target.value);
                      setErrorMessage(null);
                    }}
                    autoFocus
                    className="w-full text-2xl font-black px-4 py-3.5 pr-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold uppercase text-sm">
                    {unit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: FOOT LENGTH (OPTIONAL) */}
          {activeKey === 'foot' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase mb-1">
                  {strings.common.optional}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.foot.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.foot.shortDesc}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                <FootGuideSvg className="w-full max-h-56" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.foot.instruction}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="foot-input" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {strings.wizard.steps.foot.fieldLabel}
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    {strings.common.typicalRange}: {getTypicalRange('foot').min} – {getTypicalRange('foot').max} {unit}
                  </span>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <input
                    id="foot-input"
                    type="number"
                    step={unit === 'in' ? '0.1' : '1'}
                    placeholder={strings.wizard.steps.foot.placeholder}
                    value={inputValue}
                    onChange={e => {
                      setInputValue(e.target.value);
                      setErrorMessage(null);
                    }}
                    autoFocus
                    className="w-full text-2xl font-black px-4 py-3.5 pr-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold uppercase text-sm">
                    {unit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: FLEXIBILITY SELF-TEST */}
          {activeKey === 'flexibility' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.flexibility.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.flexibility.shortDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.flexibility.instruction}</span>
              </div>

              {/* 3 Choices with small illustrations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as FlexibilityLevel[]).map(lvl => {
                  const opt = strings.wizard.steps.flexibility.options[lvl];
                  const isSelected = measurements.flexibility === lvl;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        updateMeasurement('flexibility', lvl);
                        setErrorMessage(null);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/50 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="w-full flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <FlexibilityGuideSvg level={lvl} className="w-full max-h-28" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-black text-sm text-slate-900 dark:text-white">
                            {opt.title}
                          </h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: RIDING STYLE */}
          {activeKey === 'ridingStyle' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {strings.wizard.steps.ridingStyle.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {strings.wizard.steps.ridingStyle.shortDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{strings.wizard.steps.ridingStyle.instruction}</span>
              </div>

              {/* 3 Choices with silhouettes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['endurance', 'balanced', 'race'] as RidingStyle[]).map(style => {
                  const opt = strings.wizard.steps.ridingStyle.options[style];
                  const isSelected = measurements.ridingStyle === style;

                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => {
                        updateMeasurement('ridingStyle', style);
                        setErrorMessage(null);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/50 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="w-full flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <RidingStyleGuideSvg style={style} className="w-full max-h-28" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-black text-sm text-slate-900 dark:text-white">
                            {opt.title}
                          </h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Friendly Out-of-Range Warning (non-blocking) */}
          {warningMessage && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Navigation Controls (Always Visible) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm min-w-[100px] justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{strings.common.back}</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm min-w-[140px] justify-center shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{currentStep === TOTAL_STEPS - 1 ? strings.common.seeResults : strings.common.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
