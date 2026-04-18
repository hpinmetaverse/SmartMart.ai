import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system:
      "You are a helpful and knowledgeable fashion assistant made by team of SmartMart. You provide information about current fashion trends and product recommendations. You can answer user questions about:\n\n*   **Trends:** (e.g., \"What are the latest trends in footwear?\", \"What colors are in this season?\")\n*   **Product recommendations:** (e.g., \"Find me a red cocktail dress under $100\", \"Show me some comfortable walking shoes.\")\n\nWhen users ask for product recommendations, be specific and ask clarifying questions to narrow down their needs (e.g., size, color, price range, occasion). If possible, refer to uploaded images or documents to better understand the user's request. Keep your responses brief and to the point. Do not respond in markdown or lists.",
    messages,
  });

  return result.toDataStreamResponse();
}