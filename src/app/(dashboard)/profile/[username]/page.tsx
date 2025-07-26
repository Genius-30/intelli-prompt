"use client";

import { Loader } from "@/components/ui/loader";
import { UserProfileDisplay } from "@/components/user/UserProfileDisplay";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useUserByUsername } from "@/lib/queries/user";

export default function PublicProfilePage() {
  const { username } = useParams();

  const {
    data: user,
    isLoading,
    isError,
  } = useUserByUsername(username as string);

  if (isLoading) return <Loader />;
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
      <UserProfileDisplay user={user} isOwnProfile={false} />
    </div>
  );
}
