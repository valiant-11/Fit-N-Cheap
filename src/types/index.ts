export type UnitSystem = 'cm' | 'in';

export type FlexibilityLevel = 'low' | 'medium' | 'high';
export type RidingStyle = 'endurance' | 'balanced' | 'race';

export interface RiderMeasurements {
  height: number; // Stored in cm
  inseam: number; // Stored in cm
  torso: number; // Stored in cm
  arm: number; // Stored in cm
  shoulder: number; // Stored in cm
  foot?: number; // Optional, stored in cm
  flexibility: FlexibilityLevel;
  ridingStyle: RidingStyle;
}

export interface FitResult {
  saddleHeightLeMond: number; // cm
  saddleHeightHamley: number; // cm
  saddleHeightAvg: number; // cm
  saddleSetbackDescription: string;
  saddleSetbackMm: number; // estimated mm behind BB center
  frameSizeSeatTubeCT: number; // cm
  reachMinMm: number;
  reachMaxMm: number;
  stackMinMm: number;
  stackMaxMm: number;
  saddleToBarDropMinMm: number;
  saddleToBarDropMaxMm: number;
  handlebarWidthCm: 38 | 40 | 42 | 44;
  crankLengthMm: 165 | 170 | 172.5 | 175;
  targetAngles: {
    kneeBottomDeg: { min: number; max: number };
    hipOpenDeg: { min: number; max: number };
    backAngleDeg: { min: number; max: number };
    elbowDeg: { min: number; max: number };
    shoulderDeg: { min: number; max: number };
  };
}

export interface SavedFit {
  id: string;
  name: string;
  createdAt: string;
  measurements: RiderMeasurements;
  results: FitResult;
  notes?: string;
}

export interface BikeFrame {
  id: string;
  brand: string;
  model: string;
  year: number;
  size: string;
  seatTubeCT: number; // mm
  stack: number; // mm
  reach: number; // mm
  effTT: number; // mm (effective top tube)
  headTube: number; // mm
  wheelbase: number; // mm
  sourceUrl: string;
  verified: boolean;
}
