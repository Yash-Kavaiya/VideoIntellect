// src/components/features/video-summary.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Users,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  Share2,
  Copy,
  RefreshCw,
  BarChart3,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  Eye,
  Filter,
  Calendar,
  Tag,
  Zap,
  Brain,
  Cpu,
  Shield,
  ExternalLink,
  Bookmark,
  Star,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Settings,
  PlayCircle,
  PauseCircle,
  Volume2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoSummary } from '@/types';

interface SummarySection {
  id: string;
  title: string;
  content: string;
  confidence: number;
  keyPoints: string[];
  timestamp?: number;
  category: 'overview' | 'action' | 'decision' | 'insight' | 'risk';
}

interface SummaryMetrics {
  processingTime: number;
  confidenceScore: number;
  topicsIdentified: number;
  participantsDetected: number;
  actionItemsExtracted: number;
  sentimentScore: number;
  keywordDensity: Record<string, number>;
}

interface VideoSummaryProps {
  summary: VideoSummary;
  videoId: string;
  onTimestampClick?: (timestamp: number) => void;
  onExport?: (format: 'pdf' | 'docx' | 'json' | 'txt') => void;
  onRegenerateSection?: (sectionId: string) => void;
  isRegenerating?: boolean;
  className?: string;
}

type SummaryViewMode = 'executive' | 'detailed' | 'technical' | 'actionable';
type ExportFormat = 'pdf' | 'docx' | 'json' | 'txt';

export default function VideoSummary({ 
  summary, 
  videoId,
  onTimestampClick,
  onExport,
  onRegenerateSection,
  isRegenerating = false,
  className = '' 
}: VideoSummaryProps) {
  const [viewMode, setViewMode] = useState<SummaryViewMode>('executive');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulated AI-generated sections based on OPEA™ analysis
  const summarySections: SummarySection[] = useMemo(() => [
    {
      id: 'overview',
      title: 'Executive Overview',
      content: 'Strategic meeting focused on Q2 product roadmap alignment and resource allocation. Key stakeholders reached consensus on three critical initiatives with $2.3M budget allocation. Meeting concluded with clear action items and deliverable timelines.',
      confidence: 0.94,
      keyPoints: [
        'Q2 product roadmap finalized with three key initiatives',
        '$2.3M budget allocated across strategic priorities',
        'Consensus achieved on resource distribution',
        'Clear timeline established for deliverables'
      ],
      category: 'overview'
    },
    {
      id: 'decisions',
      title: 'Key Decisions Made',
      content: 'Primary decisions include product launch date acceleration, additional engineering headcount approval, and partnership strategy pivot. All decisions received unanimous approval from leadership team.',
      confidence: 0.91,
      keyPoints: [
        'Product launch accelerated by 6 weeks to Q3 2025',
        'Approved hiring of 12 additional engineers',
        'Partnership strategy shifted to focus on enterprise clients',
        'Marketing budget increased by 25% for launch support'
      ],
      timestamp: 1280,
      category: 'decision'
    },
    {
      id: 'action-items',
      title: 'Action Items & Assignments',
      content: 'Fifteen action items assigned across four teams with specific deadlines and success metrics. Critical path items identified with accelerated timelines.',
      confidence: 0.96,
      keyPoints: [
        'Sarah Chen: Complete market analysis by March 15th',
        'Engineering Team: MVP delivery by April 1st',
        'Marketing: Campaign strategy presentation by March 20th',
        'Legal: Partnership agreements review by March 25th'
      ],
      timestamp: 2340,
      category: 'action'
    },
    {
      id: 'insights',
      title: 'AI-Generated Insights',
      content: 'Analysis reveals strong alignment between technical capabilities and market demands. Potential risks identified in resource allocation timing and dependency management.',
      confidence: 0.88,
      keyPoints: [
        'Technical roadmap aligns well with market opportunities',
        'Resource allocation may create bottlenecks in Q3',
        'External dependencies could impact timeline',
        'Competitive advantage window closing in 6 months'
      ],
      category: 'insight'
    },
    {
      id: 'risks',
      title: 'Risk Assessment',
      content: 'Medium-level risks identified in timeline execution and resource dependencies. Mitigation strategies proposed for each identified risk factor.',
      confidence: 0.85,
      keyPoints: [
        'Timeline compression increases delivery risk by 20%',
        'Dependency on external vendor for critical components',
        'Talent acquisition challenges in current market',
        'Budget allocation may require mid-quarter adjustment'
      ],
      category: 'risk'
    }
  ], []);

  // Simulated metrics from OPEA™ AI analysis
  const metrics: SummaryMetrics = useMemo(() => ({
    processingTime: 127,
    confidenceScore: 0.92,
    topicsIdentified: 24,
    participantsDetected: summary.participants?.length || 8,
    actionItemsExtracted: 15,
    sentimentScore: 0.78,
    keywordDensity: {
      'product': 23,
      'budget': 18,
      'timeline': 15,
      'engineering': 12,
      'marketing': 10,
      'partnership': 8
    }
  }), [summary]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  const handleCopyText = useCallback(async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(identifier);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, []);

  const getViewModeContent = useCallback((section: SummarySection) => {
    switch (viewMode) {
      case 'executive':
        return section.content;
      case 'detailed':
        return `${section.content}\n\nDetailed Analysis:\n${section.keyPoints.map(point => `• ${point}`).join('\n')}`;
      case 'technical':
        return `${section.content}\n\nTechnical Details:\nConfidence: ${(section.confidence * 100).toFixed(1)}%\nProcessed by Intel OPEA™ NLP Pipeline\nSemantic Analysis Score: ${(Math.random() * 0.2 + 0.8).toFixed(3)}`;
      case 'actionable':
        return section.category === 'action' ? section.content : 
          `Actionable Insights:\n${section.keyPoints.map(point => `✓ ${point}`).join('\n')}`;
      default:
        return section.content;
    }
  }, [viewMode]);

  const getSectionIcon = (category: SummarySection['category']) => {
    const iconMap = {
      overview: FileText,
      action: Target,
      decision: CheckCircle2,
      insight: Lightbulb,
      risk: AlertTriangle
    };
    return iconMap[category];
  };

  const getSectionColor = (category: SummarySection['category']) => {
    const colorMap = {
      overview: 'bg-blue-500',
      action: 'bg-green-500',
      decision: 'bg-purple-500',
      insight: 'bg-yellow-500',
      risk: 'bg-red-500'
    };
    return colorMap[category];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const exportSummary = (format: ExportFormat) => {
    if (onExport) {
      onExport(format);
    }
  };

  const regenerateSection = (sectionId: string) => {
    if (onRegenerateSection) {
      onRegenerateSection(sectionId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full space-y-6 ${className} ${isFullscreen ? 'fixed inset-4 z-50 bg-white rounded-lg shadow-2xl overflow-auto' : ''}`}
    >
      {/* Header Controls */}
      <Card className="intel-shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-intel-navy flex items-center">
                  AI-Powered Video Summary
                  <Badge variant="secondary" className="ml-3 bg-intel-blue/10 text-intel-blue">
                    <Zap className="h-3 w-3 mr-1" />
                    OPEA™ Enhanced
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-intel-gray mt-1">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {summary.duration}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {metrics.participantsDetected} participants
                  </span>
                  <span className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {metrics.actionItemsExtracted} action items
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Metrics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-intel-navy">View Mode:</span>
              <div className="flex border border-intel-light-gray rounded-lg p-1">
                {(['executive', 'detailed', 'technical', 'actionable'] as SummaryViewMode[]).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className={`capitalize ${viewMode === mode ? 'intel-gradient text-white' : 'text-intel-gray hover:text-intel-blue'}`}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSummary('pdf')}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* AI Metrics Panel */}
        <AnimatePresence>
          {showMetrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-intel-light-gray"
            >
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-intel-blue">{metrics.processingTime}s</div>
                    <div className="text-xs text-intel-gray">Processing Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-intel-blue">{(metrics.confidenceScore * 100).toFixed(0)}%</div>
                    <div className="text-xs text-intel-gray">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-intel-blue">{metrics.topicsIdentified}</div>
                    <div className="text-xs text-intel-gray">Topics Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-intel-blue">{(metrics.sentimentScore * 100).toFixed(0)}%</div>
                    <div className="text-xs text-intel-gray">Positive Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-intel-blue flex items-center justify-center">
                      <Cpu className="h-5 w-5 mr-1" />
                      AI
                    </div>
                    <div className="text-xs text-intel-gray">OPEA™ Powered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-intel-blue flex items-center justify-center">
                      <Shield className="h-5 w-5 mr-1" />
                      99%
                    </div>
                    <div className="text-xs text-intel-gray">Data Security</div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Summary Sections */}
      <div className="space-y-4">
        {summarySections.map((section, index) => {
          const SectionIcon = getSectionIcon(section.category);
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="intel-shadow hover:intel-shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${getSectionColor(section.category)} flex items-center justify-center`}>
                        <SectionIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-intel-navy">{section.title}</CardTitle>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge variant="secondary" className={`text-xs ${getConfidenceColor(section.confidence)}`}>
                            {(section.confidence * 100).toFixed(1)}% confidence
                          </Badge>
                          {section.timestamp && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onTimestampClick?.(section.timestamp!)}
                              className="text-intel-blue hover:bg-intel-blue/10 px-2 py-1 h-auto text-xs"
                            >
                              <PlayCircle className="h-3 w-3 mr-1" />
                              {Math.floor(section.timestamp / 60)}:{(section.timestamp % 60).toString().padStart(2, '0')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyText(getViewModeContent(section), section.id)}
                        className="text-intel-gray hover:text-intel-blue"
                      >
                        {copiedText === section.id ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => regenerateSection(section.id)}
                        disabled={isRegenerating}
                        className="text-intel-gray hover:text-intel-blue"
                      >
                        {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(section.id)}
                        className="text-intel-gray hover:text-intel-blue"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-intel-dark-gray leading-relaxed mb-4">
                    {getViewModeContent(section)}
                  </div>

                  {/* Key Points */}
                  {viewMode !== 'technical' && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-intel-navy">Key Points:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {section.keyPoints.map((point, pointIndex) => (
                          <div key={pointIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-intel-blue rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-intel-gray">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-intel-light-gray"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-intel-navy mb-2">AI Analysis</h5>
                            <div className="space-y-2 text-sm text-intel-gray">
                              <div>Processing Method: OPEA™ NLP Pipeline</div>
                              <div>Model Confidence: {(section.confidence * 100).toFixed(1)}%</div>
                              <div>Context Relevance: High</div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-intel-navy mb-2">Related Topics</h5>
                            <div className="flex flex-wrap gap-1">
                              {summary.topics.slice(0, 4).map((topic, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-intel-navy mb-2">Actions</h5>
                            <div className="space-y-1">
                              <Button variant="ghost" size="sm" className="w-full justify-start text-intel-blue hover:bg-intel-blue/10">
                                <Bookmark className="h-3 w-3 mr-2" />
                                Save section
                              </Button>
                              <Button variant="ghost" size="sm" className="w-full justify-start text-intel-blue hover:bg-intel-blue/10">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                View details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <Card className="intel-shadow">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-intel-gray">
              <span className="flex items-center">
                <Brain className="h-4 w-4 mr-1 text-intel-blue" />
                Generated by Intel OPEA™
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-intel-blue" />
                {new Date(summary.generatedAt).toLocaleString()}
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Enterprise Ready
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSummary('json')}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-intel-gray hover:text-intel-blue"
              >
                <Star className="h-4 w-4 mr-2" />
                Rate Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}