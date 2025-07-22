import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Code2,
  Award,
  TrendingUp,
  Settings,
  Edit3,
  Save,
  X,
  BarChart3,
  Clock,
  Star,
  CheckCircle2
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface LearningStats {
  totalLessons: number;
  completedLessons: number;
  totalTasks: number;
  completedTasks: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { progress } = useProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: '',
    bio: 'Passionate developer learning new technologies every day.',
    location: 'San Francisco, CA',
    website: 'https://github.com/johndoe'
  });

  // Calculate learning statistics
  const learningStats: LearningStats = {
    totalLessons: 120,
    completedLessons: progress.reduce((sum, p) => sum + p.completedLessons.length, 0),
    totalTasks: 45,
    completedTasks: progress.reduce((sum, p) => sum + p.completedTasks.length, 0),
    totalXP: progress.reduce((sum, p) => sum + p.score, 0),
    currentStreak: 7,
    longestStreak: 15,
    averageScore: 85
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first lesson',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      unlockedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      title: 'Code Warrior',
      description: 'Solved 10 coding challenges',
      icon: Code2,
      color: 'from-green-500 to-green-600',
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintained a 7-day learning streak',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      unlockedAt: new Date('2024-01-20')
    },
    {
      id: '4',
      title: 'React Expert',
      description: 'Completed the React Fundamentals path',
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      unlockedAt: new Date('2024-01-25')
    },
    {
      id: '5',
      title: 'TypeScript Pro',
      description: 'Master TypeScript concepts',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      progress: 75,
      maxProgress: 100
    },
    {
      id: '6',
      title: 'Full Stack Developer',
      description: 'Complete both frontend and backend paths',
      icon: Award,
      color: 'from-red-500 to-red-600',
      progress: 40,
      maxProgress: 100
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'lesson',
      title: 'React Hooks Advanced Patterns',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      points: 25
    },
    {
      id: 2,
      type: 'task',
      title: 'Build a Todo App with TypeScript',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      points: 50
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Earned "Streak Master" achievement',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      points: 100
    },
    {
      id: 4,
      type: 'lesson',
      title: 'Advanced TypeScript Types',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      points: 30
    }
  ];

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: user?.name || '',
      email: '',
      bio: 'Passionate developer learning new technologies every day.',
      location: 'San Francisco, CA',
      website: 'https://github.com/johndoe'
    });
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case 'task':
        return <Code2 className="h-5 w-5 text-green-600" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="relative px-8 pb-8">
            <div className="flex items-end -mt-16 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full border-4 border-white">
                <User className="h-16 w-16 text-white" />
              </div>
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-gray-900">{editedProfile.name}</h1>
                    )}
                    <div className="flex items-center text-gray-600 mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span>{editedProfile.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-600">{editedProfile.bio}</p>
                )}
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Settings className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span>{editedProfile.location}</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{learningStats.totalXP}</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{learningStats.currentStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{learningStats.completedLessons}</div>
                    <div className="text-sm text-gray-600">Lessons</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{learningStats.completedTasks}</div>
                    <div className="text-sm text-gray-600">Tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Statistics */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Statistics</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Lessons Progress</span>
                    <span className="text-sm text-gray-500">
                      {learningStats.completedLessons}/{learningStats.totalLessons}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(learningStats.completedLessons / learningStats.totalLessons) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Tasks Progress</span>
                    <span className="text-sm text-gray-500">
                      {learningStats.completedTasks}/{learningStats.totalTasks}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(learningStats.completedTasks / learningStats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <StatCard
                  icon={TrendingUp}
                  title="Average Score"
                  value={`${learningStats.averageScore}%`}
                  color="text-blue-600"
                />
                <StatCard
                  icon={Target}
                  title="Current Streak"
                  value={`${learningStats.currentStreak} days`}
                  color="text-orange-600"
                />
                <StatCard
                  icon={Trophy}
                  title="Longest Streak"
                  value={`${learningStats.longestStreak} days`}
                  color="text-purple-600"
                />
                <StatCard
                  icon={BarChart3}
                  title="Total XP"
                  value={learningStats.totalXP.toString()}
                  color="text-green-600"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-lg mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-600">{getTimeAgo(activity.timestamp)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">+{activity.points} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg">
    <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
    <div className="text-lg font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{title}</div>
  </div>
);

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const Icon = achievement.icon;
  const isUnlocked = !!achievement.unlockedAt;
  const hasProgress = achievement.progress !== undefined && achievement.maxProgress !== undefined;

  return (
    <div className={`p-4 rounded-lg border ${
      isUnlocked 
        ? 'border-yellow-200 bg-yellow-50' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-start">
        <div className={`bg-gradient-to-r ${achievement.color} p-2 rounded-lg mr-3 ${
          !isUnlocked && !hasProgress ? 'opacity-50' : ''
        }`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className={`font-semibold ${
            isUnlocked ? 'text-yellow-900' : 'text-gray-700'
          }`}>
            {achievement.title}
          </div>
          <div className={`text-sm ${
            isUnlocked ? 'text-yellow-700' : 'text-gray-500'
          }`}>
            {achievement.description}
          </div>
          
          {hasProgress && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs text-gray-600">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`bg-gradient-to-r ${achievement.color} h-1 rounded-full transition-all duration-300`}
                  style={{ width: `${(achievement.progress! / achievement.maxProgress!) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {isUnlocked && achievement.unlockedAt && (
            <div className="flex items-center mt-2 text-xs text-yellow-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Unlocked {achievement.unlockedAt.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;