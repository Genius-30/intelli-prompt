"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import { dark } from "@clerk/themes";
import { usePathname } from "next/navigation";

export default function PublicLayout() {
  const pathname = usePathname();
  const isPricing = pathname.startsWith("/pricing");
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full border-b backdrop-blur-md bg-transparent dark">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {!isPricing && (
            <Button variant="ghost" asChild className="dark">
              <Link href="/pricing">Pricing</Link>
            </Button>
          )}

          {isSignedIn ? (
            <>
              <Button variant="outline" asChild className="dark">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <UserButton appearance={{ baseTheme: dark }} />
            </>
          ) : (
            <>
              <SignInButton>
                <Button variant="ghost" className="dark">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  variant="default"
                  className="bg-primary hover:bg-primary/90 dark"
                >
                  Sign up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
