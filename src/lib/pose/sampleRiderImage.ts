import type { KeypointLandmarks } from './detector';

/**
 * Creates an offscreen canvas with a clean side-profile road cyclist on a trainer
 * for instant testing without requiring an uploaded image file.
 */
export function createSampleCyclistCanvas(): {
  canvas: HTMLCanvasElement;
  defaultLandmarks: KeypointLandmarks;
} {
  const width = 800;
  const height = 600;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Hip on saddle
  const hipX = 265;
  const hipY = 195;
  // Knee at 6 o'clock
  const kneeX = 320;
  const kneeY = 345;
  // Ankle on pedal
  const ankleX = 340;
  const ankleY = 480;
  // Shoulder
  const shoulderX = 430;
  const shoulderY = 135;
  // Elbow
  const elbowX = 490;
  const elbowY = 195;
  // Wrist on hoods
  const wristX = 555;
  const wristY = 240;

  if (ctx) {
    // Background indoor wall / studio
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1e293b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Floor
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 520, width, 80);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 520);
    ctx.lineTo(width, 520);
    ctx.stroke();

    // Bike Wheels
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(180, 430, 90, 0, Math.PI * 2); // Rear
    ctx.arc(620, 430, 90, 0, Math.PI * 2); // Front
    ctx.stroke();

    // Trainer Stand
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(130, 520);
    ctx.lineTo(180, 430);
    ctx.lineTo(230, 520);
    ctx.fill();

    // Bike Frame (BB at 340, 430)
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Rear triangle
    ctx.moveTo(180, 430);
    ctx.lineTo(340, 430);
    ctx.lineTo(290, 290);
    ctx.lineTo(180, 430);
    // Front triangle
    ctx.moveTo(290, 290);
    ctx.lineTo(520, 260); // Top tube
    ctx.lineTo(340, 430); // Down tube
    // Fork & Headtube
    ctx.moveTo(520, 260);
    ctx.lineTo(530, 310);
    ctx.lineTo(620, 430);
    ctx.stroke();

    // Seatpost & Saddle
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(290, 290);
    ctx.lineTo(260, 205);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(220, 195, 75, 12, 4);
    ctx.fill();

    // Crank & Pedal at 6 o'clock
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(340, 430);
    ctx.lineTo(340, 485); // 6 o'clock position
    ctx.stroke();

    // Handlebars & Stem
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(520, 260);
    ctx.lineTo(545, 235);
    ctx.lineTo(560, 245);
    ctx.stroke();

    // Head & Helmet
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(460, 85, 26, 20, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 32;
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(shoulderX, shoulderY);
    ctx.stroke();

    // Leg (Thigh & Shin)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(ankleX, ankleY);
    ctx.stroke();

    // Arm
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(elbowX, elbowY);
    ctx.lineTo(wristX, wristY);
    ctx.stroke();

    // Shoe
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(345, 485, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const defaultLandmarks: KeypointLandmarks = {
    shoulder: { x: shoulderX / width, y: shoulderY / height },
    elbow: { x: elbowX / width, y: elbowY / height },
    wrist: { x: wristX / width, y: wristY / height },
    hip: { x: hipX / width, y: hipY / height },
    knee: { x: kneeX / width, y: kneeY / height },
    ankle: { x: ankleX / width, y: ankleY / height },
    side: 'right',
    confidence: 0.95,
  };

  return { canvas, defaultLandmarks };
}
