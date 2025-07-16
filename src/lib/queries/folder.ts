import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../axios";

export const useGetAllFolders = () => {
  return useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/folder");
      return res.data.folders;
    },
  });
};

export const useGetPromptMeta = (folderId: string) => {
  return useQuery({
    queryKey: ["folderMeta", folderId],
    queryFn: async () => {
      if (!folderId) throw new Error("Folder ID is required");

      const res = await axiosInstance.get(`/folder/${folderId}`);
      return res.data.folder;
    },
    enabled: !!folderId,
  });
};

export const useGetFolder = (id: string | undefined) => {
  return useQuery({
    queryKey: ["folder", id],
    queryFn: async () => {
      if (!id) throw new Error("Folder ID is required");
      const res = await axiosInstance.get(`user/getFolder/${id}`);
      return res.data;
    },
    enabled: !!id, // prevent firing on undefined
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const response = await axiosInstance.post("/folder", { title });
      return response.data.folder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ _id, title }: { _id: string; title: string }) => {
      const res = await axiosInstance.patch(`/folder/${_id}`, {
        newTitle: title,
      });
      return res.data;
    },
    onSuccess: (_, { _id }) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder", _id] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/folder/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
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
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folderMeta", id] });
    },
  });
};
