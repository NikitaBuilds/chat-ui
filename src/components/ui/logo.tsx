import { Brain } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-6 h-6">
        <Brain className="w-6 h-6" />
      </div>
      <span className="text-xl font-semibold leading-7 font-ibm-plex dark:text-slate-100">
        AI Chat
      </span>
    </div>
  );
}
