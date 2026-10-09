import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FitProvider } from '../context/FitContext';
import { ResultsPage } from './ResultsPage';

describe('ResultsPage', () => {
  it('renders empty notice when measurements are missing', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <ResultsPage />
        </BrowserRouter>
      </FitProvider>
    );

    expect(screen.getByText(/No measurements found yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Load Sample Measurements/i })).toBeInTheDocument();
  });

  it('renders fit blueprint summary cards and diagram after loading sample measurements', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <ResultsPage />
        </BrowserRouter>
      </FitProvider>
    );

    // Click load sample measurements
    const sampleButton = screen.getByRole('button', { name: /Load Sample Measurements/i });
    fireEvent.click(sampleButton);

    // Results blueprint should be visible
    expect(screen.getByText(/Your Tailored Bike Fit Blueprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Biomechanical Rider & Geometry Blueprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Saddle Setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Frame & Cockpit Target/i)).toBeInTheDocument();

    // Check specific calculations rendered (sample 178cm / 83cm inseam gives 73.3 cm avg saddle height)
    const matches = screen.getAllByText(/73.3 cm/i);
    expect(matches.length).toBeGreaterThan(0);

    expect(screen.getByRole('button', { name: /Save this fit/i })).toBeInTheDocument();
  });
});
