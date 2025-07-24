import {
  Bot,
  Brain,
  Cpu,
  Flame,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

export const AI_MODELS = {
  google: {
    name: "Google",
    icon: Sparkles,
    description: "Fast reasoning",
    color: "#0B57D0",
    premium: false,
    comingSoon: false,
    models: [
      {
        id: "google/gemini-2.0-flash-exp:free",
        name: "Gemini 2.0 Flash",
        description: "Latest model",
      },
      {
        id: "google/gemma-3-27b-it:free",
        name: "Gemma 3 27B",
        description: "Instruction tuned",
      },
      {
        id: "google/gemma-3-12b-it:free",
        name: "Gemma 3 12B",
        description: "Compact version",
      },
    ],
  },
  llama: {
    name: "Meta",
    icon: Target,
    description: "Open research",
    color: "#0082FB",
    premium: false,
    comingSoon: false,
    models: [
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "Llama 3.3 70B",
        description: "Large instruction model",
      },
      {
        id: "meta-llama/llama-3.2-11b-vision-instruct:free",
        name: "Llama 3.2 Vision",
        description: "Multimodal capabilities",
      },
      {
        id: "meta-llama/llama-3.2-3b-instruct:free",
        name: "Llama 3.2 3B",
        description: "Efficient instruction model",
      },
    ],
  },
  deepseek: {
    name: "DeepSeek",
    icon: Cpu,
    description: "Advanced reasoning",
    color: "#4861DA",
    premium: false,
    comingSoon: false,
    models: [
      {
        id: "deepseek/deepseek-chat-v3-0324:free",
        name: "DeepSeek V3",
        description: "Latest chat model",
      },
      {
        id: "deepseek/deepseek-r1-0528:free",
        name: "DeepSeek R1",
        description: "Reasoning focused",
      },
      {
        id: "deepseek/deepseek-r1-distill-llama-70b:free",
        name: "R1 Distill 70B",
        description: "Distilled reasoning model",
      },
    ],
  },
  alibaba: {
    name: "Alibaba",
    icon: Zap,
    description: "Efficient processing",
    color: "#FF6A00",
    premium: false,
    comingSoon: false,
    models: [
      {
        id: "qwen/qwen3-4b:free",
        name: "Qwen3 4B",
        description: "Lightweight model",
      },
      {
        id: "qwen/qwen2.5-vl-32b-instruct:free",
        name: "Qwen2.5 VL 32B",
        description: "Vision-language model",
      },
      {
        id: "qwen/qwen3-8b:free",
        name: "Qwen3 8B",
        description: "Balanced performance",
      },
    ],
  },
  mistral: {
    name: "Mistral",
    icon: Flame,
    description: "Open-source power",
    color: "#FA6325",
    premium: false,
    comingSoon: false,
    models: [
      {
        id: "mistralai/mistral-nemo:free",
        name: "Mistral Nemo",
        description: "Latest release",
      },
      {
        id: "mistralai/mistral-small-3.1-24b-instruct:free",
        name: "Mistral Small 3.1",
        description: "Instruction optimized",
      },
      {
        id: "mistralai/mistral-7b-instruct:free",
        name: "Mistral 7B",
        description: "Compact & efficient",
      },
    ],
  },
  openai: {
    name: "OpenAI",
    icon: Bot,
    description: "Reliable & versatile",
    color: "#10A37F",
    premium: false,
    comingSoon: true,
    models: [
      {
        id: "gpt-3.5-turbo",
        name: "GPT‑3.5 Turbo",
        description: "Fast and efficient",
      },
      { id: "gpt-4o", name: "GPT‑4 Omni", description: "Most capable model" },
      {
        id: "gpt-4o-mini",
        name: "GPT‑4 Omni Mini",
        description: "Lightweight version",
      },
    ],
  },
  anthropic: {
    name: "Anthropic",
    icon: Brain,
    description: "Creative & safe",
    color: "#D97757",
    premium: false,
    comingSoon: true,
    models: [
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        description: "Most powerful",
      },
      {
        id: "claude-3-sonnet-20240229",
        name: "Claude 3 Sonnet",
        description: "Balanced performance",
      },
      {
        id: "claude-3-haiku-20240307",
        name: "Claude 3 Haiku",
        description: "Fast responses",
      },
    ],
  },
  perplexity: {
    name: "Perplexity",
    icon: Search,
    description: "Real-time search",
    color: "#2D9AA5",
    premium: false,
    comingSoon: true,
    models: [
      {
        id: "shisa-ai/shisa-v2-llama3.3-70b:free",
        name: "Shisa V2 70B",
        description: "Large context model",
      },
      {
        id: "nvidia/llama-3.3-nemotron-super-49b-v1:free",
        name: "Nemotron 49B",
        description: "NVIDIA optimized",
      },
    ],
  },
};
