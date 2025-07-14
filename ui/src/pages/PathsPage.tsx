import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import {
  Code2,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Users,
  Star,
  ArrowRight,
  Trophy,
  Target,
  Zap,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  technologies: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  progress?: number;
}

const PathsPage: React.FC = () => {
  const { user } = useAuth();
  const { getPathProgress } = useProgress();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('all');

  const learningPaths: LearningPath[] = [
    {
      id: 'react-fundamentals',
      title: 'React Fundamentals',
      description: 'Master the fundamentals of React including components, hooks, state management, and modern patterns.',
      difficulty: 'Beginner',
      duration: '6 weeks',
      lessons: 24,
      students: 15420,
      rating: 4.8,
      technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
      icon: Code2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'typescript-mastery',
      title: 'TypeScript Mastery',
      description: 'Learn TypeScript from basics to advanced concepts including generics, decorators, and type manipulation.',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      lessons: 32,
      students: 12350,
      rating: 4.9,
      technologies: ['TypeScript', 'JavaScript', 'Node.js'],
      icon: Zap,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'dotnet-api',
      title: '.NET Core API Development',
      description: 'Build scalable REST APIs with .NET Core, Entity Framework, and best practices for enterprise applications.',
      difficulty: 'Intermediate',
      duration: '10 weeks',
      lessons: 40,
      students: 8920,
      rating: 4.7,
      technologies: ['.NET', 'C#', 'SQL Server', 'Entity Framework'],
      icon: Database,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'fullstack-javascript',
      title: 'Full-Stack JavaScript',
      description: 'Complete full-stack development with Node.js, Express, React, and MongoDB for modern web applications.',
      difficulty: 'Advanced',
      duration: '12 weeks',
      lessons: 48,
      students: 11200,
      rating: 4.6,
      technologies: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
      icon: Globe,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'mobile-development',
      title: 'React Native Mobile Apps',
      description: 'Create cross-platform mobile applications using React Native with native performance and features.',
      difficulty: 'Advanced',
      duration: '14 weeks',
      lessons: 56,
      students: 6780,
      rating: 4.5,
      technologies: ['React Native', 'JavaScript', 'iOS', 'Android'],
      icon: Smartphone,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'database-design',
      title: 'Database Design & SQL',
      description: 'Master database design principles, SQL optimization, and work with SQL Server for enterprise applications.',
      difficulty: 'Beginner',
      duration: '7 weeks',
      lessons: 28,
      students: 9540,
      rating: 4.4,
      technologies: ['SQL Server', 'Database Design', 'T-SQL'],
      icon: Database,
      color: 'from-teal-500 to-blue-500'
    }
  ];

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const technologies = ['all', 'React', 'JavaScript', 'TypeScript', '.NET', 'C#', 'Node.js', 'SQL Server'];

  const filteredPaths = learningPaths.filter(path => {
    const matchesDifficulty = selectedDifficulty === 'all' || path.difficulty === selectedDifficulty;
    const matchesTechnology = selectedTechnology === 'all' || 
      path.technologies.some(tech => tech.toLowerCase().includes(selectedTechnology.toLowerCase()));
    return matchesDifficulty && matchesTechnology;
  });

  // Add progress data for enrolled paths
  const pathsWithProgress = filteredPaths.map(path => {
    const progress = getPathProgress(path.id);
    return {
      ...path,
      progress: progress ? Math.round((progress.completedLessons.length / path.lessons) * 100) : undefined
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learning Paths
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Structured learning journeys designed to take you from beginner to expert. 
            Choose your path and start building real-world skills today.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedDifficulty === difficulty
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Technology
              </label>
              <div className="flex flex-wrap gap-2">
                {technologies.map(tech => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTechnology(tech)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedTechnology === tech
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tech === 'all' ? 'All Technologies' : tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathsWithProgress.map(path => (
            <PathCard key={path.id} path={path} />
          ))}
        </div>

        {/* No Results */}
        {pathsWithProgress.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No paths found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more learning paths
            </p>
          </div>
        )}

        {/* Call to Action */}
        {!user && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Join thousands of developers advancing their careers with our structured learning paths
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

interface PathCardProps {
  path: LearningPath;
}

const PathCard: React.FC<PathCardProps> = ({ path }) => {
  const { user } = useAuth();
  const Icon = path.icon;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className={`h-32 bg-gradient-to-r ${path.color} relative`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center justify-between">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
              <Icon className="h-6 w-6 text-white" />
            </div>
            {path.progress !== undefined && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">{path.progress}% Complete</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Difficulty */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-3">
            {path.title}
          </h3>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(path.difficulty)}`}>
            {path.difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {path.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{path.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{path.lessons} lessons</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{path.students.toLocaleString()} students</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            <span>{path.rating} rating</span>
          </div>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {path.technologies.slice(0, 3).map(tech => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded"
            >
              {tech}
            </span>
          ))}
          {path.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              +{path.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* Progress Bar (if enrolled) */}
        {path.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{path.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${path.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {user ? (
            <Link
              to={`/course/${path.id}`}
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${path.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105`}
            >
              {path.progress !== undefined ? (
                <>
                  Continue Learning
                  <Play className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Start Path
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Link>
          ) : (
            <Link
              to="/register"
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${path.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105`}
            >
              Enroll Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathsPage;