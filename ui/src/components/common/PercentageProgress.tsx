import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";

interface PercentageProgressProps {
  course: {
    id: string;
    title: string;
    progress: number;
    nextLesson: string;
    totalLessons: number;
    completedLessons: number;
  };
}

const PercentageProgress = ({ course }: PercentageProgressProps) => (
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

export default PercentageProgress;
