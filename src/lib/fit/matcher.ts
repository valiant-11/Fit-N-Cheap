import type { BikeFrame, FitResult } from '../../types';

export type FitStatus = 'fits' | 'close' | 'too_big' | 'too_small';

export interface FrameMatchResult {
  frame: BikeFrame;
  status: FitStatus;
  statusLabel: string;
  score: number; // 0 to 100 (100 = perfect match)
  deltaReachMm: number; // Frame reach - target center
  deltaStackMm: number; // Frame stack - target center
  deltaSeatTubeMm: number; // Frame seat tube - target center
  primaryIssue: string | null;
  suggestions: string[];
}

/**
 * Evaluates and scores a bike frame against a rider's calculated fit targets.
 */
export function matchBikeFrame(
  frame: BikeFrame,
  fit: FitResult
): FrameMatchResult {
  const targetReachCenter = (fit.reachMinMm + fit.reachMaxMm) / 2;
  const targetStackCenter = (fit.stackMinMm + fit.stackMaxMm) / 2;
  const targetSeatTubeMm = fit.frameSizeSeatTubeCT * 10;

  const deltaReach = Math.round(frame.reach - targetReachCenter);
  const deltaStack = Math.round(frame.stack - targetStackCenter);
  const deltaSeatTube = Math.round(frame.seatTubeCT - targetSeatTubeMm);

  // Compute deviations relative to acceptable tolerances
  const reachTolerance = 14; // mm
  const stackTolerance = 18; // mm
  const seatTubeTolerance = 25; // mm

  const reachDeviation = Math.abs(deltaReach);
  const stackDeviation = Math.abs(deltaStack);

  // Weighted composite penalty
  const penalty = reachDeviation * 1.5 + stackDeviation * 1.2 + Math.abs(deltaSeatTube) * 0.4;
  const score = Math.max(0, Math.min(100, Math.round(100 - penalty * 1.2)));

  // Categorize fit status
  let status: FitStatus = 'fits';
  let primaryIssue: string | null = null;
  const suggestions: string[] = [];

  if (reachDeviation <= reachTolerance && stackDeviation <= stackTolerance) {
    status = 'fits';
  } else if (reachDeviation <= reachTolerance * 2.2 && stackDeviation <= stackTolerance * 2.0) {
    status = 'close';
  } else if (deltaReach > reachTolerance * 2.2 || deltaStack > stackTolerance * 2.0 || deltaSeatTube > seatTubeTolerance * 2) {
    status = 'too_big';
    primaryIssue = deltaReach > reachTolerance * 2.2 ? 'Reach too long' : 'Stack/Seat tube too tall';
  } else {
    status = 'too_small';
    primaryIssue = deltaReach < -reachTolerance * 2.2 ? 'Reach too short' : 'Stack too low';
  }

  // Generate practical cockpit tuning suggestions to close gaps
  if (deltaReach > 8) {
    suggestions.push(
      `Frame reach is ${Math.abs(deltaReach)} mm long. Fit a ${Math.round(deltaReach / 10) * 10} mm shorter stem (e.g. 90 mm) or short-reach handlebars.`
    );
  } else if (deltaReach < -8) {
    suggestions.push(
      `Frame reach is ${Math.abs(deltaReach)} mm short. Fit a ${Math.round(Math.abs(deltaReach) / 10) * 10} mm longer stem (e.g. 110–120 mm) to open your cockpit.`
    );
  }

  if (deltaStack > 10) {
    suggestions.push(
      `Frame stack is ${deltaStack} mm taller than ideal. Remove headset spacers or use a -17° downward stem to achieve your target drop.`
    );
  } else if (deltaStack < -10) {
    suggestions.push(
      `Frame stack is ${Math.abs(deltaStack)} mm lower than ideal. Add ${Math.round(Math.abs(deltaStack) / 5) * 5} mm of headset spacers under the stem to raise handlebar height.`
    );
  }

  if (Math.abs(deltaSeatTube) > 30) {
    suggestions.push(
      `Seat tube is ${Math.abs(deltaSeatTube)} mm ${deltaSeatTube > 0 ? 'longer' : 'shorter'} than classic C-T recommendation. Check standover clearance and seatpost insertion limit.`
    );
  }

  if (suggestions.length === 0) {
    suggestions.push('Stock cockpit geometry (standard 100mm stem and 10-15mm spacers) should achieve an ideal fit.');
  }

  const statusLabels: Record<FitStatus, string> = {
    fits: 'Fits Well',
    close: 'Close (Adjustable)',
    too_big: 'Too Big',
    too_small: 'Too Small',
  };

  return {
    frame,
    status,
    statusLabel: statusLabels[status],
    score,
    deltaReachMm: deltaReach,
    deltaStackMm: deltaStack,
    deltaSeatTubeMm: deltaSeatTube,
    primaryIssue,
    suggestions,
  };
}

/**
 * Matches and ranks an entire list of bike frames against fit targets.
 */
export function rankMatchedFrames(
  frames: BikeFrame[],
  fit: FitResult
): FrameMatchResult[] {
  return frames
    .map(f => matchBikeFrame(f, fit))
    .sort((a, b) => b.score - a.score);
}
