import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AwardIcon, CrownIcon, FlameIcon, MedalIcon } from "lucide-react";

import { Badge } from "../ui/badge";
import Link from "next/link";
import { RankUser } from "@/types/user";

export default function UserRankCard({
  user,
  index,
}: {
  readonly user: RankUser;
  readonly index: number;
}) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <MedalIcon className="h-5 w-5 text-gray-400" />;
      case 3:
        return <AwardIcon className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground text-lg font-bold">#{rank}</span>;
    }
  };

  return (
    <div
      key={user.rank}
      className={`hover:bg-muted/50 flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
        index <= 3 ? "bg-muted/30" : "border"
      }`}
    >
      <div className="flex items-center space-x-4">
        {getRankIcon(index + 1)}
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar || ""} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <Link href={`/profile/${user.username}`}>
              <span className="hover:text-primary cursor-pointer font-semibold">{user.name}</span>
            </Link>
            <Badge variant="outline" className="text-xs">
              {user.rank}
            </Badge>
          </div>
          <div className="text-muted-foreground flex items-center space-x-4 text-sm">
            <span>@{user.username}</span>
            <span className="flex items-center gap-1">
              <FlameIcon className="h-3 w-3" />
              {user.streak}d
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg font-bold">{user.points.toLocaleString()}</div>
        <div className="text-muted-foreground flex items-center justify-end space-x-3 text-sm">
          <span>{user.prompts} prompts</span>
          <span>{user.likes} likes</span>
        </div>
      </div>
    </div>
  );
}
