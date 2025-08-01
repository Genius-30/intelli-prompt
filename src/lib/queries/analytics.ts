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
