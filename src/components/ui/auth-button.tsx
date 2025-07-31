"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthLink {
  text: string;
  href?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  links: AuthLink[];
  children: React.ReactNode;
}

const AuthButton = ({ className, links, children, ...props }: AuthButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        className={cn(
          "relative min-w-38 rounded-3xl",
          "bg-white dark:bg-black",
          "hover:bg-gray-50 dark:hover:bg-gray-950",
          "text-black dark:text-white",
          "border border-black/10 dark:border-white/10",
          "transition-all duration-300",
          isHovered ? "opacity-0" : "opacity-100",
          className,
        )}
        {...props}
      >
        <span className="flex items-center gap-2">{children}</span>
      </Button>

      <div className="absolute top-0 left-0 flex h-9 min-w-38">
        {links.map((link, index) => {
          return (
            <button
              type="button"
              key={index}
              onClick={link.onClick}
              className={cn(
                "flex-1",
                "h-full",
                "w-10",
                "text-sm",
                "flex items-center justify-center",
                "bg-black dark:bg-white",
                "text-white dark:text-black",
                "transition-all duration-300",
                index === 0 && "rounded-l-3xl",
                index === links.length - 1 && "rounded-r-3xl",
                "border-r border-white/10 last:border-r-0 dark:border-black/10",
                "hover:bg-gray-900 dark:hover:bg-gray-100",
                "",
                isHovered ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
                index === 0 && "transition-all duration-200",
                index === 1 && "transition-all delay-[50ms] duration-200",
                index === 2 && "transition-all delay-100 duration-200",
                index === 3 && "transition-all delay-150 duration-200",
                link.className,
              )}
            >
              <span className="">{link.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AuthButton;
