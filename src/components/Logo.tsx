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
    <div className="text-md text-primary flex items-center gap-1 font-bold tracking-wide select-none md:gap-3 md:text-lg">
      <Image
        src="/logo.png"
        alt="logo"
        width={32}
        height={32}
        className={`ring-muted shadow-primary/30 h-5 w-5 rounded-md object-cover shadow-lg ring-2 md:h-6 md:w-6 ${imageClassName}`}
      />
      <span className={textClassName}>IntelliPrompt</span>
    </div>
  );
}

export default Logo;
