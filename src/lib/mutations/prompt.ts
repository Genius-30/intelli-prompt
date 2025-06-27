import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";

type CreatePromptPayload = {
  title: string;
  prompt: string;
  variables: string[];
};

export function useCreatePrompt(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePromptPayload) => {
      const res = await axios.post("/prompts", data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Prompt saved successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save prompt");
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { id, ...data } = payload;
      const res = await axios.patch(`/prompts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Prompt updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
    onError: () => {
      toast.error("Failed to update prompt.");
    },
  });
}
