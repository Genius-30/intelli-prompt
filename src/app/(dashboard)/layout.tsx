import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import DashboardLayoutClient from "@/app/(dashboard)/DashboardLayoutClient";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/dashboard" />
      </SignedOut>
    </>
  );
}
