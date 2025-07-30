"use client";

import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";
import { dark } from "@clerk/themes";
import { useState } from "react";
import { useTheme } from "next-themes";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {" "}
                Features{" "}
              </a>
              <a
                href="#playground"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {" "}
                Playground{" "}
              </a>
              <a
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {" "}
                Pricing{" "}
              </a>
              {/* <ModeToggle /> */}

              <SignedOut>
                <Link href="/sign-up">
                  <Button size="sm">Get Started</Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    baseTheme: resolvedTheme === "dark" ? dark : undefined,
                  }}
                />
              </SignedIn>
            </nav>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 p-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {" "}
                Features{" "}
              </a>
              <a
                href="#playground"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {" "}
                Playground{" "}
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {" "}
                Pricing{" "}
              </a>
              {/* <ModeToggle /> */}
              <SignedOut>
                <Link href="/sign-up">
                  <Button size="sm">Get Started</Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
