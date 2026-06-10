// api/services/aiService.js
//
// Shared AI service layer. Other services should depend on THIS module (not the
// raw OpenAI SDK) so model, base URL, retries and structured-output handling are
// configured in exactly one place.
//
// Primary entry point is `generateStructured` — it forces the model to return
// JSON that conforms to a JSON Schema you pass in, parses it, and hands back a
// plain object. There is also `generateText` for free-form text and
// `createChatCompletion` for full control.
//
// Usage:
//   const aiService = require("./aiService");
//
//   const result = await aiService.generateStructured({
//     name: "ProposalSummary",
//     schema: {
//       type: "object",
//       properties: {
//         summary: { type: "string" },
//         risks:   { type: "array", items: { type: "string" } },
//       },
//       required: ["summary", "risks"],
//     },
//     system: "You are a CRM assistant that summarises sales proposals.",
//     prompt: "Summarise this proposal: ...",
//   });
//   // -> { summary: "...", risks: ["..."] }

const openai = require("../../config/openaiClient");

const DEFAULT_MODEL = process.env.LLM_MODEL || "gpt-4o-mini";
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_RETRIES = 2;
// Cap output tokens by default. Some providers (e.g. OpenRouter) otherwise
// reserve the model's FULL context window up front, which fails on credit-
// limited keys. Callers can override per-call via `maxTokens`.
const DEFAULT_MAX_TOKENS = Number(process.env.LLM_MAX_TOKENS) || 2048;

// Base system instruction applied to EVERY call (in addition to any caller
// `system` prompt). Holds org-wide defaults that should hold across all
// consuming services. Override/disable per-call via the `baseSystem` option
// (pass a string to replace it, or `false`/"" to omit it).
const BASE_SYSTEM_PROMPT =
  "When any monetary amount, price, cost, or total is involved and the currency " +
  "is not explicitly stated, assume Indian Rupees (INR, ₹) as the currency.";

/**
 * Build a chat `messages` array from the convenient shorthand options.
 * Accepts either a ready-made `messages` array, or `system` + `prompt` strings.
 * `baseSystem` is prepended as a leading system message so org-wide defaults
 * (e.g. the INR currency rule) apply on every path. Pass `false`/"" to omit it.
 */
const buildMessages = ({ messages, system, prompt, baseSystem = BASE_SYSTEM_PROMPT }) => {
  const built = [];
  if (baseSystem) built.push({ role: "system", content: baseSystem });

  if (Array.isArray(messages) && messages.length > 0) {
    return [...built, ...messages];
  }

  if (system) built.push({ role: "system", content: system });
  if (prompt) built.push({ role: "user", content: prompt });

  // Need at least one non-base message to have something to act on.
  if (built.length === (baseSystem ? 1 : 0)) {
    throw new Error(
      "aiService: provide either `messages`, or `prompt` (optionally with `system`)."
    );
  }
  return built;
};

/**
 * Recursively harden a JSON Schema so OpenAI/OpenRouter "strict" structured
 * outputs accept it: every object gets `additionalProperties: false` and every
 * declared property listed in `required`. Strict mode rejects schemas that omit
 * these, so we normalise them for the caller.
 */
const prepareStrictSchema = (schema) => {
  if (!schema || typeof schema !== "object") return schema;

  if (Array.isArray(schema)) {
    return schema.map(prepareStrictSchema);
  }

  const next = { ...schema };

  if (next.type === "object" && next.properties && typeof next.properties === "object") {
    const properties = {};
    for (const key of Object.keys(next.properties)) {
      properties[key] = prepareStrictSchema(next.properties[key]);
    }
    next.properties = properties;
    next.required = Object.keys(properties);
    if (next.additionalProperties === undefined) {
      next.additionalProperties = false;
    }
  }

  if (next.items) {
    next.items = prepareStrictSchema(next.items);
  }

  return next;
};

/**
 * Parse model output as JSON. Models occasionally wrap JSON in ```json fences
 * even when asked not to, so strip those before parsing.
 */
const safeParseJson = (content) => {
  if (content === null || content === undefined) {
    throw new Error("aiService: model returned empty content.");
  }
  if (typeof content === "object") return content;

  let text = String(content).trim();

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) text = fenced[1].trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch (_) {
        // fall through to throw below
      }
    }
    throw new Error(
      `aiService: failed to parse JSON from model output. Raw: ${text.slice(0, 500)}`
    );
  }
};

/**
 * Low-level chat completion. Thin wrapper over the SDK that injects defaults
 * (model, temperature) and basic retry on transient/rate-limit errors. Returns
 * the raw SDK response so callers can inspect usage, finish_reason, etc.
 *
 * @param {Object} options
 * @param {Array}  [options.messages]
 * @param {string} [options.system]
 * @param {string} [options.prompt]
 * @param {string} [options.model]
 * @param {number} [options.temperature]
 * @param {number} [options.maxTokens]
 * @param {Object} [options.responseFormat]  Passed through as `response_format`.
 * @param {number} [options.maxRetries]
 * @param {Object} [options.extra]           Extra params merged into the request.
 */
const createChatCompletion = async ({
  messages,
  system,
  prompt,
  baseSystem = BASE_SYSTEM_PROMPT,
  model = DEFAULT_MODEL,
  temperature = DEFAULT_TEMPERATURE,
  maxTokens = DEFAULT_MAX_TOKENS,
  responseFormat,
  maxRetries = DEFAULT_MAX_RETRIES,
  extra = {},
} = {}) => {
  const finalMessages = buildMessages({ messages, system, prompt, baseSystem });

  const payload = {
    model,
    messages: finalMessages,
    temperature,
    ...(maxTokens ? { max_tokens: maxTokens } : {}),
    ...(responseFormat ? { response_format: responseFormat } : {}),
    ...extra,
  };

  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await openai.chat.completions.create(payload);
    } catch (error) {
      lastError = error;
      const status = error?.status;
      const retriable =
        status === 429 || status === 408 || (status >= 500 && status < 600);
      if (!retriable || attempt === maxRetries) break;
      // simple linear backoff; avoids hammering the provider on 429/5xx
      const waitMs = 500 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  throw lastError;
};

/**
 * Get a JSON object from the model that conforms to a JSON Schema.
 * This is the main entry point for "structured" responses.
 *
 * @param {Object} options
 * @param {Object} options.schema           JSON Schema for the expected object.
 * @param {string} [options.name]           Schema name (a-z, 0-9, _ only).
 * @param {Array}  [options.messages]       Full chat history (overrides prompt/system).
 * @param {string} [options.system]         System prompt.
 * @param {string} [options.prompt]         User prompt.
 * @param {string} [options.model]
 * @param {number} [options.temperature]
 * @param {number} [options.maxTokens]
 * @param {string|false}[options.baseSystem] Override/disable the org-wide base system prompt.
 * @param {boolean}[options.strict=true]     Enforce strict schema adherence.
 * @param {boolean}[options.includeMeta=false] Return { data, usage, raw } instead of just data.
 * @param {Object} [options.extra]            Extra params merged into the request
 *   (e.g. `{ reasoning: { enabled: false } }` to disable provider reasoning).
 * @returns {Promise<Object>} Parsed object (or { data, usage, raw } if includeMeta).
 */
const generateStructured = async ({
  schema,
  name = "structured_response",
  messages,
  system,
  prompt,
  model,
  temperature,
  maxTokens,
  baseSystem,
  strict = true,
  includeMeta = false,
  maxRetries,
  extra,
} = {}) => {
  try {
    if (!schema || typeof schema !== "object") {
      throw new Error("aiService.generateStructured: a JSON `schema` is required.");
    }

    const safeName = String(name)
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .slice(0, 64);

    const finalSchema = strict ? prepareStrictSchema(schema) : schema;

    const responseFormat = {
      type: "json_schema",
      json_schema: {
        name: safeName,
        strict,
        schema: finalSchema,
      },
    };

    const response = await createChatCompletion({
      messages,
      system,
      prompt,
      ...(baseSystem !== undefined ? { baseSystem } : {}),
      model,
      temperature,
      maxTokens,
      responseFormat,
      maxRetries,
      ...(extra ? { extra } : {}),
    });

    const choice = response?.choices?.[0];
    const content = choice?.message?.content;

    // Some providers surface schema violations via a refusal field.
    if (choice?.message?.refusal) {
      throw new Error(`aiService: model refused request: ${choice.message.refusal}`);
    }

    const data = safeParseJson(content);

    if (includeMeta) {
      return { data, usage: response?.usage, raw: response };
    }
    return data;
  } catch (error) {
    console.error("aiService.generateStructured error:", error.message);
    throw error;
  }
};

/**
 * Get free-form text from the model.
 *
 * @param {Object} options  Same shape as createChatCompletion.
 * @returns {Promise<string>} The assistant message content.
 */
const generateText = async (options = {}) => {
  try {
    const response = await createChatCompletion(options);
    return response?.choices?.[0]?.message?.content ?? "";
  } catch (error) {
    console.error("aiService.generateText error:", error.message);
    throw error;
  }
};

/**
 * Get a JSON object from the model WITHOUT a strict schema (json_object mode).
 * Use when the shape is flexible; prefer `generateStructured` when you can
 * describe the shape up front.
 *
 * @param {Object} options  Same shape as createChatCompletion.
 * @returns {Promise<Object>} Parsed JSON object.
 */
const generateJSON = async (options = {}) => {
  try {
    const response = await createChatCompletion({
      ...options,
      responseFormat: { type: "json_object" },
    });
    return safeParseJson(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error("aiService.generateJSON error:", error.message);
    throw error;
  }
};

module.exports = {
  generateStructured,
  generateText,
  generateJSON,
  createChatCompletion,
  // exported for testing / advanced use
  buildMessages,
  prepareStrictSchema,
  safeParseJson,
  DEFAULT_MODEL,
  BASE_SYSTEM_PROMPT,
};
