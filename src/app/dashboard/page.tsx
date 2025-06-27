import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <>
      <SignedIn>
        <div className="p-8">
          <h1 className="text-3xl font-bold">Welcome to IntelliStack 👋</h1>
          <p className="text-muted-foreground mt-2">
            Manage your agents and prompts here.
          </p>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/dashboard" />
      </SignedOut>
    </>
  );
}
