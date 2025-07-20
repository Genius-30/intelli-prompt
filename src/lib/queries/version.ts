import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../axios";

type CreateVersionPayload = {
  content: string;
  folderId: string;
};

export const useCreateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, folderId }: CreateVersionPayload) => {
      console.log(content, folderId);

      const res = await axiosInstance.post("/prompt", { content, folderId });
      return res.data.newPrompt;
    },
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: ["promptMeta", folderId] });
      queryClient.invalidateQueries({ queryKey: ["versions", folderId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] }); // for main list
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
      const res = await axiosInstance.patch(`/prompt/${versionId}/save`, {
        content,
      });
      return res.data.updatedPrompt;
    },
    onSuccess: (_, { versionId }) => {
      queryClient.invalidateQueries({ queryKey: ["versions"] });
      queryClient.invalidateQueries({ queryKey: ["promptMeta", versionId] });
    },
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
        `/prompt/${promptId}/addToHistory`,
        {
          content,
        }
      );
      return res.data.newPrompt;
    },
    onSuccess: (_, { promptId }) => {
      queryClient.invalidateQueries({ queryKey: ["versions"] });
      queryClient.invalidateQueries({ queryKey: ["promptMeta", promptId] });
    },
  });
};

export function useDeleteVersion(promptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const res = await axiosInstance.delete(`/prompt/${versionId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promptVersions", promptId],
      });
    },
  });
}

export const useGetAllVersions = (promptId: string) => {
  return useQuery({
    queryKey: ["promptVersions", promptId],
    queryFn: async () => {
      if (!promptId) throw new Error("Prompt ID is required");

      const res = await axiosInstance.post(`/prompt/fetchPrompts`, {
        folderId: promptId,
      });
      return res.data.prompts;
    },
    enabled: !!promptId,
  });
};

export const useGetVersion = (versionId: string | undefined) => {
  return useQuery({
    queryKey: ["version", versionId],
    queryFn: async () => {
      if (!versionId) throw new Error("Version ID is required");
      const res = await axiosInstance.get(`/prompt/${versionId}`);
      return res.data.prompt;
    },
    enabled: !!versionId,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.patch(`/prompt/${id}/favorite`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
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

export function useSetActiveVersion(promptFolderId: string, versionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      versionId,
      folderId,
    }: {
      versionId: string;
      folderId: string;
    }) => {
      const res = await axiosInstance.patch(`/prompt/${versionId}`, {
        folderId,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promptVersions", promptFolderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["version", versionId],
      });
    },
  });
}
