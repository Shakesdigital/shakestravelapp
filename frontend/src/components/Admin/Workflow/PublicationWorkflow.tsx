'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  completedAt?: Date;
  comments?: string;
  requirements: string[];
  isRequired: boolean;
}

interface PublicationSchedule {
  publishDate: Date;
  timezone: string;
  publishTime: string;
  autoPublish: boolean;
  socialMediaSchedule?: {
    facebook?: { enabled: boolean; time: string; message: string };
    twitter?: { enabled: boolean; time: string; message: string };
    instagram?: { enabled: boolean; time: string; message: string };
    linkedin?: { enabled: boolean; time: string; message: string };
  };
  emailNotification?: {
    enabled: boolean;
    recipients: string[];
    template: string;
  };
}

interface PublicationWorkflowProps {
  contentId: string;
  contentTitle: string;
  currentStatus: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published';
  onStatusChange: (status: string, schedule?: PublicationSchedule) => void;
  onStepUpdate: (stepId: string, status: string, comments?: string) => void;
}

export default function PublicationWorkflow({
  contentId,
  contentTitle,
  currentStatus,
  onStatusChange,
  onStepUpdate
}: PublicationWorkflowProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'schedule' | 'history'>('workflow');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [schedule, setSchedule] = useState<PublicationSchedule>({
    publishDate: new Date(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    publishTime: '09:00',
    autoPublish: true,
    socialMediaSchedule: {
      facebook: { enabled: true, time: '09:00', message: '' },
      twitter: { enabled: true, time: '09:30', message: '' },
      instagram: { enabled: false, time: '10:00', message: '' },
      linkedin: { enabled: false, time: '10:30', message: '' }
    },
    emailNotification: {
      enabled: true,
      recipients: ['subscribers@shakestravelapp.com'],
      template: 'default'
    }
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [workflowHistory, setWorkflowHistory] = useState<any[]>([]);

  // Initialize workflow steps
  useEffect(() => {
    const defaultSteps: WorkflowStep[] = [
      {
        id: 'content_review',
        name: 'Content Review',
        description: 'Review content for accuracy, grammar, and style',
        icon: '📝',
        status: currentStatus === 'draft' ? 'pending' : 'completed',
        assignee: { id: '1', name: 'Content Editor', avatar: '✏️' },
        requirements: ['Grammar check completed', 'Fact-checking done', 'Style guide followed'],
        isRequired: true
      },
      {
        id: 'seo_optimization',
        name: 'SEO Optimization',
        description: 'Optimize content for search engines',
        icon: '🔍',
        status: currentStatus === 'draft' ? 'pending' : 'completed',
        assignee: { id: '2', name: 'SEO Specialist', avatar: '📊' },
        requirements: ['Meta tags optimized', 'Keywords added', 'Internal links added'],
        isRequired: true
      },
      {
        id: 'visual_content',
        name: 'Visual Content',
        description: 'Add and optimize images, galleries, and media',
        icon: '🖼️',
        status: currentStatus === 'draft' ? 'pending' : 'completed',
        assignee: { id: '3', name: 'Visual Designer', avatar: '🎨' },
        requirements: ['Featured image added', 'Alt text for all images', 'Image optimization done'],
        isRequired: true
      },
      {
        id: 'technical_review',
        name: 'Technical Review',
        description: 'Check technical aspects and performance',
        icon: '⚙️',
        status: 'pending',
        assignee: { id: '4', name: 'Developer', avatar: '💻' },
        requirements: ['Page speed optimized', 'Mobile responsive', 'Cross-browser tested'],
        isRequired: false
      },
      {
        id: 'final_approval',
        name: 'Final Approval',
        description: 'Final approval from content manager',
        icon: '✅',
        status: 'pending',
        assignee: { id: '5', name: 'Content Manager', avatar: '👔' },
        requirements: ['All previous steps completed', 'Quality standards met'],
        isRequired: true
      }
    ];
    setWorkflowSteps(defaultSteps);
  }, [currentStatus]);

  // Mock workflow history
  useEffect(() => {
    const mockHistory = [
      {
        id: '1',
        action: 'Content created',
        user: { name: 'John Doe', avatar: '👤' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        details: 'Initial draft created'
      },
      {
        id: '2',
        action: 'Moved to review',
        user: { name: 'Jane Smith', avatar: '👤' },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        details: 'Content submitted for editorial review'
      }
    ];
    setWorkflowHistory(mockHistory);
  }, []);

  const canProgressToNext = () => {
    const requiredSteps = workflowSteps.filter(step => step.isRequired);
    return requiredSteps.every(step => step.status === 'completed');
  };

  const getOverallProgress = () => {
    const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
    return (completedSteps / workflowSteps.length) * 100;
  };

  const handleStepStatusChange = (stepId: string, newStatus: string, comments?: string) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status: newStatus as any, 
            completedAt: newStatus === 'completed' ? new Date() : undefined,
            comments 
          }
        : step
    ));
    onStepUpdate(stepId, newStatus, comments);
  };

  const handleSchedulePublication = () => {
    onStatusChange('scheduled', schedule);
    setShowScheduleModal(false);
  };

  const handlePublishNow = () => {
    if (canProgressToNext()) {
      onStatusChange('published');
    }
  };

  const formatDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':');
    const scheduledDate = new Date(date);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes));
    return scheduledDate.toLocaleString();
  };

  const tabs = [
    { id: 'workflow', label: 'Workflow', icon: '📋' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'history', label: 'History', icon: '📜' }
  ];

  const statusColors = {
    pending: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              🚀 Publication Workflow
            </h2>
            <HelpTooltip content="Manage your content through the publication workflow. Track progress, schedule publication, and collaborate with your team." />
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getOverallProgress()}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {Math.round(getOverallProgress())}%
              </span>
            </div>

            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentStatus === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              currentStatus === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              currentStatus === 'approved' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              currentStatus === 'in_review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {currentStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
            {contentTitle}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Content ID: {contentId}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AnimatedButton
                  onClick={handlePublishNow}
                  variant="primary"
                  disabled={!canProgressToNext() || currentStatus === 'published'}
                >
                  🚀 Publish Now
                </AnimatedButton>
                
                <AnimatedButton
                  onClick={() => setShowScheduleModal(true)}
                  variant="secondary"
                  disabled={!canProgressToNext() || currentStatus === 'published'}
                >
                  📅 Schedule Publication
                </AnimatedButton>
              </div>

              {!canProgressToNext() && (
                <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                  <span>⚠️</span>
                  <span className="text-sm">Complete required steps to publish</span>
                </div>
              )}
            </div>

            {/* Workflow Steps */}
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 border rounded-lg ${
                    step.status === 'completed' 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : step.status === 'in_progress'
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : step.status === 'failed'
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{step.icon}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {step.name}
                              {step.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[step.status]}`}>
                              {step.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {step.description}
                          </p>
                          {step.assignee && (
                            <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>{step.assignee.avatar}</span>
                              <span>Assigned to {step.assignee.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {step.status === 'pending' && (
                        <AnimatedButton
                          onClick={() => handleStepStatusChange(step.id, 'in_progress')}
                          variant="secondary"
                          size="sm"
                        >
                          Start
                        </AnimatedButton>
                      )}
                      
                      {step.status === 'in_progress' && (
                        <>
                          <AnimatedButton
                            onClick={() => handleStepStatusChange(step.id, 'completed')}
                            variant="primary"
                            size="sm"
                          >
                            Complete
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => handleStepStatusChange(step.id, 'failed')}
                            variant="secondary"
                            size="sm"
                          >
                            Mark Failed
                          </AnimatedButton>
                        </>
                      )}
                      
                      {step.status === 'completed' && (
                        <AnimatedButton
                          onClick={() => handleStepStatusChange(step.id, 'in_progress')}
                          variant="secondary"
                          size="sm"
                        >
                          Reopen
                        </AnimatedButton>
                      )}
                      
                      {step.status === 'failed' && (
                        <AnimatedButton
                          onClick={() => handleStepStatusChange(step.id, 'in_progress')}
                          variant="primary"
                          size="sm"
                        >
                          Retry
                        </AnimatedButton>
                      )}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Requirements:
                    </h5>
                    <ul className="space-y-1">
                      {step.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className={`mr-2 ${
                            step.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {step.status === 'completed' ? '✅' : '🔘'}
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {step.comments && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        💬 {step.comments}
                      </p>
                    </div>
                  )}

                  {step.completedAt && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Completed {step.completedAt.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Publication Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  📅 Publication Schedule
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={schedule.publishDate.toISOString().split('T')[0]}
                      onChange={(e) => setSchedule({
                        ...schedule,
                        publishDate: new Date(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publish Time
                    </label>
                    <input
                      type="time"
                      value={schedule.publishTime}
                      onChange={(e) => setSchedule({
                        ...schedule,
                        publishTime: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={schedule.timezone}
                      onChange={(e) => setSchedule({
                        ...schedule,
                        timezone: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="UTC">UTC</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Africa/Kampala">Kampala (EAT)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoPublish"
                      checked={schedule.autoPublish}
                      onChange={(e) => setSchedule({
                        ...schedule,
                        autoPublish: e.target.checked
                      })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="autoPublish" className="text-sm text-gray-700 dark:text-gray-300">
                      Automatically publish at scheduled time
                    </label>
                  </div>
                </div>
              </div>

              {/* Social Media Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  📱 Social Media Schedule
                </h3>

                {Object.entries(schedule.socialMediaSchedule || {}).map(([platform, settings]) => (
                  <div key={platform} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {platform === 'facebook' ? '📘' :
                           platform === 'twitter' ? '🐦' :
                           platform === 'instagram' ? '📷' : '💼'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {platform}
                        </span>
                      </div>
                      
                      <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => setSchedule({
                          ...schedule,
                          socialMediaSchedule: {
                            ...schedule.socialMediaSchedule,
                            [platform]: { ...settings, enabled: e.target.checked }
                          }
                        })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>

                    {settings.enabled && (
                      <div className="space-y-3">
                        <input
                          type="time"
                          value={settings.time}
                          onChange={(e) => setSchedule({
                            ...schedule,
                            socialMediaSchedule: {
                              ...schedule.socialMediaSchedule,
                              [platform]: { ...settings, time: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <textarea
                          value={settings.message}
                          onChange={(e) => setSchedule({
                            ...schedule,
                            socialMediaSchedule: {
                              ...schedule.socialMediaSchedule,
                              [platform]: { ...settings, message: e.target.value }
                            }
                          })}
                          placeholder={`${platform} post message...`}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Email Notifications */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                📧 Email Notifications
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailEnabled"
                    checked={schedule.emailNotification?.enabled}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      emailNotification: {
                        ...schedule.emailNotification!,
                        enabled: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="emailEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                    Send email notification when published
                  </label>
                </div>

                {schedule.emailNotification?.enabled && (
                  <div className="pl-6 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Recipients
                      </label>
                      <input
                        type="text"
                        value={schedule.emailNotification.recipients.join(', ')}
                        onChange={(e) => setSchedule({
                          ...schedule,
                          emailNotification: {
                            ...schedule.emailNotification!,
                            recipients: e.target.value.split(', ')
                          }
                        })}
                        placeholder="email1@example.com, email2@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Template
                      </label>
                      <select
                        value={schedule.emailNotification.template}
                        onChange={(e) => setSchedule({
                          ...schedule,
                          emailNotification: {
                            ...schedule.emailNotification!,
                            template: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                      >
                        <option value="default">Default Newsletter</option>
                        <option value="travel_guide">Travel Guide Alert</option>
                        <option value="destination_spotlight">Destination Spotlight</option>
                        <option value="travel_tips">Travel Tips & Advice</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                📋 Schedule Summary
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <strong>Publication:</strong> {formatDateTime(schedule.publishDate, schedule.publishTime)} ({schedule.timezone})
                </p>
                {schedule.socialMediaSchedule && Object.entries(schedule.socialMediaSchedule).filter(([_, settings]) => settings.enabled).length > 0 && (
                  <p>
                    <strong>Social Media:</strong> {
                      Object.entries(schedule.socialMediaSchedule)
                        .filter(([_, settings]) => settings.enabled)
                        .map(([platform, settings]) => `${platform} at ${settings.time}`)
                        .join(', ')
                    }
                  </p>
                )}
                {schedule.emailNotification?.enabled && (
                  <p>
                    <strong>Email:</strong> Notify {schedule.emailNotification.recipients.length} recipient(s)
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={handleSchedulePublication}
                variant="primary"
                disabled={!canProgressToNext()}
              >
                📅 Schedule Publication
              </AnimatedButton>
              <AnimatedButton
                onClick={() => {
                  setSchedule({
                    publishDate: new Date(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    publishTime: '09:00',
                    autoPublish: true
                  });
                }}
                variant="secondary"
              >
                Reset to Defaults
              </AnimatedButton>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              📜 Workflow History
            </h3>
            
            <div className="space-y-3">
              {workflowHistory.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-2xl">{entry.user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {entry.user.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {entry.details}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.timestamp.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}