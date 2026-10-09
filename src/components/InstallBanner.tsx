import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone PWA
    const standaloneQuery =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(display-mode: standalone)')
        : null;
    const checkStandalone = () => {
      const isAppleStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(standaloneQuery?.matches || isAppleStandalone));
    };

    checkStandalone();
    standaloneQuery?.addEventListener?.('change', checkStandalone);

    // Detect iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    // Check session dismissal
    if (sessionStorage.getItem('fitncheap_pwa_dismissed') === 'true') {
      setIsDismissed(true);
    }

    // Capture Chrome/Android PWA prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      standaloneQuery?.removeEventListener?.('change', checkStandalone);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('fitncheap_pwa_dismissed', 'true');
  };

  // If already installed or dismissed, render nothing
  if (isStandalone || isDismissed) {
    return null;
  }

  // If deferredPrompt is available (Chrome, Edge, Android)
  if (deferredPrompt) {
    return (
      <aside
        aria-label="App Installation Offer"
        className="mx-3 my-2 p-3 sm:px-4 rounded-2xl bg-gradient-to-r from-brand-500/15 to-emerald-500/10 border border-brand-500/30 flex items-center justify-between gap-3 text-xs ui-chrome"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
            <Download className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white truncate">
              Install Fit N Cheap as an App
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Works 100% offline at your bike trainer stand.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs press-feedback shadow-xs"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            aria-label="Dismiss installation banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // iOS Safari instruction banner (shown once if not standalone)
  if (isIos && !isDismissed) {
    return (
      <aside
        aria-label="iOS Home Screen Installation Guide"
        className="mx-3 my-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs ui-chrome"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Share className="w-4 h-4 text-brand-500 shrink-0" />
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            Tap <strong className="font-semibold text-slate-900 dark:text-white">Share</strong> then{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">&ldquo;Add to Home Screen&rdquo;</strong> for fullscreen offline use.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Dismiss hint"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  return null;
};
