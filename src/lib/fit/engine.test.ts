import { describe, it, expect } from 'vitest';
import {
  calculateSaddleHeight,
  determineCrankLength,
  determineHandlebarWidth,
  calculateBikeFit,
} from './engine';
import type { RiderMeasurements } from '../../types';

describe('Fit Engine Calculations', () => {
  it('calculates saddle height correctly via LeMond and Hamley methods', () => {
    // Inseam: 83 cm
    // LeMond: 83 * 0.883 = 73.289 -> 73.3 cm
    // Hamley: (83 * 1.09) - 17.25 = 90.47 - 17.25 = 73.22 -> 73.2 cm
    // Average: (73.3 + 73.2) / 2 = 73.3 cm (rounded)
    const result = calculateSaddleHeight(83);
    expect(result.leMondCm).toBe(73.3);
    expect(result.hamleyCm).toBe(73.2);
    expect(result.averageCm).toBe(73.3);
  });

  it('determines crank length using the lookup table', () => {
    expect(determineCrankLength(72)).toBe(165);
    expect(determineCrankLength(78)).toBe(170);
    expect(determineCrankLength(83)).toBe(172.5);
    expect(determineCrankLength(90)).toBe(175);
  });

  it('rounds shoulder width to standard handlebar sizes', () => {
    expect(determineHandlebarWidth(37.5)).toBe(38);
    expect(determineHandlebarWidth(40.2)).toBe(40);
    expect(determineHandlebarWidth(42.1)).toBe(42);
    expect(determineHandlebarWidth(45)).toBe(44);
  });

  it('computes full fit profile for a balanced rider', () => {
    const measurements: RiderMeasurements = {
      height: 178,
      inseam: 83,
      torso: 62,
      arm: 60,
      shoulder: 42,
      foot: 27,
      flexibility: 'medium',
      ridingStyle: 'balanced',
    };

    const fit = calculateBikeFit(measurements);

    expect(fit.saddleHeightAvg).toBe(73.3);
    expect(fit.saddleSetbackMm).toBe(58); // 83 * 0.07 * 10 = 58.1 -> 58 mm
    expect(fit.frameSizeSeatTubeCT).toBe(54.4); // 83 * 0.655 = 54.365 -> 54.4 cm
    expect(fit.handlebarWidthCm).toBe(42);
    expect(fit.crankLengthMm).toBe(172.5);
    expect(fit.stackMinMm).toBeLessThan(fit.stackMaxMm);
    expect(fit.reachMinMm).toBeLessThan(fit.reachMaxMm);
    expect(fit.targetAngles.kneeBottomDeg.min).toBe(140);
    expect(fit.targetAngles.kneeBottomDeg.max).toBe(150);
  });

  it('adjusts drop and stack appropriately for endurance vs race riding styles', () => {
    const base: RiderMeasurements = {
      height: 178,
      inseam: 83,
      torso: 62,
      arm: 60,
      shoulder: 42,
      foot: 27,
      flexibility: 'medium',
      ridingStyle: 'endurance',
    };

    const enduranceFit = calculateBikeFit(base);
    const raceFit = calculateBikeFit({ ...base, ridingStyle: 'race' });

    // Race position should have lower stack (headtube lower) and longer reach (stretched out)
    expect(raceFit.stackMinMm).toBeLessThan(enduranceFit.stackMinMm);
    expect(raceFit.reachMaxMm).toBeGreaterThan(enduranceFit.reachMaxMm);

    // Race position requires greater saddle-to-bar drop
    expect(raceFit.saddleToBarDropMaxMm).toBeGreaterThan(enduranceFit.saddleToBarDropMaxMm);
  });

  it('adjusts saddle-to-bar drop by rider flexibility level', () => {
    const base: RiderMeasurements = {
      height: 178,
      inseam: 83,
      torso: 62,
      arm: 60,
      shoulder: 42,
      foot: 27,
      flexibility: 'low',
      ridingStyle: 'balanced',
    };

    const lowFlexFit = calculateBikeFit(base);
    const highFlexFit = calculateBikeFit({ ...base, flexibility: 'high' });

    // High flexibility allows deeper drop
    expect(highFlexFit.saddleToBarDropMaxMm).toBeGreaterThan(lowFlexFit.saddleToBarDropMaxMm);
  });
});
