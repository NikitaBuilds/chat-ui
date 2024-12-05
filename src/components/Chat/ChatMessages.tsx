import { Message, ChatImage } from "@/types/chat";
import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { WelcomeScreen } from "./WelcomeScreen";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import LoadingMessage from "./LoadingMessage";

interface Props {
  messages: Message[];
  onImageRemove?: (imageId: string) => void;
}

export default function ChatMessages({ messages, onImageRemove }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [animatedWords, setAnimatedWords] = useState<Record<string, number>>(
    {}
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isMarkdown = (text: string) => {
    return /[#*`]|\[.*\]\(.*\)|```/.test(text);
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    messages.forEach((message) => {
      if (message.isStreaming && message.content) {
        const words = message.content.split(" ").length;
        setAnimatedWords((prev) => ({
          ...prev,
          [message.id!]: words,
        }));
      }
    });
  }, [messages]);

  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="h-full px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-xs font-semibold mb-1 px-4">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </span>

                <div className="rounded-lg px-4 py-2 relative group">
                  {message.role === "assistant" && !message.error && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopy(message.content, message.id!)}
                    >
                      {copiedId === message.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {message.error ? (
                    <div className="text-destructive flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>{message.content}</span>
                    </div>
                  ) : (
                    <ReactMarkdown
                      className="prose dark:prose-invert max-w-none"
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                            <SyntaxHighlighter
                              {...(props as any)}
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {messages[messages.length - 1]?.isStreaming && <LoadingMessage />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
