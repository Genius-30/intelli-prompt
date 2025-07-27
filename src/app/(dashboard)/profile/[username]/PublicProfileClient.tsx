"use client";

import { useFollowStatus, useUserByUsername } from "@/lib/queries/user";

import { UserProfileDisplay } from "@/components/user/UserProfileDisplay";
import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function PublicProfileClient() {
  const { username } = useParams();

  const {
    data: user,
    isLoading,
    isError,
  } = useUserByUsername(username as string);
  const { data: followStatus, isPending: isFollowStatusLoading } =
    useFollowStatus(user?._id);

  if (isLoading || isFollowStatusLoading) return <UserProfileSkeleton />;
  if (isError || !user) {
    toast.error("User not found");
    return (
      <div className="text-center text-muted-foreground py-10">
        User not found
      </div>
    );
  }

  return (
    <div>
      <UserProfileDisplay
        user={user}
        isOwnProfile={false}
        followStatus={followStatus}
      />
    </div>
  );
}
