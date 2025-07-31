"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { AppUser } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { getRankColor } from "@/lib/ui-utils";
import { useRouter } from "next/navigation";

interface UserCardProps {
  readonly user: AppUser;
}

export function UserCard({ user }: UserCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/u/${user.username}`);
  };

  return (
    <Card
      className="hover:shadow-md cursor-pointer transition-shadow p-4"
      onClick={handleCardClick}
    >
      <CardContent className="flex items-center gap-4 p-0">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.avatar || "/placeholder.svg"}
            alt={user.fullname}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user.fullname
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.fullname}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        <Badge className={`select-none ${getRankColor(user.rank || "Rookie")}`}>
          {user.rank || "Rookie"}
        </Badge>
      </CardContent>
    </Card>
  );
}
