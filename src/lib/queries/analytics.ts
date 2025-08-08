import { CurrentUserRankData, UserStats } from "@/types/user";
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
    refetchOnWindowFocus: false,
    retry: 1,
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

export function useLeaderboardTrendingUsers() {
  return useQuery({
    queryKey: ["trending-users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/leaderboard/trending");
      return res.data.data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useLeaderboardOverallUsers() {
  return useQuery({
    queryKey: ["trending-users-overall"],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/leaderboard/overall");
      return res.data.data;
    },
    staleTime: 1000 * 60, // cache for 1 minute
  });
}

export const useUserStats = ({ enabled }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/stats");
      return res.data.data as UserStats;
    },
    enabled,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
};

export const useUserScoreAndRank = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["userScoreAndRank"],
    queryFn: async () => {
      const response = await axiosInstance.get("/analytics/leaderboard/userScore");
      return response.data.data as CurrentUserRankData;
    },
    staleTime: 1000 * 60, // 1 min cache
    retry: 1,
  });
};
