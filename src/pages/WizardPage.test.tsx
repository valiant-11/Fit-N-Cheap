import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FitProvider } from '../context/FitContext';
import { WizardPage } from './WizardPage';

describe('WizardPage', () => {
  it('renders Step 1 (Height) with inline SVG guide and input', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <WizardPage />
        </BrowserRouter>
      </FitProvider>
    );

    // Header step indicator
    expect(screen.getByText(/Step 1 of 8/i)).toBeInTheDocument();
    // Step title
    expect(screen.getByText(/Total Rider Height/i)).toBeInTheDocument();
    // Input field
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    // Typical range hint
    expect(screen.getByText(/Typical range/i)).toBeInTheDocument();
  });

  it('validates empty input and shows error message', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <WizardPage />
        </BrowserRouter>
      </FitProvider>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(nextButton);

    expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
  });

  it('advances to Step 2 (Inseam) when a valid height is provided', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <WizardPage />
        </BrowserRouter>
      </FitProvider>
    );

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '178' } });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(screen.getByText(/Step 2 of 8/i)).toBeInTheDocument();
    expect(screen.getByText(/Inseam \/ Crotch Height/i)).toBeInTheDocument();
  });
});
