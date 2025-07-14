import { Target } from "lucide-react";

interface StudyStreakCardProps {
  currentStreak: number;
}

export const StudyStreakCard = ({ currentStreak }: StudyStreakCardProps) => (
  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border border-orange-200">
    <div className="flex items-center mb-4">
      <div className="bg-orange-100 p-2 rounded-lg mr-3">
        <Target className="h-6 w-6 text-orange-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Study Streak</h3>
        <p className="text-sm text-gray-600">Keep the momentum going!</p>
      </div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold text-orange-600 mb-1">
        {currentStreak}
      </div>
      <div className="text-sm text-gray-600">days in a row</div>
    </div>
  </div>
);
