import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

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

    const stream = await chain.stream({
      message,
      chat_history: messages.map((m: any) => ({
        role: m.role === "user" ? "human" : "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content =
            typeof chunk.content === "string" ? chunk.content : "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readable, {
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
