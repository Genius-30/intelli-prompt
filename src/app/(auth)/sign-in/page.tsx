"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl={process.env.CLERK_SIGN_UP_URL ?? "/sign-up"}
        forceRedirectUrl={
          process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL ?? "/dashboard"
        }
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}
