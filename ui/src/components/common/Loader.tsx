import { Loader as LucideLoader } from "lucide-react";

export const Loader = () => (
  <div>
    <LucideLoader className="animate-spin h-5 w-5 mr-2" />
    Wczytywanie...
  </div>
);
