// src/types/index.ts
export interface VideoFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface VideoSummary {
  id: string;
  videoId: string;
  summary: string;
  keyPoints: string[];
  duration: string;
  participants?: string[];
  topics: string[];
  generatedAt: Date;
}

export interface VideoNotes {
  id: string;
  videoId: string;
  notes: string;
  timestamps: Array<{
    time: string;
    note: string;
  }>;
  generatedAt: Date;
}

export interface BlogPost {
  id: string;
  videoId: string;
  title: string;
  content: string;
  tags: string[];
  generatedAt: Date;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface MCQSet {
  id: string;
  videoId: string;
  questions: MCQQuestion[];
  generatedAt: Date;
}

export interface Transcript {
  id: string;
  videoId: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
    speaker?: string;
  }>;
  fullText: string;
  generatedAt: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'video' | 'summary' | 'notes';
    id: string;
  }>;
}

export interface ProcessingStatus {
  videoId: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  error?: string;
}