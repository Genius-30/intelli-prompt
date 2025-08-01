"use client";

import Link from "next/link";
import { UserProfileDisplay } from "@/components/user/UserProfileDisplay";
import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/lib/queries/user";

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useAuth();

  const shouldFetch = isLoaded && isSignedIn;

  const { data: user, isLoading, isError } = useCurrentUser({ enabled: shouldFetch });

  if (!shouldFetch) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="bg-muted w-full max-w-md rounded-2xl p-6 shadow-sm">
          <h2 className="text-foreground mb-2 text-xl font-semibold">You're not signed in</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Please sign in to access your profile and see your shared prompts, favorites, and
            activity.
          </p>
          <Link
            href="/sign-in"
            className="bg-primary hover:bg-primary/90 mt-2 inline-block rounded-md px-4 py-2 text-sm font-medium text-white transition"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <UserProfileSkeleton />;
  if (isError || !user) {
    toast.error("Failed to load profile");
    return <div className="text-muted-foreground py-10 text-center">Error loading profile.</div>;
  }

  return (
    <div>
      <UserProfileDisplay user={user} isOwnProfile />
    </div>
  );
}
