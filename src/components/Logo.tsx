import Image from "next/image";
import React from "react";

function Logo({
  imageClassName,
  textClassName,
}: {
  readonly imageClassName?: string;
  readonly textClassName?: string;
}) {
  return (
    <div className="text-md text-primary dark:text-foreground flex items-center gap-1 font-mono font-bold tracking-wide select-none md:gap-2 md:text-lg">
      <Image
        src="/logo.png"
        alt="logo"
        width={32}
        height={32}
        className={`ring-muted shadow-primary/30 h-5 w-5 rounded-md object-cover shadow-lg ring-2 md:h-6 md:w-6 ${imageClassName}`}
      />
      <span className={`mt-1 ${textClassName}`}>IntelliPrompt</span>
    </div>
  );
}

export default Logo;
