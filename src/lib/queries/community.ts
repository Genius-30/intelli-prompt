import { useMutation, useQuery } from "@tanstack/react-query";

import { SharedPrompt } from "@/types/sharedPrompt";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

type SharePromptPayload = {
  title: string;
  content: string;
  versionId: string;
  tags?: string[];
  responseId: string;
};

export const useSharePrompt = () => {
  return useMutation({
    mutationFn: async ({ title, content, versionId, tags, responseId }: SharePromptPayload) => {
      const { data } = await axiosInstance.post("/sharedPrompt", {
        title,
        content,
        versionId,
        tags,
        responseId,
      });
      return data.newSharedPrompt;
    },

    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to share prompt");
    },
  });
};

interface UseOverallSharedPromptsParams {
  page: number;
  limit: number;
  search?: string;
  enabled?: boolean;
}

interface OverallPromptResponse {
  message: string;
  data: SharedPrompt[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const useOverallSharedPrompts = ({
  page,
  limit,
  search = "",
  enabled = true,
}: UseOverallSharedPromptsParams) => {
  return useQuery<OverallPromptResponse>({
    queryKey: ["overall-shared-prompts", page, limit, search],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/explore/overall", {
        params: { page, limit, search: search.trim() || undefined },
      });
      return res.data;
    },
    enabled,
    staleTime: 1000 * 60, // 1 minute
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useTrendingSharedPrompts = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["trending-shared-prompts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/explore/trending");
      return res.data.data as SharedPrompt[];
    },
    enabled,
    staleTime: 1000 * 60, // 1 minute
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
