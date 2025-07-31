import { Metadata } from "next";
import UserProfilePage from "@/components/pages/public/UserProfilePage";
import { getUserByUsername } from "@/lib/actions/user";

type Props = {
  readonly params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return {
      title: "User Not Found | IntelliPrompt",
      description: `No user found with the username ${username}.`,
    };
  }

  const displayName = user.name || user.username;

  return {
    title: `${displayName} | IntelliPrompt`,
    description: `Explore prompt collections and activity of ${displayName} on IntelliPrompt.`,
    openGraph: {
      title: `${displayName} | IntelliPrompt`,
      description: `Check out public prompts, stats, and favorites from ${displayName}.`,
      url: `https://intelliprompt.app/u/${user.username}`,
      siteName: "IntelliPrompt",
      images: [
        {
          url: "https://intelliprompt.app/og-profile.png",
          width: 1200,
          height: 630,
          alt: `${displayName} – AI Prompt Creator Profile`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} | IntelliPrompt`,
      description: `Explore prompt collections and activity of ${displayName} on IntelliPrompt.`,
      images: ["https://intelliprompt.app/og-profile.png"],
    },
  };
}

export default async function Page({ params }: Props) {
  const { username } = await params;

  return <UserProfilePage username={username} />;
}
