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
