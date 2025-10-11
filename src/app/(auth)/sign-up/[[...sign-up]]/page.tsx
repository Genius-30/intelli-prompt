"use client";

import { DotBackgroundDemo } from "@/components/ui/dotBackground";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <DotBackgroundDemo className="w-screen h-auto extra">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"}
          fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_REDIRECT_URL || "/explore"}
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </DotBackgroundDemo>
    </div>
  );
}
