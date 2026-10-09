import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FitProvider } from '../context/FitContext';
import { FramesPage } from './FramesPage';

describe('FramesPage', () => {
  it('renders mandatory manufacturer geometry disclaimer banner', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <FramesPage />
        </BrowserRouter>
      </FitProvider>
    );

    expect(
      screen.getByText(/Always check the manufacturer's geometry chart/i)
    ).toBeInTheDocument();
  });

  it('renders seed frames marked as EXAMPLE ONLY', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <FramesPage />
        </BrowserRouter>
      </FitProvider>
    );

    expect(screen.getByText(/Aero Sprint Fake/i)).toBeInTheDocument();
    const badges = screen.getAllByText(/EXAMPLE ONLY/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('opens and closes Add Custom Frame modal', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <FramesPage />
        </BrowserRouter>
      </FitProvider>
    );

    const addBtn = screen.getByRole('button', { name: /Add Frame/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Add Custom Road Frame/i)).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText(/Add Custom Road Frame/i)).not.toBeInTheDocument();
  });
});
