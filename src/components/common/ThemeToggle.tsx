"use client";

import ThemeToggleButton from "../ui/theme-toggle-button";

export default function ThemeToggle({ className = "" }: { readonly className?: string }) {
  return <ThemeToggleButton variant="polygon" start="top-right" className={className} />;
}
