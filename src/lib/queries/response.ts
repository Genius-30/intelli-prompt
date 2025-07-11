import { useMutation, useQuery } from "@tanstack/react-query";
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
      console.log("Fetched responses:", data);

      return data.responses as ModelResponse[];
    },
    enabled: !!versionId,
  });
}
