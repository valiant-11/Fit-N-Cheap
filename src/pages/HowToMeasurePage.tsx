import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Printer,
  Users,
  Shirt,
  RotateCcw,
  Book,
  ArrowRight,
} from 'lucide-react';

export const HowToMeasurePage: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const checklistItems = [
    {
      title: 'Get a flexible measuring tape',
      desc: 'A tailor tape or fiberglass tape measure works best. Metal tape measures can bend or pinch.',
    },
    {
      title: 'Grab a hardcover book',
      desc: 'Use a thick hardcover book (approx 2–3 cm / 1 in wide spine) for measuring your inseam.',
    },
    {
      title: 'Find a flat wall and smooth floor',
      desc: 'Stand barefoot with heels, buttocks, and upper back resting gently against a vertical wall.',
    },
    {
      title: 'Wear cycling kit or tight clothes',
      desc: 'Baggy shorts and loose clothing will give false measurements around your crotch and hips.',
    },
    {
      title: 'Have a helper if possible',
      desc: 'Measuring torso and arm length on yourself introduces errors. Ask a cycling buddy or partner.',
    },
    {
      title: 'Measure each point twice',
      desc: 'Always repeat every measurement. If the two values differ by more than 5 mm (0.2 in), take a third.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 py-4 print:py-0 print:space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How to Measure for Bike Fit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Printable preparation guide and accuracy tips before you begin.
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors print:hidden shadow-xs"
        >
          <Printer className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Print Checklist</span>
        </button>
      </div>

      {/* 3 Key Golden Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-slate-950 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Ask a Friend</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Measuring your own inseam or arm length forces you to twist or slouch, throwing measurements off by centimeters.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/50 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
            <Shirt className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Wear Tight Kit</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Wear cycling bibs or thin compression shorts without shoes. Thick jeans or baggy shorts mask your pelvic bone.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <RotateCcw className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Measure Twice</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Measure every point at least twice. Accuracy to within ±5 mm (0.2 in) ensures your calculated saddle height is spot on.
          </p>
        </div>
      </div>

      {/* Printable Checklist */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-brand-500" />
          Pre-Fit Preparation Checklist
        </h2>
        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 mt-0.5 shrink-0 flex items-center justify-center" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inseam special tip */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
          <Book className="w-4 h-4" />
          <span>The Critical Inseam Secret: Saddle Firmness</span>
        </div>
        <p className="leading-relaxed">
          When pulling the hardcover book up between your legs, pull up with the same pressure you feel when sitting on a bicycle saddle. If you barely press, your inseam will measure too short, resulting in a saddle that sits too low and causes knee strain.
        </p>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end pt-2 print:hidden">
        <Link
          to="/wizard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
        >
          <span>Ready to Measure? Open Wizard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
