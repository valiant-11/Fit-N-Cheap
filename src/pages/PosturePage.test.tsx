import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FitProvider } from '../context/FitContext';
import { PosturePage } from './PosturePage';

describe('PosturePage', () => {
  it('renders Posture Analysis header and mode tabs', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <PosturePage />
        </BrowserRouter>
      </FitProvider>
    );

    expect(screen.getByText(/Side-View Posture Analysis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Camera & Analysis/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Setup Guide & Examples/i })).toBeInTheDocument();
  });

  it('switches to Setup Guide tab showing good vs bad photo instructions', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <PosturePage />
        </BrowserRouter>
      </FitProvider>
    );

    const setupTabButton = screen.getByRole('button', { name: /Setup Guide & Examples/i });
    fireEvent.click(setupTabButton);

    expect(screen.getByText(/Camera & Trainer Setup Instructions/i)).toBeInTheDocument();
    expect(screen.getByText('GOOD PHOTO')).toBeInTheDocument();
    expect(screen.getByText('BAD PHOTO')).toBeInTheDocument();
  });

  it('loads sample rider photo and displays angle cards and advice', () => {
    render(
      <FitProvider>
        <BrowserRouter>
          <PosturePage />
        </BrowserRouter>
      </FitProvider>
    );

    // Click "Try with Sample Rider"
    const sampleBtn = screen.getByRole('button', { name: /Try with Sample Rider/i });
    fireEvent.click(sampleBtn);

    // Draggable skeleton title should be displayed
    expect(screen.getByText(/Live Draggable Posture Skeleton/i)).toBeInTheDocument();
    expect(screen.getByText(/Measured Joint Angles & Rule-Based Advice/i)).toBeInTheDocument();

    // Check angle cards render
    expect(screen.getByText(/Knee Extension/i)).toBeInTheDocument();
    expect(screen.getByText(/Elbow Bend/i)).toBeInTheDocument();
    expect(screen.getByText(/Shoulder Extension/i)).toBeInTheDocument();
  });
});
