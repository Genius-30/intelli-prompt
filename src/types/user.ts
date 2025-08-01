export interface AppUser {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  rank?: string;
}

export type SocialPlatform = "twitter" | "instagram" | "linkedin" | "github";

export interface SocialLink {
  label: SocialPlatform;
  url: string;
}
