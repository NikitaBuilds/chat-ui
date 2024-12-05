import { Message } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { WelcomeScreen } from "./WelcomeScreen";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  messages: Message[];
}

export default function ChatMessages({ messages }: Props) {
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
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className={`text-xs font-semibold mb-1 px-4`}>
              {message.role === "user" ? "You" : "AI Assistant"}
            </span>
            <div className={`rounded-lg px-4 py-2 relative group`}>
              {message.role === "assistant" && (
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
              {message.isStreaming && !isMarkdown(message.content) ? (
                <p className="text-base leading-7 whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : (
                <ReactMarkdown
                  className="prose dark:prose-invert max-w-none
                    text-base leading-7
                    prose-p:my-2 prose-p:leading-7
                    prose-headings:font-ibm-plex prose-headings:font-semibold
                    prose-pre:my-0 prose-pre:bg-slate-900 
                    prose-code:text-blue-500 dark:prose-code:text-blue-400
                    prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                    prose-strong:font-semibold prose-strong:text-slate-900 dark:prose-strong:text-white"
                  components={{
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !props.inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
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
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
