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
    <div className="h-[72px] p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-4 h-full">
        <Input
          id="message"
          name="message"
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 font-ibm-plex text-base h-12"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading}
          className="h-10 w-10 shrink-0"
        >
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
