import AppShell from "@/components/AppShell";
import React from "react";

export default function MainLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
