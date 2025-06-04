// src/components/features/analytics-dashboard.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Brain,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Star,
  Activity,
  PieChart,
  LineChart,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Zap,
  Award,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  SkipForward,
  Volume2,
  FileText,
  Share2,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: number[];
  icon: React.ElementType;
  color: string;
  description: string;
}

interface MeetingAnalytics {
  totalMeetings: number;
  totalDuration: number;
  averageDuration: number;
  participantEngagement: number;
  actionItemsGenerated: number;
  actionItemsCompleted: number;
  transcriptionAccuracy: number;
  summaryQuality: number;
  topTopics: Array<{ topic: string; frequency: number; sentiment: number }>;
  participantStats: Array<{
    name: string;
    meetings: number;
    speakingTime: number;
    contributions: number;
    sentiment: number;
  }>;
  timeDistribution: Array<{ hour: number; meetings: number }>;
  meetingOutcomes: Array<{ outcome: string; percentage: number; color: string }>;
}

interface AnalyticsDashboardProps {
  dateRange: {
    start: Date;
    end: Date;
  };
  meetingIds?: string[];
  userId?: string;
  teamId?: string;
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
  onExportReport?: (format: 'pdf' | 'excel' | 'csv') => void;
  className?: string;
}

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'custom';
type ViewMode = 'overview' | 'meetings' | 'participants' | 'topics' | 'performance';

export default function AnalyticsDashboard({
  dateRange,
  meetingIds,
  userId,
  teamId,
  onDateRangeChange,
  onExportReport,
  className = ''
}: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['all']);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Simulated analytics data - in real implementation, fetch from OPEA™ analytics API
  const analytics: MeetingAnalytics = useMemo(() => ({
    totalMeetings: 45,
    totalDuration: 3240, // minutes
    averageDuration: 72, // minutes
    participantEngagement: 0.87,
    actionItemsGenerated: 127,
    actionItemsCompleted: 89,
    transcriptionAccuracy: 0.94,
    summaryQuality: 0.91,
    topTopics: [
      { topic: 'Product Strategy', frequency: 28, sentiment: 0.75 },
      { topic: 'Budget Planning', frequency: 24, sentiment: 0.62 },
      { topic: 'Technical Implementation', frequency: 21, sentiment: 0.81 },
      { topic: 'Team Updates', frequency: 19, sentiment: 0.88 },
      { topic: 'Risk Assessment', frequency: 16, sentiment: 0.45 }
    ],
    participantStats: [
      { name: 'Sarah Chen', meetings: 32, speakingTime: 847, contributions: 156, sentiment: 0.78 },
      { name: 'Michael Rodriguez', meetings: 28, speakingTime: 623, contributions: 134, sentiment: 0.85 },
      { name: 'Emily Watson', meetings: 25, speakingTime: 592, contributions: 98, sentiment: 0.72 },
      { name: 'David Kim', meetings: 23, speakingTime: 445, contributions: 87, sentiment: 0.81 },
      { name: 'Jessica Park', meetings: 20, speakingTime: 398, contributions: 76, sentiment: 0.76 }
    ],
    timeDistribution: [
      { hour: 9, meetings: 8 },
      { hour: 10, meetings: 12 },
      { hour: 11, meetings: 15 },
      { hour: 13, meetings: 6 },
      { hour: 14, meetings: 10 },
      { hour: 15, meetings: 14 },
      { hour: 16, meetings: 9 }
    ],
    meetingOutcomes: [
      { outcome: 'Successful', percentage: 78, color: 'bg-green-500' },
      { outcome: 'Partially Successful', percentage: 18, color: 'bg-yellow-500' },
      { outcome: 'Needs Follow-up', percentage: 4, color: 'bg-red-500' }
    ]
  }), []);

  const metricCards: MetricCard[] = useMemo(() => [
    {
      id: 'total-meetings',
      title: 'Total Meetings',
      value: analytics.totalMeetings,
      change: 12.5,
      changeType: 'increase',
      trend: [35, 38, 42, 39, 45],
      icon: Calendar,
      color: 'text-blue-600',
      description: 'Meetings conducted in selected period'
    },
    {
      id: 'avg-duration',
      title: 'Avg Duration',
      value: `${Math.floor(analytics.averageDuration / 60)}h ${analytics.averageDuration % 60}m`,
      change: -8.3,
      changeType: 'decrease',
      trend: [82, 78, 75, 73, 72],
      icon: Clock,
      color: 'text-green-600',
      description: 'Average meeting duration'
    },
    {
      id: 'engagement',
      title: 'Engagement Score',
      value: `${Math.round(analytics.participantEngagement * 100)}%`,
      change: 5.7,
      changeType: 'increase',
      trend: [82, 84, 85, 86, 87],
      icon: TrendingUp,
      color: 'text-purple-600',
      description: 'Participant engagement level'
    },
    {
      id: 'action-items',
      title: 'Action Items',
      value: analytics.actionItemsGenerated,
      change: 15.2,
      changeType: 'increase',
      trend: [98, 105, 118, 122, 127],
      icon: Target,
      color: 'text-orange-600',
      description: 'Generated action items'
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: `${Math.round((analytics.actionItemsCompleted / analytics.actionItemsGenerated) * 100)}%`,
      change: 3.8,
      changeType: 'increase',
      trend: [65, 68, 69, 71, 70],
      icon: CheckCircle2,
      color: 'text-emerald-600',
      description: 'Action item completion rate'
    },
    {
      id: 'ai-accuracy',
      title: 'AI Accuracy',
      value: `${Math.round(analytics.transcriptionAccuracy * 100)}%`,
      change: 1.2,
      changeType: 'increase',
      trend: [92, 93, 93, 94, 94],
      icon: Brain,
      color: 'text-intel-blue',
      description: 'OPEA™ transcription accuracy'
    }
  ], [analytics]);

  useEffect(() => {
    // Set up auto-refresh if enabled
    if (refreshInterval) {
      const interval = setInterval(() => {
        // Refresh analytics data
        console.log('Refreshing analytics...');
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    
    if (range !== 'custom' && onDateRangeChange) {
      const now = new Date();
      let start: Date;
      
      switch (range) {
        case '7d':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          return;
      }
      
      onDateRangeChange({ start, end: now });
    }
  };

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'decrease':
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSentimentColor = (sentiment: number): string => {
    if (sentiment >= 0.7) return 'text-green-600';
    if (sentiment >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment >= 0.7) return ThumbsUp;
    if (sentiment >= 0.5) return Minus;
    return ThumbsDown;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full space-y-6 ${className}`}
    >
      {/* Header */}
      <Card className="intel-shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-intel-navy flex items-center">
                  Meeting Analytics Dashboard
                  <Badge variant="secondary" className="ml-3 bg-intel-blue/10 text-intel-blue">
                    <Brain className="h-3 w-3 mr-1" />
                    OPEA™ Insights
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-intel-gray mt-1">
                  <span>{analytics.totalMeetings} meetings analyzed</span>
                  <span>•</span>
                  <span>{formatDuration(analytics.totalDuration)} total duration</span>
                  <span>•</span>
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportReport?.('pdf')}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center justify-between pt-4 border-t border-intel-light-gray">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-intel-navy">Time Period:</span>
              <div className="flex border border-intel-light-gray rounded-lg p-1">
                {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleTimeRangeChange(range)}
                    className={`text-xs ${selectedTimeRange === range ? 'intel-gradient text-white' : 'text-intel-gray hover:text-intel-blue'}`}
                  >
                    {range === '7d' ? 'Last 7 Days' :
                     range === '30d' ? 'Last 30 Days' :
                     range === '90d' ? 'Last 90 Days' :
                     'Last Year'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-intel-gray">View:</span>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as ViewMode)}
                  className="text-sm border border-intel-light-gray rounded px-2 py-1 focus:ring-intel-blue focus:border-intel-blue"
                >
                  <option value="overview">Overview</option>
                  <option value="meetings">Meetings</option>
                  <option value="participants">Participants</option>
                  <option value="topics">Topics</option>
                  <option value="performance">Performance</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-intel-gray">Auto-refresh:</span>
                <select
                  value={refreshInterval || ''}
                  onChange={(e) => setRefreshInterval(e.target.value ? parseInt(e.target.value) : null)}
                  className="text-sm border border-intel-light-gray rounded px-2 py-1 focus:ring-intel-blue focus:border-intel-blue"
                >
                  <option value="">Off</option>
                  <option value="30">30s</option>
                  <option value="60">1m</option>
                  <option value="300">5m</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-intel-light-gray bg-intel-light-gray/30"
            >
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Meeting Type</label>
                    <select className="mt-1 w-full text-sm border border-intel-light-gray rounded px-2 py-1">
                      <option>All Types</option>
                      <option>Strategy</option>
                      <option>Technical</option>
                      <option>Status Update</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Team</label>
                    <select className="mt-1 w-full text-sm border border-intel-light-gray rounded px-2 py-1">
                      <option>All Teams</option>
                      <option>Engineering</option>
                      <option>Product</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Duration</label>
                    <select className="mt-1 w-full text-sm border border-intel-light-gray rounded px-2 py-1">
                      <option>Any Duration</option>
                      <option>0-30 minutes</option>
                      <option>30-60 minutes</option>
                      <option>60+ minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Outcome</label>
                    <select className="mt-1 w-full text-sm border border-intel-light-gray rounded px-2 py-1">
                      <option>All Outcomes</option>
                      <option>Successful</option>
                      <option>Partially Successful</option>
                      <option>Needs Follow-up</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="intel-shadow hover:intel-shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-intel-light-gray flex items-center justify-center ${metric.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric.changeType)}`}>
                      {getChangeIcon(metric.changeType)}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-intel-gray">{metric.title}</h3>
                    <div className="text-2xl font-bold text-intel-navy">{metric.value}</div>
                    <p className="text-xs text-intel-gray">{metric.description}</p>
                  </div>

                  {/* Mini Trend Chart */}
                  <div className="mt-4">
                    <div className="h-8 flex items-end space-x-1">
                      {metric.trend.map((value, idx) => (
                        <div
                          key={idx}
                          className={`w-2 rounded-t opacity-60 ${
                            idx === metric.trend.length - 1 ? metric.color.replace('text-', 'bg-') : 'bg-intel-light-gray'
                          }`}
                          style={{ height: `${(value / Math.max(...metric.trend)) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <Card className="intel-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-intel-navy flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-intel-blue" />
              Top Discussion Topics
            </CardTitle>
            <p className="text-sm text-intel-gray">Most frequently discussed topics with sentiment analysis</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topTopics.map((topic, index) => {
              const SentimentIcon = getSentimentIcon(topic.sentiment);
              return (
                <div key={topic.topic} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-intel-navy">{index + 1}.</span>
                      <span className="text-sm text-intel-dark-gray">{topic.topic}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getSentimentColor(topic.sentiment)}`}>
                      <SentimentIcon className="h-3 w-3" />
                      <span className="text-xs">{Math.round(topic.sentiment * 100)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-intel-gray">{topic.frequency} times</span>
                    <div className="w-16 bg-intel-light-gray rounded-full h-1">
                      <div 
                        className="intel-gradient h-1 rounded-full"
                        style={{ width: `${(topic.frequency / analytics.topTopics[0].frequency) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Participant Performance */}
        <Card className="intel-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-intel-navy flex items-center">
              <Users className="h-5 w-5 mr-2 text-intel-blue" />
              Participant Insights
            </CardTitle>
            <p className="text-sm text-intel-gray">Individual contribution and engagement metrics</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.participantStats.map((participant, index) => {
              const SentimentIcon = getSentimentIcon(participant.sentiment);
              return (
                <div key={participant.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 intel-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-intel-navy">{participant.name}</span>
                      <div className={`flex items-center space-x-1 ${getSentimentColor(participant.sentiment)}`}>
                        <SentimentIcon className="h-3 w-3" />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {participant.meetings} meetings
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-intel-gray ml-10">
                    <div>
                      <span className="block">Speaking Time</span>
                      <span className="font-medium text-intel-navy">{formatDuration(participant.speakingTime)}</span>
                    </div>
                    <div>
                      <span className="block">Contributions</span>
                      <span className="font-medium text-intel-navy">{participant.contributions}</span>
                    </div>
                    <div>
                      <span className="block">Engagement</span>
                      <span className={`font-medium ${getSentimentColor(participant.sentiment)}`}>
                        {Math.round(participant.sentiment * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Meeting Time Distribution */}
        <Card className="intel-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-intel-navy flex items-center">
              <Clock className="h-5 w-5 mr-2 text-intel-blue" />
              Meeting Time Distribution
            </CardTitle>
            <p className="text-sm text-intel-gray">Optimal meeting times based on engagement</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.timeDistribution.map((timeSlot) => (
                <div key={timeSlot.hour} className="flex items-center justify-between">
                  <span className="text-sm text-intel-dark-gray">
                    {timeSlot.hour}:00 - {timeSlot.hour + 1}:00
                  </span>
                  <div className="flex items-center space-x-2 flex-1 mx-4">
                    <div className="flex-1 bg-intel-light-gray rounded-full h-2">
                      <div 
                        className="intel-gradient h-2 rounded-full"
                        style={{ width: `${(timeSlot.meetings / Math.max(...analytics.timeDistribution.map(t => t.meetings))) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-intel-gray w-8 text-right">{timeSlot.meetings}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Outcomes */}
        <Card className="intel-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-intel-navy flex items-center">
              <Award className="h-5 w-5 mr-2 text-intel-blue" />
              Meeting Outcomes
            </CardTitle>
            <p className="text-sm text-intel-gray">Success rate and outcome distribution</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.meetingOutcomes.map((outcome) => (
                <div key={outcome.outcome} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-intel-dark-gray">{outcome.outcome}</span>
                    <span className="text-sm font-medium text-intel-navy">{outcome.percentage}%</span>
                  </div>
                  <div className="w-full bg-intel-light-gray rounded-full h-2">
                    <div 
                      className={`${outcome.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${outcome.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-intel-light-gray rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-intel-navy">Overall Success Rate</span>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {analytics.meetingOutcomes[0].percentage}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+5.2%</span>
                  </div>
                  <span className="text-xs text-intel-gray">vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card className="intel-shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-intel-navy flex items-center">
                <Brain className="h-5 w-5 mr-2 text-intel-blue" />
                OPEA™ AI Performance
              </CardTitle>
              <p className="text-sm text-intel-gray">Intel's AI platform performance metrics</p>
            </div>
            <Badge variant="secondary" className="bg-intel-blue/10 text-intel-blue">
              <Zap className="h-3 w-3 mr-1" />
              Enterprise Grade
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-intel-blue mb-2">
                {Math.round(analytics.transcriptionAccuracy * 100)}%
              </div>
              <span className="text-sm text-intel-gray">Transcription Accuracy</span>
              <div className="mt-2 w-full bg-intel-light-gray rounded-full h-1">
                <div 
                  className="intel-gradient h-1 rounded-full"
                  style={{ width: `${analytics.transcriptionAccuracy * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-intel-blue mb-2">
                {Math.round(analytics.summaryQuality * 100)}%
              </div>
              <span className="text-sm text-intel-gray">Summary Quality</span>
              <div className="mt-2 w-full bg-intel-light-gray rounded-full h-1">
                <div 
                  className="intel-gradient h-1 rounded-full"
                  style={{ width: `${analytics.summaryQuality * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-intel-blue mb-2">2.3s</div>
              <span className="text-sm text-intel-gray">Avg Processing Time</span>
              <div className="mt-2 flex items-center justify-center">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  15% faster
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-intel-blue mb-2">99.9%</div>
              <span className="text-sm text-intel-gray">Uptime</span>
              <div className="mt-2 flex items-center justify-center">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Excellent
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-intel-light-gray rounded-lg bg-intel-light-gray/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-intel-blue" />
                <span className="text-sm font-medium text-intel-navy">Intel OPEA™ Platform Status</span>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Activity className="h-3 w-3 mr-1" />
                  All Systems Operational
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-intel-blue hover:bg-intel-blue/10"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="intel-shadow">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-intel-navy">Quick Actions:</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </div>

            <div className="text-xs text-intel-gray">
              Powered by Intel OPEA™ • Enterprise AI Analytics Platform
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}