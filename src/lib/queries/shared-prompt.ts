import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../axios";
import { toast } from "sonner";

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
