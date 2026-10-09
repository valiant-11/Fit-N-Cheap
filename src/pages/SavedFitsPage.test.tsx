import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FitProvider } from '../context/FitContext';
import { SavedFitsPage } from './SavedFitsPage';

describe('SavedFitsPage and Comparison', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty state and allows generating demo profiles for comparison', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <SavedFitsPage />
        </BrowserRouter>
      </FitProvider>
    );

    expect(screen.getByText(/No saved fits yet/i)).toBeInTheDocument();
    const demoBtn = screen.getByRole('button', { name: /Create Demo Profiles to Compare/i });
    expect(demoBtn).toBeInTheDocument();

    // Click to create demo profiles
    fireEvent.click(demoBtn);

    // Verify side-by-side comparison table appears
    expect(screen.getByText(/Side-by-Side Fit Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile A \(Baseline\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile B \(Comparison\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Difference \(B vs A\)/i)).toBeInTheDocument();

    // Verify key parameter rows exist
    expect(screen.getByText(/Saddle Height \(Recommended\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Reach Range/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Stack Range/i)).toBeInTheDocument();
  });

  it('allows closing and re-opening comparison view when fits exist', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <SavedFitsPage />
        </BrowserRouter>
      </FitProvider>
    );

    // Create demo profiles
    fireEvent.click(screen.getByRole('button', { name: /Create Demo Profiles to Compare/i }));
    expect(screen.getByText(/Side-by-Side Fit Comparison/i)).toBeInTheDocument();

    // Close comparison
    const closeBtn = screen.getByRole('button', { name: /Close Comparison/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Side-by-Side Fit Comparison/i)).not.toBeInTheDocument();

    // Re-open comparison
    const compareBtn = screen.getByRole('button', { name: /Compare 2 Fits/i });
    fireEvent.click(compareBtn);
    expect(screen.getByText(/Side-by-Side Fit Comparison/i)).toBeInTheDocument();
  });
});
