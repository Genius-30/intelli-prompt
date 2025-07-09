import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios";

export const useGetAllPrompts = () => {
  return useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/folder");
      return res.data.folders;
    },
  });
};

export const useGetPromptMeta = (promptId: string) => {
  return useQuery({
    queryKey: ["promptMeta", promptId],
    queryFn: async () => {
      if (!promptId) throw new Error("Prompt ID is required");

      const res = await axiosInstance.get(`/folder/${promptId}`);
      return res.data.folder;
    },
    enabled: !!promptId,
  });
};

export const useGetPrompt = (id: string | undefined) => {
  return useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      if (!id) throw new Error("Prompt ID is required");
      const res = await axiosInstance.get(`user/getPrompt/${id}`);
      return res.data;
    },
    enabled: !!id, // prevent firing on undefined
  });
};

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const response = await axiosInstance.post("/folder", { title });
      return response.data.folder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
};

export const useRenamePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ _id, title }: { _id: string; title: string }) => {
      const res = await axiosInstance.patch(`/folder/${_id}`, {
        newTitle: title,
      });
      return res.data;
    },
    onSuccess: (_, { _id }) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompt", _id] });
    },
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/folder/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.patch(`/folder/${id}/favorite`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["promptMeta", id] });
    },
  });
};
