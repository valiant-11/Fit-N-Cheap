import { describe, it, expect } from 'vitest';
import { matchBikeFrame, rankMatchedFrames } from './matcher';
import type { BikeFrame, FitResult } from '../../types';

describe('Frame Matcher Engine', () => {
  const dummyFit: FitResult = {
    saddleHeightLeMond: 73.3,
    saddleHeightHamley: 73.2,
    saddleHeightAvg: 73.3,
    saddleSetbackDescription: 'test',
    saddleSetbackMm: 58,
    frameSizeSeatTubeCT: 54.4,
    reachMinMm: 380,
    reachMaxMm: 400, // target center = 390 mm
    stackMinMm: 545,
    stackMaxMm: 565, // target center = 555 mm
    saddleToBarDropMinMm: 40,
    saddleToBarDropMaxMm: 70,
    handlebarWidthCm: 42,
    crankLengthMm: 172.5,
    targetAngles: {
      kneeBottomDeg: { min: 140, max: 150 },
      hipOpenDeg: { min: 100, max: 115 },
      backAngleDeg: { min: 40, max: 46 },
      elbowDeg: { min: 150, max: 165 },
      shoulderDeg: { min: 80, max: 95 },
    },
  };

  it('identifies an ideal frame as "fits"', () => {
    const perfectFrame: BikeFrame = {
      id: 'f1',
      brand: 'Ideal Bike',
      model: 'Speed',
      year: 2024,
      size: '54',
      seatTubeCT: 540,
      stack: 555, // exactly matches target center
      reach: 390, // exactly matches target center
      effTT: 550,
      headTube: 145,
      wheelbase: 990,
      sourceUrl: '',
      verified: true,
    };

    const match = matchBikeFrame(perfectFrame, dummyFit);
    expect(match.status).toBe('fits');
    expect(match.score).toBeGreaterThan(90);
    expect(match.deltaReachMm).toBe(0);
    expect(match.deltaStackMm).toBe(0);
  });

  it('categorizes moderately off frames as "close" with cockpit suggestions', () => {
    const closeFrame: BikeFrame = {
      id: 'f2',
      brand: 'Slightly Long Bike',
      model: 'Sprint',
      year: 2024,
      size: '56',
      seatTubeCT: 550,
      stack: 570, // +15 mm
      reach: 405, // +15 mm long reach
      effTT: 565,
      headTube: 160,
      wheelbase: 1000,
      sourceUrl: '',
      verified: false,
    };

    const match = matchBikeFrame(closeFrame, dummyFit);
    expect(match.status).toBe('close');
    expect(match.suggestions.length).toBeGreaterThan(0);
    expect(match.suggestions.some(s => s.includes('shorter stem'))).toBe(true);
  });

  it('categorizes substantially oversized frames as "too_big"', () => {
    const hugeFrame: BikeFrame = {
      id: 'f3',
      brand: 'Jumbo Bike',
      model: 'Giant',
      year: 2024,
      size: '61',
      seatTubeCT: 600,
      stack: 620,
      reach: 435, // +45 mm
      effTT: 600,
      headTube: 200,
      wheelbase: 1030,
      sourceUrl: '',
      verified: false,
    };

    const match = matchBikeFrame(hugeFrame, dummyFit);
    expect(match.status).toBe('too_big');
  });

  it('ranks matched frames in descending order of fit score', () => {
    const frames: BikeFrame[] = [
      {
        id: 'f-bad',
        brand: 'Far off',
        model: 'A',
        year: 2024,
        size: '60',
        seatTubeCT: 600,
        stack: 610,
        reach: 430,
        effTT: 600,
        headTube: 200,
        wheelbase: 1020,
        sourceUrl: '',
        verified: false,
      },
      {
        id: 'f-good',
        brand: 'Spot on',
        model: 'B',
        year: 2024,
        size: '54',
        seatTubeCT: 540,
        stack: 555,
        reach: 390,
        effTT: 550,
        headTube: 145,
        wheelbase: 990,
        sourceUrl: '',
        verified: true,
      },
    ];

    const ranked = rankMatchedFrames(frames, dummyFit);
    expect(ranked[0].frame.id).toBe('f-good');
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });
});
