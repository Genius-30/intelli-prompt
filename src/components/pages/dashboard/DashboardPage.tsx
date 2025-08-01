"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Folder, Heart, Zap } from "lucide-react";

import { FolderSelectModal } from "@/components/dashboard/FolderSelectModal";
import GradientProgress from "@/components/ui/gradient-progress";
import Link from "next/link";
import StreakCircle from "@/components/dashboard/StreakCircle";

const dashboardStats = [
  {
    title: "Total Prompts",
    value: "28",
    icon: <FileText className="text-muted-foreground h-4 w-4" />,
    description: (
      <p className="text-muted-foreground text-xs">
        <span className="text-green-500">+4</span> from last month
      </p>
    ),
  },
  {
    title: "Token Usage",
    value: "12.4K",
    icon: <Zap className="text-muted-foreground h-4 w-4" />,
    description: (
      <>
        <GradientProgress value={62} className="mt-2" />
        <p className="text-muted-foreground mt-1 text-xs">62% of monthly limit</p>
      </>
    ),
  },
  {
    title: "Community Likes",
    value: "156",
    icon: <Heart className="text-muted-foreground h-4 w-4" />,
    description: (
      <p className="text-muted-foreground text-xs">
        <span className="text-green-500">+12</span> this week
      </p>
    ),
  },
  {
    title: "Shared Prompts",
    value: "42",
    icon: <CheckCircle className="text-muted-foreground h-4 w-4" />,
    description: (
      <p className="text-muted-foreground text-xs">
        <span className="text-green-500">+3</span> this month
      </p>
    ),
  },
];

export default function DashboardClient() {
  const recentPrompts = [
    {
      id: 1,
      title: "Code Review Assistant",
      folder: "Development",
      folderId: "dev-123",
      lastUsed: "2 hours ago",
      tests: 12,
    },
    {
      id: 2,
      title: "Email Generator",
      folder: "Marketing",
      folderId: "marketing-456",
      lastUsed: "1 day ago",
      tests: 8,
    },
    {
      id: 3,
      title: "Bug Report Analyzer",
      folder: "Development",
      folderId: "dev-123",
      lastUsed: "3 days ago",
      tests: 15,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your prompt activity overview.
          </p>
        </div>
        <FolderSelectModal />
      </div>

      {/* Main Grid: Streak + Stats */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left: Streak Graph */}
        <Card className="gap-1 rounded-2xl border-0 py-4 shadow-lg md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Streak Progress
            </CardTitle>
            <div className="bg-muted text-muted-foreground rounded-full p-2">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <StreakCircle currentStreak={12} longestStreak={25} />
          </CardContent>
        </Card>

        {/* Right: Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
          {dashboardStats.map((stat, i) => (
            <Card
              key={i}
              className="rounded-2xl border-0 shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-sm font-semibold">
                  {stat.title}
                </CardTitle>
                <div className="bg-muted rounded-full p-2">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-foreground text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground mt-1 text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Card className="flex-1 rounded-2xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Prompts</CardTitle>
            <CardDescription>Your most recently used prompts and templates</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentPrompts.map((prompt) => (
                <Link key={prompt.id} href={`/folders/${prompt.folderId}/prompts/${prompt.id}`}>
                  <div className="border-border hover:bg-muted/30 hover:border-primary/30 group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200">
                    <div className="flex flex-1 items-center space-x-4">
                      <div className="from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-colors">
                        <FileText className="text-primary h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 truncate leading-none font-medium">{prompt.title}</h3>
                        <div className="text-muted-foreground flex items-center space-x-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            <span className="truncate">{prompt.folder}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{prompt.lastUsed}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
