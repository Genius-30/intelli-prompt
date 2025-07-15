import { ReactNode } from "react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import DashboardLayoutClient from "@/app/(dashboard)/DashboardLayoutClient";

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
