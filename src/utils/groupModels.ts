import { AI_MODELS } from "../lib/constants";

export const GROUPED_MODELS = {
  OpenAI: {
    logo: "/logos/chatgpt.webp",
    models: AI_MODELS.filter((m) => m.id.includes("gpt")),
  },
  Claude: {
    logo: "/logos/claude.png",
    models: AI_MODELS.filter((m) => m.id.includes("claude")),
  },
  Gemini: {
    logo: "/logos/gemini.png",
    models: AI_MODELS.filter((m) => m.id.includes("gemini")),
  },
};
