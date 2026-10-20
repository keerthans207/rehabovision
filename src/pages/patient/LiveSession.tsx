import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, Square, Camera, CameraOff,
  CheckCircle, AlertTriangle, XCircle, WifiOff,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import type { SessionPhase, MeasurementQuality } from '../../types';
import type { PoseAnalysisResponse } from '../../services/api';

// ─── Real pose skeleton overlay (mirrored to match video) ───────────────────
const PoseSkeleton: React.FC<{ 
  landmarks: number[][] | null;
  width: number;
  height: number;
  currentAngle: number | null;
}> = ({ landmarks, width, height, currentAngle }) => {
  if (!landmarks || landmarks.length === 0) return null;

  // MediaPipe landmark indices
  const connections = [
    // Torso
    [11, 12], [11, 23], [12, 24], [23, 24],
    // Left arm
    [11, 13], [13, 15],
    // Right arm
    [12, 14], [14, 16],
    // Left leg
    [23, 25], [25, 27], [27, 29], [29, 31],
    // Right leg
    [24, 26], [26, 28], [28, 30], [30, 32],
  ];

  const getLandmark = (idx: number) => {
    if (idx >= landmarks.length) return null;
    return {
      x: (1 - landmarks[idx][0]) * width, // Flip X coordinate to mirror
      y: landmarks[idx][1] * height,
    };
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ 
        position: 'absolute', 
        inset: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        zIndex: 5,
      }}
      aria-label="Real-time pose skeleton"
      role="img"
    >
      {/* Draw connections */}
      {connections.map(([start, end], i) => {
        const p1 = getLandmark(start);
        const p2 = getLandmark(end);
        if (!p1 || !p2) return null;
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#147D78"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      })}
      
      {/* Draw joints */}
      {landmarks.slice(0, 33).map((lm, i) => {
        // Only show key joints
        const keyJoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
        if (!keyJoints.includes(i)) return null;
        
        return (
          <circle
            key={i}
            cx={(1 - lm[0]) * width} // Flip X coordinate
            cy={lm[1] * height}
            r={6}
            fill="#fff"
            stroke="#147D78"
            strokeWidth="3"
          />
        );
      })}

      {/* Show knee angle if available */}
      {currentAngle !== null && (
        <>
          <rect
            x={width * 0.15}
            y={height * 0.65}
            width="70"
            height="32"
            rx="8"
            fill="rgba(197,138,38,0.95)"
          />
          <text
            x={width * 0.15 + 35}
            y={height * 0.65 + 22}
            fill="#fff"
            fontSize="16"
            fontWeight="700"
            textAnchor="middle"
          >
            {Math.round(currentAngle)}°
          </text>
        </>
      )}
    </svg>
  );
};

// ─── Rep counter ────────────────────────────────────────────────────────────
const RepCounter: React.FC<{ completed: number; total: number }> = ({ completed, total }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      padding: '16px 0',
    }}
    aria-label={`${completed} of ${total} repetitions completed`}
  >
    <span style={{ fontSize: 52, fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
      {String(completed).padStart(2, '0')}
    </span>
    <span style={{ fontSize: 22, color: 'var(--color-text-secondary)', fontWeight: 400 }}>
      / {total}
    </span>
    <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginLeft: 4 }}>reps</span>
  </div>
);

// ─── Main component ─────────────────────────────────────────────────────────
export const LiveSession: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [reps, setReps] = useState(0);
  const [quality, setQuality] = useState<MeasurementQuality>('unavailable');
  const [qualityReason, setQualityReason] = useState<string>('Initializing...');
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [discomfort, setDiscomfort] = useState<null | boolean>(null);
  const [currentMovementPhase, setCurrentMovementPhase] = useState('Standing');
  const [currentAngle, setCurrentAngle] = useState<number | null>(null);
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);
  const [lastRepAngle, setLastRepAngle] = useState<number>(180);
  const [repState, setRepState] = useState<'standing' | 'descending' | 'bottom'>('standing');
  const [minAngleInRep, setMinAngleInRep] = useState<number>(180);
  const [angleHistory, setAngleHistory] = useState<number[]>([]); // For smoothing
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalReps = 10;

  // Pose detection callback
  const handlePoseDetected = (result: PoseAnalysisResponse) => {
    if (!result.detected) {
      setQuality('unavailable');
      setQualityReason(result.qualityReason);
      setLandmarks(null);
      return;
    }

    // Update quality
    setQuality(result.quality);
    setQualityReason(result.qualityReason);

    // Update landmarks
    if (result.landmarks) {
      setLandmarks(result.landmarks);
    }

    // Update measurements with smoothing
    const leftKnee = result.measurements.leftKneeAngle;
    if (leftKnee !== null) {
      // Apply moving average for smoother display
      setAngleHistory((prev) => {
        const newHistory = [...prev, leftKnee].slice(-3); // Keep last 3 readings
        const smoothedAngle = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
        setCurrentAngle(smoothedAngle);
        return newHistory;
      });
      
      // Use raw angle for rep counting (more responsive)
      if (phase === 'active') {
        // State machine for rep counting
        if (repState === 'standing' && leftKnee < 140) {
          // Started descending
          setRepState('descending');
          setMinAngleInRep(leftKnee);
          setCurrentMovementPhase('Descending');
        } else if (repState === 'descending') {
          // Track minimum angle
          if (leftKnee < minAngleInRep) {
            setMinAngleInRep(leftKnee);
          }
          
          // Reached bottom (below 100°)
          if (leftKnee < 100) {
            setRepState('bottom');
            setCurrentMovementPhase('Bottom');
          }
          // Started ascending before reaching bottom (incomplete rep)
          else if (leftKnee > minAngleInRep + 10) {
            // Reset - didn't go low enough
            setRepState('standing');
            setMinAngleInRep(180);
            setCurrentMovementPhase('Standing');
          }
        } else if (repState === 'bottom' && leftKnee > 150) {
          // Completed a full rep - stood back up
          setReps((prev) => {
            const newReps = prev + 1;
            if (newReps >= totalReps) {
              setPhase('complete');
              stopContinuousAnalysis();
            }
            return newReps;
          });
          setRepState('standing');
          setMinAngleInRep(180);
          setCurrentMovementPhase('Standing');
        } else if (repState === 'bottom') {
          setCurrentMovementPhase('Ascending');
        }
        
        setLastRepAngle(leftKnee);
      }
    }

    // Update movement phase from backend
    if (result.movementPhase) {
      setCurrentMovementPhase(
        result.movementPhase.charAt(0).toUpperCase() + result.movementPhase.slice(1)
      );
    }
  };

  // Initialize pose detection with balanced settings
  const {
    videoRef,
    canvasRef,
    isCameraActive,
    cameraError,
    backendStatus,
    initializeCamera,
    stopCamera,
    startContinuousAnalysis,
    stopContinuousAnalysis,
  } = usePoseDetection({
    exerciseType: 'squat',
    analysisInterval: 250, // Balanced - every 250ms (4 FPS)
    onPoseDetected: handlePoseDetected,
  });

  // Initialize camera on mount - wait a tick for refs to be available
  useEffect(() => {
    const init = async () => {
      // Wait for next frame to ensure refs are mounted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Initializing camera...');
      console.log('Video ref available:', !!videoRef.current);
      
      if (!videoRef.current) {
        console.error('Video element not found!');
        return;
      }
      
      const success = await initializeCamera();
      console.log('Camera initialization:', success ? 'success' : 'failed');
      if (success) {
        console.log('Video element:', videoRef.current);
        console.log('Camera active:', isCameraActive);
      }
    };
    init();
    
    return () => {
      stopCamera();
      stopContinuousAnalysis();
    };
  }, []); // Empty deps - run once on mount

  // Start/stop analysis based on phase
  useEffect(() => {
    if (phase === 'active') {
      startContinuousAnalysis();
    } else {
      stopContinuousAnalysis();
    }
  }, [phase, startContinuousAnalysis, stopContinuousAnalysis]);

  const handleEnd = () => {
    setPhase('idle');
    navigate('/patient/session-summary');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: 0 }}>
      {/* Top bar */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>R</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>RehaboVision AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {phase === 'active' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-error)', fontWeight: 500 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-error)', display: 'inline-block', animation: 'blink 1.2s infinite' }} />
              Recording
            </span>
          )}
          <Button variant="secondary" size="sm" onClick={() => navigate('/patient/exercises')}>
            Exit
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 0,
          height: 'calc(100vh - 57px)',
        }}
      >
        {/* Left: Camera viewport */}
        <div
          style={{
            background: '#0f1a1a',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Backend status indicator */}
          {backendStatus === 'offline' && (
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(200,76,76,0.9)',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 12,
                color: '#fff',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                zIndex: 10,
              }}
            >
              <WifiOff size={14} />
              Backend offline
            </div>
          )}

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Always render video element (hidden when not active) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => {
              console.log('Video loaded:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)', // Mirror for user
              display: isCameraActive ? 'block' : 'none',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />

          {!isCameraActive ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#9ab0ae', textAlign: 'center', padding: 40 }}>
              <CameraOff size={48} />
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#cde0de' }}>Camera unavailable</h2>
              <p style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.7 }}>
                {cameraError || 'RehaboVision AI needs camera access to track your movement.'}
                <br />
                Check your browser permissions and refresh the page.
              </p>
              <Button onClick={initializeCamera}>Retry Camera Access</Button>
            </div>
          ) : null}

          {/* Show camera feed when active */}
          {isCameraActive && (
            <>
              {/* Pose skeleton overlay */}
              {landmarks && videoRef.current && (
                <PoseSkeleton
                  landmarks={landmarks}
                  width={videoRef.current.videoWidth || 1280}
                  height={videoRef.current.videoHeight || 720}
                  currentAngle={currentAngle}
                />
              )}

              {/* Corner guides */}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
                <div
                  key={corner}
                  style={{
                    position: 'absolute',
                    width: 28,
                    height: 28,
                    ...(corner.includes('top') ? { top: 24 } : { bottom: 24 }),
                    ...(corner.includes('left') ? { left: 24 } : { right: 24 }),
                    borderTop: corner.includes('top') ? '2px solid rgba(20,125,120,0.7)' : 'none',
                    borderBottom: corner.includes('bottom') ? '2px solid rgba(20,125,120,0.7)' : 'none',
                    borderLeft: corner.includes('left') ? '2px solid rgba(20,125,120,0.7)' : 'none',
                    borderRight: corner.includes('right') ? '2px solid rgba(20,125,120,0.7)' : 'none',
                  }}
                />
              ))}

              {/* Camera status banner */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 999,
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#cde0de',
                  fontSize: 13,
                }}
              >
                <Camera size={14} />
                Position your full body inside the frame
              </div>

              {/* Live indicator */}
              {phase === 'active' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    background: 'rgba(39,132,90,0.85)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 11,
                    color: '#fff',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    zIndex: 10,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'blink 1s infinite' }} />
                  LIVE TRACKING
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Exercise panel */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Exercise info */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Exercise
            </p>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Bodyweight Squat
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 6, lineHeight: 1.6 }}>
              Stand with your feet comfortably apart. Lower yourself in a controlled movement, then return to standing. Follow your prescribed exercise plan.
            </p>
          </div>

          {/* Metrics */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
            <RepCounter completed={reps} total={totalReps} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Current phase</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{phase === 'idle' || phase === 'complete' ? '—' : currentMovementPhase}</p>
              </div>
              <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Observed angle</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: quality === 'unavailable' ? 'var(--color-text-secondary)' : 'var(--color-primary)' }}>
                  {currentAngle !== null ? `${Math.round(currentAngle)}°` : '—'}
                </p>
              </div>
            </div>

            <div
              role="status"
              aria-label={`Measurement quality: ${quality}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '10px 14px',
                background:
                  quality === 'good'
                    ? 'var(--color-success-bg)'
                    : quality === 'uncertain'
                    ? 'var(--color-warning-bg)'
                    : 'var(--color-error-bg)',
                border: `1px solid ${
                  quality === 'good' ? '#b8e0cc' : quality === 'uncertain' ? '#eed9a8' : '#f0bfbf'
                }`,
                borderRadius: 'var(--radius-md)',
                color:
                  quality === 'good'
                    ? 'var(--color-success)'
                    : quality === 'uncertain'
                    ? 'var(--color-warning)'
                    : 'var(--color-error)',
              }}
            >
              <span style={{ marginTop: 1, flexShrink: 0 }}>
                {quality === 'good' ? (
                  <CheckCircle size={14} />
                ) : quality === 'uncertain' ? (
                  <AlertTriangle size={14} />
                ) : (
                  <XCircle size={14} />
                )}
              </span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>
                  {quality === 'good' ? 'Reliable measurement' : quality === 'uncertain' ? 'Measurement uncertain' : 'Unable to measure'}
                </p>
                <p style={{ fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>{qualityReason}</p>
              </div>
            </div>
          </div>

          {/* Discomfort */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
              Are you experiencing discomfort?
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[false, true].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setDiscomfort(val)}
                  aria-pressed={discomfort === val}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${discomfort === val ? (val ? 'var(--color-warning)' : 'var(--color-success)') : 'var(--color-border)'}`,
                    background: discomfort === val ? (val ? 'var(--color-warning-bg)' : 'var(--color-success-bg)') : 'var(--color-bg)',
                    color: discomfort === val ? (val ? 'var(--color-warning)' : 'var(--color-success)') : 'var(--color-text-secondary)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {val ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
            {discomfort === true && (
              <p style={{ fontSize: 12, color: 'var(--color-warning)', marginTop: 8, lineHeight: 1.5 }}>
                If discomfort is severe or unusual, stop the session and contact your physiotherapist.
              </p>
            )}
          </div>

          {/* Controls */}
          <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
            {phase === 'idle' && (
              <Button
                fullWidth
                size="lg"
                icon={<Play size={16} />}
                onClick={() => setPhase('active')}
                style={{ fontSize: 16 }}
              >
                Start Session
              </Button>
            )}
            {phase === 'active' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button
                  fullWidth
                  size="lg"
                  variant="secondary"
                  icon={<Pause size={16} />}
                  onClick={() => setPhase('paused')}
                >
                  Pause
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  variant="danger"
                  icon={<Square size={16} />}
                  onClick={() => setShowEndDialog(true)}
                >
                  End Session
                </Button>
              </div>
            )}
            {phase === 'paused' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button
                  fullWidth
                  size="lg"
                  icon={<Play size={16} />}
                  onClick={() => setPhase('active')}
                >
                  Resume
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  variant="danger"
                  icon={<Square size={16} />}
                  onClick={() => setShowEndDialog(true)}
                >
                  End Session
                </Button>
              </div>
            )}
            {phase === 'complete' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    background: 'var(--color-success-bg)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-success)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <CheckCircle size={16} />
                  All {totalReps} repetitions completed
                </div>
                <Button fullWidth size="lg" onClick={() => navigate('/patient/session-summary')}>
                  View Summary
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End session dialog */}
      <Dialog
        open={showEndDialog}
        title="End session?"
        description={`You have completed ${reps} of ${totalReps} prescribed repetitions. Ending now will save what has been recorded so far.`}
        confirmLabel="End Session"
        cancelLabel="Continue Exercising"
        onConfirm={handleEnd}
        onCancel={() => setShowEndDialog(false)}
        variant="danger"
      />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
