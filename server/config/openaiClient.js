// config/openaiClient.js
// Single shared OpenAI SDK client. The endpoint is OpenAI-compatible, so the
// same client works against OpenAI, OpenRouter, Azure, etc. — controlled purely
// by env (OPENAI_API_KEY / OPENAI_API_BASE_URL / LLM_MODEL).
const OpenAI = require("openai");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL;
const LLM_MODEL = process.env.LLM_MODEL;

if (!OPENAI_API_KEY) {
  // Don't crash the whole server on boot — only the AI features should fail.
  console.warn(
    "[openaiClient] OPENAI_API_KEY is not set. AI service calls will fail until it is configured."
  );
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || "missing-api-key",
  // undefined => SDK falls back to the official OpenAI endpoint.
  baseURL: OPENAI_API_BASE_URL || undefined,
});

module.exports = openai;
module.exports.openai = openai;
module.exports.LLM_MODEL = LLM_MODEL;
