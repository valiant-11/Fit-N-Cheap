/**
 * Fit N Cheap — Core Biomechanical Fit Constants & Formula Coefficients
 * Every formula, range, and lookup table is defined here with clear methodology notes.
 */

export const FIT_CONSTANTS = {
  // Saddle Height (from bottom bracket center to top of saddle along the seat tube)
  // 1. Greg LeMond method: Inseam * 0.883
  LEMOND_COEFFICIENT: 0.883,

  // 2. Hamley & Thomas method: Inseam * 1.09 (measured from pedal axle at bottom dead center to saddle top)
  // Assuming standard 172.5mm crank (17.25 cm): Saddle height from BB ≈ (Inseam * 1.09) - 17.25 cm
  HAMLEY_COEFFICIENT: 1.09,
  DEFAULT_CRANK_LENGTH_CM: 17.25,

  // Saddle Setback (horizontal distance saddle tip behind bottom bracket center)
  // Traditional starting point: ~5-7 cm for average riders, scaled gently by inseam/femur length
  KOPS_SETBACK_FACTOR: 0.07, // roughly 7% of inseam as initial guideline

  // Frame Size: Traditional road seat tube Center-to-Top (C-T) estimate in cm:
  // Inseam * 0.65 to 0.67
  FRAME_SIZE_INSEAM_FACTOR: 0.655,

  // Crank length lookup table by Inseam (cm)
  // Shorter cranks are increasingly preferred in modern bike fitting for open hip angles at top dead center
  CRANK_LENGTH_LOOKUP: [
    { maxInseam: 74, crankLengthMm: 165 as const },
    { maxInseam: 81, crankLengthMm: 170 as const },
    { maxInseam: 88, crankLengthMm: 172.5 as const },
    { maxInseam: 999, crankLengthMm: 175 as const },
  ],

  // Handlebar width options (cm, center-to-center at hoods)
  // Road cycling standard: closely matches acromion-to-acromion shoulder width
  HANDLEBAR_WIDTHS: [38, 40, 42, 44] as const,

  // Saddle-to-Handlebar Drop range (mm) by flexibility and riding style
  DROP_RANGES_MM: {
    endurance: {
      low: { min: 0, max: 25 },
      medium: { min: 20, max: 45 },
      high: { min: 35, max: 60 },
    },
    balanced: {
      low: { min: 20, max: 45 },
      medium: { min: 40, max: 70 },
      high: { min: 60, max: 90 },
    },
    race: {
      low: { min: 40, max: 65 },
      medium: { min: 65, max: 95 },
      high: { min: 85, max: 125 },
    },
  },

  // Reach and Stack Heuristics
  // Stack ratio from height/inseam modified by style:
  // Endurance: taller stack (stack-to-reach ratio ~1.52 - 1.58)
  // Balanced: medium stack (ratio ~1.45 - 1.52)
  // Race: aggressive low stack (ratio ~1.38 - 1.45)
  STACK_RATIO: {
    endurance: 1.54,
    balanced: 1.48,
    race: 1.42,
  },

  // Target Body Angles (degrees) on the bike
  TARGET_ANGLES: {
    // Knee interior angle at 6 o'clock (Holmes method: 140° - 150° interior angle, equivalent to 30°-40° flexion)
    kneeBottom: {
      min: 140,
      max: 150,
      ideal: 145,
      description: 'Interior angle of hip-knee-ankle with pedal at bottom dead center.',
    },
    // Hip angle at bottom of pedal stroke
    hipOpen: {
      min: 100,
      max: 115,
      ideal: 107,
      description: 'Torso-to-femur angle at the open portion of pedal stroke.',
    },
    // Back angle relative to horizontal ground line
    backAngle: {
      endurance: { min: 45, max: 52, ideal: 48 },
      balanced: { min: 40, max: 46, ideal: 43 },
      race: { min: 30, max: 38, ideal: 34 },
      description: 'Angle of rider torso line relative to horizontal plane.',
    },
    // Elbow bend angle (interior angle: 150°-165°, roughly 15°-30° flexion)
    elbow: {
      min: 150,
      max: 165,
      ideal: 158,
      description: 'Gentle bend at elbow to absorb road shock.',
    },
    // Shoulder angle (torso to upper arm: 80°-95°)
    shoulder: {
      min: 80,
      max: 95,
      ideal: 88,
      description: 'Upper arm angle relative to spine.',
    },
  },

  // Typical human measurement validation bounds (cm)
  RANGES: {
    height: { min: 140, max: 215, defaultVal: 175 },
    inseam: { min: 60, max: 105, defaultVal: 82 },
    torso: { min: 45, max: 80, defaultVal: 60 },
    arm: { min: 45, max: 85, defaultVal: 60 },
    shoulder: { min: 32, max: 54, defaultVal: 42 },
    foot: { min: 20, max: 36, defaultVal: 27 },
  },
};

// Default sample rider measurements for quick testing
export const SAMPLE_MEASUREMENTS = {
  height: 178, // 178 cm (~5 ft 10 in)
  inseam: 83, // 83 cm
  torso: 62, // 62 cm
  arm: 60, // 60 cm
  shoulder: 42, // 42 cm
  foot: 27, // 27 cm (EU 43)
  flexibility: 'medium' as const,
  ridingStyle: 'balanced' as const,
};
