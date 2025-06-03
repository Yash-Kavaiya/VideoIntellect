// src/components/features/chat-interface.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle,
  FileText,
  Video,
  PenTool,
  RefreshCw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types';

interface ChatInterfaceProps {
  videoId?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  className?: string;
}

interface SuggestedQuestion {
  id: string;
  text: string;
  category: 'summary' | 'action' | 'detail' | 'analysis';
  icon: React.ElementType;
}

export default function ChatInterface({ 
  videoId, 
  isMinimized = false, 
  onToggleMinimize,
  className = '' 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      id: 'summary',
      text: 'What are the key takeaways from this meeting?',
      category: 'summary',
      icon: FileText
    },
    {
      id: 'action-items',
      text: 'What action items were assigned?',
      category: 'action',
      icon: PenTool
    },
    {
      id: 'decisions',
      text: 'What decisions were made?',
      category: 'detail',
      icon: Sparkles
    },
    {
      id: 'timeline',
      text: 'Can you provide a timeline of the discussion?',
      category: 'analysis',
      icon: Video
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello! I'm your Intel AI Meeting Assistant, powered by OPEA™. I can help you understand your meeting content, find specific information, and generate insights. ${videoId ? 'I have access to your uploaded video and can answer questions about it.' : 'Upload a video to get started with intelligent analysis.'}`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [videoId, messages.length]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to OPEA™ backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: generateContextualResponse(text),
        timestamp: new Date(),
        attachments: videoId ? [{ type: 'video', id: videoId }] : undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('summary') || lowerQuestion.includes('takeaway')) {
      return `Based on the meeting analysis using Intel's OPEA™ platform, here are the key takeaways:

1. **Strategic Initiatives**: Three major product roadmap decisions were finalized
2. **Resource Allocation**: Q2 budget approved with 15% increase for R&D
3. **Timeline Commitments**: Product launch moved to Q3 2025 for additional testing
4. **Team Responsibilities**: New project leads assigned for each workstream

The AI analysis identified 12 action items with clear ownership and deadlines. Would you like me to elaborate on any specific point?`;
    }
    
    if (lowerQuestion.includes('action') || lowerQuestion.includes('task')) {
      return `Here are the action items identified by our AI analysis:

**High Priority:**
• John to finalize vendor agreements by March 15th
• Sarah to conduct market research by March 20th
• Team leads to submit resource requirements by March 10th

**Medium Priority:**
• Update project timeline documentation
• Schedule follow-up stakeholder meetings
• Review compliance requirements

Each item has been automatically assigned timestamps and responsible parties based on the meeting discussion.`;
    }

    if (lowerQuestion.includes('decision')) {
      return `Key decisions made during this meeting:

✅ **Approved**: New product architecture using Intel® Xeon® processors
✅ **Approved**: Partnership with additional cloud providers  
✅ **Postponed**: Marketing campaign launch (moved to Q3)
✅ **Approved**: Additional headcount for engineering team

All decisions were captured with supporting rationale and voting outcomes where applicable.`;
    }

    // Default intelligent response
    return `I've analyzed your question using Intel's OPEA™ AI capabilities. ${videoId ? 'Based on the uploaded meeting video, I can provide specific insights about the discussed topics.' : 'Please upload a meeting video for detailed analysis.'} 

The AI systems detected high confidence in understanding your query. How can I help you dive deeper into the meeting content?`;
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCategoryIcon = (category: SuggestedQuestion['category']) => {
    const iconMap = {
      summary: FileText,
      action: PenTool,
      detail: Sparkles,
      analysis: Video
    };
    return iconMap[category];
  };

  const getCategoryColor = (category: SuggestedQuestion['category']) => {
    const colorMap = {
      summary: 'bg-blue-500',
      action: 'bg-green-500',
      detail: 'bg-purple-500',
      analysis: 'bg-orange-500'
    };
    return colorMap[category];
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <Button
          onClick={onToggleMinimize}
          className="h-14 w-14 rounded-full intel-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col h-full bg-white rounded-lg border border-intel-light-gray intel-shadow-lg ${className}`}
    >
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b border-intel-light-gray bg-intel-light-gray rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 intel-gradient rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Meeting Assistant</CardTitle>
              <p className="text-sm text-intel-gray">Powered by Intel OPEA™</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Online
            </Badge>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-intel-gray hover:text-intel-blue"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-intel-blue' : 'intel-gradient'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 relative group ${
                      message.type === 'user' 
                        ? 'bg-intel-blue text-white' 
                        : 'bg-intel-light-gray text-intel-dark-gray'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${
                          message.type === 'user' ? 'text-white/70' : 'text-intel-gray'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ${
                            message.type === 'user' ? 'text-white hover:bg-white/20' : 'text-intel-gray hover:bg-intel-gray/10'
                          }`}
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      {message.attachments && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.attachments.map((attachment, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {attachment.type === 'video' && <Video className="h-3 w-3 mr-1" />}
                              {attachment.type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full intel-gradient flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-intel-light-gray rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-intel-blue" />
                      <span className="text-sm text-intel-gray">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && !isLoading && (
            <div className="p-4 border-t border-intel-light-gray bg-gray-50">
              <h4 className="text-sm font-medium text-intel-navy mb-3">Suggested Questions:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((question) => {
                  const IconComponent = question.icon;
                  return (
                    <Button
                      key={question.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(question.text)}
                      className="text-left justify-start text-sm border-intel-blue/20 hover:border-intel-blue hover:bg-intel-blue/5"
                    >
                      <div className={`w-4 h-4 rounded ${getCategoryColor(question.category)} flex items-center justify-center mr-2`}>
                        <IconComponent className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="truncate">{question.text}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t border-intel-light-gray">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your meeting content..."
                disabled={isLoading}
                className="flex-1 focus:ring-intel-blue focus:border-intel-blue"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="intel-gradient text-white hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-intel-gray mt-2 text-center">
              Powered by Intel OPEA™ • Enterprise AI Platform
            </p>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
}