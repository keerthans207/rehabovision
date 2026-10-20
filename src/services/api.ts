/**
 * API client for RehaboVision AI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface PoseAnalysisRequest {
  image: string; // base64 encoded
  exerciseType: string;
  timestamp?: number;
}

export interface PoseAnalysisResponse {
  success: boolean;
  detected: boolean;
  landmarks?: number[][];
  visibility?: number[];
  measurements: {
    leftKneeAngle: number | null;
    rightKneeAngle: number | null;
    leftHipAngle: number | null;
    rightHipAngle: number | null;
  };
  quality: 'good' | 'uncertain' | 'unavailable';
  qualityReason: string;
  movementPhase: string;
}

export interface SessionInitRequest {
  exerciseType: string;
  prescribedReps: number;
  targetAngle?: number;
}

export interface SessionInitResponse {
  success: boolean;
  config: {
    sessionId: string;
    exerciseType: string;
    prescribedReps: number;
    targetAngle: number | null;
    initialized: boolean;
  };
}

export interface SessionSaveRequest {
  patientId: string;
  exerciseType: string;
  completedReps: number;
  angles: { rep: number; angle: number; quality: string }[];
  duration: number;
  discomfortReported: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  }

  async analyzePoseFrame(request: PoseAnalysisRequest): Promise<PoseAnalysisResponse> {
    const response = await fetch(`${this.baseUrl}/api/pose/analyze-frame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async initSession(request: SessionInitRequest): Promise<SessionInitResponse> {
    const response = await fetch(`${this.baseUrl}/api/pose/stream-init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async saveSession(request: SessionSaveRequest): Promise<{ success: boolean; sessionId: string }> {
    const response = await fetch(`${this.baseUrl}/api/session/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
