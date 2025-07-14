import { BookOpen, CheckCircle2, Code2 } from "lucide-react";

export interface Activity {
  id: number;
  type: "lesson" | "task" | "quiz";
  title: string;
  timestamp: Date;
  points: number;
}

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
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
