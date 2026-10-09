import { describe, it, expect } from 'vitest';
import {
  calculateInteriorAngle,
  calculateBackAngleVsHorizontal,
  computePostureAngles,
  type Point2D,
} from './geometry';

describe('Pose Geometry Math', () => {
  it('calculates a 90 degree right angle correctly', () => {
    const a: Point2D = { x: 0, y: 10 };
    const b: Point2D = { x: 0, y: 0 };
    const c: Point2D = { x: 10, y: 0 };

    const angle = calculateInteriorAngle(a, b, c);
    expect(angle).toBe(90);
  });

  it('calculates a 180 degree straight line angle correctly', () => {
    const a: Point2D = { x: -10, y: 0 };
    const b: Point2D = { x: 0, y: 0 };
    const c: Point2D = { x: 10, y: 0 };

    const angle = calculateInteriorAngle(a, b, c);
    expect(angle).toBe(180);
  });

  it('calculates back angle relative to horizontal ground line', () => {
    // 45 degree upward incline: dx = 10, dy = 10
    const hip: Point2D = { x: 10, y: 50 };
    const shoulder: Point2D = { x: 20, y: 40 };

    const backAngle = calculateBackAngleVsHorizontal(hip, shoulder);
    expect(backAngle).toBe(45);
  });

  it('computes all 5 key biomechanical posture angles for a realistic road cyclist', () => {
    // Realistic cyclist landmarks in normalized space
    const landmarks = {
      hip: { x: 0.35, y: 0.35 },
      knee: { x: 0.42, y: 0.58 },
      ankle: { x: 0.44, y: 0.82 },
      shoulder: { x: 0.55, y: 0.25 },
      elbow: { x: 0.62, y: 0.33 },
      wrist: { x: 0.70, y: 0.40 },
    };

    const angles = computePostureAngles(landmarks);

    // Knee should be in interior obtuse angle range (around 140-155°)
    expect(angles.kneeAngle).toBeGreaterThan(130);
    expect(angles.kneeAngle).toBeLessThan(175);

    // Back angle should be around 25-50°
    expect(angles.backAngle).toBeGreaterThan(20);
    expect(angles.backAngle).toBeLessThan(60);

    // Hip angle should be around 85-130°
    expect(angles.hipAngle).toBeGreaterThan(80);
    expect(angles.hipAngle).toBeLessThan(140);
  });
});
