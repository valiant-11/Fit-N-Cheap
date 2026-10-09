import { FIT_CONSTANTS } from './constants';
import type { RidingStyle } from '../../types';

export interface AngleEvaluation {
  angleName: string;
  measuredDeg: number;
  targetMin: number;
  targetMax: number;
  status: 'optimal' | 'low' | 'high';
  advice: string;
  category: 'saddle' | 'cockpit' | 'posture';
}

/**
 * Pure rule-based advice generator comparing measured angles against biomechanical target windows.
 * Zero LLM - deterministic if/else rules only.
 */
export function evaluatePostureAngles(
  angles: {
    kneeAngle: number;
    hipAngle: number;
    backAngle: number;
    elbowAngle: number;
    shoulderAngle: number;
  },
  ridingStyle: RidingStyle = 'balanced'
): AngleEvaluation[] {
  const evaluations: AngleEvaluation[] = [];

  // 1. Knee Angle at 6 o'clock (Target: 140° - 150°)
  const kneeTarget = FIT_CONSTANTS.TARGET_ANGLES.kneeBottom;
  if (angles.kneeAngle < kneeTarget.min) {
    evaluations.push({
      angleName: 'Knee Extension (6 o’clock)',
      measuredDeg: angles.kneeAngle,
      targetMin: kneeTarget.min,
      targetMax: kneeTarget.max,
      status: 'low',
      advice:
        'Saddle likely too low. Raise saddle in ~3–5 mm steps and recheck. A saddle that is too low places excessive shear stress on the anterior patellar tendon.',
      category: 'saddle',
    });
  } else if (angles.kneeAngle > kneeTarget.max) {
    evaluations.push({
      angleName: 'Knee Extension (6 o’clock)',
      measuredDeg: angles.kneeAngle,
      targetMin: kneeTarget.min,
      targetMax: kneeTarget.max,
      status: 'high',
      advice:
        'Saddle likely too high or reaching for pedal. Lower saddle in ~3–5 mm steps. Overextension causes posterior hamstring/knee strain and pelvis rocking.',
      category: 'saddle',
    });
  } else {
    evaluations.push({
      angleName: 'Knee Extension (6 o’clock)',
      measuredDeg: angles.kneeAngle,
      targetMin: kneeTarget.min,
      targetMax: kneeTarget.max,
      status: 'optimal',
      advice:
        'Optimal knee extension (140°–150°). Good power transfer without hyperextending or pinching the knee joint.',
      category: 'saddle',
    });
  }

  // 2. Hip Angle (Target: 100° - 115°)
  const hipTarget = FIT_CONSTANTS.TARGET_ANGLES.hipOpen;
  if (angles.hipAngle < hipTarget.min) {
    evaluations.push({
      angleName: 'Hip Angle (Open)',
      measuredDeg: angles.hipAngle,
      targetMin: hipTarget.min,
      targetMax: hipTarget.max,
      status: 'low',
      advice:
        'Hip angle is overly compressed (<100°). Consider raising handlebars with 5–10 mm of headset spacers, sliding saddle slightly back, or using shorter crank arms to open the hip.',
      category: 'cockpit',
    });
  } else if (angles.hipAngle > hipTarget.max) {
    evaluations.push({
      angleName: 'Hip Angle (Open)',
      measuredDeg: angles.hipAngle,
      targetMin: hipTarget.min,
      targetMax: hipTarget.max,
      status: 'high',
      advice:
        'Hip angle is very open (>115°). Position is quite upright, which reduces aerodynamics but may favor riders with acute lumbar stiffness.',
      category: 'cockpit',
    });
  } else {
    evaluations.push({
      angleName: 'Hip Angle (Open)',
      measuredDeg: angles.hipAngle,
      targetMin: hipTarget.min,
      targetMax: hipTarget.max,
      status: 'optimal',
      advice:
        'Hip angle is balanced (100°–115°), allowing smooth diaphragmatic breathing and glute activation without impingement.',
      category: 'cockpit',
    });
  }

  // 3. Back Angle vs Horizontal (Target varies by riding style)
  const backTarget = FIT_CONSTANTS.TARGET_ANGLES.backAngle[ridingStyle];
  if (angles.backAngle < backTarget.min) {
    evaluations.push({
      angleName: `Torso Incline (${ridingStyle})`,
      measuredDeg: angles.backAngle,
      targetMin: backTarget.min,
      targetMax: backTarget.max,
      status: 'low',
      advice:
        'Torso is flatter than typical for this riding style. If you experience neck, trapezius, or lower back soreness, raise your stem or shorten reach.',
      category: 'posture',
    });
  } else if (angles.backAngle > backTarget.max) {
    evaluations.push({
      angleName: `Torso Incline (${ridingStyle})`,
      measuredDeg: angles.backAngle,
      targetMin: backTarget.min,
      targetMax: backTarget.max,
      status: 'high',
      advice:
        'Torso is noticeably upright. For greater aerodynamic efficiency and wind penetration, you can lower stem spacers or slightly extend stem length.',
      category: 'posture',
    });
  } else {
    evaluations.push({
      angleName: `Torso Incline (${ridingStyle})`,
      measuredDeg: angles.backAngle,
      targetMin: backTarget.min,
      targetMax: backTarget.max,
      status: 'optimal',
      advice: `Torso angle aligns comfortably with typical ${ridingStyle} road cycling posture (${backTarget.min}°–${backTarget.max}°).`,
      category: 'posture',
    });
  }

  // 4. Elbow Bend Angle (Target: 150° - 165°)
  const elbowTarget = FIT_CONSTANTS.TARGET_ANGLES.elbow;
  if (angles.elbowAngle > elbowTarget.max) {
    evaluations.push({
      angleName: 'Elbow Bend',
      measuredDeg: angles.elbowAngle,
      targetMin: elbowTarget.min,
      targetMax: elbowTarget.max,
      status: 'high',
      advice:
        'Elbows appear locked or straight (>165°). Locked elbows transfer road vibrations straight into shoulders and wrists. Introduce a gentle 15° bend.',
      category: 'cockpit',
    });
  } else if (angles.elbowAngle < elbowTarget.min) {
    evaluations.push({
      angleName: 'Elbow Bend',
      measuredDeg: angles.elbowAngle,
      targetMin: elbowTarget.min,
      targetMax: elbowTarget.max,
      status: 'low',
      advice:
        'Elbows are bent more than usual (<150°). Check if reach is too short or if you are hunching your shoulders.',
      category: 'cockpit',
    });
  } else {
    evaluations.push({
      angleName: 'Elbow Bend',
      measuredDeg: angles.elbowAngle,
      targetMin: elbowTarget.min,
      targetMax: elbowTarget.max,
      status: 'optimal',
      advice:
        'Natural shock-absorbing bend (150°–165°). Helps damp road chatter and prevents ulnar nerve numbness in hands.',
      category: 'cockpit',
    });
  }

  // 5. Shoulder-to-Torso Angle (Target: 80° - 95°)
  const shoulderTarget = FIT_CONSTANTS.TARGET_ANGLES.shoulder;
  if (angles.shoulderAngle > shoulderTarget.max) {
    evaluations.push({
      angleName: 'Shoulder Extension',
      measuredDeg: angles.shoulderAngle,
      targetMin: shoulderTarget.min,
      targetMax: shoulderTarget.max,
      status: 'high',
      advice:
        'Shoulder angle is overextended (>95°). Cockpit reach is likely too long. Consider a stem 10–20 mm shorter or handlebars with shorter reach.',
      category: 'cockpit',
    });
  } else if (angles.shoulderAngle < shoulderTarget.min) {
    evaluations.push({
      angleName: 'Shoulder Extension',
      measuredDeg: angles.shoulderAngle,
      targetMin: shoulderTarget.min,
      targetMax: shoulderTarget.max,
      status: 'low',
      advice:
        'Shoulder angle is cramped (<80°). Upper body may feel compressed. Consider a 10 mm longer stem.',
      category: 'cockpit',
    });
  } else {
    evaluations.push({
      angleName: 'Shoulder Extension',
      measuredDeg: angles.shoulderAngle,
      targetMin: shoulderTarget.min,
      targetMax: shoulderTarget.max,
      status: 'optimal',
      advice:
        'Shoulders are well-positioned (80°–95°). Arms can bear upper body load without straining neck muscles.',
      category: 'cockpit',
    });
  }

  return evaluations;
}
