"use client";

import { DotBackgroundDemo } from "@/components/ui/dotBackground";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <DotBackgroundDemo className="w-screen h-auto extra">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
        fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL ?? "/explore"}
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
      </DotBackgroundDemo>
    </div>
  );
}
