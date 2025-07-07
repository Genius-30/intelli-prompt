import Hero from "@/components/hero";
import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  // ✅ Redirect to dashboard if user is already signed in
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <SignedOut>
      <main>
        <Hero />
      </main>
    </SignedOut>
  );
}
