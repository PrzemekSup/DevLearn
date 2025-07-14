import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import {
  BookOpen,
  Code2,
  Trophy,
  Clock,
  TrendingUp,
  Target,
  Calendar,
  Award,
  PlayCircle,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import {
  BadgeBlue,
  BadgePurple,
  BadgeGreen,
} from "../components/common/ActionBadge";
import { StatCard } from "../components/common/StatCard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { progress } = useProgress();

  // Mock data for demonstration
  const stats = {
    coursesEnrolled: 3,
    lessonsCompleted: 24,
    currentStreak: 7,
    totalXP: 1250,
    rank: "Intermediate",
    nextRankXP: 1500,
  };

  const recentActivity: Array<{
    id: number;
    type: "lesson" | "task" | "quiz";
    title: string;
    timestamp: Date;
    points: number;
  }> = [
    {
      id: 1,
      type: "lesson",
      title: "React Hooks Fundamentals",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      points: 25,
    },
    {
      id: 2,
      type: "task",
      title: "Build a Todo App",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      points: 50,
    },
    {
      id: 3,
      type: "quiz",
      title: "TypeScript Basics Quiz",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      points: 30,
    },
  ];

  const currentCourses = [
    {
      id: "react-fundamentals",
      title: "React Fundamentals",
      progress: 75,
      nextLesson: "State Management with Context",
      totalLessons: 12,
      completedLessons: 9,
    },
    {
      id: "typescript-mastery",
      title: "TypeScript Mastery",
      progress: 40,
      nextLesson: "Advanced Types",
      totalLessons: 15,
      completedLessons: 6,
    },
    {
      id: "dotnet-api",
      title: ".NET Core API Development",
      progress: 25,
      nextLesson: "Entity Framework Setup",
      totalLessons: 20,
      completedLessons: 5,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Completed your first lesson",
      unlocked: true,
    },
    {
      id: 2,
      title: "Code Warrior",
      description: "Solved 10 coding challenges",
      unlocked: true,
    },
    {
      id: 3,
      title: "Streak Master",
      description: "Maintained a 7-day streak",
      unlocked: true,
    },
    {
      id: 4,
      title: "TypeScript Pro",
      description: "Completed TypeScript path",
      unlocked: false,
    },
  ];

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Dzień dobry";
    if (hour < 17) return "Dzień dobry";
    return "Dobry wieczór";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getTimeOfDayGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Gotowy/a, aby kontynuować swoją naukową podróż?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Liczba kursów"
            value={stats.coursesEnrolled}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            title="Zaliczonych lekcji"
            value={stats.lessonsCompleted}
            color="green"
          />
          <StatCard
            icon={Target}
            title="Dzienna seria"
            value={stats.currentStreak}
            color="orange"
          />
          <StatCard
            icon={Trophy}
            title="Łączna liczba punktów"
            value={stats.totalXP}
            color="purple"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Progress
                </h2>
                <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-purple-700 font-semibold">
                    {stats.rank}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({stats.totalXP}/{stats.nextRankXP} XP)
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress to next rank
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((stats.totalXP / stats.nextRankXP) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(stats.totalXP / stats.nextRankXP) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Current Courses */}
              <div className="space-y-4">
                {currentCourses.map((course) => (
                  <CourseProgressCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <BadgeBlue linkTo="/paths" icon={Code2}>
                  Browse Learning Paths
                </BadgeBlue>
                <BadgePurple linkTo="/blog" icon={BookOpen}>
                  Read Articles
                </BadgePurple>
                <BadgeGreen linkTo="/profile" icon={BarChart3}>
                  View Analytics
                </BadgeGreen>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-3 rounded-lg ${
                      achievement.unlocked
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <Award
                      className={`h-6 w-6 mr-3 ${
                        achievement.unlocked
                          ? "text-yellow-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <div
                        className={`font-medium ${
                          achievement.unlocked
                            ? "text-yellow-900"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.title}
                      </div>
                      <div
                        className={`text-sm ${
                          achievement.unlocked
                            ? "text-yellow-700"
                            : "text-gray-400"
                        }`}
                      >
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Study Streak
                  </h3>
                  <p className="text-sm text-gray-600">
                    Keep the momentum going!
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {stats.currentStreak}
                </div>
                <div className="text-sm text-gray-600">days in a row</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CourseProgressCardProps {
  course: {
    id: string;
    title: string;
    progress: number;
    nextLesson: string;
    totalLessons: number;
    completedLessons: number;
  };
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ course }) => (
  <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold text-gray-900">{course.title}</h4>
      <span className="text-sm text-gray-600">
        {course.completedLessons}/{course.totalLessons}
      </span>
    </div>
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">Progress</span>
        <span className="text-sm font-medium text-gray-900">
          {course.progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">Next: {course.nextLesson}</span>
      <Link
        to={`/course/${course.id}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Continue
        <PlayCircle className="h-4 w-4 ml-1" />
      </Link>
    </div>
  </div>
);

interface ActivityItemProps {
  activity: {
    id: number;
    type: "lesson" | "task" | "quiz";
    title: string;
    timestamp: Date;
    points: number;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case "lesson":
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case "task":
        return <Code2 className="h-5 w-5 text-green-600" />;
      case "quiz":
        return <CheckCircle2 className="h-5 w-5 text-purple-600" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
      <div className="bg-white p-2 rounded-lg mr-3">{getIcon()}</div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{activity.title}</div>
        <div className="text-sm text-gray-600">
          {getTimeAgo(activity.timestamp)}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-green-600">
          +{activity.points} XP
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
