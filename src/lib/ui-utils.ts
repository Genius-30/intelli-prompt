export const getFollowButtonVariant = (followStatus?: {
  isFollowing: boolean;
  isFollowedBy: boolean;
}): "default" | "secondary" => {
  if (followStatus?.isFollowing) {
    return "secondary";
  } else if (followStatus?.isFollowedBy) {
    return "default";
  } else {
    return "default";
  }
};

export const getPlanColor = (plan: string): string => {
  const colors = {
    Free: "bg-gray-100 text-gray-700",
    Premium: "bg-primary/10 text-primary",
    Enterprise: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700",
  };
  return colors[plan as keyof typeof colors] || colors.Free;
};

export const socialColors: Record<string, string> = {
  twitter: "bg-[#1DA1F2] text-white hover:bg-[#1a91da]",
  instagram: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white",
  linkedin: "bg-[#0077B5] text-white hover:bg-[#006097]",
  github: "bg-[#333] text-white hover:bg-[#24292f]",
};
