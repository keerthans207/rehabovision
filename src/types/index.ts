export type UserRole = 'physio' | 'patient';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  identifier: string;
  assignedPhysio: string;
  protocol: string;
  protocolId: string;
  lastSession: string;
  sessionCount: number;
  status: 'active' | 'inactive' | 'on-hold';
  recentSessionStatus: 'reviewed' | 'pending' | 'flagged';
  latestKneeROM?: number;
  measurementQuality?: 'good' | 'uncertain' | 'unavailable';
  consentGiven: boolean;
}

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  exercise: string;
  date: string;
  duration: number; // minutes
  prescribedReps: number;
  completedReps: number;
  measurementCoverage: number; // percentage
  measurementQuality: 'good' | 'uncertain' | 'unavailable';
  reviewStatus: 'reviewed' | 'pending' | 'flagged';
  angles: RepAngle[];
  notes?: string;
  aiSummary?: string;
  discomfortReported: boolean;
}

export interface RepAngle {
  rep: number;
  peakAngle: number;
  quality: 'good' | 'uncertain' | 'unavailable';
  duration: number; // seconds
}

export interface Protocol {
  id: string;
  name: string;
  exercise: string;
  prescribedReps: number;
  sets: number;
  instructions: string;
  restrictions?: string;
  targetAngle?: number;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  assignedPatients: number;
}

export interface ProgressPoint {
  date: string;
  value: number | null;
  quality: 'good' | 'uncertain' | 'unavailable';
}

export interface ClinicalNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
  isAuto: boolean;
}

export type MeasurementQuality = 'good' | 'uncertain' | 'unavailable';
export type SessionPhase = 'idle' | 'active' | 'paused' | 'complete';
