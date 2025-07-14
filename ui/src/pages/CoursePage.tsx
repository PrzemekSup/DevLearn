import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  Users,
  Star,
  BookOpen,
  Code2,
  Trophy,
  Lock,
  PlayCircle,
  FileText,
  Target
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'quiz' | 'task';
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  lessons: Lesson[];
  overview: string;
  whatYouWillLearn: string[];
  requirements: string[];
}

const CoursePage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { user } = useAuth();
  const { getPathProgress, updateProgress } = useProgress();
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'reviews'>('overview');

  const pathProgress = getPathProgress(pathId || '');

  // Mock course data
  const course: Course = {
    id: pathId || 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Master the fundamentals of React and build modern web applications with confidence.',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    students: 12543,
    duration: '8 hours',
    level: 'Beginner',
    category: 'Frontend Development',
    overview: `
      This comprehensive React course will take you from beginner to confident React developer. 
      You'll learn all the essential concepts including components, state management, hooks, and more.
      
      Through hands-on projects and practical exercises, you'll build real-world applications that 
      demonstrate your React skills. By the end of this course, you'll be ready to build your own 
      React applications and contribute to React projects.
    `,
    whatYouWillLearn: [
      'Understand React components and JSX syntax',
      'Master React hooks including useState, useEffect, and custom hooks',
      'Build interactive user interfaces with event handling',
      'Manage application state effectively',
      'Work with forms and user input validation',
      'Implement routing with React Router',
      'Connect to APIs and handle asynchronous data',
      'Apply best practices for React development'
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Familiarity with ES6+ JavaScript features',
      'A code editor (VS Code recommended)',
      'Node.js installed on your computer'
    ],
    lessons: [
      {
        id: '1',
        title: 'Introduction to React',
        description: 'Learn what React is and why it\'s popular for building user interfaces.',
        type: 'video',
        duration: '15 min',
        completed: pathProgress?.completedLessons.includes('1') || false,
        locked: false
      },
      {
        id: '2',
        title: 'Setting Up Your Development Environment',
        description: 'Install and configure the tools you need for React development.',
        type: 'reading',
        duration: '10 min',
        completed: pathProgress?.completedLessons.includes('2') || false,
        locked: false
      },
      {
        id: '3',
        title: 'Your First React Component',
        description: 'Create your first React component and understand JSX syntax.',
        type: 'video',
        duration: '20 min',
        completed: pathProgress?.completedLessons.includes('3') || false,
        locked: !pathProgress?.completedLessons.includes('2')
      },
      {
        id: '4',
        title: 'Props and Component Communication',
        description: 'Learn how to pass data between components using props.',
        type: 'video',
        duration: '25 min',
        completed: pathProgress?.completedLessons.includes('4') || false,
        locked: !pathProgress?.completedLessons.includes('3')
      },
      {
        id: '5',
        title: 'State Management with useState',
        description: 'Understand how to manage component state with the useState hook.',
        type: 'video',
        duration: '30 min',
        completed: pathProgress?.completedLessons.includes('5') || false,
        locked: !pathProgress?.completedLessons.includes('4')
      },
      {
        id: '6',
        title: 'Handling Events',
        description: 'Learn how to handle user interactions and events in React.',
        type: 'task',
        duration: '45 min',
        completed: pathProgress?.completedLessons.includes('6') || false,
        locked: !pathProgress?.completedLessons.includes('5')
      },
      {
        id: '7',
        title: 'Lists and Keys',
        description: 'Render dynamic lists of data and understand the importance of keys.',
        type: 'video',
        duration: '20 min',
        completed: pathProgress?.completedLessons.includes('7') || false,
        locked: !pathProgress?.completedLessons.includes('6')
      },
      {
        id: '8',
        title: 'Forms and Controlled Components',
        description: 'Build forms and handle user input with controlled components.',
        type: 'task',
        duration: '40 min',
        completed: pathProgress?.completedLessons.includes('8') || false,
        locked: !pathProgress?.completedLessons.includes('7')
      },
      {
        id: '9',
        title: 'useEffect Hook',
        description: 'Learn about side effects and the useEffect hook.',
        type: 'video',
        duration: '35 min',
        completed: pathProgress?.completedLessons.includes('9') || false,
        locked: !pathProgress?.completedLessons.includes('8')
      },
      {
        id: '10',
        title: 'Final Project: Todo Application',
        description: 'Build a complete todo application using all the concepts you\'ve learned.',
        type: 'task',
        duration: '60 min',
        completed: pathProgress?.completedLessons.includes('10') || false,
        locked: !pathProgress?.completedLessons.includes('9')
      }
    ]
  };

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / course.lessons.length) * 100;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-5 w-5" />;
      case 'reading':
        return <FileText className="h-5 w-5" />;
      case 'quiz':
        return <Target className="h-5 w-5" />;
      case 'task':
        return <Code2 className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-blue-600 bg-blue-50';
      case 'reading':
        return 'text-green-600 bg-green-50';
      case 'quiz':
        return 'text-purple-600 bg-purple-50';
      case 'task':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/paths"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Learning Paths
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-2">
                  {course.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{course.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span>{course.level}</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full mr-3">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{course.instructor}</div>
                  <div className="text-sm text-gray-600">Senior React Developer</div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {completedLessons} of {course.lessons.length} lessons completed
                </div>
              </div>

              {user ? (
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                    Continue Learning
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Download Resources
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Sign in to track your progress</p>
                  <Link
                    to="/login"
                    className="inline-block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'lessons', label: 'Lessons' },
              { id: 'reviews', label: 'Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Course Description */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {course.overview}
                </p>
              </div>

              {/* What You'll Learn */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-3">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              <p className="text-gray-600 mt-2">
                {course.lessons.length} lessons • {course.duration} total length
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {course.lessons.map((lesson, index) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index + 1}
                  getLessonIcon={getLessonIcon}
                  getLessonTypeColor={getLessonTypeColor}
                  user={user}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to review this course!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  getLessonIcon: (type: string) => JSX.Element;
  getLessonTypeColor: (type: string) => string;
  user: any;
}

const LessonItem: React.FC<LessonItemProps> = ({ 
  lesson, 
  index, 
  getLessonIcon, 
  getLessonTypeColor, 
  user 
}) => {
  const handleLessonClick = () => {
    if (!lesson.locked && user) {
      // Navigate to lesson
      window.location.href = `/lesson/${lesson.id}`;
    }
  };

  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-colors ${
        lesson.locked ? 'opacity-60' : 'cursor-pointer'
      }`}
      onClick={handleLessonClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="flex items-center mr-4">
            <span className="text-sm font-medium text-gray-500 mr-3">
              {index.toString().padStart(2, '0')}
            </span>
            {lesson.completed ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : lesson.locked ? (
              <Lock className="h-6 w-6 text-gray-400" />
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h3 className="font-semibold text-gray-900 mr-3">{lesson.title}</h3>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLessonTypeColor(lesson.type)}`}>
                {getLessonIcon(lesson.type)}
                <span className="ml-1 capitalize">{lesson.type}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{lesson.description}</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {lesson.duration}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;