import React, { useState, useRef } from 'react';
import { useFit } from '../../src/context/FitContext';
import { detectPose, type KeypointLandmarks } from '../lib/pose/detector';
import { computePostureAngles } from '../lib/pose/geometry';
import { evaluatePostureAngles, type AngleEvaluation } from '../lib/fit/advice';
import { createSampleCyclistCanvas } from '../lib/pose/sampleRiderImage';
import { SetupGuideSvg, GoodVsBadPhotoSvg } from '../components/posture/SetupGuideSvg';
import { PoseCanvas } from '../components/posture/PoseCanvas';
import {
  Camera,
  Video,
  Upload,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Info,
  HelpCircle,
  Play,
  Pause,
  Sliders,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const PosturePage: React.FC = () => {
  const { measurements } = useFit();
  const ridingStyle = measurements.ridingStyle || 'balanced';

  // Active step / mode: 'setup' | 'analysis'
  const [activeTab, setActiveTab] = useState<'setup' | 'analyze'>('analyze');

  // Media state
  const [_mediaFile, setMediaFile] = useState<File | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Extracted single frame image/canvas for pose detection
  const [activeImageSource, setActiveImageSource] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [landmarks, setLandmarks] = useState<KeypointLandmarks | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle uploaded media file (photo or video)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    setDetectionError(null);
    setLandmarks(null);
    setActiveImageSource(null);

    const isVid = file.type.startsWith('video');
    setIsVideo(isVid);

    if (isVid) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    } else {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          setActiveImageSource(img);
          runDetectionOnSource(img);
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Run PoseLandmarker on a given image source
  const runDetectionOnSource = async (source: HTMLImageElement | HTMLCanvasElement) => {
    setIsDetecting(true);
    setDetectionError(null);

    try {
      const detected = await detectPose(source);
      if (detected) {
        setLandmarks(detected);
      } else {
        // If detector couldn't find pose cleanly, provide centered fallback points so user can drag them
        const fallback: KeypointLandmarks = {
          shoulder: { x: 0.55, y: 0.28 },
          elbow: { x: 0.62, y: 0.38 },
          wrist: { x: 0.70, y: 0.46 },
          hip: { x: 0.38, y: 0.38 },
          knee: { x: 0.44, y: 0.62 },
          ankle: { x: 0.46, y: 0.85 },
          side: 'right',
          confidence: 0.4,
        };
        setLandmarks(fallback);
        setDetectionError('Automatic pose detection was uncertain. We placed starting markers for you to drag onto your joints.');
      }
    } catch (err) {
      console.error('Detection error:', err);
      // Graceful fallback points
      const fallback: KeypointLandmarks = {
        shoulder: { x: 0.55, y: 0.28 },
        elbow: { x: 0.62, y: 0.38 },
        wrist: { x: 0.70, y: 0.46 },
        hip: { x: 0.38, y: 0.38 },
        knee: { x: 0.44, y: 0.62 },
        ankle: { x: 0.46, y: 0.85 },
        side: 'right',
        confidence: 0.5,
      };
      setLandmarks(fallback);
      setDetectionError('Pose model initialized with draggable markers. Drag each circle to align with your shoulder, hip, knee, and ankle.');
    } finally {
      setIsDetecting(false);
    }
  };

  // Capture current paused video frame
  const handleCaptureVideoFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setActiveImageSource(canvas);
    runDetectionOnSource(canvas);
  };

  // Try with Sample Cyclist Image
  const handleLoadSample = () => {
    setDetectionError(null);
    setIsVideo(false);
    setVideoSrc(null);

    const { canvas, defaultLandmarks } = createSampleCyclistCanvas();
    setActiveImageSource(canvas);
    setLandmarks(defaultLandmarks);
  };

  // Live posture angles and advice evaluations
  const postureAngles = landmarks ? computePostureAngles(landmarks) : null;
  const evaluations: AngleEvaluation[] = postureAngles
    ? evaluatePostureAngles(postureAngles, ridingStyle)
    : [];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 py-2 sm:py-6">
      {/* Top Header & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>On-Device Posture Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Side-View Posture Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Measure actual joint angles on your trainer bike. Drag any point to correct alignment.
          </p>
        </div>

        {/* Tab switch between Setup Guide and Analysis */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('analyze')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analyze'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Camera & Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'setup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Setup Guide & Examples
          </button>
        </div>
      </div>

      {/* TAB 1: SETUP GUIDE & GOOD VS BAD PHOTOS */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Camera & Trainer Setup Instructions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              For 2D biomechanical analysis, camera placement is critical. Any angular distortion introduces perspective error.
            </p>

            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <SetupGuideSvg className="w-full max-h-72" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">1. Perpendicular Distance</span>
                Place phone on a tripod or stack of books 2–3 meters away, level with your bottom bracket or hip.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">2. Crank at 6 o&apos;clock</span>
                Drive-side pedal pointing straight down at bottom dead center with rider sitting naturally on hoods.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">3. Tight Kit / Stickers</span>
                Wear tight bib shorts. Optional small sticker dots on shoulder, hip bone, and knee speed up alignment.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Good vs. Bad Photo Examples
            </h3>
            <GoodVsBadPhotoSvg />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('analyze')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
            >
              <span>Ready? Open Posture Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYZE / UPLOAD / CANVAS */}
      {activeTab === 'analyze' && (
        <div className="space-y-6">
          {/* Privacy & Accuracy Notices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>100% On-Device Privacy:</strong> Photos and videos are processed purely in your browser using local WebAssembly. No media ever leaves your phone or computer.
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>2D Measurement Tolerance:</strong> Planar single-camera analysis carries a ±2–3° natural variance. Use the draggable handles to align bone landmarks precisely.
              </span>
            </div>
          </div>

          {/* Media Upload & Action Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="posture-file-upload"
              />
              <label
                htmlFor="posture-file-upload"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Side Photo or Video</span>
              </label>

              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Try with Sample Rider</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className="text-xs text-slate-500 hover:text-brand-500 font-medium flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Camera Setup Guide</span>
            </button>
          </div>

          {/* Video Frame Scrubber (If video file was selected) */}
          {isVideo && videoSrc && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-violet-500" />
                  Trainer Video Frame Scrubber
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Pause at crank 6 o&apos;clock
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black max-h-72 flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="max-h-72 w-auto mx-auto"
                  playsInline
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setVideoCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setVideoDuration(videoRef.current.duration);
                    }
                  }}
                />
              </div>

              {/* Scrubber Controls */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!videoRef.current) return;
                      if (isVideoPlaying) {
                        videoRef.current.pause();
                        setIsVideoPlaying(false);
                      } else {
                        videoRef.current.play();
                        setIsVideoPlaying(true);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max={videoDuration || 10}
                    step="0.03"
                    value={videoCurrentTime}
                    onChange={e => {
                      const time = parseFloat(e.target.value);
                      setVideoCurrentTime(time);
                      if (videoRef.current) {
                        videoRef.current.currentTime = time;
                      }
                    }}
                    className="flex-1 accent-brand-500 cursor-pointer"
                  />

                  <span className="text-xs font-mono text-slate-500 min-w-[50px]">
                    {videoCurrentTime.toFixed(2)}s
                  </span>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleCaptureVideoFrame}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Analyze This Frame (Crank 6 o&apos;clock)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Canvas & Angle Display */}
          {activeImageSource && landmarks && (
            <div className="space-y-6">
              {detectionError && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>{detectionError}</span>
                </div>
              )}

              {isDetecting && (
                <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-800 dark:text-brand-300 text-xs flex items-center gap-2 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
                  <span>Analyzing landmarks with in-browser PoseLandmarker...</span>
                </div>
              )}

              {/* Draggable Overlay Canvas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Draggable Posture Skeleton
                  </span>
                  <button
                    type="button"
                    onClick={() => runDetectionOnSource(activeImageSource)}
                    className="text-xs text-slate-500 hover:text-brand-500 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Landmarks</span>
                  </button>
                </div>

                <PoseCanvas
                  imageSource={activeImageSource}
                  landmarks={landmarks}
                  onLandmarksChange={updated => setLandmarks(updated)}
                />
              </div>

              {/* RULE-BASED ADVICE & ANGLE BREAKDOWN */}
              {postureAngles && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Measured Joint Angles & Rule-Based Advice
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      Riding Style: {ridingStyle.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluations.map((evalItem, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-3xl border transition-all space-y-2 ${
                          evalItem.status === 'optimal'
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                            : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {evalItem.angleName}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              evalItem.status === 'optimal'
                                ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                                : 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                            }`}
                          >
                            {evalItem.status === 'optimal' ? 'OPTIMAL' : evalItem.status === 'low' ? 'TOO LOW' : 'TOO HIGH'}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                            {evalItem.measuredDeg}°
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            (Target: {evalItem.targetMin}°–{evalItem.targetMax}°)
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                          {evalItem.advice}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State placeholder before uploading */}
          {!activeImageSource && (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Photo or Video Loaded Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload a side-view photo of you sitting on your road bike (or a video clip on a stationary trainer), or test immediately with a sample rider.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 rounded-xl bg-brand-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Choose File to Upload
                </button>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                >
                  Load Sample Photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
