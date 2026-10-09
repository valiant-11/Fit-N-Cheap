import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-amber-500 text-slate-950 font-bold text-[11px] py-1 px-4 flex items-center justify-center gap-2 ui-chrome shadow-xs shrink-0"
      >
        <WifiOff className="w-3.5 h-3.5 shrink-0" />
        <span>Offline Mode — All measurements, pose analysis &amp; saved fits run 100% locally.</span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-emerald-500 text-slate-950 font-bold text-[11px] py-1 px-4 flex items-center justify-center gap-2 ui-chrome shrink-0 animate-fade-in"
      >
        <Wifi className="w-3.5 h-3.5 shrink-0" />
        <span>Internet connection restored.</span>
      </div>
    );
  }

  return null;
};
