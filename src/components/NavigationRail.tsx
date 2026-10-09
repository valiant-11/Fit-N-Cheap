import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import {
  Bike,
  Ruler,
  BookOpen,
  Compass,
  Camera,
  FolderArchive,
  Home,
  ShieldCheck,
} from 'lucide-react';

export const NavigationRail: React.FC = () => {
  const { strings } = useFit();

  const navItems = [
    { to: '/', label: strings.nav.home, icon: Home },
    { to: '/wizard', label: strings.nav.wizard, icon: Ruler },
    { to: '/guide', label: strings.nav.guide, icon: BookOpen },
    { to: '/results', label: strings.nav.results, icon: Compass },
    { to: '/posture', label: strings.nav.posture, icon: Camera },
    { to: '/frames', label: strings.nav.frames, icon: Bike },
    { to: '/saved', label: strings.nav.saved, icon: FolderArchive },
  ];

  return (
    <aside
      aria-label="Desktop Navigation Sidebar"
      className="hidden md:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-200 md:w-20 xl:w-64 ui-chrome select-none z-30"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 xl:px-6 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
          <Bike className="w-5 h-5" />
        </div>
        <div className="hidden xl:block min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white truncate">
              Fit<span className="text-brand-500">N</span>Cheap
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 shrink-0">
              Road
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Free DIY Bike Fit
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5" aria-label="Sidebar Links">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold press-feedback transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`
              }
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden xl:inline truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Pill */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 hidden xl:block">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% In-Browser</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            No server uploads, offline PWA ready.
          </p>
        </div>
      </div>
    </aside>
  );
};
