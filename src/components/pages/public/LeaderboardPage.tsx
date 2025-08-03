"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, TrendingUp, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { RankUser } from "@/types/user";
import UserRankCard from "@/components/leaderboard/userRankCard";
import { useTrendingUsers } from "@/lib/queries/analytics";

export default function LeaderboardClient() {
  const { data: trendingUsers, isLoading: isLoadingTrendingUsers } = useTrendingUsers();

  if (isLoadingTrendingUsers) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const topContributors = [
    {
      _id: "1",
      rank: "Rookie",
      name: "Techo Biz",
      username: "techobiz",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2450,
      prompts: 28,
      likes: 2341,
      streak: 15,
    },
    {
      _id: "2",
      rank: "Pro",
      name: "Genius Porwal",
      username: "thisisgenius",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2180,
      prompts: 24,
      likes: 1987,
      streak: 12,
    },
    {
      _id: "3",
      rank: "Expert",
      name: "Dr. Emily Watson",
      username: "emilyw",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1950,
      prompts: 19,
      likes: 1654,
      streak: 8,
    },
    {
      _id: "4",
      rank: "Master",
      name: "Alex Rivera",
      username: "alexr",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1820,
      prompts: 22,
      likes: 1432,
      streak: 6,
    },
    {
      _id: "5",
      rank: "Champion",
      name: "David Kim",
      username: "davidk",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1650,
      prompts: 18,
      likes: 1298,
      streak: 4,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Top contributors in the IntelliPrompt community
          </p>
        </div>

        <Button
          variant="outline"
          className="text-sm"
          onClick={() => {
            const shareData = {
              title: "My IntelliPrompt Stats",
              text: "Check out my leaderboard stats on IntelliPrompt!",
              url: window.location.href,
            };

            if (navigator.share) {
              navigator.share(shareData).catch((err) => console.error("Sharing failed", err));
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-3">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="trending">
            <TabsList className="mb-2 grid h-10 w-full min-w-2xs grid-cols-2 gap-4">
              <TabsTrigger value="trending" className="flex items-center gap-1.5 text-sm">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="overall" className="flex items-center gap-1.5 text-sm">
                <Trophy className="h-4 w-4" />
                Overall
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending">
              <Card className="gap-2 border-0 shadow-sm">
                <CardHeader className="py-0">
                  <CardTitle className="text-lg">Trending Now</CardTitle>
                  <CardDescription className="text-sm">
                    Top contributors this week based on recent activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {/* {trendingUsers.map((user: RankUser, index: number) => (
                    <UserRankCard key={user._id} user={user} index={index} />
                  ))} */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overall">
              <Card className="gap-2 border-0 shadow-sm">
                <CardHeader className="py-0">
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                  <CardDescription className="text-sm">
                    All-time leaderboard based on community contributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {topContributors.map((user: RankUser, index: number) => (
                    <UserRankCard key={user._id} user={user} index={index} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

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
        </div>
      </div>
    </div>
  );
}
