export interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculates the interior angle in degrees between three points: A -> B -> C,
 * with vertex at point B.
 * Returns angle in degrees [0, 180].
 */
export function calculateInteriorAngle(a: Point2D, b: Point2D, c: Point2D): number {
  // Vector BA
  const v1x = a.x - b.x;
  const v1y = a.y - b.y;
  // Vector BC
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;

  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  const angleRad = Math.acos(cosTheta);
  return Number(((angleRad * 180) / Math.PI).toFixed(1));
}

/**
 * Calculates torso/back angle relative to the horizontal ground plane (0° = horizontal, 90° = vertical).
 * Vertex at Hip, pointing towards Shoulder.
 */
export function calculateBackAngleVsHorizontal(hip: Point2D, shoulder: Point2D): number {
  // In screen coordinates: Y increases downwards.
  // dx = shoulder.x - hip.x (forward), dy = hip.y - shoulder.y (upward height difference)
  const dx = Math.abs(shoulder.x - hip.x);
  const dy = hip.y - shoulder.y; // Positive when shoulder is higher than hip

  if (dx === 0) return 90;

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;
  return Number(Math.max(0, Math.min(90, angleDeg)).toFixed(1));
}

/**
 * Computes all 5 key cycling biomechanical angles from tracked landmarks
 */
export function computePostureAngles(landmarks: {
  shoulder: Point2D;
  elbow: Point2D;
  wrist: Point2D;
  hip: Point2D;
  knee: Point2D;
  ankle: Point2D;
}): {
  kneeAngle: number;
  hipAngle: number;
  backAngle: number;
  elbowAngle: number;
  shoulderAngle: number;
} {
  const { shoulder, elbow, wrist, hip, knee, ankle } = landmarks;

  // Knee interior angle (Hip -> Knee -> Ankle) at 6 o'clock
  const kneeAngle = calculateInteriorAngle(hip, knee, ankle);

  // Hip angle (Shoulder -> Hip -> Knee)
  const hipAngle = calculateInteriorAngle(shoulder, hip, knee);

  // Back angle vs horizontal
  const backAngle = calculateBackAngleVsHorizontal(hip, shoulder);

  // Elbow bend angle (Shoulder -> Elbow -> Wrist)
  const elbowAngle = calculateInteriorAngle(shoulder, elbow, wrist);

  // Shoulder-to-torso angle (Hip -> Shoulder -> Elbow)
  const shoulderAngle = calculateInteriorAngle(hip, shoulder, elbow);

  return {
    kneeAngle,
    hipAngle,
    backAngle,
    elbowAngle,
    shoulderAngle,
  };
}
