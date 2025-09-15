import { Loader as LucideLoader } from "lucide-react";

export const Loader = () => (
  <div className="flex items-center space-x-1 px-3">
    <LucideLoader className="animate-spin h-5 w-5 mr-2" />
    Ładowanie...
  </div>
);
