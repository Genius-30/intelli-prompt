export const AI_MODELS = {
  openai: {
    logo: "/logos/openai.jpg",
    models: [
      { id: "gpt-3.5-turbo", name: "GPT‑3.5 Turbo" },
      { id: "gpt-3.5-turbo-16k", name: "GPT‑3.5 Turbo 16K" },
      { id: "gpt-4", name: "GPT‑4" },
      { id: "gpt-4o", name: "GPT‑4 Omni" },
      { id: "gpt-4o-mini", name: "GPT‑4 Omni Mini" },
      { id: "gpt-4o-large", name: "GPT‑4 Omni Large" },
      { id: "gpt-4o-vision", name: "GPT‑4 Omni Vision" },
    ],
  },
  google: {
    logo: "/logos/gemini.png",
    models: [
      { id: "gemini-ultra", name: "Gemini Ultra" },
      { id: "gemini-pro", name: "Gemini Pro" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
      { id: "gemini-1.0-pro", name: "Gemini 1.0 Pro" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-2.0", name: "Gemini 2.0" },
    ],
  },
  mistral: {
    logo: "/logos/mistral.png",
    models: [
      { id: "mistral-small", name: "Mistral Small" },
      { id: "mistral-medium", name: "Mistral Medium" },
      { id: "mistral-large", name: "Mistral Large" },
      { id: "mistral-7b-instruct", name: "Mistral 7B Instruct" },
      { id: "mistral-7b-base", name: "Mistral 7B Base" },
    ],
  },
  anthropic: {
    logo: "/logos/claude.png",
    models: [
      { id: "claude-2", name: "Claude 2" },
      { id: "claude-3-light", name: "Claude 3 Light" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
    ],
  },
  xai: {
    logo: "/logos/grok.png",
    models: [
      { id: "grok-1", name: "Grok 1" },
      { id: "grok-1.5", name: "Grok 1.5" },
      { id: "grok-1.5v", name: "Grok 1.5 Vision" },
    ],
  },
  perplexity: {
    logo: "/logos/perplexity.png",
    models: [
      { id: "pplx-7b-chat", name: "Perplexity 7B Chat" },
      { id: "pplx-70b-chat", name: "Perplexity 70B Chat" },
    ],
  },
};
