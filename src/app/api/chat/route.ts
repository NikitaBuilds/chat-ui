import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MAX_FREE_MESSAGES = 3;
const COOKIE_NAME = "guest_messages_count";

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 1,
  modelName: "gpt-4-turbo-preview",
  streaming: true,
});

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful AI assistant focused on providing practical knowledge and solutions. " +
      "Respond naturally in conversational format.\n\n" +
      "Keep responses clear and concise, focusing on delivering accurate information " +
      "in an easy-to-understand way.",
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{message}"],
]);

const chain = RunnableSequence.from([chatPrompt, llm]);
export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json();
    const cookieStore = await cookies();
    const session = await getServerSession(authOptions);

    // Check message limit for guests
    if (!session?.user) {
      const messageCount = parseInt(cookieStore.get(COOKIE_NAME)?.value || "0");
      const remainingMessages = MAX_FREE_MESSAGES - messageCount;

      if (messageCount >= MAX_FREE_MESSAGES) {
        return NextResponse.json(
          { error: "Message limit reached", remainingMessages: 0 },
          { status: 403 }
        );
      }

      // Create the response with stream
      const response = new Response(
        await getStreamingResponse(message, messages, chain),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "X-Remaining-Messages": (remainingMessages - 1).toString(),
          },
        }
      );

      // Set cookie
      response.headers.append(
        "Set-Cookie",
        `${COOKIE_NAME}=${messageCount + 1}; Max-Age=${
          60 * 60 * 24 * 7
        }; Path=/`
      );

      return response;
    }

    // For authenticated users, just return the streaming response
    return new Response(await getStreamingResponse(message, messages, chain), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getStreamingResponse(
  message: string,
  messages: any[],
  chain: any
) {
  const stream = await chain.stream({
    message,
    chat_history: messages.map((m: any) => ({
      role: m.role === "user" ? "human" : "assistant",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = typeof chunk.content === "string" ? chunk.content : "";
        controller.enqueue(encoder.encode(content));
      }
      controller.close();
    },
  });
}
