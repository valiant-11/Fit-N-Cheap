import React from 'react';
import { useFit } from '../context/FitContext';
import { AlertCircle, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { strings } = useFit();
  return (
    <footer className="w-full mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-5xl mx-auto space-y-4 text-center">
        {/* Critical Disclaimer Banner */}
        <div className="inline-flex items-start sm:items-center gap-2 p-3 sm:px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-left sm:text-center text-xs leading-relaxed max-w-3xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-0" />
          <span>{strings.app.disclaimer}</span>
        </div>

        {/* Privacy Note */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 font-medium text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            {strings.app.badge}
          </span>
          <span>•</span>
          <span>{strings.app.privacyNote}</span>
        </div>

        {/* Made for riders note */}
        <div className="pt-2 text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <span>Fit N Cheap</span>
          <span>—</span>
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>for cyclists worldwide</span>
        </div>
      </div>
    </footer>
  );
};
