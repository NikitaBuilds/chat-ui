import { NextResponse } from "next/server";
import { generateSuggestions } from "@/lib/langchain/suggestions";

export async function POST(req: Request) {
  try {
    const { messages, model = "gpt-4" } = await req.json();
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role !== "assistant") {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await generateSuggestions(lastMessage.content, model);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
