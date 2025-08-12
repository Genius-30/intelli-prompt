"use client";

import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
  NavbarButton,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";

import AuthButton from "../ui/auth-button";
import { Github } from "@lobehub/icons";
import Link from "next/link";
import ThemeToggle from "../common/ThemeToggle";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublicNavbar() {
  const router = useRouter();

  const navItems = [
    { name: "Explore", link: "/explore" },
    { name: "Leaderboard", link: "/leaderboard" },
    { name: "Blog", link: "/blog" },
    { name: "Pricing", link: "/pricing" },
  ];

  const shareLinks = [
    {
      text: "Login",
      onClick: () => router.push("/sign-in"),
      label: "Go to Sign In",
      className: `
      bg-gray-100 dark:bg-gray-200 hover:bg-gray-200 dark:hover:bg-gray-300
      text-neutral-800
      font-medium tracking-wide
      transition-colors duration-200
    `.trim(),
    },
    {
      text: "Sign Up",
      onClick: () => router.push("/sign-up"),
      label: "Go to Sign Up",
      className: `
      bg-primary dark:bg-primary/70
      text-white dark:text-white
      hover:bg-primary/80 dark:hover:bg-primary/60
      font-medium tracking-wide 
      shadow-md hover:shadow-lg
      transition-all duration-200
    `.trim(),
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const route = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2">
            <NavbarButton as="div" variant="secondary" className="p-0">
              <ThemeToggle />
            </NavbarButton>
            <NavbarButton
              variant="secondary"
              className="mr-2 flex items-center justify-center p-0"
              onClick={() => window.open("https://github.com/Genius-30/intelli-prompt", "_blank")}
            >
              <Github size={20} />
            </NavbarButton>
            <AuthButton
              links={shareLinks}
              className="from-primary to-primary/70 h-9 bg-gradient-to-b text-sm font-medium text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
            >
              Get Started
            </AuthButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => route(item.link)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex flex-col items-start gap-2">
              <NavbarButton as="div" variant="secondary" className="h-auto w-auto p-0">
                <ThemeToggle className="w-auto" />
              </NavbarButton>
              <NavbarButton
                variant="secondary"
                className="mr-2 flex items-center justify-center p-0"
                onClick={() => window.open("https://github.com/Genius-30/intelli-prompt", "_blank")}
              >
                <Github size={20} />
              </NavbarButton>
              <NavbarButton
                onClick={() => route("/sign-in")}
                variant="secondary"
                className="mt-4 w-auto px-0"
              >
                Login
              </NavbarButton>
              <NavbarButton onClick={() => route("/sign-up")} variant="gradient" className="w-full">
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
