import '@testing-library/jest-dom/vitest';

// Lightweight 2D canvas context mock for jsdom environment
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string) {
    if (type === '2d') {
      return {
        canvas: this,
        clearRect: () => {},
        drawImage: () => {},
        fillRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        arc: () => {},
        ellipse: () => {},
        stroke: () => {},
        fill: () => {},
        fillText: () => {},
        measureText: (text: string) => ({ width: (text || '').length * 7 }),
        setLineDash: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        scale: () => {},
        roundRect: () => {},
        save: () => {},
        restore: () => {},
      } as unknown as CanvasRenderingContext2D;
    }
    return null;
  } as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

// Global mocks for jsdom environment
if (typeof window !== 'undefined') {
  window.matchMedia =
    window.matchMedia ||
    function (query: string) {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    };

  if (typeof ResizeObserver === 'undefined') {
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}
