import { defineAgent } from "eve";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import dotenv from "dotenv";

// Load environment variables from .env or .env.local
dotenv.config();
dotenv.config({ path: ".env.local" });

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Default to an accessible, reliable OpenRouter model (e.g. meta-llama/llama-3.3-70b-instruct or anthropic/claude-3.5-sonnet)
// You can also override this via the OPENROUTER_MODEL environment variable
const modelId = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct";

export default defineAgent({
  model: openrouter(modelId),
  modelContextWindowTokens: 128_000,
});
