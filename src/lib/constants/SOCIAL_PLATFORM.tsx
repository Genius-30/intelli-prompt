import { SiGithub, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

import { JSX } from "react";
import { SocialPlatform } from "@/types/user";

export const socialIcons: Record<string, JSX.Element> = {
  github: <SiGithub className="h-4 w-4 text-zinc-600" />,
  twitter: <SiX className="h-4 w-4 text-blue-500" />,
  linkedin: <SiLinkedin className="h-4 w-4 text-blue-700" />,
  instagram: <SiInstagram className="h-4 w-4 text-pink-500" />,
};

export const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { icon: JSX.Element; baseUrl: string; placeholder: string }
> = {
  twitter: {
    icon: socialIcons.twitter,
    baseUrl: "https://twitter.com/",
    placeholder: "e.g. intelliprompt_",
  },
  instagram: {
    icon: socialIcons.instagram,
    baseUrl: "https://instagram.com/",
    placeholder: "e.g. intelliprompt.ai",
  },
  linkedin: {
    icon: socialIcons.linkedin,
    baseUrl: "https://linkedin.com/in/",
    placeholder: "e.g. intelliprompt_ai",
  },
  github: {
    icon: socialIcons.github,
    baseUrl: "https://github.com/",
    placeholder: "e.g. intelliprompt",
  },
};
