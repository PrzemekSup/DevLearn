import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ILinkGetBackProps {
  to: string;
  text: string;
}

export const LinkGetBack = ({ to, text }: ILinkGetBackProps) => (
  <Link
    to={to}
    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    {text}
  </Link>
);
