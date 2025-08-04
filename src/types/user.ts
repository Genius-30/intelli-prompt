export type User = {
  _id: string;
  fullname: string;
  username: string;
  bio?: string;
  email: string;
  avatar?: string;
  plan: "Free" | "Premium" | "Enterprise";
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

export type RankUser = {
  userId: string;
  user: {
    fullname: string;
    username: string;
    avatar?: string;
    streak: {
      best: number;
    };
  };
  totalScore: number;
  totalSharedPrompts: number;
  totalLikes: number;
};

export type UserStats = {
  totalPrompts: {
    label: string;
    value: number;
    trend: string;
  };
  tokenUsage: {
    label: string;
    value: string;
    progress: number;
    progressLabel: string;
  };
  communityLikes: {
    label: string;
    value: number;
    trend: string;
  };
  sharedPrompts: {
    label: string;
    value: number;
    trend: string;
  };
};

export interface CurrentUserRankData {
  userId: string;
  totalScore: number;
  rank: number | null;
  totalUsers: number;
}
