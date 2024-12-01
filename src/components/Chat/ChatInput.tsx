"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface Props {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("message") as HTMLInputElement;
    if (input.value.trim()) {
      onSendMessage(input.value);
      input.value = "";
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          id="message"
          name="message"
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 font-ibm-plex text-base"
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

// <div className="p-4 border-t border-border bg-card/50 backdrop-blur">
// <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
//   <Input
//     id="message"
//     name="message"
//     placeholder="Type your message..."
//     disabled={isLoading}
//     className="flex-1 font-ibm-plex text-base"
//   />
//   <Button
//     type="submit"
//     size="icon"
//     disabled={isLoading}
//     className="bg-blue-500 hover:bg-blue-600 text-white"
//   >
//     {isLoading ? (
//       <Loader2 className="h-4 w-4 animate-spin" />
//     ) : (
//       <Send className="h-4 w-4" />
//     )}
//   </Button>
// </form>
// </div>
// );
