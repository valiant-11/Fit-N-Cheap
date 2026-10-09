import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import {
  Bike,
  Sun,
  Moon,
  ArrowLeft,
  Ruler,
  Compass,
  Camera,
  FolderArchive,
  BookOpen,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { unit, toggleUnit, theme, toggleTheme, lang, toggleLang, strings } = useFit();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/' || location.pathname === '';

  // Get current page title for mobile top bar
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/wizard':
        return strings.nav.wizard;
      case '/guide':
        return strings.nav.guide;
      case '/results':
        return strings.nav.results;
      case '/posture':
        return strings.nav.posture;
      case '/frames':
        return strings.nav.frames;
      case '/saved':
        return strings.nav.saved;
      default:
        return null;
    }
  };

  const pageTitle = getPageTitle();

  const navItems = [
    { label: strings.nav.wizard, path: '/wizard', icon: Ruler },
    { label: strings.nav.guide, path: '/guide', icon: BookOpen },
    { label: strings.nav.results, path: '/results', icon: Compass },
    { label: strings.nav.posture, path: '/posture', icon: Camera },
    { label: strings.nav.frames, path: '/frames', icon: Bike },
    { label: strings.nav.saved, path: '/saved', icon: FolderArchive },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md ui-chrome transition-colors shrink-0"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Left: Mobile Back Button + Logo / Page Title */}
          <div className="flex items-center gap-2 min-w-0">
            {!isHome && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 press-feedback focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label={strings.common.back}
                title={strings.common.back}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1 min-w-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white truncate">
                    Fit<span className="text-brand-500">N</span>Cheap
                  </span>
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 shrink-0">
                    Road
                  </span>
                </div>
                {pageTitle && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold sm:hidden truncate">
                    {pageTitle}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Menu (Web View Only: hidden on mobile, visible on md and up) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-400 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Unit toggle & Language toggle & Theme toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher (44px min tap area) */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center justify-center h-10 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500/50 press-feedback focus:outline-none focus:ring-2 focus:ring-brand-500"
              title={lang === 'en' ? 'Lumipat sa Filipino (Tagalog)' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <span className={`text-xs font-bold ${lang === 'en' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                EN
              </span>
              <span className="mx-1 text-[11px] text-slate-300 dark:text-slate-600">/</span>
              <span className={`text-xs font-bold ${lang === 'tl' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                FIL
              </span>
            </button>

            {/* Unit Switcher (44px min tap area) */}
            <div
              className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 h-10"
              role="group"
              aria-label={strings.units.switchLabel}
            >
              <button
                type="button"
                onClick={toggleUnit}
                className="flex items-center text-xs font-semibold px-2.5 h-full rounded-lg min-w-[56px] justify-center press-feedback focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                title={`Switch to ${unit === 'cm' ? 'inches' : 'centimeters'}`}
              >
                <span className={unit === 'cm' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'}>
                  cm
                </span>
                <span className="mx-1 text-slate-300 dark:text-slate-600">/</span>
                <span className={unit === 'in' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'}>
                  in
                </span>
              </button>
            </div>

            {/* Theme Toggle (44px min tap area) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={strings.theme.toggle}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 press-feedback focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
