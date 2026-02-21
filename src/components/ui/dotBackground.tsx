import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export function DotBackgroundDemo({children, className}: {children: ReactNode, className?: string}) {
  const isExtra = className?.includes("extra");
  return (
    <div className={`relative flex h-[50rem] w-full items-center justify-center bg-transparent ${className}`}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          isExtra
            ? "[background-image:radial-gradient(#ECECEC,transparent_1px)]"
            : "[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] bg-[#090014]"></div>
      {children}
    </div>
  );
}
