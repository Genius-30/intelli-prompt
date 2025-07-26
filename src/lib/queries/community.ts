import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

type SharePromptPayload = {
  title: string;
  content: string;
  tags?: string[];
  modelUsed: string;
};

export const useSharePrompt = () => {
  return useMutation({
    mutationFn: async ({
      title,
      content,
      tags,
      modelUsed,
    }: SharePromptPayload) => {
      const { data } = await axiosInstance.post("/sharedPrompt", {
        title,
        content,
        tags,
        modelUsed,
      });
      return data.newSharedPrompt;
    },

    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to share prompt");
    },
  });
};
