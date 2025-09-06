import { Share2 } from "lucide-react";

interface IButtonShareProps {
  onClick: () => void;
}

export const ButtonShare = ({ onClick }: IButtonShareProps) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
  >
    <Share2 className="h-5 w-5" />
    <span className="font-medium">Udostępnij</span>
  </button>
);
