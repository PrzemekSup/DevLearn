import { InfoIcon } from "lucide-react";

export const Info = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <InfoIcon className="h-5 w-5 text-blue-500 mr-2" />
        <span className="text-blue-700">{message}</span>
      </div>
    </div>
  );
};
