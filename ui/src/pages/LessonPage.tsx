import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  BookOpen,
  Clock,
  Target,
  Code2
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'quiz';
  content: string;
  duration: string;
  videoUrl?: string;
  nextLessonId?: string;
  prevLessonId?: string;
  pathId: string;
}

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user } = useAuth();
  const { updateProgress } = useProgress();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  // Mock lesson data
  const lesson: Lesson = {
    id: lessonId || '1',
    title: 'Introduction to React',
    description: 'Learn what React is and why it\'s popular for building user interfaces.',
    type: 'video',
    duration: '15 min',
    pathId: 'react-fundamentals',
    videoUrl: 'https://example.com/video.mp4',
    nextLessonId: '2',
    prevLessonId: undefined,
    content: `
# Introduction to React

React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook (now Meta) and has become one of the most popular frontend frameworks in the world.

## What is React?

React is a **declarative**, **efficient**, and **flexible** JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

### Key Features

1. **Component-Based Architecture**
   - Build encapsulated components that manage their own state
   - Compose them to make complex UIs
   - Component logic is written in JavaScript instead of templates

2. **Virtual DOM**
   - React creates an in-memory virtual DOM
   - When state changes, React compares the virtual DOM with the real DOM
   - Only updates the parts that actually changed

3. **Unidirectional Data Flow**
   - Data flows down from parent to child components
   - Makes applications more predictable and easier to debug

## Why Use React?

### 1. Reusable Components
Components can be reused throughout your application, making development faster and more consistent.

### 2. Large Ecosystem
React has a huge ecosystem of libraries, tools, and community support.

### 3. Performance
The virtual DOM and React's reconciliation algorithm make applications fast and efficient.

### 4. Developer Experience
Great developer tools, hot reloading, and excellent error messages make development enjoyable.

## React vs Other Frameworks

| Feature | React | Angular | Vue |
|---------|-------|---------|-----|
| Learning Curve | Moderate | Steep | Gentle |
| Performance | Excellent | Good | Excellent |
| Ecosystem | Huge | Large | Growing |
| Bundle Size | Small | Large | Small |

## Getting Started

To start using React, you'll need:

- Basic knowledge of HTML, CSS, and JavaScript
- Node.js installed on your computer
- A code editor (VS Code recommended)

In the next lesson, we'll set up your development environment and create your first React application.

## Summary

React is a powerful library that makes building interactive user interfaces easier and more efficient. Its component-based architecture, virtual DOM, and strong ecosystem make it an excellent choice for modern web development.
    `
  };

  useEffect(() => {
    // Simulate video duration
    setDuration(900); // 15 minutes in seconds
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteLesson = () => {
    if (user) {
      updateProgress(lesson.pathId, lesson.id);
      setIsCompleted(true);
    }
  };

  const handleNextLesson = () => {
    if (lesson.nextLessonId) {
      navigate(`/lesson/${lesson.nextLessonId}`);
    }
  };

  const handlePrevLesson = () => {
    if (lesson.prevLessonId) {
      navigate(`/lesson/${lesson.prevLessonId}`);
    }
  };

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Auto-complete when video is 90% watched
          if (newTime >= duration * 0.9 && !isCompleted) {
            handleCompleteLesson();
          }
          return Math.min(newTime, duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, isCompleted]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to={`/course/${lesson.pathId}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mr-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{lesson.title}</h1>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{lesson.duration}</span>
                  {isCompleted && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-4 mr-1" />
                      <span className="text-green-600">Completed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2 inline" />
                Notes
              </button>
              {!isCompleted && (
                <button
                  onClick={handleCompleteLesson}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {lesson.type === 'video' ? (
              /* Video Player */
              <div className="bg-black rounded-2xl overflow-hidden mb-8">
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg">Video Player Placeholder</p>
                    <p className="text-sm opacity-75">In a real implementation, this would be a video player</p>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleProgressChange}
                          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-300 mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleMute}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      
                      <button className="text-white hover:text-blue-400 transition-colors">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Reading Content */
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="prose prose-lg max-w-none">
                  {lesson.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                          {paragraph.slice(2)}
                        </h1>
                      );
                    } else if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                          {paragraph.slice(3)}
                        </h2>
                      );
                    } else if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">
                          {paragraph.slice(4)}
                        </h3>
                      );
                    } else if (paragraph.trim().startsWith('|')) {
                      // Simple table rendering
                      return (
                        <div key={index} className="overflow-x-auto my-4">
                          <table className="min-w-full border border-gray-200">
                            <tbody>
                              <tr>
                                {paragraph.split('|').slice(1, -1).map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border border-gray-200 px-4 py-2 text-sm">
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    } else if (paragraph.trim()) {
                      return (
                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevLesson}
                disabled={!lesson.prevLessonId}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </button>
              
              <button
                onClick={handleNextLesson}
                disabled={!lesson.nextLessonId}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Lesson
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="text-sm font-medium text-gray-900">
                    {lesson.type === 'video' ? Math.round((currentTime / duration) * 100) : isCompleted ? 100 : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${lesson.type === 'video' ? (currentTime / duration) * 100 : isCompleted ? 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {lesson.type === 'video' && (
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Watched:</span>
                    <span>{formatTime(currentTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span>{formatTime(duration - currentTime)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/task/${lesson.id}-task`}
                  className="flex items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
                >
                  <Code2 className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="text-orange-700 font-medium">Practice Task</span>
                  <ArrowRight className="h-4 w-4 text-orange-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group w-full text-left">
                  <Target className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-purple-700 font-medium">Take Quiz</span>
                  <ArrowRight className="h-4 w-4 text-purple-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Notes */}
            {showNotes && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes about this lesson..."
                  rows={6}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;