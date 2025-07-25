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
    mutationFn: async ({
      versionId,
      models,
      tokenEstimated = 100,
    }: TestPromptInput) => {
      const res = await axiosInstance.post(`/version/${versionId}/testModel`, {
        models,
        tokenEstimated,
      });
      return res.data.results;
    },

    onSuccess: () => {
      toast.success("Prompt tested successfully");
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
        const res = await axiosInstance.get(
          `/version/${versionId}/allResponses`
        );
        return res.data.responses as ModelResponse[];
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch model responses"
        );
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
      const res = await axiosInstance.delete(
        `/version/${versionId}/testModel/${modelResponseId}`
      );
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
    mutationFn: async ({ versionId, ...body }: SaveModelResponsePayload) => {
      const { data } = await axiosInstance.post(
        `/testModel/${versionId}`,
        body
      );
      return data;
    },
  });
};
