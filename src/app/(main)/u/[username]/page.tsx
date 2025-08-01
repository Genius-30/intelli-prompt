import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/SITE_URL";
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
      title: "User Not Found",
      description: `No user found with the username ${username}.`,
    };
  }

  const displayName = user.name || user.username;

  return {
    title: `${displayName}`,
    description: `Explore prompt collections and activity of ${displayName} on IntelliPrompt.`,
    openGraph: {
      title: `${displayName}`,
      description: `Check out public prompts, stats, and favorites from ${displayName}.`,
      url: `${SITE_URL}/u/${user.username}`,
      siteName: "IntelliPrompt",
      images: [
        {
          url: `${SITE_URL}/og-profile.png`,
          width: 1200,
          height: 630,
          alt: `${displayName} – AI Prompt Creator Profile`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName}`,
      description: `Explore prompt collections and activity of ${displayName} on IntelliPrompt.`,
      images: [`${SITE_URL}/og-profile.png`],
    },
  };
}

export default async function Page({ params }: Props) {
  const { username } = await params;

  return <UserProfilePage username={username} />;
}
