import { Trophy } from "lucide-react";
import PercentageProgress from "../../../components/common/PercentageProgress";

interface Course {
  id: string;
  title: string;
  progress: number;
  nextLesson: string;
  totalLessons: number;
  completedLessons: number;
}

interface UserProgressProps {
  stats: {
    rank: string;
    totalXP: number;
    nextRankXP: number;
  };
  currentCourses: Course[];
}

export const UserProgress = ({ stats, currentCourses }: UserProgressProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
        <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg">
          <Trophy className="h-5 w-5 text-purple-600 mr-2" />
          <span className="text-purple-700 font-semibold">{stats.rank}</span>
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
          <PercentageProgress key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
