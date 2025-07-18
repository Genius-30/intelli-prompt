"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Award,
  Crown,
  Flame,
  Medal,
  Share2,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LeaderboardClient() {
  const topContributors = [
    {
      rank: 1,
      name: "Sarah Chen",
      username: "sarahc",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2450,
      prompts: 28,
      likes: 2341,
      streak: 15,
      badge: "Expert",
      change: "+2",
    },
    {
      rank: 2,
      name: "Mike Johnson",
      username: "mikej",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2180,
      prompts: 24,
      likes: 1987,
      streak: 12,
      badge: "Advanced",
      change: "0",
    },
    {
      rank: 3,
      name: "Dr. Emily Watson",
      username: "emilyw",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1950,
      prompts: 19,
      likes: 1654,
      streak: 8,
      badge: "Expert",
      change: "-1",
    },
    {
      rank: 4,
      name: "Alex Rivera",
      username: "alexr",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1820,
      prompts: 22,
      likes: 1432,
      streak: 6,
      badge: "Advanced",
      change: "+1",
    },
    {
      rank: 5,
      name: "David Kim",
      username: "davidk",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1650,
      prompts: 18,
      likes: 1298,
      streak: 4,
      badge: "Intermediate",
      change: "+3",
    },
  ];

  const weeklyTop = [
    {
      rank: 1,
      name: "Alex Rivera",
      username: "alexr",
      avatar: "/placeholder.svg?height=32&width=32",
      points: 340,
      prompts: 3,
      badge: "Advanced",
    },
    {
      rank: 2,
      name: "Sarah Chen",
      username: "sarahc",
      avatar: "/placeholder.svg?height=32&width=32",
      points: 280,
      prompts: 2,
      badge: "Expert",
    },
    {
      rank: 3,
      name: "Mike Johnson",
      username: "mikej",
      avatar: "/placeholder.svg?height=32&width=32",
      points: 220,
      prompts: 2,
      badge: "Advanced",
    },
  ];

  const categories = [
    { name: "Development", leader: "Sarah Chen", points: 1240 },
    { name: "Marketing", leader: "Mike Johnson", points: 890 },
    { name: "Research", leader: "Dr. Emily Watson", points: 760 },
    { name: "Creative", leader: "Alex Rivera", points: 650 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith("+")) return "text-green-500";
    if (change.startsWith("-")) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top contributors in the IntelliStack community
          </p>
        </div>

        <Button
          variant="outline"
          className="text-sm"
          onClick={() => {
            const shareData = {
              title: "My IntelliStack Stats",
              text: "Check out my leaderboard stats on IntelliStack!",
              url: window.location.href,
            };

            if (navigator.share) {
              navigator
                .share(shareData)
                .catch((err) => console.error("Sharing failed", err));
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overall" className="space-y-4">
            <TabsList className="grid grid-cols-3 gap-4 self-end mb-2">
              <TabsTrigger
                value="overall"
                className="flex items-center gap-1.5 text-sm"
              >
                <Trophy className="h-4 w-4" />
                Overall
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="flex items-center gap-1.5 text-sm"
              >
                <TrendingUp className="h-4 w-4" />
                This Week
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex items-center gap-1.5 text-sm"
              >
                <Star className="h-4 w-4" />
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overall">
              <Card className="border-0 shadow-sm">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                  <CardDescription className="text-sm">
                    All-time leaderboard based on community contributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {topContributors.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between rounded-lg transition-colors hover:bg-muted/50 py-3 px-4 ${
                        user.rank <= 3 ? "bg-muted/30" : "border"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {getRankIcon(user.rank)}
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
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
                              <span className="font-semibold hover:text-primary cursor-pointer">
                                {user.name}
                              </span>
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {user.badge}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>@{user.username}</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              {user.streak}d
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {user.points.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-end space-x-3 text-sm text-muted-foreground">
                          <span>{user.prompts} prompts</span>
                          <span>{user.likes} likes</span>
                          <span className={getChangeColor(user.change)}>
                            {user.change !== "0" && user.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly">
              <Card className="border-0 shadow-sm">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg">Weekly Top</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {weeklyTop.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between py-2 px-4 rounded-lg border hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        {getRankIcon(user.rank)}
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{user.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {user.badge}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{user.points} pts</div>
                        <div className="text-sm text-muted-foreground">
                          {user.prompts} prompts
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Category Leaders</CardTitle>
                  <CardDescription>
                    Top contributors by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">{category.leader}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.points} points
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Rank */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rank</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">#47</div>
                <div className="text-muted-foreground">out of 2,341 users</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Points</span>
                  <span className="font-medium">890</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prompts</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Likes</span>
                  <span className="font-medium">156</span>
                </div>
              </div>
              <Button className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Climb the Ranks
              </Button>
            </CardContent>
          </Card>

          {/* Achievement Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Next Achievements</CardTitle>
              <CardDescription>Goals to unlock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">🏆</div>
                    <div>
                      <div className="text-sm font-medium">Top 25</div>
                      <div className="text-xs text-muted-foreground">
                        Reach rank 25
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">22 to go</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">🔥</div>
                    <div>
                      <div className="text-sm font-medium">Streak Master</div>
                      <div className="text-xs text-muted-foreground">
                        30 day streak
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">23 days</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">⭐</div>
                    <div>
                      <div className="text-sm font-medium">Popular Creator</div>
                      <div className="text-xs text-muted-foreground">
                        500 total likes
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">344 more</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-medium">2,341</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active This Week</span>
                <span className="font-medium">456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prompts Shared</span>
                <span className="font-medium">12,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Likes</span>
                <span className="font-medium">89,234</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
