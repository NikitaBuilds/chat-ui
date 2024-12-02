"use client";

import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";

interface Props {
  onSelect: (message: string) => void;
  messages: Message[];
  isLoading: boolean;
}

export default function ChatSuggestions({
  onSelect,
  messages,
  isLoading,
}: Props) {
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;
  const suggestions = lastMessage?.suggestions || [];

  const handleSuggestionClick = (suggestion: string) => {
    onSelect(suggestion);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="h-1 w-24 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-white dark:bg-white rounded-full w-1/2 animate-progress" />
          </div>
          Generating suggestions...
        </div>
      </div>
    );
  }

  return suggestions.length > 0 ? (
    <div className="p-4">
      <span className="text-xs font-semibold mb-2 px-4 text-slate-600 dark:text-slate-400">
        Suggested follow-ups
      </span>
      <div className="flex flex-wrap gap-2 mt-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-base leading-7 font-ibm-plex text-slate-700 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  ) : null;
}
