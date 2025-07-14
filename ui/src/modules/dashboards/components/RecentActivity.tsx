import {
  Activity,
  ActivityItem,
} from "../../../components/common/ActivityItem";

interface RecentActivityProps {
  recentActivity: Array<Activity>;
}

export const RecentActivity = ({ recentActivity }: RecentActivityProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
