import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import { Home, Ruler, Camera, Bike, FolderArchive } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { strings } = useFit();

  const tabs = [
    { to: '/', label: strings.nav.home, icon: Home },
    { to: '/wizard', label: strings.nav.wizard, icon: Ruler },
    { to: '/posture', label: strings.nav.posture, icon: Camera },
    { to: '/frames', label: strings.nav.frames, icon: Bike },
    { to: '/saved', label: strings.nav.saved, icon: FolderArchive },
  ];

  return (
    <nav
      aria-label="Bottom Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 ui-chrome select-none transition-colors"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)',
      }}
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full min-w-0 py-1 px-1 rounded-xl press-feedback transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-transform ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-950/80 scale-105 shadow-xs'
                        : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <span className="text-[10px] tracking-tight truncate max-w-full mt-0.5 leading-none">
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
