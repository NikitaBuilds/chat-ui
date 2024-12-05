import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGroq } from "@langchain/groq";

export type ModelType = "gpt-4" | "claude" | "groq";

interface ModelConfig {
  temperature?: number;
  maxTokens?: number;
}

export function getModel(model: ModelType, config: ModelConfig = {}) {
  const { temperature = 1, maxTokens } = config;

  switch (model) {
    case "claude":
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error(
          "ANTHROPIC_API_KEY is not set in environment variables"
        );
      }
      return new ChatAnthropic({
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        temperature,
        modelName: "claude-3-sonnet-20240229",
        maxTokens: maxTokens || 4096,
      });

    case "groq":
      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set in environment variables");
      }
      return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        // temperature,
        // modelName: "mixtral-8x7b-32768",
        // maxTokens: maxTokens || 4096,
      });

    default: // gpt-4
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set in environment variables");
      }
      return new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature,
        modelName: "gpt-4-turbo-preview",
        maxTokens: maxTokens || 4096,
      });
  }
}
