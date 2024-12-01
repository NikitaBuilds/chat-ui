import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: "gpt-4-turbo-preview",
});

const suggestPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Generate 3 relevant follow-up questions based on the last message. " +
      "Focus on exploring the topic deeper or clarifying details. " +
      "Format your response as a simple array of strings, like this:\n" +
      '["Question 1?", "Question 2?", "Question 3?"]',
  ],
  ["human", "{last_message}"],
]);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role !== "assistant") {
      return NextResponse.json({ suggestions: [] });
    }

    const chain = suggestPrompt.pipe(llm);
    const response = await chain.invoke({
      last_message: lastMessage.content,
    });

    let suggestions;
    try {
      suggestions = JSON.parse(response.content.toString());
    } catch (e) {
      suggestions = (
        typeof response.content === "string" ? response.content : ""
      )
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0)
        .slice(0, 3);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
