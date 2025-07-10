import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <div className="text-md md:text-lg font-bold flex items-center gap-2 text-white">
      <div className="h-full w-auto bg-primary/20 flex items-center justify-center py-[3px] px-1 rounded-md">
        <Image
          src="/favicon.ico"
          alt="logo"
          width={30}
          height={30}
          className="rounded-lg h-5 w-5 md:h-6 md:w-6 object-cover"
        />
      </div>
      IntelliStack
    </div>
  );
}

export default Logo;
