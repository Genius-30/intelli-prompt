"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, TrendingUp, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLeaderboardOverallUsers,
  useLeaderboardTrendingUsers,
  useUserScoreAndRank,
  useUserStats,
} from "@/lib/queries/analytics";

import { Button } from "@/components/ui/button";
import { RankGuideModal } from "@/components/leaderboard/RankGuideModal";
import { RankUser } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import UserRankCard from "@/components/leaderboard/UserRankCard";
import UserRankCardSkeleton from "@/components/skeletons/UserRankCardSkeleton";
import { useAuth } from "@clerk/nextjs";
import { useOpenAuthModal } from "@/hooks/useOpenAuthModal";
import { useState } from "react";

export default function LeaderboardPage() {
  const { isSignedIn } = useAuth();
  const openAuthModal = useOpenAuthModal();

  const [isRankGuideOpen, setIsRankGuideOpen] = useState(false);

  const { data: trendingUsers, isLoading: isLoadingTrendingUsers } = useLeaderboardTrendingUsers();
  const { data: overallUsers, isLoading: isLoadingOverallUsers } = useLeaderboardOverallUsers();

  const { data: userScoreAndRank, isLoading: isLoadingUserScoreAndRank } = useUserScoreAndRank({
    enabled: isSignedIn,
  });

  const { data: userStats, isLoading: isLoadingUserStats } = useUserStats({
    enabled: isSignedIn,
  });

  const handleShareStats = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/leaderboard`;

    const userRank = userScoreAndRank?.rank;
    const totalScore = userScoreAndRank?.totalScore;

    const shareText =
      isSignedIn && userRank
        ? `🚀 I'm ranked #${userRank} on IntelliPrompt with ${totalScore} points!\nJoin the leaderboard here:`
        : "Check out the IntelliPrompt leaderboard! See top community contributors:";

    const shareData = {
      title: "My IntelliPrompt Stats",
      text: `${shareText}\n${shareUrl}`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Sharing failed", err));
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("Share text copied to clipboard!");
    }
  };

  const handleSignIn = () => {
    openAuthModal();
  };

  return (
    <div className="space-y-6 container lg:max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Top contributors in the IntelliPrompt community
          </p>
        </div>

        <Button variant="outline" className="text-sm" onClick={handleShareStats}>
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
                  {isLoadingTrendingUsers
                    ? Array.from({ length: 5 }).map((_, idx) => <UserRankCardSkeleton key={idx} />)
                    : trendingUsers.map((user: RankUser, index: number) => (
                        <UserRankCard key={user.userId} user={user} index={index} />
                      ))}
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
                  {isLoadingOverallUsers
                    ? Array.from({ length: 5 }).map((_, idx) => <UserRankCardSkeleton key={idx} />)
                    : overallUsers.map((user: RankUser, index: number) => (
                        <UserRankCard key={user.userId} user={user} index={index} />
                      ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full self-start">
          <Card className="min-h-72 space-y-6">
            <CardHeader className="m-0">
              <CardTitle>Your Rank</CardTitle>
            </CardHeader>

            {isSignedIn ? (
              <CardContent className="space-y-4">
                {isLoadingUserScoreAndRank || isLoadingUserStats ? (
                  <>
                    {/* Rank Skeleton */}
                    <div className="text-center">
                      <Skeleton className="mx-auto h-8 w-12" />
                      <Skeleton className="mx-auto mt-2 h-4 w-32" />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Rank */}
                    <div className="text-center">
                      <div className="text-3xl font-bold">#{userScoreAndRank?.rank ?? "-"}</div>
                      <div className="text-muted-foreground">
                        out of <span>{userScoreAndRank?.totalUsers}</span> users
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Points</span>
                        <span className="font-medium">{userScoreAndRank?.totalScore ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prompts Shared</span>
                        <span className="font-medium">{userStats?.totalPrompts.value ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Community Likes</span>
                        <span className="font-medium">{userStats?.communityLikes.value ?? 0}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Always Visible Button + Modal */}
                <Button className="mt-4 w-full" onClick={() => setIsRankGuideOpen(true)}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Climb the Ranks
                </Button>
                <RankGuideModal open={isRankGuideOpen} onOpenChange={setIsRankGuideOpen} />
              </CardContent>
            ) : (
              <CardContent className="my-auto flex h-full flex-col items-center justify-center space-y-4">
                <span className="text-muted-foreground text-sm">
                  Sign in to view your rank and stats
                </span>
                <Button variant="default" onClick={handleSignIn}>
                  Login to Continue
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
