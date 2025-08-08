"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { Loader } from "@/components/ui/loader";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function Providers({ children }: { readonly children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL}
      signUpForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
