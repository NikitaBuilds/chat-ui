"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/Chat/ChatMessages";
import ChatSuggestions from "@/components/Chat/ChatSuggestions";
import ChatInput from "@/components/Chat/ChatInput";
import { ChatImage, Message } from "@/types/chat";
import { RemainingMessages } from "@/components/Chat/RemainingMessages";
import { useSession } from "next-auth/react";
import { COOKIE_NAME } from "@/lib/utils/messageCounter";
import { ChatHeader } from "@/components/Chat/ChatHeader";
import AttachedImages from "@/components/Chat/AttachedImages";
import { useDropzone } from "react-dropzone";
import { HumanMessage } from "@langchain/core/messages";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );
  const { data: session } = useSession();
  const [currentModel, setCurrentModel] = useState<"gpt-4" | "claude" | "groq">(
    "claude"
  );

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
    const lastMessage = messages[messages.length - 1];
    const images = lastMessage?.images || [];

    // Convert images to base64
    const processedImages = await Promise.all(
      images.map(async (img) => {
        if (img.file) {
          const base64 = await fileToBase64(img.file);
          return {
            ...img,
            base64,
          };
        }
        return img;
      })
    );

    setMessages((prev) => [
      ...prev.filter((msg) => msg.id !== lastMessage?.id),
      { role: "user", content: message, id: messageId, images },
    ]);

    try {
      // Create message content based on whether there are images
      const messageContent =
        images.length > 0
          ? [
              {
                type: "text",
                text: message,
              },
              ...processedImages.map((img) => ({
                type: "image_url",
                image_url: img.base64 || img.url,
              })),
            ]
          : message;

      const base64ImageMessage = new HumanMessage({
        content: messageContent,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: images.length > 0 ? base64ImageMessage : message,
          messages,
          model: currentModel,
          isStreaming: true,
        }),
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
              model: currentModel, // Make sure this is passed
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
          id: crypto.randomUUID(),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_messages");
  };

  const handleModelChange = (model: "gpt-4" | "claude" | "groq") => {
    setCurrentModel(model);
  };

  const handleImagesAdded = (images: ChatImage[]) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: "",
        id: crypto.randomUUID(),
        images: images,
      },
    ]);
  };

  const handleImageRemove = (imageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        images: msg.images?.filter((img) => img.id !== imageId),
      }))
    );
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const processedImages: ChatImage[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
        preview: URL.createObjectURL(file),
      }));
      handleImagesAdded(processedImages);
    },
    [handleImagesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div {...getRootProps()} className="flex flex-col h-full relative">
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-primary/5 flex items-center justify-center pointer-events-none">
          <div className="text-lg font-medium text-primary">
            Drop images here...
          </div>
        </div>
      )}
      <ChatHeader
        onNewChat={handleNewChat}
        currentModel={currentModel}
        onModelChange={handleModelChange}
      />
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} onImageRemove={handleImageRemove} />
      </div>
      <div className="sticky bottom-0 w-full bg-background">
        <div className="relative">
          <div className="absolute inset-x-0 bottom-full h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
        <RemainingMessages remainingMessages={remainingMessages} />
        <div className="relative bg-background/80 backdrop-blur-sm border-t border-border">
          <AttachedImages
            messages={messages}
            onImageRemove={handleImageRemove}
          />
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
