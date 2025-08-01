import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../axios";
import { toast } from "sonner";

export function useGetPromptsByFolder(folderId: string) {
  return useQuery({
    queryKey: ["prompts", folderId],
    queryFn: async () => {
      // Replace with your actual API call
      const response = await axiosInstance.get(`/folder/${folderId}/allPrompts`);
      return response.data.prompts;
    },
    enabled: !!folderId,
  });
}

export const useGetPrompt = (promptId: string | undefined) => {
  return useQuery({
    queryKey: ["prompt", promptId],
    queryFn: async () => {
      if (!promptId) throw new Error("Prompt ID is required");

      const { data } = await axiosInstance.get(`/prompt/${promptId}`);
      return data.prompt;
    },
    enabled: !!promptId,
    retry: false,
  });
};

type CreatePromptPayload = {
  title: string;
  content: string;
  folderId: string;
};

export const useCreatePrompt = () => {
  return useMutation({
    mutationFn: async ({ title, content, folderId }: CreatePromptPayload) => {
      const { data } = await axiosInstance.post("/prompt", {
        title,
        content,
        folderId,
      });
      return data.newPrompt;
    },
    onSuccess: () => {
      toast.success("Prompt created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create prompt");
    },
  });
};

type UpdatePromptPayload = {
  promptId: string;
  newTitle?: string;
};

export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ promptId, newTitle }: UpdatePromptPayload) => {
      const payload: Record<string, any> = {};
      if (newTitle) payload.newTitle = newTitle;

      const response = await axiosInstance.patch(`/prompt/${promptId}`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prompt", variables.promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast.success("Prompt updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update prompt");
    },
  });
}

export function useToggleFavoritePrompt(promptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.patch(`/prompt/${promptId}/favorite`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
      queryClient.invalidateQueries({ queryKey: ["userLibrary"] });
    },
  });
}

export function useDeletePrompt(promptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/prompt/${promptId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast.success("Prompt deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete prompt");
    },
  });
}
