"use client";

import {
  useCurrentUser,
  useFollowStatus,
  useUserByUsername,
} from "@/lib/queries/user";
import { useParams, useRouter } from "next/navigation";

import { AlertTriangle } from "lucide-react";
import { UserProfileDisplay } from "@/components/user/UserProfileDisplay";
import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton";
import { toast } from "sonner";
import { useEffect } from "react";

export default function PublicProfileClient() {
  const { username } = useParams();
  const router = useRouter();

  const { data: currentUser } = useCurrentUser();
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserByUsername(username as string);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (isOwnProfile) {
      router.replace("/profile");
    }
  }, [isOwnProfile, router]);

  const { data: followStatus, isPending: isFollowStatusLoading } =
    useFollowStatus(user?._id, {
      enabled: !!user?._id && !isOwnProfile,
    });

  useEffect(() => {
    if (isUserError) {
      toast.error("Invalid username!");
    }
  }, [isUserError]);

  if (isUserLoading || (!isOwnProfile && user && isFollowStatusLoading)) {
    return <UserProfileSkeleton />;
  }

  if (isUserError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
        <h2 className="text-xl font-semibold text-foreground">
          User not found
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          The profile you're trying to view doesn’t exist or the username is
          incorrect. Please check the URL or try searching for another user.
        </p>
      </div>
    );
  }

  return (
    <UserProfileDisplay
      user={user}
      isOwnProfile={isOwnProfile}
      followStatus={isOwnProfile ? undefined : followStatus}
    />
  );
}
