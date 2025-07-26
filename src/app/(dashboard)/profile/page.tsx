"use client";

import { Loader } from "@/components/ui/loader";
import { UserProfileDisplay } from "@/components/user/UserProfileDisplay";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/queries/user";

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <Loader />;
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
