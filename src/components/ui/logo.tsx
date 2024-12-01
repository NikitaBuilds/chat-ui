import { Brain } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-6 h-6">
        <Brain className="w-6 h-6" />
      </div>
      <span className="font-semibold text-lg">AI Chat</span>
    </div>
  );
}
