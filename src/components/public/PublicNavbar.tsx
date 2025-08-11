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
      bg-muted dark:bg-neutral-900 
      text-neutral-800 dark:text-neutral-200 
      hover:bg-neutral-200 dark:hover:bg-neutral-800 
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
            <Link
              href="https://github.com/Genius-30/intelli-prompt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-0"
            >
              <NavbarButton as="div" variant="secondary" className="p-0">
                <Github size={20} />
              </NavbarButton>
            </Link>
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
              <NavbarButton as="div" variant="secondary" className="p-0">
                <ThemeToggle />
              </NavbarButton>
              <Link
                href="https://github.com/Genius-30/intelli-prompt"
                target="_blank"
                rel="noopener noreferrer"
                className="p-0"
              >
                <NavbarButton as="div" variant="secondary" className="p-0">
                  <Github size={16} />
                </NavbarButton>
              </Link>
              <NavbarButton
                onClick={() => route("/sign-in")}
                variant="secondary"
                className="w-full text-left"
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
