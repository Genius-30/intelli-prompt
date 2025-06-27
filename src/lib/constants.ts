export const AI_MODELS = [
  { id: "gpt-4", label: "GPT-4", logo: "/logos/chatgpt.webp" },
  { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", logo: "/logos/chatgpt.webp" },
  { id: "claude-3-opus", label: "Claude 3 Opus", logo: "/logos/claude.png" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", logo: "/logos/gemini.png" },
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    logo: "/logos/gemini.png",
  },
  {
    id: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    logo: "/logos/gemini.png",
  },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", logo: "/logos/gemini.png" },
];

export const MODEL_ENUM = AI_MODELS.map((m) => m.id);
