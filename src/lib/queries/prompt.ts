import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../axios";

export const useGetAllPrompts = () => {
  return useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const res = await axios.get("/user/getAllPrompts");
      return res.data;
    },
  });
};

export const useGetPrompt = (id: string | undefined) => {
  return useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      if (!id) throw new Error("Prompt ID is required");
      const res = await axios.get(`user/getPrompt/${id}`);
      return res.data;
    },
    enabled: !!id, // prevent firing on undefined
  });
};

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; rawPrompt: string }) => {
      const res = await axios.post("/raw-prompt", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: string;
      title: string;
      rawPrompt: string;
    }) => {
      const res = await axios.patch(`/raw-prompt/${id}`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompt", id] });
    },
  });
};

export const useDeletePrompt = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/raw-prompt/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
};
