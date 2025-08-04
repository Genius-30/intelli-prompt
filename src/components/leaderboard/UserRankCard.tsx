import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AwardIcon, CrownIcon, FlameIcon, MedalIcon } from "lucide-react";

import { Badge } from "../ui/badge";
import Link from "next/link";
import { RankUser } from "@/types/user";
import { cn } from "@/lib/utils";

export default function UserRankCard({
  user,
  index,
}: {
  readonly user: RankUser;
  readonly index: number;
}) {
  const rank = index + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <MedalIcon className="h-6 w-6 text-gray-400" />;
      case 3:
        return <AwardIcon className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-muted-foreground text-sm font-bold">#{rank}</span>;
    }
  };

  const rankStyles = {
    1: "border-[rgba(234,179,8,0.5)]", // yellow-500
    2: "border-[rgba(156,163,175,0.5)]", // gray-400
    3: "border-[rgba(202,138,4,0.5)]", // amber-600
  };

  return (
    <div
      className={cn(
        "hover:bg-muted/40 bg-muted/30 flex items-center justify-between rounded-xl border-2 px-4 py-4 transition-all",
        rank <= 3 && rankStyles[rank as 1 | 2 | 3],
      )}
    >
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <div>{getRankIcon(rank)}</div>
        <Avatar className="h-11 w-11">
          <AvatarImage src={user.user.avatar || ""} />
          <AvatarFallback>
            {user.user.fullname
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-0">
          <Link href={`/u/${user.user.username}`}>
            <span className="hover:text-primary cursor-pointer text-base font-semibold">
              {user.user.fullname}
            </span>
          </Link>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>@{user.user.username}</span>
            <span className="flex items-center gap-1 text-amber-500">
              <FlameIcon className="h-3.5 w-3.5" />
              {user.user.streak?.best || 0}d
            </span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="space-y-1 text-right">
        <div className="text-primary text-xl font-bold">
          {user.totalScore.toLocaleString()}
          <span className="text-muted-foreground ml-1 text-sm">pts</span>
        </div>
        <div className="text-muted-foreground flex items-center justify-end gap-2 text-xs">
          <Badge variant="secondary">{user.totalSharedPrompts} prompts</Badge>
          <Badge variant="secondary">{user.totalLikes} likes</Badge>
        </div>
      </div>
    </div>
  );
}
