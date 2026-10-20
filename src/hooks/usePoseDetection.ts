/**
 * Custom hook for real-time pose detection with camera
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { apiClient, type PoseAnalysisResponse } from '../services/api';

export interface UsePoseDetectionOptions {
  exerciseType: string;
  onPoseDetected?: (result: PoseAnalysisResponse) => void;
  analysisInterval?: number; // ms between frame analyses
}

export function usePoseDetection(options: UsePoseDetectionOptions) {
  const { exerciseType, onPoseDetected, analysisInterval = 500 } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await apiClient.healthCheck();
      setBackendStatus('online');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus('offline');
    }
  };

  const initializeCamera = useCallback(async () => {
    try {
      console.log('[usePoseDetection] Starting camera initialization...');
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 30 }, // Limit frame rate
        },
        audio: false,
      });

      console.log('[usePoseDetection] Got media stream:', stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        console.log('[usePoseDetection] Set srcObject, waiting for metadata...');

        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video ref lost'));
            return;
          }
          
          const timeout = setTimeout(() => reject(new Error('Metadata load timeout')), 5000);
          
          videoRef.current.onloadedmetadata = () => {
            clearTimeout(timeout);
            console.log('[usePoseDetection] Metadata loaded, playing video...');
            videoRef.current?.play().then(() => {
              console.log('[usePoseDetection] Video playing');
              resolve();
            }).catch(reject);
          };
        });

        console.log('[usePoseDetection] Setting camera active state');
        setIsCameraActive(true);
        setIsInitialized(true);
        console.log('[usePoseDetection] Camera initialization complete!');
      }

      return true;
    } catch (error) {
      console.error('[usePoseDetection] Camera initialization error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to access camera. Please check permissions.';
      setCameraError(errorMessage);
      setIsCameraActive(false);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Use moderate resolution - good balance of speed and accuracy
    const targetWidth = 960;
    const targetHeight = 720;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw current frame
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    // Convert to base64 with good quality
    return canvas.toDataURL('image/jpeg', 0.85);
  }, []);

  const analyzeCurrentFrame = useCallback(async (): Promise<PoseAnalysisResponse | null> => {
    if (!isCameraActive || isAnalyzing) {
      console.log('[usePoseDetection] Skipping analysis - camera:', isCameraActive, 'analyzing:', isAnalyzing);
      return null;
    }

    setIsAnalyzing(true);

    try {
      const imageData = captureFrame();
      if (!imageData) {
        console.log('[usePoseDetection] No image data captured');
        return null;
      }

      console.log('[usePoseDetection] Sending frame to backend...');
      const startTime = Date.now();
      
      const result = await apiClient.analyzePoseFrame({
        image: imageData,
        exerciseType,
        timestamp: Date.now(),
      });

      const elapsed = Date.now() - startTime;
      console.log(`[usePoseDetection] Backend response in ${elapsed}ms`);

      if (onPoseDetected && result.success) {
        onPoseDetected(result);
      }

      return result;
    } catch (error) {
      console.error('[usePoseDetection] Pose analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isCameraActive, isAnalyzing, captureFrame, exerciseType, onPoseDetected]);

  const startContinuousAnalysis = useCallback(() => {
    if (analysisTimerRef.current) {
      clearInterval(analysisTimerRef.current);
    }

    analysisTimerRef.current = setInterval(() => {
      analyzeCurrentFrame();
    }, analysisInterval);
  }, [analyzeCurrentFrame, analysisInterval]);

  const stopContinuousAnalysis = useCallback(() => {
    if (analysisTimerRef.current) {
      clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopContinuousAnalysis();
      stopCamera();
    };
  }, [stopContinuousAnalysis, stopCamera]);

  return {
    // Refs
    videoRef,
    canvasRef,

    // State
    isInitialized,
    isCameraActive,
    cameraError,
    isAnalyzing,
    backendStatus,

    // Actions
    initializeCamera,
    stopCamera,
    analyzeCurrentFrame,
    startContinuousAnalysis,
    stopContinuousAnalysis,
    checkBackendHealth,
  };
}
