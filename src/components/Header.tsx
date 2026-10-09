import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import {
  Bike,
  Sun,
  Moon,
  Menu,
  X,
  Ruler,
  Compass,
  Camera,
  FolderArchive,
  BookOpen,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { unit, toggleUnit, theme, toggleTheme, lang, toggleLang, strings } = useFit();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Fit<span className="text-brand-500">N</span>Cheap
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
                  Road
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Free DIY Bike Fit
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Unit toggle & Theme toggle & Mobile menu button */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              title={lang === 'en' ? 'Lumipat sa Tagalog / Filipino' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <span className={lang === 'en' ? 'text-brand-600 dark:text-brand-400 font-extrabold' : 'text-slate-400'}>
                EN
              </span>
              <span className="mx-1 text-slate-300 dark:text-slate-600">/</span>
              <span className={lang === 'tl' ? 'text-brand-600 dark:text-brand-400 font-extrabold' : 'text-slate-400'}>
                FIL
              </span>
            </button>

            {/* Unit Switcher */}
            <div
              className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700"
              role="group"
              aria-label={strings.units.switchLabel}
            >
              <button
                type="button"
                onClick={toggleUnit}
                className="flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-md min-w-[56px] justify-center transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
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

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={strings.theme.toggle}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
