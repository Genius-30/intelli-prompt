import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../axios";

export const useUserStreakGraph = () => {
  return useQuery({
    queryKey: ["userStreakGraph"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/user/graph");
      return data.graphDates;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useUpdateStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/user/streak");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStreakGraph"] });
    },
  });
};

type RecentVersion = {
  _id: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  prompt: {
    _id: string;
    title: string;
  };
  folder?: {
    _id: string;
    title: string;
  };
};

export const useRecentVersions = () => {
  return useQuery({
    queryKey: ["recent-versions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/recent");
      return res.data.data as RecentVersion[];
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
};

export function useTrendingUsers() {
  return useQuery({
    queryKey: ["trending-users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/leaderboard/trending");
      return res.data.data;
    },
    staleTime: 1000 * 60, // 1 minute cache
  });
}
