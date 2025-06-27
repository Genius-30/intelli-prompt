import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <div className="text-lg md:text-xl font-bold flex items-center gap-2">
      <div className="h-full w-auto bg-primary/20 flex items-center justify-center py-[3px] px-1 rounded-md">
        <Image
          src="/favicon.ico"
          alt="logo"
          width={30}
          height={30}
          className="rounded-lg h-6 w-6 md:h-8 md:w-8 object-cover"
        />
      </div>
      IntelliStack
    </div>
  );
}

export default Logo;
