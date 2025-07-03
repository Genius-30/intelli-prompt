"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl={process.env.CLERK_SIGN_IN_URL ?? "/sign-in"}
        forceRedirectUrl={
          process.env.CLERK_SIGN_UP_FORCE_REDIRECT_URL ?? "/dashboard"
        }
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}
