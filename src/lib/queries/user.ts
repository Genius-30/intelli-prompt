import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
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

export const useUpdateUserBio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bio }: { bio: string }) => {
      const res = await axiosInstance.patch("/user", { bio });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

interface FollowStatusResponse {
  isFollowing: boolean;
  isFollowedBy: boolean;
}

export const useFollowStatus = (targetUserId?: string) => {
  return useQuery<FollowStatusResponse>({
    queryKey: ["followStatus", targetUserId],
    queryFn: async () => {
      if (!targetUserId) toast.error("No target userId provided");

      const res = await axiosInstance.post(
        "/following/followStatus",
        targetUserId
      );
      return res.data;
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 60,
  });
};

interface ToggleFollowArgs {
  userId: string;
  isFollowing: boolean;
}

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isFollowing }: ToggleFollowArgs) => {
      const url = isFollowing
        ? `/following/unfollow/${userId}`
        : `/following/follow/${userId}`;

      const method = isFollowing ? "delete" : "post";

      const res = await axiosInstance({
        method,
        url,
      });

      return res.data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["followStatus", userId] });
    },
  });
};

export const useFollowers = () => {
  return useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/user/followers");
      return data.followers;
    },
  });
};

export const useFollowing = () => {
  return useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/user/following");
      return data.followees;
    },
  });
};

export const useUserByUsername = (username?: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/${username}`);
      return data.user;
    },
    enabled: !!username,
  });
};

export const useUserSharedPrompts = (username: string | undefined) => {
  return useQuery({
    queryKey: ["userSharedPrompts", username],
    queryFn: async () => {
      if (!username) return [];

      const { data } = await axiosInstance.get("/analytics/search", {
        params: { username },
      });

      return data.results;
    },
    enabled: !!username,
  });
};
