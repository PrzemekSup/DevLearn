import { AlertCircle } from "lucide-react";

export const Error = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 mt-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">{message}</span>
      </div>
    </div>
  );
};
