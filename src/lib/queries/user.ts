import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

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

export const useUserByUsername = (username?: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/${username}`);
      if (!data.user) {
        throw new Error("User not found");
      }
      return data.user;
    },
    enabled: !!username,
    retry: false,
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

export const useFollowStatus = (targetUserId?: string, options?: any) => {
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
    ...options,
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
        ? `/following/unFollow/${userId}`
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
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
};

export const useFollowers = (personId: string) => {
  return useQuery({
    queryKey: ["followers", personId],
    queryFn: async () => {
      const { data } = await axiosInstance.post("/user/followers", {
        personId,
      });
      return data.followers;
    },
    enabled: !!personId,
  });
};

export const useFollowing = (personId: string) => {
  return useQuery({
    queryKey: ["following", personId],
    queryFn: async () => {
      const { data } = await axiosInstance.post("/user/following", {
        personId,
      });
      return data.followees;
    },
    enabled: !!personId,
  });
};

export const useUserSharedPrompts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userSharedPrompts", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data } = await axiosInstance.get(
        `/user/allSharedPrompts/${userId}`
      );
      return data.data;
    },
    enabled: !!userId,
  });
};
