import { AI_MODELS } from "@/lib/constants/AI_MODELS";

export function getProviderByModelId(modelId: string): string | null {
  for (const [provider, data] of Object.entries(AI_MODELS)) {
    if (data.models.some((m) => m.name === modelId)) {
      return provider;
    }
  }
  return null;
}

export const getModelProviderDetails = (modelName: string) => {
  for (const providerKey of Object.keys(AI_MODELS) as Array<keyof typeof AI_MODELS>) {
    const provider = AI_MODELS[providerKey];

    const model = provider.models.find((m) => m.name === modelName);

    if (model) {
      return {
        modelName: model.name,
        Icon: provider.icon,
        color: provider.color,
        providerName: provider.name,
      };
    }
  }

  return null;
};
