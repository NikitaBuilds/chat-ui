export function cleanAssistantMessage(message: string): string {
  return message
    .replace(/^(AI:|System:|Assistant:)\s*/gi, "")
    .replace(/^I am an AI( assistant)?[.,]?\s*/gi, "")
    .replace(/^As an AI( assistant)?[.,]?\s*/gi, "")
    .replace(/^Let me[.,]?\s*/gi, "")
    .replace(
      /^(I would be happy to|I'd be happy to|I am happy to|I'm happy to)[.,]?\s*/gi,
      ""
    )
    .replace(/^(Of course|Sure|Certainly|Absolutely)[.,!]?\s*/gi, "")
    .trim();
}

export function parseAssistantMessage(content: string): {
  response: string;
  suggestions: string[];
} {
  try {
    const parsed = JSON.parse(content);
    return {
      response: cleanAssistantMessage(parsed.response),
      suggestions: parsed.suggestions || [],
    };
  } catch (e) {
    return {
      response: cleanAssistantMessage(content),
      suggestions: [],
    };
  }
}
