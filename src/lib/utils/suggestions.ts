import { Message } from "@/types/chat";

export function generateContextualSuggestions(messages: Message[]): string[] {
  if (messages.length === 0) {
    return [
      "Can you help me with something?",
      "I have a question about...",
      "I need assistance with...",
    ];
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "assistant") return [];

  // Extract meaningful phrases (3-10 words)
  const phrases = lastMessage.content
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => {
      const wordCount = s.split(/\s+/).length;
      return wordCount >= 3 && wordCount <= 10;
    })
    .slice(0, 3);

  // Generate more natural follow-up questions from user perspective
  return phrases.map((phrase) => {
    if (
      phrase.toLowerCase().includes("can") ||
      phrase.toLowerCase().includes("could")
    ) {
      return `Yes, please help me with that`;
    }
    if (
      phrase.toLowerCase().includes("help") ||
      phrase.toLowerCase().includes("assist")
    ) {
      return `Yes, I need help with...`;
    }
    if (phrase.toLowerCase().includes("example")) {
      return `Can you give me more examples?`;
    }
    if (phrase.toLowerCase().includes("explain")) {
      return `Could you explain that in simpler terms?`;
    }
    return `Tell me more about ${phrase.trim()}`;
  });
}
