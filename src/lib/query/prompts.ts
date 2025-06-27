"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function usePrompts() {
  return useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const res = await axios.get("/prompts");
      console.log(res);

      return res.data ?? [];
    },
  });
}

export function usePromptById(id: string) {
  return useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const res = await axios.get(`/prompts/${id}`);
      return res.data?.data;
    },
    enabled: !!id, // Prevents running query if ID is undefined
  });
}
