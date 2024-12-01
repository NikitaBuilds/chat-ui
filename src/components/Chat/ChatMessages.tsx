import { Message } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { WelcomeScreen } from "./WelcomeScreen";

interface Props {
  messages: Message[];
}

export default function ChatMessages({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [animatedWords, setAnimatedWords] = useState<Record<string, number>>(
    {}
  );

  const isMarkdown = (text: string) => {
    // Check for common markdown patterns
    return /[#*`]|\[.*\]\(.*\)|```/.test(text);
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
    <div className="h-full overflow-y-auto px-4 py-6 space-y-6">
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
            <span className={`text-xs font-semibold mb-1 px-4 `}>
              {message.role === "user" ? "You" : "AI Assistant"}
            </span>
            <div className={`rounded-lg px-4 py-1 max-w-[80%]`}>
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
