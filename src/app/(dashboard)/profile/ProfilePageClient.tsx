"use client";

import { UserProfileDisplay } from "@/components/user/UserProfileDisplay";
import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/queries/user";

export default function ProfilePageClient() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <UserProfileSkeleton />;
  if (isError || !user) {
    toast.error("Failed to load profile");
    return (
      <div className="text-center text-muted-foreground py-10">
        Error loading profile.
      </div>
    );
  }

  return (
    <div>
      <UserProfileDisplay user={user} isOwnProfile />
    </div>
  );
}
