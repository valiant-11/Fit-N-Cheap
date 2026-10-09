import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FitProvider } from '../context/FitContext';
import { Header } from './Header';

describe('Header component', () => {
  it('renders application branding and unit switcher', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </FitProvider>
    );

    // App name & brand elements
    const brandLinks = screen.getAllByRole('link', { name: /Fit.*Cheap/i });
    expect(brandLinks.length).toBeGreaterThan(0);

    // Unit toggle is present
    const unitButton = screen.getByRole('button', { name: /cm\/in/i });
    expect(unitButton).toBeInTheDocument();
    expect(unitButton).toHaveAttribute('title', 'Switch to inches');

    // Toggle unit click
    fireEvent.click(unitButton);
    expect(unitButton).toHaveAttribute('title', 'Switch to centimeters');

    // Language switcher is present and toggles between EN and FIL
    const langButton = screen.getByRole('button', { name: /Toggle language/i });
    expect(langButton).toBeInTheDocument();
    expect(langButton).toHaveTextContent(/EN.*FIL/i);
    fireEvent.click(langButton);
    expect(langButton).toHaveAttribute('title', 'Switch to English');
  });
});
