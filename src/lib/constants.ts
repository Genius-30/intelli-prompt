export const AI_MODELS = {
  openai: {
    logo: "/logos/openai.jpg",
    description: "Best for general tasks and reliable performance",
    color: "#10A37F", // OpenAI teal-green
    models: [
      { id: "gpt-3.5-turbo", name: "GPT‑3.5 Turbo" },
      { id: "gpt-4o", name: "GPT‑4 Omni" },
      { id: "gpt-4o-mini", name: "GPT‑4 Omni Mini" },
    ],
  },
  anthropic: {
    logo: "/logos/claude.png",
    description: "Great for creativity, long context, and safety",
    color: "#7E22CE", // Purple shade (Claude brand hint)
    models: [
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
    ],
  },
  perplexity: {
    logo: "/logos/perplexity.png",
    description: "Great for fast factual search and real-time answers",
    color: "#6366F1",
    models: [
      { id: "pplx-7b-chat", name: "Perplexity 7B Chat" },
      { id: "pplx-70b-chat", name: "Perplexity 70B Chat" },
    ],
  },
  google: {
    logo: "/logos/gemini.png",
    description: "Great for logical reasoning and fast responses",
    color: "#4285F4", // Google Blue
    models: [
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" },
      { id: "google/gemma-3-27b-it:free", name: "Gemini Gemma 3" },
      { id: "google/gemma-3-12b-it:free", name: "Gemini Gemma 12B" },
    ],
  },
  alibaba: {
    logo: "/logos/alibaba.png",
    description: "Great for logical reasoning and fast responses",
    color: "#4285F4", // Google Blue
    models: [
      { id: "qwen/qwen3-4b:free", name: "Alibaba Qwen3 4B" },
      { id: "qwen/qwen2.5-vl-32b-instruct:free", name: "Alibaba Qwen2.5 VL 32B Instruct " },
      { id: "qwen/qwen3-8b:free", name: "Alibaba Qwen3 8B" },
    ],
  },
  mistral: {
    logo: "/logos/mistral.png",
    description: "Best for open-source LLM usage and flexibility",
    color: "#FF6B00", // Neutral dark gray (Mistral has no strong brand color)
    models: [
      { id: "mistralai/mistral-nemo:free", name: "Mistral Nemo" },
      { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1 24B" },
      { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B Instruct" },
    ],
  },
  llama: {
    logo: "/logos/llama.png",
    description: "Great for fast factual search and real-time answers",
    color: "#6366F1",
    models: [
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B Instruct" },
      { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "Llama 3.2 11B Vision" },
      { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B Instruct" },
    ],
  },
  deepseek: {
    logo: "/logos/deepseek.png",
    description: "Great for fast factual search and real-time answers",
    color: "#6366F1", // Indigo (Perplexity brand hint)
    models: [
      { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek V3 0324" },
      { id: "deepseek/deepseek-r1-0528:free", name: "DeepSeek R1 0528" },
      { id: "deepseek/deepseek-r1-distill-llama-70b:free", name: "DeepSeek: R1 Distill Llama" },
    ],
  },
};
