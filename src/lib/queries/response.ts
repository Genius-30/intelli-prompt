import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

// Model option passed for testing
interface ModelOption {
  provider: string;
  model: string;
  temperature: number;
}

interface TestPromptInput {
  versionId: string;
  models: ModelOption[];
  tokenEstimated?: number;
}

export function useGetResponse() {
  return useMutation({
    mutationFn: async ({ versionId, models, tokenEstimated = 100 }: TestPromptInput) => {
      const res = await axiosInstance.post(`/version/${versionId}/testModel`, {
        models,
        tokenEstimated,
      });
      return res.data.results;
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to test prompt");
    },
  });
}

export type ModelResponse = {
  isFavorite: boolean | undefined;
  _id: string;
  provider: string;
  model: string;
  temperature: number;
  response: string;
  createdAt: string;
  updatedAt: string;
};

// Query hook to fetch all responses for a given version
export function useGetAllResponsesForVersion(versionId: string) {
  return useQuery<ModelResponse[]>({
    queryKey: ["all-responses", versionId],
    enabled: !!versionId,
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/version/${versionId}/allResponses`);
        return res.data.responses as ModelResponse[];
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch model responses");
        throw error;
      }
    },
  });
}

// Mutation to delete a specific response
export function useDeleteResponse(versionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelResponseId: string) => {
      const res = await axiosInstance.delete(`/testModel/${modelResponseId}`);
      return res.data;
    },
    onSuccess: () => {
      if (versionId) {
        queryClient.invalidateQueries({
          queryKey: ["all-responses", versionId],
        });
      }
    },
  });
}

type SaveModelResponsePayload = {
  versionId: string;
  model: string;
  temperature: number;
  response: string;
};

export const useSaveModelResponse = () => {
  return useMutation({
    mutationFn: async (payload: SaveModelResponsePayload) => {
      const { data } = await axiosInstance.post("/testModel", payload);
      return data.modelResponse;
    },
  });
};

export const useModelResponse = (responseId?: string, options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["model-response", responseId],
    queryFn: async () => {
      if (!responseId) throw new Error("No responseId provided");

      const res = await axiosInstance.get(`/testModel/${responseId}`);
      return res.data.modelResponse;
    },
    enabled: !!responseId && enabled,
    staleTime: 1000 * 60 * 5, // Optional: 5 minutes
  });
};
