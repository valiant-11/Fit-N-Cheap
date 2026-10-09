import { describe, it, expect } from 'vitest';
import { cmToInches, inchesToCm, formatMeasurement, formatMm } from './units';

describe('Unit Conversion Utilities', () => {
  it('converts cm to inches accurately', () => {
    // 83 cm / 2.54 = ~32.677 -> 32.7 inches
    expect(cmToInches(83)).toBe(32.7);
    expect(cmToInches(2.54)).toBe(1.0);
    expect(cmToInches(0)).toBe(0);
  });

  it('converts inches to cm accurately', () => {
    // 32.7 * 2.54 = ~83.058 -> 83.1 cm
    expect(inchesToCm(10)).toBe(25.4);
    expect(inchesToCm(32)).toBe(81.3);
  });

  it('formats measurements according to active unit system', () => {
    expect(formatMeasurement(83, 'cm')).toBe('83 cm');
    expect(formatMeasurement(83, 'in')).toBe('32.7 in');
    expect(formatMeasurement(undefined, 'cm')).toBe('--');
    expect(formatMeasurement(null, 'in')).toBe('--');
  });

  it('formats mm to active unit system', () => {
    // 386 mm = 38.6 cm
    expect(formatMm(386, 'cm')).toBe('38.6 cm');
    expect(formatMm(386, 'in')).toBe('15.2 in');
    expect(formatMm(undefined, 'cm')).toBe('--');
  });
});
