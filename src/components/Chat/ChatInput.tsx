import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatImage } from "@/types/chat";
import { Loader2, Send } from "lucide-react";
import { useRef, useEffect } from "react";

interface Props {
  onSendMessage: (message: string, images?: ChatImage[]) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, 48), 96)}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const messageInput = form.message as HTMLTextAreaElement;
    const message = messageInput.value.trim();
    if (message) {
      onSendMessage(message);
      messageInput.value = "";
      resetHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      target.value =
        target.value.substring(0, start) + "\n" + target.value.substring(end);
      target.selectionStart = target.selectionEnd = start + 1;
      adjustHeight();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = (e.target as HTMLTextAreaElement).form;
      if (form) form.requestSubmit();
    }
  };

  useEffect(() => {
    resetHeight();
  }, []);

  return (
    <div className="h-auto min-h-[72px] p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        <Textarea
          ref={textareaRef}
          id="message"
          name="message"
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 font-ibm-plex text-base min-h-[40px] max-h-[96px] resize-none overflow-y-auto py-2.5"
          onKeyDown={handleKeyDown}
          onChange={adjustHeight}
          rows={1}
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
