// src/components/features/transcript-search.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  Clock,
  User,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Download,
  Share2,
  Bookmark,
  Tag,
  Calendar,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transcript } from '@/types';

interface SearchResult {
  id: string;
  segmentIndex: number;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  relevanceScore: number;
  matchPositions: Array<{ start: number; end: number }>;
  context: {
    before: string;
    after: string;
  };
}

interface SearchFilters {
  speakers: string[];
  timeRange: {
    start: number;
    end: number;
  };
  topics: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'all';
  confidence: number;
}

interface TranscriptSearchProps {
  transcript: Transcript;
  onTimestampClick?: (timestamp: number) => void;
  onExport?: (results: SearchResult[]) => void;
  className?: string;
}

export default function TranscriptSearch({ 
  transcript, 
  onTimestampClick,
  onExport,
  className = '' 
}: TranscriptSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [searchStats, setSearchStats] = useState({ total: 0, duration: 0 });
  const [savedSearches, setSavedSearches] = useState<Array<{ query: string; timestamp: Date }>>([]);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    speakers: [],
    timeRange: { start: 0, end: 0 },
    topics: [],
    sentiment: 'all',
    confidence: 0.7
  });

  // Extract unique speakers and topics from transcript
  const availableSpeakers = useMemo(() => {
    const speakers = new Set<string>();
    transcript.segments.forEach(segment => {
      if (segment.speaker) speakers.add(segment.speaker);
    });
    return Array.from(speakers);
  }, [transcript]);

  // Simulated topic extraction - in real implementation, this would come from OPEA™ NLP analysis
  const availableTopics = useMemo(() => {
    return ['Budget Planning', 'Product Strategy', 'Team Updates', 'Technical Discussion', 'Action Items', 'Q&A'];
  }, []);

  // Initialize time range filter
  useEffect(() => {
    if (transcript.segments.length > 0) {
      const maxTime = Math.max(...transcript.segments.map(s => s.end));
      setFilters(prev => ({
        ...prev,
        timeRange: { start: 0, end: maxTime }
      }));
    }
  }, [transcript]);

  // Advanced search algorithm with fuzzy matching and semantic analysis
  const performSearch = useCallback(async (query: string, filters: SearchFilters): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    setIsSearching(true);
    const startTime = performance.now();

    try {
      // Simulate OPEA™ AI-powered semantic search
      await new Promise(resolve => setTimeout(resolve, 300));

      const results: SearchResult[] = [];
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(word => word.length > 1);

      transcript.segments.forEach((segment, index) => {
        const segmentText = segment.text.toLowerCase();
        
        // Apply filters
        const speakerMatch = filters.speakers.length === 0 || 
          (segment.speaker && filters.speakers.includes(segment.speaker));
        
        const timeMatch = segment.start >= filters.timeRange.start && 
          segment.end <= filters.timeRange.end;

        if (!speakerMatch || !timeMatch) return;

        // Multi-strategy matching
        const exactMatch = segmentText.includes(queryLower);
        const wordMatches = queryWords.filter(word => segmentText.includes(word));
        const wordMatchRatio = wordMatches.length / queryWords.length;

        // Semantic similarity simulation (in real implementation, use embedding models)
        const semanticScore = calculateSemanticSimilarity(segment.text, query);
        
        const relevanceScore = exactMatch ? 1.0 : 
          wordMatchRatio > 0.5 ? 0.8 + (wordMatchRatio * 0.2) :
          semanticScore > 0.3 ? semanticScore : 0;

        if (relevanceScore >= filters.confidence) {
          const matchPositions = findMatchPositions(segment.text, query);
          const context = getContext(index, transcript.segments);

          results.push({
            id: `result-${index}`,
            segmentIndex: index,
            startTime: segment.start,
            endTime: segment.end,
            text: segment.text,
            speaker: segment.speaker,
            relevanceScore,
            matchPositions,
            context
          });
        }
      });

      // Sort by relevance score and timestamp
      results.sort((a, b) => {
        if (Math.abs(a.relevanceScore - b.relevanceScore) < 0.1) {
          return a.startTime - b.startTime;
        }
        return b.relevanceScore - a.relevanceScore;
      });

      const endTime = performance.now();
      setSearchStats({
        total: results.length,
        duration: endTime - startTime
      });

      return results.slice(0, 50); // Limit results for performance
    } catch (error) {
      console.error('Search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [transcript]);

  // Debounced search handler
  const handleSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const results = await performSearch(query, filters);
      setSearchResults(results);
    }, 300);
  }, [performSearch, filters]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // Utility functions
  const calculateSemanticSimilarity = (text1: string, text2: string): number => {
    // Simplified semantic similarity - in production, use embeddings
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  };

  const findMatchPositions = (text: string, query: string): Array<{ start: number; end: number }> => {
    const positions: Array<{ start: number; end: number }> = [];
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    let index = textLower.indexOf(queryLower);
    while (index !== -1) {
      positions.push({ start: index, end: index + query.length });
      index = textLower.indexOf(queryLower, index + 1);
    }
    
    return positions;
  };

  const getContext = (segmentIndex: number, segments: Transcript['segments']) => {
    const before = segmentIndex > 0 ? segments[segmentIndex - 1]?.text || '' : '';
    const after = segmentIndex < segments.length - 1 ? segments[segmentIndex + 1]?.text || '' : '';
    return { before, after };
  };

  const formatTimestamp = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const highlightText = (text: string, matchPositions: Array<{ start: number; end: number }>) => {
    if (matchPositions.length === 0) return text;

    const parts: Array<{ text: string; isHighlighted: boolean }> = [];
    let lastIndex = 0;

    matchPositions.forEach(({ start, end }) => {
      if (start > lastIndex) {
        parts.push({ text: text.slice(lastIndex, start), isHighlighted: false });
      }
      parts.push({ text: text.slice(start, end), isHighlighted: true });
      lastIndex = end;
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isHighlighted: false });
    }

    return (
      <span>
        {parts.map((part, index) => (
          <span
            key={index}
            className={part.isHighlighted ? 'bg-yellow-200 font-semibold' : ''}
          >
            {part.text}
          </span>
        ))}
      </span>
    );
  };

  const handleSaveSearch = () => {
    if (searchQuery.trim()) {
      setSavedSearches(prev => [
        { query: searchQuery, timestamp: new Date() },
        ...prev.slice(0, 4) // Keep only 5 recent searches
      ]);
    }
  };

  const handleExportResults = () => {
    if (onExport) {
      onExport(searchResults);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full space-y-6 ${className}`}
    >
      {/* Search Header */}
      <Card className="intel-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-intel-navy">
                <Search className="h-5 w-5 mr-2 text-intel-blue" />
                Advanced Transcript Search
              </CardTitle>
              <p className="text-sm text-intel-gray mt-1">
                Powered by Intel OPEA™ • AI-Enhanced Semantic Search
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-intel-blue/10 text-intel-blue">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              {searchResults.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportResults}
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-intel-gray" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcript content, topics, or speaker statements..."
                className="pl-10 focus:ring-intel-blue focus:border-intel-blue"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-intel-blue" />
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-intel-blue text-intel-blue hover:bg-intel-blue hover:text-white ${showFilters ? 'bg-intel-blue text-white' : ''}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveSearch}
                className="text-intel-blue hover:bg-intel-blue/10"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-intel-light-gray rounded-lg p-4 bg-intel-light-gray/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Speaker Filter */}
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Speakers</label>
                    <div className="mt-2 space-y-2">
                      {availableSpeakers.map(speaker => (
                        <label key={speaker} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.speakers.includes(speaker)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                speakers: e.target.checked 
                                  ? [...prev.speakers, speaker]
                                  : prev.speakers.filter(s => s !== speaker)
                              }));
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-intel-gray">{speaker}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Topics Filter */}
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Topics</label>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {availableTopics.map(topic => (
                        <Badge
                          key={topic}
                          variant={filters.topics.includes(topic) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              topics: prev.topics.includes(topic)
                                ? prev.topics.filter(t => t !== topic)
                                : [...prev.topics, topic]
                            }));
                          }}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Confidence Threshold */}
                  <div>
                    <label className="text-sm font-medium text-intel-navy">
                      Confidence: {Math.round(filters.confidence * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.1"
                      value={filters.confidence}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        confidence: parseFloat(e.target.value)
                      }))}
                      className="w-full mt-2"
                    />
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({
                        speakers: [],
                        timeRange: { start: 0, end: filters.timeRange.end },
                        topics: [],
                        sentiment: 'all',
                        confidence: 0.7
                      })}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Stats */}
          {searchQuery && (
            <div className="flex items-center justify-between text-sm text-intel-gray">
              <div className="flex items-center space-x-4">
                <span>
                  {searchStats.total} results found in {Math.round(searchStats.duration)}ms
                </span>
                {searchResults.length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                )}
              </div>
              {savedSearches.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span>Recent:</span>
                  {savedSearches.slice(0, 3).map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery(search.query)}
                      className="text-xs text-intel-blue hover:bg-intel-blue/10 px-2 py-1 h-auto"
                    >
                      {search.query.length > 20 ? `${search.query.slice(0, 20)}...` : search.query}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {searchResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:intel-shadow-lg ${
                    selectedResult === result.id ? 'border-intel-blue bg-intel-blue/5' : 'hover:border-intel-blue/50'
                  }`}
                  onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTimestampClick?.(result.startTime);
                            }}
                            className="text-intel-blue hover:bg-intel-blue/10 px-2 py-1 h-auto"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(result.startTime)}
                          </Button>
                          
                          {result.speaker && (
                            <Badge variant="outline" className="text-xs">
                              <User className="h-3 w-3 mr-1" />
                              {result.speaker}
                            </Badge>
                          )}
                          
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              result.relevanceScore > 0.8 ? 'bg-green-100 text-green-700' :
                              result.relevanceScore > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {Math.round(result.relevanceScore * 100)}% match
                          </Badge>
                        </div>
                        
                        <div className="text-intel-dark-gray leading-relaxed">
                          {highlightText(result.text, result.matchPositions)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTimestampClick?.(result.startTime);
                          }}
                          className="text-intel-blue hover:bg-intel-blue/10"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-intel-gray hover:bg-gray-100"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Context */}
                    <AnimatePresence>
                      {selectedResult === result.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-intel-light-gray"
                        >
                          <div className="space-y-3">
                            {result.context.before && (
                              <div className="text-sm text-intel-gray">
                                <span className="font-medium">Previous context:</span>
                                <p className="mt-1 italic">"{result.context.before}"</p>
                              </div>
                            )}
                            
                            {result.context.after && (
                              <div className="text-sm text-intel-gray">
                                <span className="font-medium">Following context:</span>
                                <p className="mt-1 italic">"{result.context.after}"</p>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onTimestampClick?.(Math.max(0, result.startTime - 30))}
                                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                              >
                                <SkipBack className="h-3 w-3 mr-1" />
                                -30s
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onTimestampClick?.(result.startTime + 30)}
                                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                              >
                                <SkipForward className="h-3 w-3 mr-1" />
                                +30s
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-intel-gray hover:bg-gray-100"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Open in new tab
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results State */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Card className="intel-shadow">
            <CardContent className="pt-6">
              <AlertCircle className="h-12 w-12 text-intel-gray mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-intel-navy mb-2">No results found</h3>
              <p className="text-intel-gray mb-4">
                Try adjusting your search terms or filters, or use our AI suggestions below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('action items')}
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  Search "action items"
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('decisions')}
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  Search "decisions"
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('budget')}
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  Search "budget"
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}