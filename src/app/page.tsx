"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/Chat/ChatMessages";
import ChatSuggestions from "@/components/Chat/ChatSuggestions";
import ChatInput from "@/components/Chat/ChatInput";
import { Message } from "@/types/chat";
import { RemainingMessages } from "@/components/Chat/RemainingMessages";
import { useSession } from "next-auth/react";
import { COOKIE_NAME } from "@/lib/utils/messageCounter";
import { ChatHeader } from "@/components/Chat/ChatHeader";

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );
  const { data: session } = useSession();

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Check remaining messages for guests
  useEffect(() => {
    if (!session?.user) {
      const messageCount = parseInt(
        document.cookie.match(`${COOKIE_NAME}=(\\d+)`)?.[1] || "0"
      );
      setRemainingMessages(3 - messageCount);
    }
  }, [session]);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    const messageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: message, id: messageId },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, messages }),
      });

      if (!session?.user) {
        const remaining = response.headers.get("X-Remaining-Messages");
        if (remaining) {
          setRemainingMessages(parseInt(remaining));
        }
      }

      if (response.status === 403) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "You've reached your free message limit. Sign in to continue chatting and unlock unlimited messages!",
            id: crypto.randomUUID(),
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) throw new Error("Network response was not ok");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const assistantMessageId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          id: assistantMessageId,
          isStreaming: true,
        },
      ]);

      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );

          setIsSuggestionsLoading(true);
          // Fetch suggestions after message is complete
          const suggestionsResponse = await fetch("/api/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                ...messages,
                { role: "assistant", content: accumulatedResponse },
              ],
            }),
          });

          const { suggestions } = await suggestionsResponse.json();
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, suggestions } : msg
            )
          );
          setIsSuggestionsLoading(false);
          break;
        }

        const chunk = decoder.decode(value);
        accumulatedResponse += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_messages");
  };

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader onNewChat={handleNewChat} />
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} />
      </div>
      <div className="sticky bottom-0 w-full bg-background">
        <div className="relative">
          <div className="absolute inset-x-0 bottom-full h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
        <RemainingMessages remainingMessages={remainingMessages} />
        <div className="relative bg-background/80 backdrop-blur-sm border-t border-border">
          <ChatSuggestions
            onSelect={handleSendMessage}
            messages={messages}
            isLoading={isSuggestionsLoading}
          />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
