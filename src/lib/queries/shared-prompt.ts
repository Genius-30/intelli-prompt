import { Comment, SharedPrompt } from "@/types/sharedPrompt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../axios";
import { toast } from "sonner";

export const useGetSharedPrompt = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["sharedPrompt", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/sharedPrompt/${id}`);
      return res.data.data as SharedPrompt;
    },
    enabled: !!id,
    ...options,
  });
};

export const useDeleteSharedPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/sharedPrompt/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["overall-shared-prompts"] });
      queryClient.invalidateQueries({ queryKey: ["trending-shared-prompts"] });
      queryClient.invalidateQueries({ queryKey: ["userLibrary"] });
      queryClient.invalidateQueries({ queryKey: ["userSharedPrompts", userId] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.response?.data?.error || "Failed to delete prompt",
      );
    },
  });
};

interface UpdateSharedPromptPayload {
  _id: string;
  newTitle: string;
  tags: string[];
  responseId: string;
}

export function useUpdateSharedPrompt() {
  return useMutation({
    mutationFn: async (payload: UpdateSharedPromptPayload) => {
      const res = await axiosInstance.patch(`/sharedPrompt/${payload._id}`, {
        newTitle: payload.newTitle,
        tags: payload.tags,
        responseId: payload.responseId,
      });
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update prompt");
    },
  });
}

export const useToggleLikeSharedPrompt = (promptId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(`/sharedPrompt/${promptId}/like`);
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to toggle like");
    },
  });
};

export const useToggleSaveSharedPrompt = (promptId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(`/sharedPrompt/${promptId}/save`);
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to toggle save");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLibrary"] });
    },
  });
};

export const useMarkSharedPromptAsShared = (promptId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(`/sharedPrompt/${promptId}/share`);
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark as shared");
    },
  });
};

export const useComments = (promptId: string, limit?: number) => {
  return useQuery({
    queryKey: ["comments", promptId, limit],
    queryFn: async () => {
      const res = await axiosInstance.get(`/sharedPrompt/${promptId}/comment`, {
        params: { limit },
      });
      return res.data.comments as Comment[];
    },
    enabled: !!promptId,
  });
};

export const useAddComment = (sharedPromptId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await axiosInstance.post(`/sharedPrompt/${sharedPromptId}/comment`, {
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", sharedPromptId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add comment");
    },
  });
};

export const useDeleteComment = (sharedPromptId: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/sharedPrompt/${sharedPromptId}/comment/${commentId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", sharedPromptId] });
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
};

export const useToggleCommentLike = (sharedPromptId: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(
        `/sharedPrompt/${sharedPromptId}/comment/${commentId}/like`,
      );
      return res.data;
    },
    onError: () => {
      toast.error("Failed to toggle like on comment");
    },
  });
};
