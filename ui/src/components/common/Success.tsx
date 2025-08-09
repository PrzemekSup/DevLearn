import { CheckCircle } from "lucide-react";

export const Success = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <span className="text-green-700">{message}</span>
      </div>
    </div>
  );
};
