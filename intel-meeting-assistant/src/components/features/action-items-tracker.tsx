// src/components/features/action-items-tracker.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Star,
  Flag,
  BarChart3,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  Bell,
  RefreshCw,
  Download,
  Share2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  PlayCircle,
  Zap,
  Brain,
  ArrowRight,
  FileText,
  Link,
  Tag,
  Send,
  CheckSquare,
  Square,
  Circle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActionItem, Priority, ActionItemStatus } from '@/types';

interface ActionItemsTrackerProps {
  meetingId: string;
  videoId?: string;
  onTimestampClick?: (timestamp: number) => void;
  onActionItemUpdate?: (actionItem: ActionItem) => void;
  onBulkExport?: (items: ActionItem[]) => void;
  isRealTime?: boolean;
  className?: string;
}

interface FilterOptions {
  status: ActionItemStatus[];
  priority: Priority[];
  assignees: string[];
  tags: string[];
  dueDateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultPriority: Priority;
  defaultDueInDays: number;
  requiredFields: string[];
  tags: string[];
}

type ViewMode = 'list' | 'kanban' | 'calendar' | 'analytics';
type SortMode = 'dueDate' | 'priority' | 'status' | 'assignee' | 'created';

export default function ActionItemsTracker({
  meetingId,
  videoId,
  onTimestampClick,
  onActionItemUpdate,
  onBulkExport,
  isRealTime = false,
  className = ''
}: ActionItemsTrackerProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortMode, setSortMode] = useState<SortMode>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    priority: [],
    assignees: [],
    tags: [],
    dueDateRange: { start: null, end: null }
  });

  const [newActionItem, setNewActionItem] = useState<Partial<ActionItem>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'not-started',
    assignee: null,
    dueDate: null,
    tags: [],
    estimatedHours: null
  });

  // Simulated team members - in real app, fetch from user management
  const teamMembers = [
    { id: 'user-1', name: 'Sarah Chen', email: 'sarah.chen@intel.com', avatar: null },
    { id: 'user-2', name: 'Michael Rodriguez', email: 'michael.rodriguez@intel.com', avatar: null },
    { id: 'user-3', name: 'Emily Watson', email: 'emily.watson@intel.com', avatar: null },
    { id: 'user-4', name: 'David Kim', email: 'david.kim@intel.com', avatar: null },
    { id: 'user-5', name: 'Jessica Park', email: 'jessica.park@intel.com', avatar: null }
  ];

  const taskTemplates: TaskTemplate[] = [
    {
      id: 'follow-up-meeting',
      name: 'Follow-up Meeting',
      description: 'Schedule and conduct follow-up meeting to discuss...',
      defaultPriority: 'medium',
      defaultDueInDays: 7,
      requiredFields: ['title', 'assignee', 'dueDate'],
      tags: ['meeting', 'follow-up']
    },
    {
      id: 'technical-review',
      name: 'Technical Review',
      description: 'Conduct technical review and provide feedback on...',
      defaultPriority: 'high',
      defaultDueInDays: 3,
      requiredFields: ['title', 'assignee', 'description'],
      tags: ['technical', 'review']
    },
    {
      id: 'budget-analysis',
      name: 'Budget Analysis',
      description: 'Analyze budget requirements and provide recommendations for...',
      defaultPriority: 'medium',
      defaultDueInDays: 14,
      requiredFields: ['title', 'assignee', 'dueDate'],
      tags: ['budget', 'analysis', 'finance']
    },
    {
      id: 'stakeholder-update',
      name: 'Stakeholder Update',
      description: 'Prepare and deliver update to stakeholders regarding...',
      defaultPriority: 'high',
      defaultDueInDays: 5,
      requiredFields: ['title', 'assignee', 'dueDate'],
      tags: ['stakeholder', 'communication']
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    // Simulate loading action items from the meeting
    const sampleItems: ActionItem[] = [
      {
        id: 'action-1',
        title: 'Finalize Q2 product roadmap',
        description: 'Complete the product roadmap for Q2 including timeline, resources, and deliverables',
        priority: 'high',
        status: 'in-progress',
        assignee: 'user-1',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['product', 'roadmap', 'q2'],
        estimatedHours: 16,
        videoTimestamp: 1280,
        meetingId,
        source: 'transcript'
      },
      {
        id: 'action-2',
        title: 'Review vendor contracts',
        description: 'Review and approve vendor contracts for the new partnership initiative',
        priority: 'medium',
        status: 'not-started',
        assignee: 'user-3',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['legal', 'contracts', 'partnership'],
        estimatedHours: 8,
        videoTimestamp: 2340,
        meetingId,
        source: 'ai-suggestion'
      },
      {
        id: 'action-3',
        title: 'Prepare budget presentation',
        description: 'Create comprehensive budget presentation for leadership review',
        priority: 'high',
        status: 'completed',
        assignee: 'user-2',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        tags: ['budget', 'presentation', 'leadership'],
        estimatedHours: 12,
        completedAt: new Date(),
        meetingId,
        source: 'manual'
      }
    ];

    setActionItems(sampleItems);
  }, [meetingId]);

  const createActionItem = useCallback((template?: TaskTemplate) => {
    const item: ActionItem = {
      id: `action-${Date.now()}`,
      title: template ? template.name : newActionItem.title || '',
      description: template ? template.description : newActionItem.description || '',
      priority: template ? template.defaultPriority : newActionItem.priority || 'medium',
      status: 'not-started',
      assignee: newActionItem.assignee || null,
      dueDate: template 
        ? new Date(Date.now() + template.defaultDueInDays * 24 * 60 * 60 * 1000)
        : newActionItem.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: template ? template.tags : newActionItem.tags || [],
      estimatedHours: newActionItem.estimatedHours || null,
      meetingId,
      source: 'manual'
    };

    setActionItems(prev => [item, ...prev]);
    setShowNewItemForm(false);
    setShowTemplates(false);
    setNewActionItem({
      title: '',
      description: '',
      priority: 'medium',
      status: 'not-started',
      assignee: null,
      dueDate: null,
      tags: [],
      estimatedHours: null
    });

    onActionItemUpdate?.(item);
  }, [newActionItem, meetingId, onActionItemUpdate]);

  const updateActionItem = useCallback((itemId: string, updates: Partial<ActionItem>) => {
    setActionItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            ...updates, 
            updatedAt: new Date(),
            completedAt: updates.status === 'completed' && item.status !== 'completed' 
              ? new Date() 
              : updates.status !== 'completed' 
                ? undefined 
                : item.completedAt
          }
        : item
    ));

    const updatedItem = actionItems.find(item => item.id === itemId);
    if (updatedItem) {
      onActionItemUpdate?.({ ...updatedItem, ...updates });
    }
  }, [actionItems, onActionItemUpdate]);

  const deleteActionItem = useCallback((itemId: string) => {
    setActionItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  }, []);

  const toggleItemSelection = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleBulkAction = useCallback((action: 'complete' | 'delete' | 'assign' | 'priority', value?: any) => {
    switch (action) {
      case 'complete':
        selectedItems.forEach(itemId => {
          updateActionItem(itemId, { status: 'completed' });
        });
        break;
      case 'delete':
        selectedItems.forEach(itemId => {
          deleteActionItem(itemId);
        });
        break;
      case 'assign':
        selectedItems.forEach(itemId => {
          updateActionItem(itemId, { assignee: value });
        });
        break;
      case 'priority':
        selectedItems.forEach(itemId => {
          updateActionItem(itemId, { priority: value });
        });
        break;
    }
    setSelectedItems([]);
    setBulkActionMode(false);
  }, [selectedItems, updateActionItem, deleteActionItem]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = actionItems;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (item.assignee && teamMembers.find(m => m.id === item.assignee)?.name.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status.includes(item.status));
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(item => filters.priority.includes(item.priority));
    }

    // Apply assignee filter
    if (filters.assignees.length > 0) {
      filtered = filtered.filter(item => item.assignee && filters.assignees.includes(item.assignee));
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item => 
        filters.tags.some(tag => item.tags.includes(tag))
      );
    }

    // Show/hide completed items
    if (!showCompleted) {
      filtered = filtered.filter(item => item.status !== 'completed');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { 'not-started': 1, 'in-progress': 2, 'blocked': 3, 'completed': 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'assignee':
          const aAssignee = a.assignee ? teamMembers.find(m => m.id === a.assignee)?.name || '' : '';
          const bAssignee = b.assignee ? teamMembers.find(m => m.id === b.assignee)?.name || '' : '';
          return aAssignee.localeCompare(bAssignee);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [actionItems, searchQuery, filters, showCompleted, sortMode, teamMembers]);

  const getStatusIcon = (status: ActionItemStatus) => {
    const iconMap = {
      'not-started': Circle,
      'in-progress': Clock,
      'blocked': AlertTriangle,
      'completed': CheckCircle2
    };
    return iconMap[status];
  };

  const getStatusColor = (status: ActionItemStatus) => {
    const colorMap = {
      'not-started': 'text-gray-500',
      'in-progress': 'text-blue-500',
      'blocked': 'text-red-500',
      'completed': 'text-green-500'
    };
    return colorMap[status];
  };

  const getPriorityColor = (priority: Priority) => {
    const colorMap = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colorMap[priority];
  };

  const formatDueDate = (dueDate: Date): string => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  const getOverdueCount = () => {
    const now = new Date();
    return actionItems.filter(item => 
      item.dueDate && 
      new Date(item.dueDate) < now && 
      item.status !== 'completed'
    ).length;
  };

  const getAssigneeName = (assigneeId: string | null): string => {
    if (!assigneeId) return 'Unassigned';
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : 'Unknown';
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
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-intel-navy flex items-center">
                  Action Items Tracker
                  <Badge variant="secondary" className="ml-3 bg-intel-blue/10 text-intel-blue">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-intel-gray mt-1">
                  <span>{actionItems.length} total items</span>
                  <span>•</span>
                  <span>{actionItems.filter(item => item.status !== 'completed').length} active</span>
                  {getOverdueCount() > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-red-600 font-medium">{getOverdueCount()} overdue</span>
                    </>
                  )}
                  {isRealTime && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Zap className="h-3 w-3 mr-1" />
                      Live Tracking
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedItems.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkActionMode(!bulkActionMode)}
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Bulk Actions ({selectedItems.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(true)}
                className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button
                onClick={() => setShowNewItemForm(true)}
                className="intel-gradient text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Item
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-intel-light-gray">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-intel-gray" />
                <Input
                  placeholder="Search action items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 focus:ring-intel-blue focus:border-intel-blue"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-intel-gray" />
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="text-sm border border-intel-light-gray rounded px-2 py-1 focus:ring-intel-blue focus:border-intel-blue"
                >
                  <option value="dueDate">By Due Date</option>
                  <option value="priority">By Priority</option>
                  <option value="status">By Status</option>
                  <option value="assignee">By Assignee</option>
                  <option value="created">By Created Date</option>
                </select>
              </div>

              <Button
                variant={showCompleted ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
                className={showCompleted ? "intel-gradient text-white" : "text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showCompleted ? 'Hide' : 'Show'} Completed
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkExport?.(filteredAndSortedItems)}
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

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {bulkActionMode && selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-intel-light-gray bg-intel-light-gray/30"
            >
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-intel-navy">
                  {selectedItems.length} items selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('complete')}
                    className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                  <select
                    onChange={(e) => handleBulkAction('assign', e.target.value)}
                    className="text-sm border border-intel-light-gray rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="">Assign to...</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                  <select
                    onChange={(e) => handleBulkAction('priority', e.target.value)}
                    className="text-sm border border-intel-light-gray rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="">Set Priority...</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredAndSortedItems.length === 0 ? (
          <Card className="intel-shadow">
            <CardContent className="py-12 text-center">
              <Target className="h-16 w-16 text-intel-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-intel-navy mb-2">No action items found</h3>
              <p className="text-intel-gray mb-6">
                {searchQuery || filters.status.length > 0 || filters.priority.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Create your first action item to start tracking tasks'}
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => setShowNewItemForm(true)}
                  className="intel-gradient text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Action Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedItems.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'completed';
            const isSelected = selectedItems.includes(item.id);
            const isEditing = editingItem === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className={`intel-shadow hover:intel-shadow-lg transition-all duration-200 ${
                    isSelected ? 'border-intel-blue bg-intel-blue/5' : 
                    isOverdue ? 'border-red-300 bg-red-50' : 
                    'hover:border-intel-blue/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Selection Checkbox */}
                        <div className="flex items-center pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(item.id)}
                            className="rounded border-intel-light-gray focus:ring-intel-blue"
                          />
                        </div>

                        {/* Status Icon */}
                        <div className={`w-8 h-8 rounded-lg bg-intel-light-gray flex items-center justify-center ${getStatusColor(item.status)}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-3">
                              <Input
                                value={item.title}
                                onChange={(e) => updateActionItem(item.id, { title: e.target.value })}
                                className="font-medium focus:ring-intel-blue focus:border-intel-blue"
                              />
                              <Textarea
                                value={item.description}
                                onChange={(e) => updateActionItem(item.id, { description: e.target.value })}
                                rows={3}
                                className="focus:ring-intel-blue focus:border-intel-blue"
                              />
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingItem(null)}
                                  className="text-intel-blue border-intel-blue hover:bg-intel-blue hover:text-white"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingItem(null)}
                                  className="text-intel-gray hover:bg-gray-100"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className={`font-semibold ${item.status === 'completed' ? 'line-through text-intel-gray' : 'text-intel-navy'}`}>
                                  {item.title}
                                </h3>
                                
                                <Badge variant="outline" className={`text-xs capitalize ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </Badge>
                                
                                <Badge variant="outline" className="text-xs capitalize">
                                  {item.status.replace('-', ' ')}
                                </Badge>

                                {item.source === 'ai-suggestion' && (
                                  <Badge variant="secondary" className="bg-intel-blue/10 text-intel-blue text-xs">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </div>

                              {item.description && (
                                <p className={`text-sm mb-3 leading-relaxed ${item.status === 'completed' ? 'text-intel-gray' : 'text-intel-dark-gray'}`}>
                                  {item.description}
                                </p>
                              )}

                              <div className="flex items-center space-x-4 text-xs text-intel-gray">
                                {item.assignee && (
                                  <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>{getAssigneeName(item.assignee)}</span>
                                  </div>
                                )}
                                
                                {item.dueDate && (
                                  <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDueDate(new Date(item.dueDate))}</span>
                                  </div>
                                )}
                                
                                {item.estimatedHours && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{item.estimatedHours}h estimated</span>
                                  </div>
                                )}

                                {item.videoTimestamp && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onTimestampClick?.(item.videoTimestamp!)}
                                    className="text-intel-blue hover:bg-intel-blue/10 px-1 py-0 h-auto text-xs"
                                  >
                                    <PlayCircle className="h-3 w-3 mr-1" />
                                    {formatTimestamp(item.videoTimestamp)}
                                  </Button>
                                )}
                              </div>

                              {item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <select
                          value={item.status}
                          onChange={(e) => updateActionItem(item.id, { status: e.target.value as ActionItemStatus })}
                          className="text-xs border border-intel-light-gray rounded px-2 py-1 focus:ring-intel-blue focus:border-intel-blue"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="blocked">Blocked</option>
                          <option value="completed">Completed</option>
                        </select>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(isEditing ? null : item.id)}
                          className="text-intel-blue hover:bg-intel-blue/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteActionItem(item.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* New Item Form Modal */}
      <AnimatePresence>
        {showNewItemForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewItemForm(false)}
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
                  <h2 className="text-xl font-semibold text-intel-navy">Create New Action Item</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewItemForm(false)}
                    className="text-intel-gray hover:bg-gray-100"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-intel-navy">Title *</label>
                    <Input
                      value={newActionItem.title}
                      onChange={(e) => setNewActionItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter action item title..."
                      className="mt-1 focus:ring-intel-blue focus:border-intel-blue"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-intel-navy">Description</label>
                    <Textarea
                      value={newActionItem.description}
                      onChange={(e) => setNewActionItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the action item..."
                      rows={3}
                      className="mt-1 focus:ring-intel-blue focus:border-intel-blue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-intel-navy">Priority</label>
                      <select
                        value={newActionItem.priority}
                        onChange={(e) => setNewActionItem(prev => ({ ...prev, priority: e.target.value as Priority }))}
                        className="mt-1 w-full border border-intel-light-gray rounded px-3 py-2 focus:ring-intel-blue focus:border-intel-blue"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-intel-navy">Assignee</label>
                      <select
                        value={newActionItem.assignee || ''}
                        onChange={(e) => setNewActionItem(prev => ({ ...prev, assignee: e.target.value || null }))}
                        className="mt-1 w-full border border-intel-light-gray rounded px-3 py-2 focus:ring-intel-blue focus:border-intel-blue"
                      >
                        <option value="">Select assignee...</option>
                        {teamMembers.map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-intel-navy">Due Date</label>
                      <Input
                        type="date"
                        value={newActionItem.dueDate ? new Date(newActionItem.dueDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setNewActionItem(prev => ({ 
                          ...prev, 
                          dueDate: e.target.value ? new Date(e.target.value) : null 
                        }))}
                        className="mt-1 focus:ring-intel-blue focus:border-intel-blue"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-intel-navy">Estimated Hours</label>
                      <Input
                        type="number"
                        value={newActionItem.estimatedHours || ''}
                        onChange={(e) => setNewActionItem(prev => ({ 
                          ...prev, 
                          estimatedHours: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        placeholder="0"
                        className="mt-1 focus:ring-intel-blue focus:border-intel-blue"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewItemForm(false)}
                      className="text-intel-gray border-intel-gray hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createActionItem()}
                      disabled={!newActionItem.title}
                      className="intel-gradient text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Action Item
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
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
                  <h2 className="text-xl font-semibold text-intel-navy">Action Item Templates</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(false)}
                    className="text-intel-gray hover:bg-gray-100"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {taskTemplates.map(template => (
                    <Card key={template.id} className="cursor-pointer hover:border-intel-blue transition-colors">
                      <CardContent 
                        className="p-4"
                        onClick={() => createActionItem(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-intel-navy mb-1">{template.name}</h3>
                            <p className="text-sm text-intel-gray mb-3">{template.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-intel-gray">
                              <span className={`px-2 py-1 rounded ${getPriorityColor(template.defaultPriority)}`}>
                                {template.defaultPriority} priority
                              </span>
                              <span>Due in {template.defaultDueInDays} days</span>
                            </div>
                            {template.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {template.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
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