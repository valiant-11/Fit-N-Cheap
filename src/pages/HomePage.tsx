import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import {
  Ruler,
  Compass,
  Camera,
  Bike,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { loadSampleMeasurements, strings } = useFit();
  const navigate = useNavigate();

  const handleTrySample = () => {
    loadSampleMeasurements();
    navigate('/wizard');
  };

  return (
    <div className="space-y-12 py-2 sm:py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open & Free Cycling Geometry Lab</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            {strings.home.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {strings.home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/wizard"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-base shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{strings.home.startWizardBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={handleTrySample}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700 transition-colors"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <span>{strings.common.trySample}</span>
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              No signup or email required
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-400" />
              Private in-browser math
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              cm & inches supported
            </span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Complete DIY Fit Toolkit
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Everything you need to set up your road machine comfortably.
            </p>
          </div>
          <Link
            to="/guide"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <BookOpen className="w-4 h-4" />
            <span>Measurement Guide</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Wizard */}
          <Link
            to="/wizard"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-xs hover:shadow-sport dark:hover:shadow-sport-dark transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {strings.home.features.wizard.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {strings.home.features.wizard.desc}
            </p>
          </Link>

          {/* Card 2: Formulas & Results */}
          <Link
            to="/results"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-xs hover:shadow-sport dark:hover:shadow-sport-dark transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {strings.home.features.provenFormulas.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {strings.home.features.provenFormulas.desc}
            </p>
          </Link>

          {/* Card 3: Posture Analysis */}
          <Link
            to="/posture"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-xs hover:shadow-sport dark:hover:shadow-sport-dark transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {strings.home.features.postureAi.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {strings.home.features.postureAi.desc}
            </p>
          </Link>

          {/* Card 4: Frame Matcher */}
          <Link
            to="/frames"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-xs hover:shadow-sport dark:hover:shadow-sport-dark transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bike className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {strings.home.features.frameMatcher.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {strings.home.features.frameMatcher.desc}
            </p>
          </Link>
        </div>
      </section>

      {/* Measurement checklist reminder */}
      <section className="rounded-2xl p-6 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-slate-900 dark:text-white">
            Need help measuring accurately?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Read our step-by-step checklist. Get a tape measure, a hardcover book, and a wall.
          </p>
        </div>
        <Link
          to="/guide"
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
        >
          View Measurement Guide
        </Link>
      </section>
    </div>
  );
};
