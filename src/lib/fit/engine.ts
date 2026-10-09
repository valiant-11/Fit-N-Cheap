import { FIT_CONSTANTS } from './constants';
import type { RiderMeasurements, FitResult } from '../../types';

/**
 * Calculates saddle height from center of bottom bracket to top of saddle along the seat tube.
 * LeMond formula: Inseam * 0.883
 * Hamley formula: (Inseam * 1.09) - crank length (approx 17.25 cm)
 */
export function calculateSaddleHeight(inseamCm: number): {
  leMondCm: number;
  hamleyCm: number;
  averageCm: number;
} {
  const leMondCm = Number((inseamCm * FIT_CONSTANTS.LEMOND_COEFFICIENT).toFixed(1));
  const hamleyCm = Number(
    (inseamCm * FIT_CONSTANTS.HAMLEY_COEFFICIENT - FIT_CONSTANTS.DEFAULT_CRANK_LENGTH_CM).toFixed(1)
  );
  const averageCm = Number(((leMondCm + hamleyCm) / 2).toFixed(1));

  return {
    leMondCm,
    hamleyCm,
    averageCm,
  };
}

/**
 * Determine recommended crank length based on inseam lookup table
 */
export function determineCrankLength(inseamCm: number): 165 | 170 | 172.5 | 175 {
  for (const item of FIT_CONSTANTS.CRANK_LENGTH_LOOKUP) {
    if (inseamCm <= item.maxInseam) {
      return item.crankLengthMm;
    }
  }
  return 175;
}

/**
 * Determine handlebar width (center-to-center) by rounding shoulder width
 * to closest standard width: 38, 40, 42, 44 cm
 */
export function determineHandlebarWidth(shoulderCm: number): 38 | 40 | 42 | 44 {
  const options = FIT_CONSTANTS.HANDLEBAR_WIDTHS;
  let closest: 38 | 40 | 42 | 44 = options[0];
  let minDiff = Math.abs(shoulderCm - closest);

  for (const opt of options) {
    const diff = Math.abs(shoulderCm - opt);
    if (diff < minDiff) {
      minDiff = diff;
      closest = opt;
    }
  }

  return closest;
}

/**
 * Calculate full fit outputs from rider body measurements
 */
export function calculateBikeFit(measurements: RiderMeasurements): FitResult {
  const { height, inseam, torso, arm, shoulder, flexibility, ridingStyle } = measurements;

  // 1. Saddle Height
  const { leMondCm, hamleyCm, averageCm } = calculateSaddleHeight(inseam);

  // 2. Saddle Setback Guidance (KOPS baseline)
  // Typically 5-8 cm behind BB center depending on femur length (approximated from inseam)
  const setbackCm = Number((inseam * FIT_CONSTANTS.KOPS_SETBACK_FACTOR).toFixed(1));
  const saddleSetbackDescription = `Starting point ~${setbackCm} cm behind bottom bracket (knee over pedal spindle at 3 o'clock). Adjust fore/aft based on balance and pelvic tilt.`;

  // 3. Frame Size (Seat Tube C-T)
  const frameSizeSeatTubeCT = Number((inseam * FIT_CONSTANTS.FRAME_SIZE_INSEAM_FACTOR).toFixed(1));

  // 4. Reach and Stack target ranges (heuristics)
  // Base Stack: derived from height and torso proportion
  // Typical road stack is roughly 0.31 - 0.33 of height
  const baseStack = height * 0.315 + (inseam * 0.05);
  // Style adjustment: endurance is taller, race is lower
  const styleStackFactor = FIT_CONSTANTS.STACK_RATIO[ridingStyle];
  const targetStackCenter = baseStack * (styleStackFactor / 1.48);
  const stackMinMm = Math.round(targetStackCenter * 10 - 15);
  const stackMaxMm = Math.round(targetStackCenter * 10 + 15);

  // Reach estimate: derived from torso + arm length, scaled by riding style and flexibility
  const upperBodyTotal = torso + arm;
  const flexReachMod = flexibility === 'high' ? 8 : flexibility === 'low' ? -8 : 0;
  const styleReachMod = ridingStyle === 'race' ? 10 : ridingStyle === 'endurance' ? -10 : 0;
  const targetReachCenterMm = (upperBodyTotal * 3.1) + flexReachMod + styleReachMod;
  const reachMinMm = Math.round(targetReachCenterMm - 12);
  const reachMaxMm = Math.round(targetReachCenterMm + 12);

  // 5. Saddle-to-Bar Drop Range (mm)
  const dropRange = FIT_CONSTANTS.DROP_RANGES_MM[ridingStyle][flexibility];

  // 6. Handlebar Width
  const handlebarWidthCm = determineHandlebarWidth(shoulder);

  // 7. Crank Length
  const crankLengthMm = determineCrankLength(inseam);

  // 8. Target angles
  const backRange = FIT_CONSTANTS.TARGET_ANGLES.backAngle[ridingStyle];

  return {
    saddleHeightLeMond: leMondCm,
    saddleHeightHamley: hamleyCm,
    saddleHeightAvg: averageCm,
    saddleSetbackDescription,
    saddleSetbackMm: setbackCm * 10,
    frameSizeSeatTubeCT,
    reachMinMm,
    reachMaxMm,
    stackMinMm,
    stackMaxMm,
    saddleToBarDropMinMm: dropRange.min,
    saddleToBarDropMaxMm: dropRange.max,
    handlebarWidthCm,
    crankLengthMm,
    targetAngles: {
      kneeBottomDeg: {
        min: FIT_CONSTANTS.TARGET_ANGLES.kneeBottom.min,
        max: FIT_CONSTANTS.TARGET_ANGLES.kneeBottom.max,
      },
      hipOpenDeg: {
        min: FIT_CONSTANTS.TARGET_ANGLES.hipOpen.min,
        max: FIT_CONSTANTS.TARGET_ANGLES.hipOpen.max,
      },
      backAngleDeg: {
        min: backRange.min,
        max: backRange.max,
      },
      elbowDeg: {
        min: FIT_CONSTANTS.TARGET_ANGLES.elbow.min,
        max: FIT_CONSTANTS.TARGET_ANGLES.elbow.max,
      },
      shoulderDeg: {
        min: FIT_CONSTANTS.TARGET_ANGLES.shoulder.min,
        max: FIT_CONSTANTS.TARGET_ANGLES.shoulder.max,
      },
    },
  };
}
