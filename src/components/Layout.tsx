import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { NavigationRail } from './NavigationRail';
import { BottomTabBar } from './BottomTabBar';
import { InstallBanner } from './InstallBanner';
import { OfflineIndicator } from './OfflineIndicator';

export const Layout: React.FC = () => {
  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Offline Status Bar if offline */}
      <OfflineIndicator />

      {/* Main Shell with Left Rail on >=md and Bottom Bar on <md */}
      <div className="flex-1 flex overflow-hidden min-w-0 w-full">
        {/* Tablet / Desktop Navigation Sidebar */}
        <NavigationRail />

        {/* Content Area with Top Header & Scrollable Main Container */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header />
          <InstallBanner />

          {/* Sole scroll container for the app */}
          <main
            id="main-scroll-container"
            className="flex-1 overflow-y-auto overscroll-y-contain w-full min-w-0 focus:outline-none"
            tabIndex={-1}
          >
            <div className="w-full max-w-[1100px] mx-auto fluid-gutter py-4 sm:py-6 flex flex-col min-w-0 pb-28 md:pb-10">
              <Outlet />
            </div>
            <Footer />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
};
