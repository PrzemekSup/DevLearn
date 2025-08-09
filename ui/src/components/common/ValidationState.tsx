import { CheckCircle } from "lucide-react";

interface ValidationStateProps {
  items: {
    met: boolean;
    text: string;
  }[];
}

export const ValidationState = ({ items }: ValidationStateProps) =>
  items.map((item) => (
    <div className="flex items-center text-sm">
      <CheckCircle
        className={`h-4 w-4 mr-2 ${
          item.met ? "text-green-500" : "text-gray-300"
        }`}
      />
      <span className={item.met ? "text-green-700" : "text-gray-500"}>
        {item.text}
      </span>
    </div>
  ));
