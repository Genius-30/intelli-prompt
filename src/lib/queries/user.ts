import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/user");
      return data.mongoUser;
    },
    staleTime: 1000 * 60 * 5,
  });
};
