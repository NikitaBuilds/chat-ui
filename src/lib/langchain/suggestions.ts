import { getModel, ModelType } from "@/lib/langchain/models";
import { ChatPromptTemplate } from "@langchain/core/prompts";

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

export async function generateSuggestions(
  lastMessage: string,
  model: ModelType
) {
  try {
    const llm = getModel(model, { temperature: 0.7 });
    const chain = suggestPrompt.pipe(llm);
    const response = await chain.invoke({
      last_message: lastMessage,
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

    return suggestions;
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return [];
  }
}
