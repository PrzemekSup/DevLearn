import { BarChart3, BookOpen, Code2 } from "lucide-react";
import {
  ActionBadgeBlue,
  ActionBadgeGreen,
  ActionBadgePurple,
} from "../../../components/common/ActionBadge";

export const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <ActionBadgeBlue linkTo="/paths" icon={Code2}>
          Browse Learning Paths
        </ActionBadgeBlue>
        <ActionBadgePurple linkTo="/blog" icon={BookOpen}>
          Read Articles
        </ActionBadgePurple>
        <ActionBadgeGreen linkTo="/profile" icon={BarChart3}>
          View Analytics
        </ActionBadgeGreen>
      </div>
    </div>
  );
};
