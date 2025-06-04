// src/components/features/meeting-notes.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool,
  Save,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Tag,
  Clock,
  User,
  Brain,
  Lightbulb,
  Target,
  AlertCircle,
  CheckCircle2,
  Star,
  BookOpen,
  Share2,
  Download,
  Copy,
  RefreshCw,
  Zap,
  MessageSquare,
  Bookmark,
  FileText,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Sparkles,
  Link,
  Calendar,
  Users,
  ArrowRight,
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Note, NoteTag, NoteType } from '@/types';

interface SmartSuggestion {
  id: string;
  type: 'action' | 'question' | 'insight' | 'follow-up';
  content: string;
  confidence: number;
  timestamp?: number;
  source: 'transcript' | 'context' | 'ai-analysis';
}

interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  structure: Array<{
    title: string;
    placeholder: string;
    required: boolean;
  }>;
}

interface MeetingNotesProps {
  meetingId: string;
  videoId?: string;
  transcript?: string;
  onTimestampClick?: (timestamp: number) => void;
  onNoteChange?: (notes: Note[]) => void;
  onActionItemCreated?: (actionItem: any) => void;
  isRealTime?: boolean;
  className?: string;
}

type ViewMode = 'edit' | 'review' | 'presentation';
type SortMode = 'timestamp' | 'priority' | 'type' | 'recent';

export default function MeetingNotes({
  meetingId,
  videoId,
  transcript,
  onTimestampClick,
  onNoteChange,
  onActionItemCreated,
  isRealTime = false,
  className = ''
}: MeetingNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [sortMode, setSortMode] = useState<SortMode>('timestamp');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const noteTemplates: NoteTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level overview for leadership',
      structure: [
        { title: 'Key Decisions', placeholder: 'Major decisions made during the meeting...', required: true },
        { title: 'Action Items', placeholder: 'Tasks assigned with owners and deadlines...', required: true },
        { title: 'Budget Impact', placeholder: 'Financial implications and budget considerations...', required: false },
        { title: 'Next Steps', placeholder: 'Immediate next steps and follow-up meetings...', required: true }
      ]
    },
    {
      id: 'technical-review',
      name: 'Technical Review',
      description: 'Engineering and technical discussions',
      structure: [
        { title: 'Technical Decisions', placeholder: 'Architecture and implementation decisions...', required: true },
        { title: 'Risks & Issues', placeholder: 'Technical risks and blockers identified...', required: true },
        { title: 'Resource Requirements', placeholder: 'Technical resources and timeline needs...', required: false },
        { title: 'Testing Strategy', placeholder: 'Quality assurance and testing approach...', required: false }
      ]
    },
    {
      id: 'project-planning',
      name: 'Project Planning',
      description: 'Project status and planning discussions',
      structure: [
        { title: 'Project Status', placeholder: 'Current project status and milestones...', required: true },
        { title: 'Timeline Updates', placeholder: 'Schedule changes and deadline adjustments...', required: true },
        { title: 'Resource Allocation', placeholder: 'Team assignments and resource distribution...', required: false },
        { title: 'Dependencies', placeholder: 'External dependencies and blockers...', required: false }
      ]
    }
  ];

  const availableTags: NoteTag[] = [
    { id: 'decision', name: 'Decision', color: 'bg-green-500' },
    { id: 'action', name: 'Action Item', color: 'bg-blue-500' },
    { id: 'risk', name: 'Risk', color: 'bg-red-500' },
    { id: 'insight', name: 'Insight', color: 'bg-purple-500' },
    { id: 'question', name: 'Question', color: 'bg-yellow-500' },
    { id: 'follow-up', name: 'Follow-up', color: 'bg-orange-500' }
  ];

  // Initialize with AI-generated suggestions
  useEffect(() => {
    generateSmartSuggestions();
  }, [transcript, meetingId]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && notes.length > 0) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes, autoSaveEnabled]);

  const generateSmartSuggestions = useCallback(async () => {
    // Simulate AI analysis of transcript and context
    const suggestions: SmartSuggestion[] = [
      {
        id: 'suggestion-1',
        type: 'action',
        content: 'Follow up with engineering team on Q2 deliverables timeline',
        confidence: 0.94,
        timestamp: 1280,
        source: 'transcript'
      },
      {
        id: 'suggestion-2',
        type: 'insight',
        content: 'Budget allocation discussion suggests potential resource constraints',
        confidence: 0.87,
        timestamp: 2340,
        source: 'ai-analysis'
      },
      {
        id: 'suggestion-3',
        type: 'question',
        content: 'Clarify dependency timeline with external vendor',
        confidence: 0.91,
        source: 'context'
      },
      {
        id: 'suggestion-4',
        type: 'follow-up',
        content: 'Schedule technical review meeting for new architecture',
        confidence: 0.89,
        timestamp: 3120,
        source: 'transcript'
      }
    ];

    setSmartSuggestions(suggestions);
  }, [transcript, meetingId]);

  const createNewNote = useCallback((type: NoteType = 'general', template?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      type,
      title: '',
      content: '',
      timestamp: new Date(),
      tags: [],
      priority: 'medium',
      isPrivate: false,
      author: 'Current User', // In real app, get from auth context
      videoTimestamp: isRealTime ? getCurrentVideoTime() : undefined,
      aiGenerated: false,
      template: template || undefined
    };

    if (template) {
      const templateData = noteTemplates.find(t => t.id === template);
      if (templateData) {
        newNote.title = templateData.name;
        newNote.content = templateData.structure
          .map(section => `## ${section.title}\n${section.placeholder}\n`)
          .join('\n');
      }
    }

    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote.id);
    onNoteChange?.([newNote, ...notes]);

    // Focus on the editor
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  }, [notes, isRealTime, onNoteChange]);

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (activeNote === noteId) {
      setActiveNote(null);
    }
  }, [activeNote]);

  const handleAutoSave = useCallback(async () => {
    try {
      // Simulate auto-save to backend
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, []);

  const acceptSuggestion = useCallback((suggestion: SmartSuggestion) => {
    const noteType: NoteType = suggestion.type === 'action' ? 'action-item' : 'general';
    const tags = [suggestion.type];

    createNewNote(noteType);
    
    // Update the newly created note with suggestion content
    setTimeout(() => {
      if (notes.length > 0) {
        const latestNote = notes[0];
        updateNote(latestNote.id, {
          title: `AI Suggestion: ${suggestion.type}`,
          content: suggestion.content,
          tags,
          aiGenerated: true,
          videoTimestamp: suggestion.timestamp
        });
      }
    }, 100);

    // Remove accepted suggestion
    setSmartSuggestions(prev => prev.filter(s => s.id !== suggestion.id));

    if (suggestion.type === 'action' && onActionItemCreated) {
      onActionItemCreated({
        title: suggestion.content,
        description: '',
        priority: 'medium',
        dueDate: null,
        assignee: null,
        source: 'ai-suggestion'
      });
    }
  }, [notes, createNewNote, updateNote, onActionItemCreated]);

  const getCurrentVideoTime = (): number => {
    // In real implementation, get current video timestamp
    return Math.floor(Math.random() * 3600); // Simulated
  };

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        selectedTags.some(tag => note.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'type':
          return a.type.localeCompare(b.type);
        case 'recent':
          return new Date(b.updatedAt || b.timestamp).getTime() - new Date(a.updatedAt || a.timestamp).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, searchQuery, selectedTags, sortMode]);

  const formatTimestamp = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getNoteTypeIcon = (type: NoteType) => {
    const iconMap = {
      'general': FileText,
      'action-item': Target,
      'decision': CheckCircle2,
      'question': MessageSquare,
      'insight': Lightbulb,
      'risk': AlertCircle
    };
    return iconMap[type] || FileText;
  };

  const getNoteTypeColor = (type: NoteType) => {
    const colorMap = {
      'general': 'text-intel-gray',
      'action-item': 'text-blue-600',
      'decision': 'text-green-600',
      'question': 'text-yellow-600',
      'insight': 'text-purple-600',
      'risk': 'text-red-600'
    };
    return colorMap[type] || 'text-intel-gray';
  };

  const getSuggestionIcon = (type: SmartSuggestion['type']) => {
    const iconMap = {
      action: Target,
      question: MessageSquare,
      insight: Lightbulb,
      'follow-up': ArrowRight
    };
    return iconMap[type];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full space-y-6 ${className}`}
    >
      {/* Header Controls */}
      <Card className="intel-shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-intel-navy flex items-center">
                  Smart Meeting Notes
                  <Badge variant="secondary" className="ml-3 bg-intel-blue/10 text-intel-blue">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-intel-gray mt-1">
                  <span>{notes.length} notes</span>
                  {lastSaved && (
                    <span className="flex items-center">
                      <Save className="h-3 w-3 mr-1" />
                      Saved {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  {isRealTime && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Mic className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(true)}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button
                onClick={() => createNewNote()}
                className="intel-gradient text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-intel-light-gray">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-intel-gray" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 focus:ring-intel-blue focus:border-intel-blue"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-intel-gray" />
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="text-sm border border-intel-light-gray rounded px-2 py-1 focus:ring-intel-blue focus:border-intel-blue"
                >
                  <option value="timestamp">By Time</option>
                  <option value="priority">By Priority</option>
                  <option value="type">By Type</option>
                  <option value="recent">Recently Updated</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                {availableTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${selectedTags.includes(tag.id) ? tag.color + ' text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag.id) 
                          ? prev.filter(t => t !== tag.id)
                          : [...prev, tag.id]
                      );
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className={`text-intel-blue ${showSuggestions ? 'bg-intel-blue/10' : ''}`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Suggestions ({smartSuggestions.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-1"
            >
              <Card className="intel-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-intel-navy flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-intel-blue" />
                    AI Suggestions
                  </CardTitle>
                  <p className="text-sm text-intel-gray">Smart insights from OPEA™</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {smartSuggestions.map(suggestion => {
                    const SuggestionIcon = getSuggestionIcon(suggestion.type);
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 border border-intel-light-gray rounded-lg hover:border-intel-blue/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <SuggestionIcon className="h-4 w-4 text-intel-blue" />
                            <Badge variant="outline" className="text-xs capitalize">
                              {suggestion.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-intel-dark-gray mb-3 leading-relaxed">
                          {suggestion.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-intel-gray">
                            <span className="capitalize">{suggestion.source}</span>
                            {suggestion.timestamp && (
                              <>
                                <span>•</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onTimestampClick?.(suggestion.timestamp!)}
                                  className="text-intel-blue hover:bg-intel-blue/10 px-1 py-0 h-auto text-xs"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  {formatTimestamp(suggestion.timestamp)}
                                </Button>
                              </>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => acceptSuggestion(suggestion)}
                            className="text-intel-blue hover:bg-intel-blue/10 px-2 py-1 h-auto text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Note
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {smartSuggestions.length === 0 && (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-intel-gray mx-auto mb-3" />
                      <p className="text-intel-gray">No suggestions available</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={generateSmartSuggestions}
                        className="text-intel-blue hover:bg-intel-blue/10 mt-2"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes List */}
        <div className={`${showSuggestions ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          {filteredNotes.length === 0 ? (
            <Card className="intel-shadow">
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 text-intel-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-intel-navy mb-2">No notes yet</h3>
                <p className="text-intel-gray mb-6">
                  Start taking notes or use our AI suggestions to capture key insights
                </p>
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => createNewNote()}
                    className="intel-gradient text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplates(true)}
                    className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note, index) => {
              const NoteIcon = getNoteTypeIcon(note.type);
              const isActive = activeNote === note.id;
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className={`intel-shadow hover:intel-shadow-lg transition-all duration-200 cursor-pointer ${
                      isActive ? 'border-intel-blue bg-intel-blue/5' : 'hover:border-intel-blue/50'
                    }`}
                    onClick={() => setActiveNote(isActive ? null : note.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-8 h-8 rounded-lg bg-intel-light-gray flex items-center justify-center ${getNoteTypeColor(note.type)}`}>
                            <NoteIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {note.title ? (
                                <h3 className="font-semibold text-intel-navy truncate">{note.title}</h3>
                              ) : (
                                <h3 className="font-semibold text-intel-gray italic">Untitled Note</h3>
                              )}
                              {note.aiGenerated && (
                                <Badge variant="secondary" className="bg-intel-blue/10 text-intel-blue text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                              {note.isPrivate && (
                                <EyeOff className="h-4 w-4 text-intel-gray" />
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-intel-gray">
                              <span>{new Date(note.timestamp).toLocaleString()}</span>
                              <span>•</span>
                              <span className="capitalize">{note.type.replace('-', ' ')}</span>
                              {note.videoTimestamp && (
                                <>
                                  <span>•</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTimestampClick?.(note.videoTimestamp!);
                                    }}
                                    className="text-intel-blue hover:bg-intel-blue/10 px-1 py-0 h-auto text-xs"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    {formatTimestamp(note.videoTimestamp)}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {note.priority === 'high' && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className="text-intel-gray hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.map(tagId => {
                            const tag = availableTags.find(t => t.id === tagId);
                            return tag ? (
                              <Badge key={tagId} variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {/* Note Preview */}
                        <div className="text-sm text-intel-dark-gray leading-relaxed">
                          {note.content ? (
                            <div className="line-clamp-3">
                              {note.content.split('\n').slice(0, 3).join('\n')}
                            </div>
                          ) : (
                            <span className="italic text-intel-gray">No content</span>
                          )}
                        </div>

                        {/* Expanded Editor */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4 pt-4 border-t border-intel-light-gray"
                            >
                              <Input
                                placeholder="Note title..."
                                value={note.title}
                                onChange={(e) => updateNote(note.id, { title: e.target.value })}
                                className="font-medium focus:ring-intel-blue focus:border-intel-blue"
                              />
                              
                              <Textarea
                                ref={editorRef}
                                placeholder="Write your note here..."
                                value={note.content}
                                onChange={(e) => updateNote(note.id, { content: e.target.value })}
                                rows={6}
                                className="focus:ring-intel-blue focus:border-intel-blue"
                              />
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <select
                                    value={note.type}
                                    onChange={(e) => updateNote(note.id, { type: e.target.value as NoteType })}
                                    className="text-sm border border-intel-light-gray rounded px-2 py-1 focus:ring-intel-blue focus:border-intel-blue"
                                  >
                                    <option value="general">General</option>
                                    <option value="action-item">Action Item</option>
                                    <option value="decision">Decision</option>
                                    <option value="question">Question</option>
                                    <option value="insight">Insight</option>
                                    <option value="risk">Risk</option>
                                  </select>
                                  
                                  <select
                                    value={note.priority}
                                    onChange={(e) => updateNote(note.id, { priority: e.target.value as Note['priority'] })}
                                    className="text-sm border border-intel-light-gray rounded px-2 py-1 focus:ring-intel-blue focus:border-intel-blue"
                                  >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                  </select>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveNote(null)}
                                    className="text-intel-gray hover:bg-gray-100"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Template Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-intel-navy">Note Templates</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(false)}
                    className="text-intel-gray hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {noteTemplates.map(template => (
                    <Card key={template.id} className="cursor-pointer hover:border-intel-blue transition-colors">
                      <CardContent 
                        className="p-4"
                        onClick={() => {
                          createNewNote('general', template.id);
                          setShowTemplates(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-intel-navy mb-1">{template.name}</h3>
                            <p className="text-sm text-intel-gray mb-3">{template.description}</p>
                            <div className="space-y-1">
                              {template.structure.map((section, idx) => (
                                <div key={idx} className="text-xs text-intel-gray flex items-center">
                                  <span className="w-2 h-2 bg-intel-blue rounded-full mr-2"></span>
                                  {section.title}
                                  {section.required && <span className="text-red-500 ml-1">*</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-4 text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}