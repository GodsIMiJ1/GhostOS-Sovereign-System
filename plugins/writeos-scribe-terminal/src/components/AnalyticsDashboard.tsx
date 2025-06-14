"use client";

import { useState, useEffect } from 'react';

interface WritingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  wordCount: number;
  charactersTyped: number;
  timeSpent: number; // in minutes
  documentsCreated: number;
  aiInteractions: number;
}

interface AnalyticsData {
  totalSessions: number;
  totalWordsWritten: number;
  totalTimeSpent: number;
  averageWordsPerSession: number;
  averageSessionLength: number;
  mostProductiveHour: number;
  weeklyProgress: number[];
  aiUsageStats: {
    enhanceCount: number;
    summarizeCount: number;
    analyzeCount: number;
    chatMessages: number;
  };
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [currentSession, setCurrentSession] = useState<WritingSession | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load analytics data from localStorage
    loadAnalyticsData();
    
    // Start tracking current session
    startSession();

    // Update session every minute
    const interval = setInterval(updateCurrentSession, 60000);

    return () => {
      clearInterval(interval);
      endSession();
    };
  }, []);

  const loadAnalyticsData = () => {
    try {
      const stored = localStorage.getItem('writeos-analytics');
      if (stored) {
        setAnalyticsData(JSON.parse(stored));
      } else {
        // Initialize with default data
        const defaultData: AnalyticsData = {
          totalSessions: 0,
          totalWordsWritten: 0,
          totalTimeSpent: 0,
          averageWordsPerSession: 0,
          averageSessionLength: 0,
          mostProductiveHour: 14, // 2 PM default
          weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
          aiUsageStats: {
            enhanceCount: 0,
            summarizeCount: 0,
            analyzeCount: 0,
            chatMessages: 0
          }
        };
        setAnalyticsData(defaultData);
        localStorage.setItem('writeos-analytics', JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const startSession = () => {
    const session: WritingSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      wordCount: 0,
      charactersTyped: 0,
      timeSpent: 0,
      documentsCreated: 0,
      aiInteractions: 0
    };
    setCurrentSession(session);
  };

  const updateCurrentSession = () => {
    if (currentSession) {
      const now = new Date();
      const timeSpent = Math.floor((now.getTime() - currentSession.startTime.getTime()) / 60000);
      
      setCurrentSession(prev => prev ? {
        ...prev,
        timeSpent
      } : null);
    }
  };

  const endSession = () => {
    if (currentSession && analyticsData) {
      const updatedData = {
        ...analyticsData,
        totalSessions: analyticsData.totalSessions + 1,
        totalTimeSpent: analyticsData.totalTimeSpent + currentSession.timeSpent,
        totalWordsWritten: analyticsData.totalWordsWritten + currentSession.wordCount,
        averageWordsPerSession: Math.round((analyticsData.totalWordsWritten + currentSession.wordCount) / (analyticsData.totalSessions + 1)),
        averageSessionLength: Math.round((analyticsData.totalTimeSpent + currentSession.timeSpent) / (analyticsData.totalSessions + 1))
      };

      setAnalyticsData(updatedData);
      localStorage.setItem('writeos-analytics', JSON.stringify(updatedData));
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProductivityLevel = (): string => {
    if (!currentSession) return 'Starting';
    if (currentSession.timeSpent < 5) return 'Warming up';
    if (currentSession.timeSpent < 15) return 'Getting focused';
    if (currentSession.timeSpent < 30) return 'In the zone';
    if (currentSession.timeSpent < 60) return 'Deep work';
    return 'Marathon session!';
  };

  if (!analyticsData) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-flame hover:bg-flame/80 text-white p-3 rounded-full shadow-lg transition-all duration-300 mb-2"
      >
        📊
      </button>

      {/* Analytics Panel */}
      {isVisible && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-flame font-bold text-lg">📊 Writing Analytics</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Current Session */}
          <div className="mb-4 p-3 bg-zinc-800 rounded-lg">
            <h4 className="text-ghostblue font-semibold mb-2">Current Session</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="text-white">{getProductivityLevel()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Time:</span>
                <span className="text-white">{formatTime(currentSession?.timeSpent || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Words:</span>
                <span className="text-white">{currentSession?.wordCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-2xl font-bold text-flame">{analyticsData.totalSessions}</div>
                <div className="text-xs text-zinc-400">Total Sessions</div>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-2xl font-bold text-ghostblue">{analyticsData.totalWordsWritten.toLocaleString()}</div>
                <div className="text-xs text-zinc-400">Words Written</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">{formatTime(analyticsData.totalTimeSpent)}</div>
                <div className="text-xs text-zinc-400">Time Spent</div>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">{analyticsData.averageWordsPerSession}</div>
                <div className="text-xs text-zinc-400">Avg Words/Session</div>
              </div>
            </div>

            {/* AI Usage Stats */}
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h5 className="text-ghostblue font-semibold mb-2 text-sm">AI Assistance</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Enhance:</span>
                  <span className="text-white">{analyticsData.aiUsageStats.enhanceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Analyze:</span>
                  <span className="text-white">{analyticsData.aiUsageStats.analyzeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Summarize:</span>
                  <span className="text-white">{analyticsData.aiUsageStats.summarizeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Chat:</span>
                  <span className="text-white">{analyticsData.aiUsageStats.chatMessages}</span>
                </div>
              </div>
            </div>

            {/* Productivity Insights */}
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h5 className="text-flame font-semibold mb-2 text-sm">💡 Insights</h5>
              <div className="text-xs text-zinc-300 space-y-1">
                <div>• Most productive at {analyticsData.mostProductiveHour}:00</div>
                <div>• Average session: {formatTime(analyticsData.averageSessionLength)}</div>
                <div>• {analyticsData.totalWordsWritten > 1000 ? 'Great progress!' : 'Keep writing!'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
