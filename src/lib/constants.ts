export const AI_MODELS = {
  openai: {
    logo: "/logos/openai.jpg",
    description: "Best for general tasks and reliable performance",
    color: "#10A37F", // OpenAI teal-green
    models: [
      { id: "openai/gpt-4", name: "GPT‑4" },
      { id: "openai/gpt-4o", name: "GPT‑4 Omni" },
      { id: "openai/gpt-4.1-nano", name: "GPT Nano" }
    ]
  },
  google: {
    logo: "/logos/gemini.png",
    description: "Great for logical reasoning and fast responses",
    color: "#4285F4", // Google Blue
    models: [
      { id: "google/gemini-1.5-pro-preview", name: "Gemini 1.5 Pro" },
      { id: "google/gemini-flash-1.5", name: "Gemini 1.5 Flash" },
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" }
    ]
  },
  mistral: {
    logo: "/logos/mistral.png",
    description: "Best for open-source LLM usage and flexibility",
    color: "#FF6B00", // Neutral dark gray (Mistral has no strong brand color)
    models: [
      { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B Instruct" },
      { id: "mistralai/mixtral-8x7b-instruct", name: "Mistral 8x7B" },
      { id: "mistralai/mistral-nemo", name: "Mistral-Nemo" }
    ]
  },
  anthropic: {
    logo: "/logos/claude.png",
    description: "Great for creativity, long context, and safety",
    color: "#7E22CE", // Purple shade (Claude brand hint)
    models: [
      { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet" },
      { id: "anthropic/claude-3-opus", name: "Claude Opus 3" },
      { id: "anthropic/claude-3-haiku", name: "Claude Haiku 3" }
    ]
  },
  perplexity: {
    logo: "/logos/perplexity.png",
    description: "Great for fast factual search and real-time answers",
    color: "#6366F1", // Indigo (Perplexity brand hint)
    models: [
      { id: "shisa-ai/shisa-v2-llama3.3-70b:free", name: "Perplexity 70B Chat" }, 
      { id: "nvidia/llama-3.3-nemotron-super-49b-v1:free", name: "Perplexity nvidia" } 
    ]
  },
  llama: {
    logo: "/logos/llama.png",
    description: "LLaMA family—efficient and powerful open‑source models",
    color: "#FF9900",
    models: [
      { id: "meta-llama/llama-3.2-3b-instruct", name: "LLaMA 3.2 3B Instruct" },
      { id: "meta-llama/llama-3.1-8b-instruct", name: "LLaMA 3.1 8B Instruct" },
      { id: "meta-llama/llama-3.1-70b-instruct", name: "LLaMA 3.1 70B Instruct" }
    ]
  },
  deepseek: {
    logo: "/logos/deepseek.png",
    description: "DeepSeek MoE models — strong in reasoning & math",
    color: "#1A73E8",
    models: [
      { id: "deepseek/deepseek-r1", name: "DeepSeek R1" },
      { id: "deepseek/deepseek-r1-distill-llama-8b", name: "DeepSeek R1 Distill LLaMA 8B" }
    ]
  }
};
