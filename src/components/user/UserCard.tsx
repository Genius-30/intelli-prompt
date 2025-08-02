"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { getRankColor } from "@/lib/ui-utils";
import { useRouter } from "next/navigation";

interface UserCardProps {
  readonly user: User;
}

export function UserCard({ user }: UserCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/u/${user.username}`);
  };

  return (
    <Card
      className="cursor-pointer p-4 transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      <CardContent className="flex items-center gap-4 p-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullname} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user.fullname
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.fullname}</p>
          <p className="text-muted-foreground text-sm">@{user.username}</p>
        </div>
        <Badge className={`select-none ${getRankColor(user.rank || "Rookie")}`}>
          {user.rank || "Rookie"}
        </Badge>
      </CardContent>
    </Card>
  );
}
