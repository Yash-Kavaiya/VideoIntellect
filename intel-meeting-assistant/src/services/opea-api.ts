// src/services/opea-api.ts
// Intel OPEA™ (Open Platform for Enterprise AI) Integration Layer
// Enterprise-grade AI service configuration and API client

import { 
  VideoFile, 
  Transcript, 
  VideoSummary, 
  ProcessingStatus, 
  AIModel, 
  AnalyticsReport,
  ActionItem,
  Note,
  ApiResponse
} from '@/types';

// ===== OPEA™ CONFIGURATION =====

export interface OPEAConfig {
  baseUrl: string;
  apiKey: string;
  version: string;
  region: 'us-east-1' | 'us-west-2' | 'eu-west-1' | 'ap-southeast-1';
  environment: 'development' | 'staging' | 'production';
  features: {
    transcription: boolean;
    summarization: boolean;
    sentimentAnalysis: boolean;
    topicExtraction: boolean;
    actionItemExtraction: boolean;
    realTimeProcessing: boolean;
    multiLanguage: boolean;
    speakerIdentification: boolean;
    emotionAnalysis: boolean;
    entityRecognition: boolean;
  };
  limits: {
    maxFileSize: number; // bytes
    maxDuration: number; // seconds
    concurrentJobs: number;
    apiRateLimit: number; // requests per minute
  };
  security: {
    encryption: boolean;
    dataRetention: number; // days
    complianceMode: 'SOC2' | 'HIPAA' | 'GDPR' | 'STANDARD';
    auditLogging: boolean;
  };
  performance: {
    timeout: number; // seconds
    retryAttempts: number;
    cacheDuration: number; // seconds
    optimizedForLatency: boolean;
  };
}

export const DEFAULT_OPEA_CONFIG: OPEAConfig = {
  baseUrl: process.env.NEXT_PUBLIC_OPEA_API_URL || 'https://api.opea.intel.com/v1',
  apiKey: process.env.NEXT_PUBLIC_OPEA_API_KEY || '',
  version: '1.0.0',
  region: 'us-west-2',
  environment: 'production',
  features: {
    transcription: true,
    summarization: true,
    sentimentAnalysis: true,
    topicExtraction: true,
    actionItemExtraction: true,
    realTimeProcessing: true,
    multiLanguage: true,
    speakerIdentification: true,
    emotionAnalysis: true,
    entityRecognition: true
  },
  limits: {
    maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
    maxDuration: 8 * 60 * 60, // 8 hours
    concurrentJobs: 10,
    apiRateLimit: 1000 // per minute
  },
  security: {
    encryption: true,
    dataRetention: 90, // days
    complianceMode: 'SOC2',
    auditLogging: true
  },
  performance: {
    timeout: 300, // 5 minutes
    retryAttempts: 3,
    cacheDuration: 3600, // 1 hour
    optimizedForLatency: true
  }
};

// ===== API REQUEST/RESPONSE TYPES =====

export interface TranscriptionRequest {
  videoFile: File | string; // File object or URL
  options: {
    language?: string;
    enableSpeakerIdentification?: boolean;
    enableEmotionAnalysis?: boolean;
    enableEntityRecognition?: boolean;
    confidence?: number;
    customVocabulary?: string[];
    webhookUrl?: string;
  };
}

export interface SummarizationRequest {
  transcript: Transcript;
  options: {
    summaryType: 'executive' | 'detailed' | 'technical' | 'actionable';
    maxLength?: number;
    includeTopics?: boolean;
    includeActionItems?: boolean;
    includeDecisions?: boolean;
    includeSentiment?: boolean;
    customPrompt?: string;
  };
}

export interface AnalyticsRequest {
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: {
    meetingIds?: string[];
    participants?: string[];
    topics?: string[];
    departments?: string[];
  };
  metrics: string[];
}

export interface ProcessingJob {
  id: string;
  type: 'transcription' | 'summarization' | 'analytics' | 'bulk-processing';
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  estimatedCompletion?: Date;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

// ===== OPEA™ API CLIENT =====

export class OPEAApiClient {
  private config: OPEAConfig;
  private cache: Map<string, { data: any; expiry: number }>;

  constructor(config: Partial<OPEAConfig> = {}) {
    this.config = { ...DEFAULT_OPEA_CONFIG, ...config };
    this.cache = new Map();
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('OPEA API key is required');
    }
    
    if (!this.config.baseUrl) {
      throw new Error('OPEA base URL is required');
    }

    // Validate API key format
    if (!/^opea_[a-zA-Z0-9]{32,}$/.test(this.config.apiKey)) {
      console.warn('OPEA API key format may be invalid');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'X-OPEA-Version': this.config.version,
      'X-OPEA-Region': this.config.region,
      'X-OPEA-Environment': this.config.environment,
      'User-Agent': 'Intel-Meeting-Assistant/1.0.0'
    };

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      signal: AbortSignal.timeout(this.config.performance.timeout * 1000)
    };

    try {
      const response = await this.retryRequest(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`OPEA API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date(),
        requestId: response.headers.get('X-Request-ID') || ''
      };
    } catch (error) {
      console.error('OPEA API Request failed:', error);
      throw error;
    }
  }

  private async retryRequest(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.config.performance.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, options);
        
        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          return response;
        }
        
        // Retry on server errors (5xx) or network issues
        if (response.ok || attempt === this.config.performance.retryAttempts) {
          return response;
        }
        
        throw new Error(`Server error: ${response.status}`);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.performance.retryAttempts) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}-${JSON.stringify(params)}`;
  }

  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    const expiry = Date.now() + (this.config.performance.cacheDuration * 1000);
    this.cache.set(key, { data, expiry });
  }

  // ===== TRANSCRIPTION SERVICES =====

  async transcribeVideo(request: TranscriptionRequest): Promise<ProcessingJob> {
    const formData = new FormData();
    
    if (request.videoFile instanceof File) {
      formData.append('file', request.videoFile);
    } else {
      formData.append('url', request.videoFile);
    }
    
    formData.append('options', JSON.stringify(request.options));

    const response = await this.makeRequest<ProcessingJob>('/transcription/create', {
      method: 'POST',
      body: formData,
      headers: {} // Don't set Content-Type for FormData
    });

    return response.data!;
  }

  async getTranscriptionStatus(jobId: string): Promise<ProcessingJob> {
    const cacheKey = this.getCacheKey('/transcription/status', { jobId });
    const cached = this.getCache<ProcessingJob>(cacheKey);
    
    if (cached && cached.status !== 'completed') {
      return cached;
    }

    const response = await this.makeRequest<ProcessingJob>(`/transcription/${jobId}/status`);
    
    if (response.data?.status === 'completed') {
      this.setCache(cacheKey, response.data);
    }
    
    return response.data!;
  }

  async getTranscript(jobId: string): Promise<Transcript> {
    const cacheKey = this.getCacheKey('/transcription/result', { jobId });
    const cached = this.getCache<Transcript>(cacheKey);
    
    if (cached) return cached;

    const response = await this.makeRequest<Transcript>(`/transcription/${jobId}/result`);
    this.setCache(cacheKey, response.data!);
    
    return response.data!;
  }

  // ===== SUMMARIZATION SERVICES =====

  async generateSummary(request: SummarizationRequest): Promise<ProcessingJob> {
    const response = await this.makeRequest<ProcessingJob>('/summarization/create', {
      method: 'POST',
      body: JSON.stringify(request)
    });

    return response.data!;
  }

  async getSummary(jobId: string): Promise<VideoSummary> {
    const cacheKey = this.getCacheKey('/summarization/result', { jobId });
    const cached = this.getCache<VideoSummary>(cacheKey);
    
    if (cached) return cached;

    const response = await this.makeRequest<VideoSummary>(`/summarization/${jobId}/result`);
    this.setCache(cacheKey, response.data!);
    
    return response.data!;
  }

  // ===== ACTION ITEM EXTRACTION =====

  async extractActionItems(transcript: Transcript): Promise<ActionItem[]> {
    const response = await this.makeRequest<ActionItem[]>('/analysis/action-items', {
      method: 'POST',
      body: JSON.stringify({ transcript })
    });

    return response.data!;
  }

  // ===== SMART NOTES GENERATION =====

  async generateSmartNotes(transcript: Transcript, template?: string): Promise<Note[]> {
    const response = await this.makeRequest<Note[]>('/analysis/smart-notes', {
      method: 'POST',
      body: JSON.stringify({ transcript, template })
    });

    return response.data!;
  }

  // ===== ANALYTICS SERVICES =====

  async generateAnalytics(request: AnalyticsRequest): Promise<AnalyticsReport> {
    const cacheKey = this.getCacheKey('/analytics/generate', request);
    const cached = this.getCache<AnalyticsReport>(cacheKey);
    
    if (cached) return cached;

    const response = await this.makeRequest<AnalyticsReport>('/analytics/generate', {
      method: 'POST',
      body: JSON.stringify(request)
    });

    this.setCache(cacheKey, response.data!);
    return response.data!;
  }

  async getEngagementMetrics(meetingIds: string[]): Promise<any> {
    const response = await this.makeRequest('/analytics/engagement', {
      method: 'POST',
      body: JSON.stringify({ meetingIds })
    });

    return response.data;
  }

  // ===== REAL-TIME SERVICES =====

  async startRealTimeTranscription(options: {
    language?: string;
    enableSpeakerIdentification?: boolean;
    webhookUrl?: string;
  }): Promise<{ sessionId: string; websocketUrl: string }> {
    const response = await this.makeRequest<{
      sessionId: string;
      websocketUrl: string;
    }>('/realtime/transcription/start', {
      method: 'POST',
      body: JSON.stringify(options)
    });

    return response.data!;
  }

  async stopRealTimeTranscription(sessionId: string): Promise<Transcript> {
    const response = await this.makeRequest<Transcript>(`/realtime/transcription/${sessionId}/stop`, {
      method: 'POST'
    });

    return response.data!;
  }

  // ===== MODEL MANAGEMENT =====

  async getAvailableModels(): Promise<AIModel[]> {
    const cacheKey = 'available-models';
    const cached = this.getCache<AIModel[]>(cacheKey);
    
    if (cached) return cached;

    const response = await this.makeRequest<AIModel[]>('/models');
    this.setCache(cacheKey, response.data!);
    
    return response.data!;
  }

  async getModelInfo(modelId: string): Promise<AIModel> {
    const cacheKey = this.getCacheKey('/models/info', { modelId });
    const cached = this.getCache<AIModel>(cacheKey);
    
    if (cached) return cached;

    const response = await this.makeRequest<AIModel>(`/models/${modelId}`);
    this.setCache(cacheKey, response.data!);
    
    return response.data!;
  }

  // ===== HEALTH AND STATUS =====

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    services: Record<string, 'operational' | 'degraded' | 'down'>;
    region: string;
    version: string;
    uptime: number;
  }> {
    const response = await this.makeRequest('/health');
    return response.data!;
  }

  async getUsageStatistics(): Promise<{
    requests: number;
    processingTime: number;
    storage: number;
    bandwidth: number;
    period: string;
  }> {
    const response = await this.makeRequest('/usage');
    return response.data!;
  }

  // ===== UTILITY METHODS =====

  clearCache(): void {
    this.cache.clear();
  }

  updateConfig(updates: Partial<OPEAConfig>): void {
    this.config = { ...this.config, ...updates };
    this.validateConfig();
  }

  getConfig(): OPEAConfig {
    return { ...this.config };
  }
}

// ===== WEBHOOK HANDLERS =====

export class OPEAWebhookHandler {
  private handlers: Map<string, (data: any) => void>;

  constructor() {
    this.handlers = new Map();
  }

  on(event: string, handler: (data: any) => void): void {
    this.handlers.set(event, handler);
  }

  off(event: string): void {
    this.handlers.delete(event);
  }

  async handleWebhook(
    event: string,
    data: any,
    signature: string,
    secret: string
  ): Promise<void> {
    // Verify webhook signature
    const expectedSignature = await this.generateSignature(JSON.stringify(data), secret);
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }

    const handler = this.handlers.get(event);
    if (handler) {
      handler(data);
    }
  }

  private async generateSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// ===== REAL-TIME TRANSCRIPTION CLIENT =====

export class OPEARealTimeClient {
  private websocket: WebSocket | null = null;
  private sessionId: string | null = null;
  private eventHandlers: Map<string, (data: any) => void>;

  constructor() {
    this.eventHandlers = new Map();
  }

  async connect(options: {
    language?: string;
    enableSpeakerIdentification?: boolean;
  }): Promise<void> {
    const apiClient = new OPEAApiClient();
    const session = await apiClient.startRealTimeTranscription(options);
    
    this.sessionId = session.sessionId;
    this.websocket = new WebSocket(session.websocketUrl);

    this.websocket.onopen = () => {
      this.emit('connected', { sessionId: this.sessionId });
    };

    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit('transcription', data);
    };

    this.websocket.onclose = () => {
      this.emit('disconnected', {});
    };

    this.websocket.onerror = (error) => {
      this.emit('error', error);
    };
  }

  sendAudio(audioData: ArrayBuffer): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(audioData);
    }
  }

  async disconnect(): Promise<Transcript | null> {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.sessionId) {
      const apiClient = new OPEAApiClient();
      const transcript = await apiClient.stopRealTimeTranscription(this.sessionId);
      this.sessionId = null;
      return transcript;
    }

    return null;
  }

  on(event: string, handler: (data: any) => void): void {
    this.eventHandlers.set(event, handler);
  }

  off(event: string): void {
    this.eventHandlers.delete(event);
  }

  private emit(event: string, data: any): void {
    const handler = this.eventHandlers.get(event);
    if (handler) {
      handler(data);
    }
  }
}

// ===== ERROR HANDLING =====

export class OPEAError extends Error {
  public code: string;
  public statusCode?: number;
  public requestId?: string;

  constructor(message: string, code: string, statusCode?: number, requestId?: string) {
    super(message);
    this.name = 'OPEAError';
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}

// ===== SINGLETON INSTANCE =====

let defaultOPEAClient: OPEAApiClient | null = null;

export const getOPEAClient = (config?: Partial<OPEAConfig>): OPEAApiClient => {
  if (!defaultOPEAClient || config) {
    defaultOPEAClient = new OPEAApiClient(config);
  }
  return defaultOPEAClient;
};

// ===== REACT HOOKS FOR OPEA™ INTEGRATION =====

import { useState, useEffect, useCallback } from 'react';

export const useOPEATranscription = (videoFile?: File) => {
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startTranscription = useCallback(async (file: File, options: any = {}) => {
    try {
      setError(null);
      const client = getOPEAClient();
      const newJob = await client.transcribeVideo({ videoFile: file, options });
      setJob(newJob);

      // Poll for completion
      const pollStatus = async () => {
        const status = await client.getTranscriptionStatus(newJob.id);
        setJob(status);

        if (status.status === 'completed') {
          const result = await client.getTranscript(newJob.id);
          setTranscript(result);
        } else if (status.status === 'failed') {
          setError(status.error || 'Transcription failed');
        } else {
          setTimeout(pollStatus, 2000);
        }
      };

      setTimeout(pollStatus, 2000);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    if (videoFile) {
      startTranscription(videoFile);
    }
  }, [videoFile, startTranscription]);

  return { job, transcript, error, startTranscription };
};

export const useOPEASummarization = (transcript?: Transcript) => {
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [summary, setSummary] = useState<VideoSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = useCallback(async (
    transcriptData: Transcript, 
    options: any = {}
  ) => {
    try {
      setError(null);
      const client = getOPEAClient();
      const newJob = await client.generateSummary({
        transcript: transcriptData,
        options: {
          summaryType: 'executive',
          includeTopics: true,
          includeActionItems: true,
          includeDecisions: true,
          includeSentiment: true,
          ...options
        }
      });
      setJob(newJob);

      // Poll for completion
      const pollStatus = async () => {
        const status = await client.getTranscriptionStatus(newJob.id);
        setJob(status);

        if (status.status === 'completed') {
          const result = await client.getSummary(newJob.id);
          setSummary(result);
        } else if (status.status === 'failed') {
          setError(status.error || 'Summarization failed');
        } else {
          setTimeout(pollStatus, 2000);
        }
      };

      setTimeout(pollStatus, 2000);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    if (transcript) {
      generateSummary(transcript);
    }
  }, [transcript, generateSummary]);

  return { job, summary, error, generateSummary };
};

export const useOPEAHealth = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const client = getOPEAClient();
        const status = await client.getHealthStatus();
        setHealth(status);
      } catch (err) {
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { health, loading };
};

// ===== EXPORT DEFAULT =====

export default {
  OPEAApiClient,
  OPEAWebhookHandler,
  OPEARealTimeClient,
  getOPEAClient,
  DEFAULT_OPEA_CONFIG,
  OPEAError
};