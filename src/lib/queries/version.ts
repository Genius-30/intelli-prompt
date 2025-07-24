import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../axios";
import { toast } from "sonner";

export const useGetAllVersions = (promptId: string) => {
  return useQuery({
    queryKey: ["versions", promptId],
    queryFn: async () => {
      if (!promptId) return toast.error("Prompt ID is required");

      const res = await axiosInstance.get(`/prompt/${promptId}/allVersions`);
      return res.data.versions;
    },
    enabled: !!promptId,
  });
};

export const useGetVersion = (versionId: string | undefined) => {
  return useQuery({
    queryKey: ["version", versionId],
    queryFn: async () => {
      if (!versionId) throw new Error("Version ID is required");
      const res = await axiosInstance.get(`/version/${versionId}`);
      return res.data.version;
    },
    enabled: !!versionId,
  });
};

type AddVersionPayload = {
  promptId: string;
  content: string;
};

export const useAddVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ promptId, content }: AddVersionPayload) => {
      const res = await axiosInstance.patch(
        `/version/${promptId}/addToHistory`,
        { content }
      );
      return res.data.newVersion;
    },
    onSuccess: (_, { promptId }) => {
      queryClient.invalidateQueries({ queryKey: ["versions", promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
    },
  });
};

type UpdateVersionPayload = {
  versionId: string;
  content: string;
};

export const useUpdateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ versionId, content }: UpdateVersionPayload) => {
      const res = await axiosInstance.patch(`/version/${versionId}/save`, {
        content,
      });
      return res.data.updatedVersion;
    },
    onSuccess: (_, { versionId }) => {
      queryClient.invalidateQueries({ queryKey: ["versions"] });
      queryClient.invalidateQueries({ queryKey: ["version", versionId] });
    },
  });
};

export function useDeleteVersion(promptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const res = await axiosInstance.delete(`/version/${versionId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["versions", promptId],
      });
    },
  });
}

export const useToggleFavoriteVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.patch(`/version/${id}/favorite`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["versions"] });
      queryClient.invalidateQueries({ queryKey: ["version", id] });
    },
  });
};

type EnhancePromptArgs = {
  content: string;
  tokenEstimated: number;
  signal?: AbortSignal;
};

export function useEnhancePrompt() {
  return useMutation({
    mutationFn: async ({
      content,
      tokenEstimated,
      signal,
    }: EnhancePromptArgs) => {
      try {
        const res = await axiosInstance.post(
          `/version/enhance`,
          { content, tokenEstimated },
          { signal }
        );
        return res.data.response as string;
      } catch (err: any) {
        console.error("Enhance API error:", err);
        throw err;
      }
    },
  });
}

export function useSetActiveVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      versionId,
      promptId,
    }: {
      versionId: string;
      promptId: string;
    }) => {
      const res = await axiosInstance.patch(`/version/${versionId}/active`, {
        promptId,
      });

      return res.data;
    },
    onSuccess: (_, { promptId }) => {
      queryClient.invalidateQueries({ queryKey: ["versions"] });
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
    },
    onError: () => {
      console.error("Error setting active version");
    },
  });
}
