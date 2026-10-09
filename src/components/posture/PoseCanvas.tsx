import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { KeypointLandmarks } from '../../lib/pose/detector';
import { computePostureAngles, type Point2D } from '../../lib/pose/geometry';

interface PoseCanvasProps {
  imageSource: HTMLImageElement | HTMLCanvasElement;
  landmarks: KeypointLandmarks;
  onLandmarksChange: (updated: KeypointLandmarks) => void;
  className?: string;
}

type LandmarkKey = 'shoulder' | 'elbow' | 'wrist' | 'hip' | 'knee' | 'ankle';

export const PoseCanvas: React.FC<PoseCanvasProps> = ({
  imageSource,
  landmarks,
  onLandmarksChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeDragKey, setActiveDragKey] = useState<LandmarkKey | null>(null);
  const [hoveredKey, setHoveredKey] = useState<LandmarkKey | null>(null);

  // Dimension scaling factors between image pixel space and canvas display
  const [displaySize, setDisplaySize] = useState<{ width: number; height: number }>({
    width: 640,
    height: 480,
  });

  const updateDisplaySize = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const imgAspect = imageSource.width / imageSource.height;
    const width = containerWidth;
    const height = containerWidth / imgAspect;
    setDisplaySize({ width, height });
  }, [imageSource]);

  useEffect(() => {
    updateDisplaySize();
    window.addEventListener('resize', updateDisplaySize);
    return () => window.removeEventListener('resize', updateDisplaySize);
  }, [updateDisplaySize]);

  // Convert normalized point (0..1) to canvas pixel coordinates
  const toCanvasCoords = useCallback(
    (p: Point2D) => ({
      x: p.x * displaySize.width,
      y: p.y * displaySize.height,
    }),
    [displaySize]
  );

  // Convert canvas pixel coordinates to normalized (0..1) point
  const toNormalizedCoords = useCallback(
    (x: number, y: number): Point2D => ({
      x: Math.max(0, Math.min(1, x / displaySize.width)),
      y: Math.max(0, Math.min(1, y / displaySize.height)),
    }),
    [displaySize]
  );

  // Draw overlay skeleton and angle arcs on every state change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = displaySize.width * dpr;
    canvas.height = displaySize.height * dpr;
    ctx.scale(dpr, dpr);

    // 1. Draw background image
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    ctx.drawImage(imageSource, 0, 0, displaySize.width, displaySize.height);

    // 2. Compute live angles
    const angles = computePostureAngles(landmarks);

    // Canvas points
    const pts = {
      shoulder: toCanvasCoords(landmarks.shoulder),
      elbow: toCanvasCoords(landmarks.elbow),
      wrist: toCanvasCoords(landmarks.wrist),
      hip: toCanvasCoords(landmarks.hip),
      knee: toCanvasCoords(landmarks.knee),
      ankle: toCanvasCoords(landmarks.ankle),
    };

    // 3. Draw Connecting Skeleton Lines
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Torso: Hip -> Shoulder (Cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pts.hip.x, pts.hip.y);
    ctx.lineTo(pts.shoulder.x, pts.shoulder.y);
    ctx.stroke();

    // Arm: Shoulder -> Elbow -> Wrist (Emerald)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pts.shoulder.x, pts.shoulder.y);
    ctx.lineTo(pts.elbow.x, pts.elbow.y);
    ctx.lineTo(pts.wrist.x, pts.wrist.y);
    ctx.stroke();

    // Leg: Hip -> Knee -> Ankle (Volt / Lime)
    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pts.hip.x, pts.hip.y);
    ctx.lineTo(pts.knee.x, pts.knee.y);
    ctx.lineTo(pts.ankle.x, pts.ankle.y);
    ctx.stroke();

    // 4. Horizontal Ground Reference Line at Hip for Torso Angle
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pts.hip.x - 40, pts.hip.y);
    ctx.lineTo(pts.hip.x + 80, pts.hip.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Draw Angle Arcs & Labels
    // Knee Angle Arc at 6 o'clock
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pts.knee.x, pts.knee.y, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Badge for Knee
    drawBadge(ctx, `${angles.kneeAngle}°`, pts.knee.x + 18, pts.knee.y - 12, '#fb7185', '#fff');

    // Draw Badge for Torso Angle
    drawBadge(ctx, `Back: ${angles.backAngle}°`, pts.hip.x + 20, pts.hip.y - 20, '#06b6d4', '#fff');

    // Draw Badge for Elbow Angle
    drawBadge(ctx, `${angles.elbowAngle}°`, pts.elbow.x + 14, pts.elbow.y - 10, '#10b981', '#fff');

    // 6. Draw Joint Interactive Drag Handles
    const jointKeys: LandmarkKey[] = ['shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle'];
    jointKeys.forEach(k => {
      const pt = pts[k];
      const isHovered = hoveredKey === k || activeDragKey === k;

      // Outer glow/ring if dragging or hovering
      if (isHovered) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer white ring
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isHovered ? 9 : 7, 0, Math.PI * 2);
      ctx.fill();

      // Inner color circle
      ctx.fillStyle = k === 'knee' ? '#fb7185' : k === 'hip' || k === 'shoulder' ? '#06b6d4' : '#10b981';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isHovered ? 6 : 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Label beside handle
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px Inter, system-ui, sans-serif';
      ctx.fillText(k.toUpperCase(), pt.x + 12, pt.y + 4);
    });
  }, [imageSource, landmarks, displaySize, activeDragKey, hoveredKey, toCanvasCoords]);

  // Helper to draw pill badges on canvas
  function drawBadge(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    bgColor: string,
    textColor: string
  ) {
    ctx.font = 'bold 11px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const paddingX = 6;
    const width = textWidth + paddingX * 2;
    const height = 18;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y - height / 2, width, height, 4);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.fillText(text, x + paddingX, y + 4);
  }

  // Pointer Down (Start dragging)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check hit radius on joints (22px)
    const HIT_RADIUS = 24;
    const jointKeys: LandmarkKey[] = ['shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle'];

    for (const k of jointKeys) {
      const pt = toCanvasCoords(landmarks[k]);
      const dist = Math.hypot(clickX - pt.x, clickY - pt.y);
      if (dist <= HIT_RADIUS) {
        setActiveDragKey(k);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        break;
      }
    }
  };

  // Pointer Move (Drag landmark and recompute live)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;

    if (activeDragKey) {
      const updatedNorm = toNormalizedCoords(currX, currY);
      onLandmarksChange({
        ...landmarks,
        [activeDragKey]: updatedNorm,
      });
      return;
    }

    // Check hover state
    const HIT_RADIUS = 20;
    const jointKeys: LandmarkKey[] = ['shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle'];
    let foundHover: LandmarkKey | null = null;

    for (const k of jointKeys) {
      const pt = toCanvasCoords(landmarks[k]);
      const dist = Math.hypot(currX - pt.x, currY - pt.y);
      if (dist <= HIT_RADIUS) {
        foundHover = k;
        break;
      }
    }
    setHoveredKey(foundHover);
  };

  // Pointer Up (Stop drag)
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeDragKey) {
      setActiveDragKey(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden rounded-2xl bg-slate-950 select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: `${displaySize.width}px`,
          height: `${displaySize.height}px`,
        }}
        className={`touch-none block ${
          activeDragKey ? 'cursor-grabbing' : hoveredKey ? 'cursor-grab' : 'cursor-crosshair'
        }`}
      />

      {/* Floating interactive hint */}
      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-xs border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
        <span>💡 Tap or drag any colored circle to correct landmark position</span>
        <span className="font-mono text-brand-400 font-bold uppercase">{landmarks.side} side view</span>
      </div>
    </div>
  );
};
