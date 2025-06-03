// src/components/features/video-upload.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';
import { 
  Upload,
  Video,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Clock,
  HardDrive,
  Shield,
  Zap,
  Brain,
  Cpu,
  BarChart3,
  RefreshCw,
  Download,
  Share2,
  Tag,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Info,
  ExternalLink,
  ChevronRight,
  CloudUpload,
  Database,
  Lock,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { VideoFile, ProcessingStatus } from '@/types';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  estimatedTimeRemaining: number; // seconds
}

interface VideoMetadata {
  duration: number;
  resolution: string;
  format: string;
  size: number;
  frameRate: number;
  bitrate: number;
  audioChannels: number;
}

interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  estimatedTime?: number;
  startTime?: Date;
  endTime?: Date;
}

interface VideoUploadProps {
  onUploadComplete?: (file: VideoFile) => void;
  onProcessingUpdate?: (status: ProcessingStatus) => void;
  onError?: (error: string) => void;
  maxFileSize?: number; // in bytes
  acceptedFormats?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export default function VideoUpload({
  onUploadComplete,
  onProcessingUpdate,
  onError,
  maxFileSize = 5 * 1024 * 1024 * 1024, // 5GB default
  acceptedFormats = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv'],
  allowMultiple = false,
  className = ''
}: VideoUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<VideoFile[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>([]);
  const [uploadSettings, setUploadSettings] = useState({
    enableAutoProcessing: true,
    generateSummary: true,
    enableTranscription: true,
    enableNotes: true,
    priorityProcessing: false,
    retainOriginal: true
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAbortController = useRef<AbortController | null>(null);

  // Initialize processing stages for OPEA™ pipeline
  useEffect(() => {
    setProcessingStages([
      {
        id: 'validation',
        name: 'File Validation',
        description: 'Validating file format and security',
        status: 'pending',
        progress: 0,
        estimatedTime: 5
      },
      {
        id: 'metadata',
        name: 'Metadata Extraction',
        description: 'Analyzing video properties and content',
        status: 'pending',
        progress: 0,
        estimatedTime: 15
      },
      {
        id: 'transcription',
        name: 'AI Transcription',
        description: 'Converting speech to text using OPEA™',
        status: 'pending',
        progress: 0,
        estimatedTime: 120
      },
      {
        id: 'nlp',
        name: 'NLP Analysis',
        description: 'Processing content with Intel AI models',
        status: 'pending',
        progress: 0,
        estimatedTime: 60
      },
      {
        id: 'summary',
        name: 'Summary Generation',
        description: 'Creating AI-powered summaries',
        status: 'pending',
        progress: 0,
        estimatedTime: 30
      },
      {
        id: 'completion',
        name: 'Finalization',
        description: 'Preparing results and cleanup',
        status: 'pending',
        progress: 0,
        estimatedTime: 10
      }
    ]);
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      'video/*': acceptedFormats
    },
    maxSize: maxFileSize,
    multiple: allowMultiple,
    disabled: isUploading,
    onDrop: handleFileDrop,
    onDropRejected: handleDropRejected
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone(dropzoneOptions);

  const handleFileDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Handle single file for now
    setIsUploading(true);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0, speed: 0, estimatedTimeRemaining: 0 });

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Extract metadata
    await extractVideoMetadata(file);

    // Simulate chunked upload with progress tracking
    await simulateUpload(file);
  }, []);

  const handleDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    const rejection = rejectedFiles[0];
    let errorMessage = 'File upload failed';

    if (rejection.errors[0]?.code === 'file-too-large') {
      errorMessage = `File size exceeds maximum limit of ${(maxFileSize / 1024 / 1024 / 1024).toFixed(1)}GB`;
    } else if (rejection.errors[0]?.code === 'file-invalid-type') {
      errorMessage = `Invalid file format. Supported formats: ${acceptedFormats.join(', ')}`;
    }

    onError?.(errorMessage);
  }, [maxFileSize, acceptedFormats, onError]);

  const extractVideoMetadata = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const metadata: VideoMetadata = {
          duration: video.duration,
          resolution: `${video.videoWidth}x${video.videoHeight}`,
          format: file.type,
          size: file.size,
          frameRate: 30, // Simulated - would need more complex analysis
          bitrate: Math.round((file.size * 8) / video.duration), // Estimated bitrate
          audioChannels: 2 // Simulated
        };
        
        setVideoMetadata(metadata);
        URL.revokeObjectURL(video.src);
        resolve();
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const simulateUpload = async (file: File): Promise<void> => {
    const startTime = Date.now();
    const chunkSize = 1024 * 1024; // 1MB chunks
    let uploaded = 0;

    uploadAbortController.current = new AbortController();

    try {
      while (uploaded < file.size && !uploadAbortController.current?.signal.aborted) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
        
        const chunkEnd = Math.min(uploaded + chunkSize, file.size);
        uploaded = chunkEnd;
        
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = uploaded / elapsed;
        const remaining = (file.size - uploaded) / speed;
        const percentage = (uploaded / file.size) * 100;

        setUploadProgress({
          loaded: uploaded,
          total: file.size,
          percentage,
          speed,
          estimatedTimeRemaining: remaining
        });
      }

      if (!uploadAbortController.current?.signal.aborted) {
        // Upload completed, start processing
        const videoFile: VideoFile = {
          id: generateId(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: previewUrl || '',
          uploadedAt: new Date()
        };

        setUploadedFiles(prev => [...prev, videoFile]);
        setIsUploading(false);
        setUploadProgress(null);

        if (uploadSettings.enableAutoProcessing) {
          await startProcessing(videoFile);
        }

        onUploadComplete?.(videoFile);
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const startProcessing = async (file: VideoFile): Promise<void> => {
    const status: ProcessingStatus = {
      videoId: file.id,
      status: 'processing',
      progress: 0,
      currentStep: 'Initializing OPEA™ pipeline...'
    };

    setProcessingStatus(status);
    onProcessingUpdate?.(status);

    // Simulate processing stages
    for (let i = 0; i < processingStages.length; i++) {
      const stage = processingStages[i];
      
      // Update stage status
      setProcessingStages(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'processing', startTime: new Date() } : s
      ));

      status.currentStep = stage.description;
      status.progress = (i / processingStages.length) * 100;
      setProcessingStatus({ ...status });
      onProcessingUpdate?.({ ...status });

      // Simulate stage processing time
      const stageTime = stage.estimatedTime || 30;
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, (stageTime * 1000) / 10));
        
        setProcessingStages(prev => prev.map((s, idx) => 
          idx === i ? { ...s, progress } : s
        ));
      }

      // Mark stage as completed
      setProcessingStages(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed', endTime: new Date(), progress: 100 } : s
      ));
    }

    // Processing completed
    status.status = 'completed';
    status.progress = 100;
    status.currentStep = 'Processing completed successfully';
    setProcessingStatus(status);
    onProcessingUpdate?.(status);
  };

  const cancelUpload = () => {
    if (uploadAbortController.current) {
      uploadAbortController.current.abort();
      setIsUploading(false);
      setUploadProgress(null);
      setPreviewUrl(null);
      setVideoMetadata(null);
    }
  };

  const retryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const getDropzoneStyle = () => {
    let baseStyle = "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer";
    
    if (isDragAccept) {
      baseStyle += " border-intel-blue bg-intel-blue/5";
    } else if (isDragReject) {
      baseStyle += " border-red-500 bg-red-50";
    } else if (isDragActive) {
      baseStyle += " border-intel-light-blue bg-intel-light-blue/5";
    } else {
      baseStyle += " border-intel-light-gray hover:border-intel-blue hover:bg-intel-blue/5";
    }
    
    if (isUploading) {
      baseStyle += " pointer-events-none opacity-60";
    }
    
    return baseStyle;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full space-y-6 ${className}`}
    >
      {/* Upload Area */}
      <Card className="intel-shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-intel-navy">
                <CloudUpload className="h-5 w-5 mr-2 text-intel-blue" />
                Video Upload & Processing
              </CardTitle>
              <p className="text-sm text-intel-gray mt-1">
                Powered by Intel OPEA™ • Enterprise AI Platform
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-intel-blue/10 text-intel-blue">
                <Shield className="h-3 w-3 mr-1" />
                Secure Upload
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvancedOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-intel-light-gray rounded-lg p-4 bg-intel-light-gray/30"
              >
                <h4 className="font-medium text-intel-navy mb-3">Processing Options</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries({
                    enableAutoProcessing: 'Auto-start processing',
                    generateSummary: 'Generate AI summary',
                    enableTranscription: 'Enable transcription',
                    enableNotes: 'Generate smart notes',
                    priorityProcessing: 'Priority processing',
                    retainOriginal: 'Retain original file'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={uploadSettings[key as keyof typeof uploadSettings]}
                        onChange={(e) => setUploadSettings(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded border-intel-light-gray focus:ring-intel-blue"
                      />
                      <span className="text-sm text-intel-gray">{label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Drop Zone */}
          {!previewUrl && (
            <div {...getRootProps()} className={getDropzoneStyle()}>
              <input {...getInputProps()} ref={fileInputRef} />
              <div className="space-y-4">
                <div className="w-16 h-16 intel-gradient rounded-full flex items-center justify-center mx-auto">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-white" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-intel-navy mb-2">
                    {isDragActive ? 'Drop your video here' : 'Upload Meeting Video'}
                  </h3>
                  <p className="text-intel-gray mb-4">
                    Drag & drop your video file or click to browse
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-intel-gray">
                    <span>Supported formats: {acceptedFormats.join(', ')}</span>
                    <span>•</span>
                    <span>Max size: {formatFileSize(maxFileSize)}</span>
                  </div>
                </div>

                {!isUploading && (
                  <Button className="intel-gradient text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Select Video File
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          <AnimatePresence>
            {uploadProgress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Card className="border-intel-blue/30 bg-intel-blue/5">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-intel-navy">Uploading...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelUpload}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="w-full bg-intel-light-gray rounded-full h-2">
                        <div 
                          className="intel-gradient h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.percentage}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-intel-gray">
                        <span>
                          {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
                        </span>
                        <span>{uploadProgress.percentage.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-intel-gray">
                        <span>
                          Speed: {formatFileSize(uploadProgress.speed)}/s
                        </span>
                        <span>
                          ETA: {Math.round(uploadProgress.estimatedTimeRemaining)}s
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Preview */}
          <AnimatePresence>
            {previewUrl && videoMetadata && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="intel-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-intel-navy flex items-center">
                          <Video className="h-5 w-5 mr-2 text-intel-blue" />
                          Video Preview
                        </CardTitle>
                        <p className="text-sm text-intel-gray">File ready for processing</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Upload Complete
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Video Player */}
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        src={previewUrl}
                        className="w-full h-48 object-contain"
                        controls
                        preload="metadata"
                      />
                    </div>

                    {/* Video Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-intel-light-gray rounded-lg">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-intel-navy">Duration</div>
                        <div className="text-intel-gray">{formatDuration(videoMetadata.duration)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-intel-navy">Resolution</div>
                        <div className="text-intel-gray">{videoMetadata.resolution}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-intel-navy">Size</div>
                        <div className="text-intel-gray">{formatFileSize(videoMetadata.size)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-intel-navy">Format</div>
                        <div className="text-intel-gray">{videoMetadata.format.split('/')[1]?.toUpperCase()}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={retryUpload}
                          className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Replace File
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        {!processingStatus && uploadSettings.enableAutoProcessing && (
                          <Button
                            onClick={() => startProcessing(uploadedFiles[0])}
                            className="intel-gradient text-white"
                            disabled={isUploading}
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            Start AI Processing
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Status */}
          <AnimatePresence>
            {processingStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="intel-shadow-lg border-intel-blue/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-intel-navy flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-intel-blue" />
                          AI Processing Pipeline
                        </CardTitle>
                        <p className="text-sm text-intel-gray">{processingStatus.currentStep}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          processingStatus.status === 'completed' ? 'bg-green-100 text-green-700' :
                          processingStatus.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Cpu className="h-3 w-3 mr-1" />
                        OPEA™ Powered
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Overall Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-intel-navy">Overall Progress</span>
                        <span className="text-intel-blue">{processingStatus.progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-intel-light-gray rounded-full h-2">
                        <div 
                          className="intel-gradient h-2 rounded-full transition-all duration-300"
                          style={{ width: `${processingStatus.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Processing Stages */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-intel-navy">Processing Stages</h4>
                      {processingStages.map((stage, index) => (
                        <div key={stage.id} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-500' :
                            stage.status === 'processing' ? 'intel-gradient' :
                            stage.status === 'error' ? 'bg-red-500' :
                            'bg-intel-light-gray'
                          }`}>
                            {stage.status === 'completed' ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : stage.status === 'processing' ? (
                              <Loader2 className="h-4 w-4 text-white animate-spin" />
                            ) : stage.status === 'error' ? (
                              <AlertCircle className="h-4 w-4 text-white" />
                            ) : (
                              <div className="w-2 h-2 bg-intel-gray rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-intel-navy">{stage.name}</span>
                              {stage.status === 'processing' && (
                                <span className="text-xs text-intel-blue">{stage.progress}%</span>
                              )}
                            </div>
                            <p className="text-xs text-intel-gray">{stage.description}</p>
                            
                            {stage.status === 'processing' && (
                              <div className="w-full bg-intel-light-gray rounded-full h-1 mt-1">
                                <div 
                                  className="bg-intel-blue h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${stage.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Processing Complete Actions */}
                    {processingStatus.status === 'completed' && (
                      <div className="pt-4 border-t border-intel-light-gray">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-intel-navy">Processing Complete</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card className="intel-shadow">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-intel-blue" />
              <div>
                <div className="text-sm font-semibold text-intel-navy">Secure Processing</div>
                <div className="text-xs text-intel-gray">End-to-end encryption</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Cpu className="h-5 w-5 text-intel-blue" />
              <div>
                <div className="text-sm font-semibold text-intel-navy">Intel Hardware</div>
                <div className="text-xs text-intel-gray">Optimized performance</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Database className="h-5 w-5 text-intel-blue" />
              <div>
                <div className="text-sm font-semibold text-intel-navy">OPEA™ Platform</div>
                <div className="text-xs text-intel-gray">Enterprise AI</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Monitor className="h-5 w-5 text-intel-blue" />
              <div>
                <div className="text-sm font-semibold text-intel-navy">Real-time Analytics</div>
                <div className="text-xs text-intel-gray">Comprehensive insights</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}