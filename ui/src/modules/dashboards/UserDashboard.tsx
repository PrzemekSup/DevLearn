import { useAuth } from "../../contexts/AuthContext";
import { useProgress } from "../../contexts/ProgressContext";
import { Greetings } from "./components/Greetings";
import { StatsCards } from "./components/StatsCards";
import { QuickActions } from "./components/QuickActions";
import { UserProgress } from "./components/UserProgress";
import { RecentActivity } from "./components/RecentActivity";
import { StudyStreakCard } from "./components/StudyStreakCard";
import { RecentAchievements } from "./RecentAchievements";

const UserDashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Greetings user={user ?? { name: "" }} />

        <StatsCards
          coursesEnrolled={stats.coursesEnrolled}
          lessonsCompleted={stats.lessonsCompleted}
          currentStreak={stats.currentStreak}
          totalXP={stats.totalXP}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UserProgress
              stats={{
                rank: stats.rank,
                totalXP: stats.totalXP,
                nextRankXP: stats.nextRankXP,
              }}
              currentCourses={currentCourses}
            />

            <RecentActivity recentActivity={recentActivity} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
            <RecentAchievements achievements={achievements} />
            <StudyStreakCard currentStreak={stats.currentStreak} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
