import { AI_MODELS } from "@/lib/constants/AI_MODELS";

export function getProviderByModelId(modelId: string): string | null {
  for (const [provider, data] of Object.entries(AI_MODELS)) {
    if (data.models.some((m) => m.id === modelId)) {
      return provider;
    }
  }
  return null;
}
