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

import { Link } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublicNavbar() {
  const navItems = [
    { name: "Explore", link: "/explore" },
    { name: "Leaderboard", link: "/leaderboard" },
    { name: "Blog", link: "/blog" },
    { name: "Pricing", link: "/pricing" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

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
            <NavbarButton variant="secondary" className="p-0">
              <ThemeToggle />
            </NavbarButton>
            <NavbarButton variant="secondary" onClick={() => route("/sign-in")}>
              Login
            </NavbarButton>
            <NavbarButton variant="gradient" onClick={() => route("/sign-up")}>
              Get Started
            </NavbarButton>
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

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
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
            <div className="flex w-full flex-col gap-2">
              <NavbarButton variant="secondary" className="p-0">
                <ThemeToggle showLabel />
              </NavbarButton>
              <NavbarButton
                onClick={() => route("/sign-in")}
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => route("/sign-up")}
                variant="gradient"
                className="w-full"
              >
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
