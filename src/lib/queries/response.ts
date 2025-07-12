import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

// Model option passed for testing
interface ModelOption {
  provider: string;
  model: string;
  temperature: number;
}

// Input shape for the POST API
interface TestPromptInput {
  versionId: string;
  models: ModelOption[];
  tokenEstimated?: number;
}

// Mutation for testing a single prompt
export function useGetResponse() {
  return useMutation({
    mutationFn: async ({
      versionId,
      models,
      tokenEstimated = 100,
    }: TestPromptInput) => {
      const res = await axiosInstance.post(`/prompt/${versionId}/testModel`, {
        models,
        tokenEstimated,
      });
      return res.data.results;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to test prompt");
    },
    onSuccess: () => {
      toast.success("Prompt tested successfully");
    },
  });
}

// Response shape (raw text response)
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

// Query to fetch all saved responses for a version
export function useGetAllResponsesForVersion(versionId: string) {
  return useQuery<ModelResponse[]>({
    queryKey: ["all-responses", versionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/prompt/${versionId}/allResponses`
      );

      return data.responses as ModelResponse[];
    },
    enabled: !!versionId,
  });
}

// Mutation to delete a specific response
export function useDeleteResponse(versionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelResponseId: string) => {
      const res = await axiosInstance.delete(
        `/prompt/testModel/${modelResponseId}`
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

// Mutation to set a response as favorite
export function useSetFavoriteResponse(versionId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelResponseId: string) => {
      const res = await axiosInstance.patch(
        `/prompt/testModel/${modelResponseId}/favorite`
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
