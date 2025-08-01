"use client";

import {
  useCurrentUser,
  useFollowStatus,
  useUserByUsername,
} from "@/lib/queries/user";

import { AlertTriangle } from "lucide-react";
import { UserProfileDisplay } from "@/components/user/UserProfileDisplay";
import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserProfilePage({
  username,
}: {
  readonly username: string;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const shouldFetch = isLoaded && isSignedIn;
  const { data: currentUser } = useCurrentUser({ enabled: shouldFetch });

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserByUsername(username);

  const isOwnProfile = isSignedIn && currentUser?.username === username;

  useEffect(() => {
    if (isOwnProfile) {
      router.replace("/profile");
    }
  }, [isOwnProfile, router]);

  const shouldFetchFollowStatus = isSignedIn && !!user?._id && !isOwnProfile;

  const { data: followStatus, isPending: isFollowStatusLoading } =
    useFollowStatus(user?._id, {
      enabled: shouldFetchFollowStatus,
    });

  if (isUserLoading || (shouldFetchFollowStatus && isFollowStatusLoading)) {
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
          Sorry, we couldn’t find any user with the username{" "}
          <span className="font-medium">{username}</span>.
        </p>
      </div>
    );
  }

  return (
    <UserProfileDisplay
      user={user}
      isOwnProfile={isSignedIn ? !!isOwnProfile : false}
      followStatus={isSignedIn && !isOwnProfile ? followStatus : undefined}
    />
  );
}
