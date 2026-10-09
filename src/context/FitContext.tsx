import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UnitSystem, RiderMeasurements, FitResult, SavedFit, BikeFrame } from '../types';
import seedFrames from '../data/frames.json';
import { SAMPLE_MEASUREMENTS } from '../lib/fit/constants';
import { strings as stringsEn, type AppStrings } from '../i18n/strings';
import { stringsTl } from '../i18n/strings.tl';

export type Language = 'en' | 'tl';

interface FitContextType {
  unit: UnitSystem;
  setUnit: (u: UnitSystem) => void;
  toggleUnit: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  strings: AppStrings;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  measurements: Partial<RiderMeasurements>;
  setMeasurements: React.Dispatch<React.SetStateAction<Partial<RiderMeasurements>>>;
  updateMeasurement: <K extends keyof RiderMeasurements>(key: K, value: RiderMeasurements[K]) => void;
  resetMeasurements: () => void;
  loadSampleMeasurements: () => void;
  savedFits: SavedFit[];
  saveCurrentFit: (name: string, results: FitResult, notes?: string) => SavedFit;
  deleteSavedFit: (id: string) => void;
  frames: BikeFrame[];
  addFrame: (frame: Omit<BikeFrame, 'id'>) => BikeFrame;
  updateFrame: (id: string, updated: Partial<BikeFrame>) => void;
  deleteFrame: (id: string) => void;
  importFrames: (newFrames: BikeFrame[], replaceExisting?: boolean) => void;
  resetFramesToDefault: () => void;
}

const STORAGE_KEY_UNIT = 'fitncheap_unit';
const STORAGE_KEY_LANG = 'fitncheap_lang';
const STORAGE_KEY_THEME = 'fitncheap_theme';
const STORAGE_KEY_MEASUREMENTS = 'fitncheap_measurements';
const STORAGE_KEY_SAVED_FITS = 'fitncheap_saved_fits';
const STORAGE_KEY_FRAMES = 'fitncheap_frames';

const FitContext = createContext<FitContextType | null>(null);

export const FitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Unit System
  const [unit, setUnitState] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_UNIT);
    return saved === 'in' ? 'in' : 'cm';
  });

  const setUnit = (u: UnitSystem) => {
    setUnitState(u);
    localStorage.setItem(STORAGE_KEY_UNIT, u);
  };

  const toggleUnit = () => {
    setUnit(unit === 'cm' ? 'in' : 'cm');
  };

  // Language System (English / Filipino)
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'tl' ? 'tl' : 'en';
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY_LANG, l);
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'tl' : 'en');
  };

  const activeStrings = lang === 'tl' ? stringsTl : stringsEn;

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Measurements
  const [measurements, setMeasurements] = useState<Partial<RiderMeasurements>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEASUREMENTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEASUREMENTS, JSON.stringify(measurements));
  }, [measurements]);

  const updateMeasurement = <K extends keyof RiderMeasurements>(key: K, value: RiderMeasurements[K]) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetMeasurements = () => {
    setMeasurements({});
    localStorage.removeItem(STORAGE_KEY_MEASUREMENTS);
  };

  const loadSampleMeasurements = () => {
    setMeasurements({ ...SAMPLE_MEASUREMENTS });
  };

  // Saved Fits
  const [savedFits, setSavedFits] = useState<SavedFit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_FITS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED_FITS, JSON.stringify(savedFits));
  }, [savedFits]);

  const saveCurrentFit = (name: string, results: FitResult, notes?: string): SavedFit => {
    const newFit: SavedFit = {
      id: `fit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name || `Fit ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      measurements: measurements as RiderMeasurements,
      results,
      notes,
    };
    setSavedFits(prev => [newFit, ...prev]);
    return newFit;
  };

  const deleteSavedFit = (id: string) => {
    setSavedFits(prev => prev.filter(f => f.id !== id));
  };

  // Frames Database
  const [frames, setFrames] = useState<BikeFrame[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FRAMES);
      return saved ? JSON.parse(saved) : seedFrames;
    } catch {
      return seedFrames as BikeFrame[];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FRAMES, JSON.stringify(frames));
  }, [frames]);

  const addFrame = (frameData: Omit<BikeFrame, 'id'>): BikeFrame => {
    const newFrame: BikeFrame = {
      ...frameData,
      id: `frame_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setFrames(prev => [newFrame, ...prev]);
    return newFrame;
  };

  const updateFrame = (id: string, updated: Partial<BikeFrame>) => {
    setFrames(prev => prev.map(f => (f.id === id ? { ...f, ...updated } : f)));
  };

  const deleteFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id));
  };

  const importFrames = (newFrames: BikeFrame[], replaceExisting = false) => {
    if (replaceExisting) {
      setFrames(newFrames);
    } else {
      setFrames(prev => [...newFrames, ...prev]);
    }
  };

  const resetFramesToDefault = () => {
    setFrames(seedFrames as BikeFrame[]);
    localStorage.removeItem(STORAGE_KEY_FRAMES);
  };

  return (
    <FitContext.Provider
      value={{
        unit,
        setUnit,
        toggleUnit,
        lang,
        setLang,
        toggleLang,
        strings: activeStrings,
        theme,
        toggleTheme,
        measurements,
        setMeasurements,
        updateMeasurement,
        resetMeasurements,
        loadSampleMeasurements,
        savedFits,
        saveCurrentFit,
        deleteSavedFit,
        frames,
        addFrame,
        updateFrame,
        deleteFrame,
        importFrames,
        resetFramesToDefault,
      }}
    >
      {children}
    </FitContext.Provider>
  );
};

export const useFit = () => {
  const context = useContext(FitContext);
  if (!context) {
    throw new Error('useFit must be used within a FitProvider');
  }
  return context;
};
