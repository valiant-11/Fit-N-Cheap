import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const BombComponent = () => {
  throw new Error('Test crash explosion');
};

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>All systems green</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('All systems green')).toBeInTheDocument();
  });

  it('renders recovery UI when a child crashes', () => {
    // Suppress console.error during expected test error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BombComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something hit a bump in the road/i)).toBeInTheDocument();
    expect(screen.getByText(/Test crash explosion/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Application/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Local Data/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
