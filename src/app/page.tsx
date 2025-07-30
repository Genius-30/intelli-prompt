import LandingPage from "@/components/pages/public/LandingPage";
import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  const afterSignInUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL || "/explore";

  // ✅ Redirect to explore if user is already signed in
  if (userId) {
    redirect(afterSignInUrl);
  }

  return (
    <SignedOut>
      <LandingPage />
    </SignedOut>
  );
}
