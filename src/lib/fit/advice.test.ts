import { describe, it, expect } from 'vitest';
import { evaluatePostureAngles } from './advice';

describe('Biomechanical Advice Engine', () => {
  it('flags knee angle below 140 degrees as saddle too low', () => {
    const angles = {
      kneeAngle: 132, // Too low
      hipAngle: 108,
      backAngle: 42,
      elbowAngle: 158,
      shoulderAngle: 88,
    };

    const evals = evaluatePostureAngles(angles, 'balanced');
    const kneeEval = evals.find(e => e.angleName.includes('Knee'));

    expect(kneeEval).toBeDefined();
    expect(kneeEval?.status).toBe('low');
    expect(kneeEval?.advice).toContain('Saddle likely too low');
  });

  it('flags knee angle above 150 degrees as saddle too high', () => {
    const angles = {
      kneeAngle: 156, // Overextended
      hipAngle: 108,
      backAngle: 42,
      elbowAngle: 158,
      shoulderAngle: 88,
    };

    const evals = evaluatePostureAngles(angles, 'balanced');
    const kneeEval = evals.find(e => e.angleName.includes('Knee'));

    expect(kneeEval).toBeDefined();
    expect(kneeEval?.status).toBe('high');
    expect(kneeEval?.advice).toContain('Saddle likely too high');
  });

  it('evaluates optimal knee range (140-150 deg) as optimal', () => {
    const angles = {
      kneeAngle: 145,
      hipAngle: 108,
      backAngle: 43,
      elbowAngle: 158,
      shoulderAngle: 88,
    };

    const evals = evaluatePostureAngles(angles, 'balanced');
    const kneeEval = evals.find(e => e.angleName.includes('Knee'));

    expect(kneeEval?.status).toBe('optimal');
    expect(kneeEval?.advice).toContain('Optimal knee extension');
  });

  it('tailors back angle evaluation to chosen riding style', () => {
    const angles = {
      kneeAngle: 145,
      hipAngle: 108,
      backAngle: 34, // 34 deg is optimal for race, but low for endurance
      elbowAngle: 158,
      shoulderAngle: 88,
    };

    const raceEvals = evaluatePostureAngles(angles, 'race');
    const enduranceEvals = evaluatePostureAngles(angles, 'endurance');

    const raceBack = raceEvals.find(e => e.category === 'posture');
    const enduranceBack = enduranceEvals.find(e => e.category === 'posture');

    expect(raceBack?.status).toBe('optimal');
    expect(enduranceBack?.status).toBe('low');
    expect(enduranceBack?.advice).toContain('flatter than typical');
  });
});
