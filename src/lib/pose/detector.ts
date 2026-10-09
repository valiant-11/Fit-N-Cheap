import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { Point2D } from './geometry';

export interface KeypointLandmarks {
  shoulder: Point2D;
  elbow: Point2D;
  wrist: Point2D;
  hip: Point2D;
  knee: Point2D;
  ankle: Point2D;
  side: 'left' | 'right';
  confidence: number;
}

let poseLandmarkerInstance: PoseLandmarker | null = null;
let isInitializing = false;

/**
 * Initializes the in-browser MediaPipe PoseLandmarker model using bundled offline assets.
 */
export async function getPoseLandmarker(): Promise<PoseLandmarker> {
  if (poseLandmarkerInstance) {
    return poseLandmarkerInstance;
  }

  if (isInitializing) {
    // Wait until initialized
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (poseLandmarkerInstance) return poseLandmarkerInstance;
  }

  isInitializing = true;
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const wasmPath = `${baseUrl}wasm`;
  const modelPath = `${baseUrl}models/pose_landmarker.task`;

  try {
    // Initialize WebAssembly fileset from local wasm directory
    const vision = await FilesetResolver.forVisionTasks(wasmPath);

    poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: modelPath,
        delegate: 'GPU',
      },
      runningMode: 'IMAGE',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    return poseLandmarkerInstance;
  } catch (err) {
    console.warn('GPU delegate failed or WebAssembly issue, falling back to CPU:', err);
    // Fallback without GPU delegate
    const vision = await FilesetResolver.forVisionTasks(wasmPath);
    poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: modelPath,
        delegate: 'CPU',
      },
      runningMode: 'IMAGE',
      numPoses: 1,
    });
    return poseLandmarkerInstance;
  } finally {
    isInitializing = false;
  }
}

/**
 * Runs PoseLandmarker on a single image or canvas element,
 * auto-detects near side by landmark visibility, and extracts the 6 key landmarks.
 */
export async function detectPose(
  imageSource: HTMLImageElement | HTMLCanvasElement
): Promise<KeypointLandmarks | null> {
  const landmarker = await getPoseLandmarker();
  const result = landmarker.detect(imageSource);

  if (!result.landmarks || result.landmarks.length === 0) {
    return null;
  }

  const raw = result.landmarks[0];

  // MediaPipe Landmark Indices:
  // Left: 11 (shoulder), 13 (elbow), 15 (wrist), 23 (hip), 25 (knee), 27 (ankle)
  // Right: 12 (shoulder), 14 (elbow), 16 (wrist), 24 (hip), 26 (knee), 28 (ankle)

  const leftIndices = [11, 13, 15, 23, 25, 27];
  const rightIndices = [12, 14, 16, 24, 26, 28];

  const leftScore =
    leftIndices.reduce((sum, idx) => sum + (raw[idx]?.visibility ?? 0.5), 0) / leftIndices.length;
  const rightScore =
    rightIndices.reduce((sum, idx) => sum + (raw[idx]?.visibility ?? 0.5), 0) / rightIndices.length;

  const side: 'left' | 'right' = rightScore >= leftScore ? 'right' : 'left';
  const indices = side === 'right' ? rightIndices : leftIndices;

  const shoulder = { x: raw[indices[0]].x, y: raw[indices[0]].y };
  const elbow = { x: raw[indices[1]].x, y: raw[indices[1]].y };
  const wrist = { x: raw[indices[2]].x, y: raw[indices[2]].y };
  const hip = { x: raw[indices[3]].x, y: raw[indices[3]].y };
  const knee = { x: raw[indices[4]].x, y: raw[indices[4]].y };
  const ankle = { x: raw[indices[5]].x, y: raw[indices[5]].y };

  const confidence = Math.max(leftScore, rightScore);

  return {
    shoulder,
    elbow,
    wrist,
    hip,
    knee,
    ankle,
    side,
    confidence: Number(confidence.toFixed(2)),
  };
}
