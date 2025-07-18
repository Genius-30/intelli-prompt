import type { ReactNode } from "react";
import MarketingHeader from "@/components/MarketingHeader";

export default function MarketingLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <footer className="text-center text-sm text-gray-400 py-6 border-t backdrop-blur-md bg-gradient-to-l from-gray-900 to-black dark">
        © {new Date().getFullYear()} IntelliStack. All rights reserved.
      </footer>
    </div>
  );
}
