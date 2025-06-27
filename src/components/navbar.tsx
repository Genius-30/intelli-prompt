"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToogle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import Logo from "./Logo";

export function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <header className="fixed top-2 left-[50%] translate-x-[-50%] w-[90%] rounded-lg z-[30] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
      <div className="w-full flex h-14 items-center justify-between px-8">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <ModeToggle />

          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
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

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[240px] sm:w-[300px] px-4 py-2"
            >
              <div className="flex flex-col gap-4 mt-8">
                <ModeToggle />

                <SignedOut>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </SignedOut>

                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
