import { Loader2 } from "lucide-react";

export default function LoadingMessage() {
  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  );
}
