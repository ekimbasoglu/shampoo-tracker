import React from "react";
import { Loader2 } from "lucide-react"; // or any spinner icon

export const FullPageSpinner: React.FC = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
  </div>
);

export default FullPageSpinner;
