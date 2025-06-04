// src/components/layout/main-application.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video,
  MessageSquare,
  Search,
  FileText,
  Target,
  BarChart3,
  Upload,
  Settings,
  User,
  Bell,
  Menu,
  X,
  Brain,
  Cpu,
  Shield,
  Zap,
  Home,
  History,
  Calendar,
  Users,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Share2,
  Plus,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Import feature components
import ChatInterface from '@/components/features/chat-interface';
import TranscriptSearch from '@/components/features/transcript-search';
import VideoSummary from '@/components/features/video-summary';
import VideoUpload from '@/components/features/video-upload';
import MeetingNotes from '@/components/features/meeting-notes';
import ActionItemsTracker from '@/components/features/action-items-tracker';
import AnalyticsDashboard from '@/components/features/analytics-dashboard';

import { 
  Meeting, 
  VideoFile, 
  Transcript, 
  VideoSummary as VideoSummaryType,
  ProcessingStatus,
  User as UserType,
  ActionItem,
  Note
} from '@/types';
import { useLocalStorage, useMediaQuery, useKeyboardShortcut } from '@/utils';

interface MainApplicationProps {
  user: UserType;
  onLogout: () => void;
}

type ActiveView = 'dashboard' | 'upload' | 'meetings' | 'analytics' | 'settings' | 'help';
type PanelLayout = 'single' | 'dual' | 'triple' | 'quad';

interface ApplicationState {
  currentMeeting: Meeting | null;
  currentVideo: VideoFile | null;
  currentTranscript: Transcript | null;
  currentSummary: VideoSummaryType | null;
  processingStatus: ProcessingStatus | null;
  notes: Note[];
  actionItems: ActionItem[];
}

export default function MainApplication({ user, onLogout }: MainApplicationProps) {
  // Layout state
  const [activeView, setActiveView] = useLocalStorage<ActiveView>('activeView', 'dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebarCollapsed', false);
  const [panelLayout, setPanelLayout] = useLocalStorage<PanelLayout>('panelLayout', 'dual');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Application state
  const [appState, setAppState] = useState<ApplicationState>({
    currentMeeting: null,
    currentVideo: null,
    currentTranscript: null,
    currentSummary: null,
    processingStatus: null,
    notes: [],
    actionItems: []
  });

  // Chat interface state
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);

  // Responsive design
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Sample data initialization
  useEffect(() => {
    // Initialize with sample data for demonstration
    const sampleMeeting: Meeting = {
      id: 'meeting-sample-1',
      title: 'Q2 Product Strategy Review',
      description: 'Comprehensive review of Q2 product roadmap and strategic initiatives',
      scheduledAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      duration: 90,
      status: 'completed',
      organizer: user.id,
      participants: [user.id, 'user-2', 'user-3', 'user-4'],
      tags: ['strategy', 'product', 'q2', 'roadmap'],
      isRecurring: false,
      metadata: {
        platform: 'Microsoft Teams',
        recordingSettings: {
          autoStart: true,
          autoStop: true,
          quality: 'high',
          includeAudio: true,
          includeVideo: true,
          includeScreenShare: true
        },
        aiProcessingSettings: {
          enableTranscription: true,
          enableSummary: true,
          enableSentimentAnalysis: true,
          enableSpeakerIdentification: true,
          enableTopicExtraction: true,
          enableActionItemExtraction: true,
          language: 'en',
          model: {
            id: 'opea-v1',
            name: 'Intel OPEA™ Enterprise Model',
            version: '1.0',
            provider: 'intel-opea',
            capabilities: ['transcription', 'summarization', 'sentiment-analysis'],
            languages: ['en', 'es', 'fr', 'de']
          },
          confidence: 0.8
        }
      },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date()
    };

    const sampleTranscript: Transcript = {
      id: 'transcript-1',
      videoId: 'video-1',
      meetingId: sampleMeeting.id,
      segments: [
        {
          id: 'seg-1',
          start: 0,
          end: 15,
          text: 'Good morning everyone, welcome to our Q2 product strategy review. Today we\'ll be discussing our roadmap priorities and resource allocation.',
          speaker: 'Sarah Chen',
          confidence: 0.94,
          words: []
        },
        {
          id: 'seg-2',
          start: 15,
          end: 35,
          text: 'Before we dive into the details, let me share the key metrics from Q1. We achieved 127% of our revenue target and launched three major features.',
          speaker: 'Sarah Chen',
          confidence: 0.91,
          words: []
        }
      ],
      speakers: [
        { id: 'speaker-1', name: 'Sarah Chen', confidence: 0.95, segments: [0, 1], totalSpeakingTime: 35 },
        { id: 'speaker-2', name: 'Michael Rodriguez', confidence: 0.92, segments: [], totalSpeakingTime: 0 }
      ],
      language: 'en',
      confidence: 0.93,
      processingTime: 127,
      generatedAt: new Date(),
      version: 1
    };

    const sampleSummary: VideoSummaryType = {
      id: 'summary-1',
      videoId: 'video-1',
      meetingId: sampleMeeting.id,
      executiveSummary: 'Productive Q2 strategy session with key decisions on product roadmap, budget allocation, and timeline adjustments. All major initiatives approved with clear ownership and deadlines.',
      keyTopics: ['Product Roadmap', 'Budget Planning', 'Resource Allocation', 'Timeline Management', 'Risk Assessment'],
      participants: ['Sarah Chen', 'Michael Rodriguez', 'Emily Watson', 'David Kim'],
      actionItems: [
        'Finalize Q2 product roadmap by March 15th',
        'Review vendor contracts for new partnership',
        'Prepare budget presentation for leadership review'
      ],
      decisions: [
        'Approved Q2 budget with 15% increase for R&D',
        'Product launch moved to Q3 2025 for additional testing',
        'New project leads assigned for each workstream'
      ],
      nextSteps: [
        'Schedule follow-up with engineering team',
        'Distribute meeting notes to all stakeholders',
        'Set up weekly progress check-ins'
      ],
      sentiment: {
        overall: 0.78,
        positive: 0.68,
        negative: 0.12,
        neutral: 0.20,
        confidence: 0.91,
        segments: []
      },
      confidence: 0.92,
      duration: '1h 30m',
      generatedAt: new Date(),
      aiModel: 'Intel OPEA™ v1.0',
      version: 1
    };

    setAppState(prev => ({
      ...prev,
      currentMeeting: sampleMeeting,
      currentTranscript: sampleTranscript,
      currentSummary: sampleSummary
    }));
  }, [user.id]);

  // Keyboard shortcuts
  useKeyboardShortcut(['ctrl', 'k'], () => {
    // Focus global search
    const searchInput = document.querySelector('[data-global-search]') as HTMLInputElement;
    searchInput?.focus();
  });

  useKeyboardShortcut(['ctrl', 'shift', 'c'], () => {
    setChatVisible(prev => !prev);
  });

  useKeyboardShortcut(['ctrl', '1'], () => setActiveView('dashboard'));
  useKeyboardShortcut(['ctrl', '2'], () => setActiveView('upload'));
  useKeyboardShortcut(['ctrl', '3'], () => setActiveView('meetings'));
  useKeyboardShortcut(['ctrl', '4'], () => setActiveView('analytics'));

  // Event handlers
  const handleVideoUpload = useCallback((videoFile: VideoFile) => {
    setAppState(prev => ({ ...prev, currentVideo: videoFile }));
    setActiveView('meetings');
  }, []);

  const handleProcessingUpdate = useCallback((status: ProcessingStatus) => {
    setAppState(prev => ({ ...prev, processingStatus: status }));
  }, []);

  const handleTimestampClick = useCallback((timestamp: number) => {
    // In a real implementation, this would seek to the timestamp in the video player
    console.log('Seeking to timestamp:', timestamp);
  }, []);

  const handleNoteChange = useCallback((notes: Note[]) => {
    setAppState(prev => ({ ...prev, notes }));
  }, []);

  const handleActionItemCreated = useCallback((actionItem: ActionItem) => {
    setAppState(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, actionItem]
    }));
  }, []);

  // Navigation items
  const navigationItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: Home, shortcut: 'Ctrl+1' },
    { id: 'upload', label: 'Upload', icon: Upload, shortcut: 'Ctrl+2' },
    { id: 'meetings', label: 'Meetings', icon: Video, shortcut: 'Ctrl+3' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, shortcut: 'Ctrl+4' },
    { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'Ctrl+,' },
    { id: 'help', label: 'Help', icon: HelpCircle, shortcut: 'F1' }
  ], []);

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="intel-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-intel-navy">23</div>
                  <div className="text-sm text-intel-gray">Total Meetings</div>
                </CardContent>
              </Card>
              
              <Card className="intel-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-intel-navy">147</div>
                  <div className="text-sm text-intel-gray">Action Items</div>
                </CardContent>
              </Card>
              
              <Card className="intel-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-intel-navy">94%</div>
                  <div className="text-sm text-intel-gray">AI Accuracy</div>
                </CardContent>
              </Card>
              
              <Card className="intel-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-intel-navy">2.3s</div>
                  <div className="text-sm text-intel-gray">Avg Processing</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="intel-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-intel-navy">
                    <History className="h-5 w-5 mr-2 text-intel-blue" />
                    Recent Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-intel-light-gray rounded-lg hover:border-intel-blue transition-colors cursor-pointer">
                      <div className="w-10 h-10 intel-gradient rounded-full flex items-center justify-center">
                        <Video className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-intel-navy">Q2 Strategy Review</h4>
                        <p className="text-sm text-intel-gray">2 hours ago • 1h 30m</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="intel-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-intel-navy">
                    <Target className="h-5 w-5 mr-2 text-intel-blue" />
                    Pending Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-intel-light-gray rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-intel-navy">Review vendor contracts</h4>
                        <p className="text-sm text-intel-gray">Due tomorrow • Assigned to Emily</p>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        High
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'upload':
        return (
          <VideoUpload
            onUploadComplete={handleVideoUpload}
            onProcessingUpdate={handleProcessingUpdate}
            maxFileSize={5 * 1024 * 1024 * 1024} // 5GB
            acceptedFormats={['.mp4', '.mov', '.avi', '.mkv']}
          />
        );

      case 'meetings':
        return (
          <div className="space-y-6">
            {panelLayout === 'dual' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {appState.currentSummary && (
                    <VideoSummary
                      summary={appState.currentSummary}
                      videoId={appState.currentVideo?.id || ''}
                      onTimestampClick={handleTimestampClick}
                    />
                  )}
                  
                  <ActionItemsTracker
                    meetingId={appState.currentMeeting?.id || ''}
                    onTimestampClick={handleTimestampClick}
                    onActionItemUpdate={handleActionItemCreated}
                  />
                </div>
                
                <div className="space-y-6">
                  {appState.currentTranscript && (
                    <TranscriptSearch
                      transcript={appState.currentTranscript}
                      onTimestampClick={handleTimestampClick}
                    />
                  )}
                  
                  <MeetingNotes
                    meetingId={appState.currentMeeting?.id || ''}
                    onTimestampClick={handleTimestampClick}
                    onNoteChange={handleNoteChange}
                    onActionItemCreated={handleActionItemCreated}
                  />
                </div>
              </div>
            )}

            {panelLayout === 'single' && appState.currentSummary && (
              <VideoSummary
                summary={appState.currentSummary}
                videoId={appState.currentVideo?.id || ''}
                onTimestampClick={handleTimestampClick}
              />
            )}
          </div>
        );

      case 'analytics':
        return (
          <AnalyticsDashboard
            dateRange={{
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              end: new Date()
            }}
            meetingIds={appState.currentMeeting ? [appState.currentMeeting.id] : []}
            userId={user.id}
          />
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <Card className="intel-shadow">
              <CardHeader>
                <CardTitle className="text-intel-navy">Application Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Theme</label>
                    <select className="mt-1 w-full border border-intel-light-gray rounded px-3 py-2">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Language</label>
                    <select className="mt-1 w-full border border-intel-light-gray rounded px-3 py-2">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <Card className="intel-shadow">
              <CardHeader>
                <CardTitle className="text-intel-navy">Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-intel-light-gray rounded-lg">
                    <h3 className="font-medium text-intel-navy mb-2">Keyboard Shortcuts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Global Search</span>
                        <kbd className="px-2 py-1 bg-intel-light-gray rounded">Ctrl + K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle Chat</span>
                        <kbd className="px-2 py-1 bg-intel-light-gray rounded">Ctrl + Shift + C</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Dashboard</span>
                        <kbd className="px-2 py-1 bg-intel-light-gray rounded">Ctrl + 1</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className={`h-screen bg-gray-50 flex ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || !sidebarCollapsed) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : false}
            className={`${
              sidebarCollapsed ? 'w-16' : 'w-64'
            } bg-white border-r border-intel-light-gray flex flex-col transition-all duration-300 ${
              isMobile ? 'fixed inset-y-0 left-0 z-50' : ''
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-intel-light-gray">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 intel-gradient rounded-lg flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-intel-navy">Intel Meeting Assistant</h1>
                      <p className="text-xs text-intel-gray">Powered by OPEA™</p>
                    </div>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-intel-gray hover:text-intel-blue"
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveView(item.id as ActiveView)}
                    className={`w-full justify-start ${
                      isActive ? 'intel-gradient text-white' : 'text-intel-gray hover:text-intel-blue hover:bg-intel-blue/10'
                    }`}
                    title={sidebarCollapsed ? `${item.label} (${item.shortcut})` : undefined}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                  </Button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-intel-light-gray">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 intel-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-intel-navy">{user.name}</p>
                    <p className="text-xs text-intel-gray">{user.email}</p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-intel-gray hover:text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-intel-light-gray px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {(isMobile || sidebarCollapsed) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-intel-gray hover:text-intel-blue"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-intel-gray" />
                <Input
                  placeholder="Search meetings, notes, action items..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-96 focus:ring-intel-blue focus:border-intel-blue"
                  data-global-search
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Layout Controls */}
              <div className="flex items-center space-x-1 border border-intel-light-gray rounded-lg p-1">
                {(['single', 'dual', 'triple', 'quad'] as PanelLayout[]).map((layout) => (
                  <Button
                    key={layout}
                    variant={panelLayout === layout ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPanelLayout(layout)}
                    className={`text-xs ${panelLayout === layout ? 'intel-gradient text-white' : 'text-intel-gray'}`}
                  >
                    {layout}
                  </Button>
                ))}
              </div>

              {/* Processing Status */}
              {appState.processingStatus && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Processing...
                </Badge>
              )}

              {/* OPEA™ Status */}
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                OPEA™ Online
              </Badge>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-intel-gray hover:text-intel-blue relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-intel-gray hover:text-intel-blue"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMainContent()}
          </motion.div>
        </main>
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {chatVisible && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`${chatMinimized ? 'w-16' : 'w-96'} border-l border-intel-light-gray bg-white flex flex-col`}
          >
            <ChatInterface
              videoId={appState.currentVideo?.id}
              isMinimized={chatMinimized}
              onToggleMinimize={() => setChatMinimized(!chatMinimized)}
              className="h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-16 right-6 w-80 bg-white border border-intel-light-gray rounded-lg intel-shadow-lg z-50"
          >
            <div className="p-4 border-b border-intel-light-gray">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-intel-navy">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                  className="text-intel-gray hover:text-intel-blue"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border border-intel-light-gray rounded-lg">
                  <div className="w-8 h-8 intel-gradient rounded-full flex items-center justify-center">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-intel-navy">Meeting processed</h4>
                    <p className="text-xs text-intel-gray">Q2 Strategy Review analysis is ready</p>
                    <span className="text-xs text-intel-gray">2 minutes ago</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}