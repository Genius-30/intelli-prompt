export const AI_MODELS = {
  openai: {
    logo: "/logos/openai.jpg",
    description: "Best for general tasks and reliable performance",
    color: "#10A37F", // OpenAI teal-green
    models: [
      { id: "gpt-3.5-turbo", name: "gpt-3.5-turbo" },
      { id: "gpt-4o", name: "gpt-4o" },
      { id: "gpt-4o-mini", name: "gpt-4o mini" },
    ],
  },
  anthropic: {
    logo: "/logos/claude.png",
    description: "Great for creativity, long context, and safety",
    color: "#7E22CE", // Purple shade (Claude brand hint)
    models: [
      { id: "claude-3-opus-20240229", name: "claude-3-opus" },
      { id: "claude-3-sonnet-20240229", name: "claude-3-sonnet" },
      { id: "claude-3-haiku-20240307", name: "claude-3-haiku" },
    ],
  },
  perplexity: {
    logo: "/logos/perplexity.png",
    description: "Great for fast factual search and real-time answers",
    color: "#6366F1",
    models: [
      { id: "shisa-ai/shisa-v2-llama3.3-70b:free", name: "perplexity-70B-chat" }, 
      { id: "nvidia/llama-3.3-nemotron-super-49b-v1:free", name: "perplexity-nvidia" } 
    ]
  },
  google: {
    logo: "/logos/gemini.png",
    description: "Great for logical reasoning and fast responses",
    color: "#4285F4", // Google Blue
    models: [
      { id: "google/gemini-2.0-flash-exp:free", name: "gemini-2.0-flash" },
      { id: "google/gemma-3-27b-it:free", name: "gemini-gemma-3" },
      { id: "google/gemma-3-12b-it:free", name: "gemini-gemma-3-12B" },
    ],
  },
  alibaba: {
    logo: "/logos/alibaba.png",
    description: "Great for logical reasoning and fast responses",
    color: "#4285F4", // Google Blue
    models: [
      { id: "qwen/qwen3-4b:free", name: "qwen3-4B" },
      { id: "qwen/qwen2.5-vl-32b-instruct:free", name: "qwen2.5-vl-32b" },
      { id: "qwen/qwen3-8b:free", name: "qwen3-8B-instruct" },
    ],
  },
  mistral: {
    logo: "/logos/mistral.png",
    description: "Best for open-source LLM usage and flexibility",
    color: "#FF6B00", // Neutral dark gray (Mistral has no strong brand color)
    models: [
      { id: "mistralai/mistral-nemo:free", name: "mistral-nemo" },
      { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "mistral-small-3.1-24B" },
      { id: "mistralai/mistral-7b-instruct:free", name: "mistral-7B-instruct" },
    ],
  },
  llama: {
    logo: "/logos/llama.png",
    description: "Great for fast factual search and real-time answers",
    color: "#6366F1",
    models: [
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "llama-3.3-70B-instruct" },
      { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "llama-3.2-11B-vision" },
      { id: "meta-llama/llama-3.2-3b-instruct:free", name: "llama-3.2-3B" },
    ],
  },
  deepseek: {
    logo: "/logos/deepseek.png",
    description: "Great for fast factual search and real-time answers",
    color: "#6366F1",
    models: [
      { id: "deepseek/deepseek-chat-v3-0324:free", name: "deepSeek-v3-0324" },
      { id: "deepseek/deepseek-r1-0528:free", name: "deepSeek-R1-0528" },
      { id: "deepseek/deepseek-r1-distill-llama-70b:free", name: "deepSeek-R1-distill-llama" },
    ],
  },
};
