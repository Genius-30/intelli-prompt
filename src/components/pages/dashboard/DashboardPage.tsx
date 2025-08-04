"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Folder, Heart, Zap } from "lucide-react";
import { useRecentVersions, useUserStats } from "@/lib/queries/analytics";

import { FolderSelectModal } from "@/components/dashboard/FolderSelectModal";
import GradientProgress from "@/components/ui/gradient-progress";
import Link from "next/link";
import RecentPromptSkeleton from "@/components/skeletons/RecentPromptsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import StreakCircle from "@/components/dashboard/StreakCircle";
import StreakCircleSkeleton from "@/components/skeletons/StreakCircleSkeleton";
import { formatDistanceToNow } from "date-fns";
import { useCurrentUser } from "@/lib/queries/user";
import { useState } from "react";

export default function DashboardClient() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: recentPrompts, isLoading: isRecentPromptsLoading } = useRecentVersions();
  const { data: stats, isLoading: isStatsLoading } = useUserStats();

  const dashboardStats = stats
    ? [
        {
          title: stats.totalPrompts.label,
          value: stats.totalPrompts.value,
          icon: <FileText className="text-muted-foreground h-4 w-4" />,
          description: (
            <p className="text-muted-foreground text-xs">
              <span
                className={`${
                  parseFloat(stats.totalPrompts.trend) > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.totalPrompts.trend.split(" ")[0]}
              </span>{" "}
              {stats.totalPrompts.trend.split(" ").slice(1).join(" ")}
            </p>
          ),
        },
        {
          title: stats.tokenUsage.label,
          value: stats.tokenUsage.value,
          icon: <Zap className="text-muted-foreground h-4 w-4" />,
          description: (
            <>
              <GradientProgress value={stats.tokenUsage.progress} className="mt-2" />
              <p className="text-muted-foreground mt-1 text-xs">
                <span
                  className={`${
                    parseFloat(stats.tokenUsage.progressLabel) > 0
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {stats.tokenUsage.progressLabel.split(" ")[0]}
                </span>{" "}
                {stats.tokenUsage.progressLabel.split(" ").slice(1).join(" ")}
              </p>
            </>
          ),
        },
        {
          title: stats.communityLikes.label,
          value: stats.communityLikes.value,
          icon: <Heart className="text-muted-foreground h-4 w-4" />,
          description: (
            <p className="text-muted-foreground text-xs">
              <span
                className={`${
                  parseFloat(stats.communityLikes.trend) > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.communityLikes.trend.split(" ")[0]}
              </span>{" "}
              {stats.communityLikes.trend.split(" ").slice(1).join(" ")}
            </p>
          ),
        },
        {
          title: stats.sharedPrompts.label,
          value: stats.sharedPrompts.value,
          icon: <CheckCircle className="text-muted-foreground h-4 w-4" />,
          description: (
            <p className="text-muted-foreground text-xs">
              <span
                className={`${
                  parseFloat(stats.sharedPrompts.trend) > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.sharedPrompts.trend.split(" ")[0]}
              </span>{" "}
              {stats.sharedPrompts.trend.split(" ").slice(1).join(" ")}
            </p>
          ),
        },
      ]
    : [];

  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedPrompts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back! Here's your prompt activity overview.
          </p>
        </div>
        <FolderSelectModal />
      </div>

      {/* Main Grid: Streak + Stats */}
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        {/* Streak Graph */}
        <Card className="w-full gap-1 rounded-2xl border-0 py-4 shadow-lg lg:max-w-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Streak Progress
            </CardTitle>
            <div className="bg-muted text-muted-foreground rounded-full p-2">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {isUserLoading ? (
              <StreakCircleSkeleton />
            ) : (
              <StreakCircle
                currentStreak={user?.streak?.current || 0}
                longestStreak={user?.streak?.best || 0}
              />
            )}
          </CardContent>
        </Card>

        {/* Stat Cards */}
        {isStatsLoading ? (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card
                key={`stat-skeleton-${i}`}
                className="gap-1 rounded-2xl border-0 py-4 shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="bg-muted rounded-full p-2">
                    <Skeleton className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-3 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {dashboardStats.map((stat, i) => (
              <Card
                key={i}
                className="gap-1 rounded-2xl border-0 py-4 shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-semibold">
                    {stat.title}
                  </CardTitle>
                  <div className="bg-muted rounded-full p-2">{stat.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-foreground text-2xl font-bold">{stat.value}</div>
                  {stat.description}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Card className="flex-1 rounded-2xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Prompts</CardTitle>
            <CardDescription>Your most recently used prompts and templates</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-0">
            {(() => {
              if (isRecentPromptsLoading) {
                return (
                  <>
                    <RecentPromptSkeleton />
                    <RecentPromptSkeleton />
                    <RecentPromptSkeleton />
                  </>
                );
              } else if (!recentPrompts || recentPrompts.length === 0) {
                return (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    You haven’t used any prompts recently.
                  </div>
                );
              } else {
                return recentPrompts.map((prompt, idx) => (
                  <Link
                    key={prompt.prompt._id + (prompt.folder?._id ?? "") + idx}
                    href={`/folders/${prompt.folder?._id ?? "unknown"}/prompts/${prompt.prompt._id}/versions/${prompt._id}`}
                  >
                    <div className="border-border hover:bg-muted/30 hover:border-primary/30 group flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-colors">
                          <FileText className="text-primary h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 truncate leading-none font-medium">
                            {prompt.prompt.title}
                          </h3>
                          <div className="text-muted-foreground flex items-center space-x-3 text-xs">
                            <div className="flex items-center gap-1">
                              <Folder className="h-3 w-3" />
                              <span className="truncate">
                                {prompt.folder?.title ?? "No Folder"}
                              </span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatDistanceToNow(new Date(prompt.updatedAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prompt content */}
                      <div className="w-full">
                        <pre
                          className={`text-muted-foreground mt-1 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm ${
                            expandedPrompts[prompt._id]
                              ? ""
                              : "line-clamp-2 max-h-20 overflow-hidden"
                          }`}
                        >
                          <code>{prompt.content}</code>
                        </pre>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleExpanded(prompt._id);
                          }}
                          className="text-primary mt-1 text-xs hover:underline"
                        >
                          {expandedPrompts[prompt._id] ? "Show less" : "Show more"}
                        </button>
                      </div>
                    </div>
                  </Link>
                ));
              }
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
