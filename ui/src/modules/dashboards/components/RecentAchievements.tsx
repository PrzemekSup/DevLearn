import { Award } from "lucide-react";

interface RecentAchievementsProps {
  achievements: {
    id: number;
    title: string;
    description: string;
    unlocked: boolean;
  }[];
}

export const RecentAchievements = ({
  achievements,
}: RecentAchievementsProps) => {
  return (
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
                achievement.unlocked ? "text-yellow-600" : "text-gray-400"
              }`}
            />
            <div>
              <div
                className={`font-medium ${
                  achievement.unlocked ? "text-yellow-900" : "text-gray-500"
                }`}
              >
                {achievement.title}
              </div>
              <div
                className={`text-sm ${
                  achievement.unlocked ? "text-yellow-700" : "text-gray-400"
                }`}
              >
                {achievement.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
