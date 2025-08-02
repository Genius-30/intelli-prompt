export type User = {
  _id: string;
  fullname: string;
  username: string;
  bio?: string;
  email: string;
  avatar?: string;
  plan: "Free" | "Premium" | "Enterprise";
  rank: "Rookie" | "Cadet" | "Elite" | "Veteran" | "Master";
  subscriptionEnds: Date;
  streak: {
    current: number;
    best: number;
    lastActive: Date;
    history: Date[];
  };
  tokenLimit: number;
  tokensUsed: number;
  followerCount: number;
  followeeCount: number;
  socials?: {
    label: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type SocialPlatform = "twitter" | "instagram" | "linkedin" | "github";

export interface SocialLink {
  label: SocialPlatform;
  url: string;
}
