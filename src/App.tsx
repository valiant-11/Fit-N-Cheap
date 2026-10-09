import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FitProvider } from './context/FitContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { WizardPage } from './pages/WizardPage';
import { HowToMeasurePage } from './pages/HowToMeasurePage';
import { ResultsPage } from './pages/ResultsPage';
import { PosturePage } from './pages/PosturePage';
import { FramesPage } from './pages/FramesPage';
import { SavedFitsPage } from './pages/SavedFitsPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FitProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="wizard" element={<WizardPage />} />
            <Route path="guide" element={<HowToMeasurePage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="posture" element={<PosturePage />} />
            <Route path="frames" element={<FramesPage />} />
            <Route path="saved" element={<SavedFitsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </FitProvider>
  </ErrorBoundary>
);
};

export default App;
