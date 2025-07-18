"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  FileText,
  Flame,
  Folder,
  Heart,
  Target,
  Zap,
} from "lucide-react";

import { FolderSelectModal } from "@/components/dashboard/FolderSelectModal";
import GradientProgress from "@/components/ui/gradient-progress";
import Link from "next/link";

const dashboardStats = [
  {
    title: "Total Prompts",
    value: "28",
    icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    description: (
      <p className="text-xs text-muted-foreground">
        <span className="text-green-500">+4</span> from last month
      </p>
    ),
  },
  {
    title: "Token Usage",
    value: "12.4K",
    icon: <Zap className="h-4 w-4 text-muted-foreground" />,
    description: (
      <>
        <GradientProgress value={62} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          62% of monthly limit
        </p>
      </>
    ),
  },
  {
    title: "Community Likes",
    value: "156",
    icon: <Heart className="h-4 w-4 text-muted-foreground" />,
    description: (
      <p className="text-xs text-muted-foreground">
        <span className="text-green-500">+12</span> this week
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

  const currentStreak = 7;
  const longestStreak = 25;

  // Generate mock streak data
  const generateStreakData = () => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const isActive = Math.random() > (i > 15 ? 0.7 : 0.3);
      const count = isActive ? Math.floor(Math.random() * 8) + 1 : 0;

      data.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        count,
        isActive,
        isToday: i === 0,
      });
    }

    return data;
  };

  const streakData = generateStreakData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's your prompt activity.
          </p>
        </div>
        <FolderSelectModal />
      </div>

      {/* Streak Summary + Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prompt Streak</CardTitle>
          <CardDescription className="text-sm">
            Track your daily prompt activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats row */}
          <div className="flex items-center space-x-6">
            {/* Current Streak */}
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-primary">
                  {currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">
                  Current Streak
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-border" />

            {/* Longest Streak */}
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary/80" />
              <div>
                <div className="text-lg font-semibold text-primary/80">
                  {longestStreak}
                </div>
                <div className="text-xs text-muted-foreground">
                  Longest Streak
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Daily Activity</h3>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded bg-muted" />
                <span>Inactive</span>
                <div className="w-3 h-3 rounded bg-primary/60" />
                <span>Active</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {streakData.map((day, index) => {
                const getIntensity = (isActive: boolean) =>
                  isActive
                    ? "bg-primary/60 hover:bg-primary/70"
                    : "bg-muted hover:bg-muted/80";

                return (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 relative group
              ${getIntensity(day.isActive)}
              ${
                day.isToday
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              }
              ${day.count > 0 ? "text-foreground" : "text-muted-foreground"}`}
                    title={`${day.dayName}, ${day.month} ${day.day}: ${day.count} prompts`}
                  >
                    {day.day}
                    {day.isToday && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>4w ago</span>
              <span>3w</span>
              <span>2w</span>
              <span>1w</span>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, i) => (
          <Card key={i} className="py-4 gap-2 justify-between">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">{stat.value}</div>
              {stat.description}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Prompts */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Recent Prompts</CardTitle>
          <CardDescription className="text-sm">
            Your most recently used prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-2">
            {recentPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/folders/${prompt.folderId}/prompts/${prompt.id}`}
              >
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium leading-none mb-1 truncate">
                        {prompt.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Folder className="w-3 h-3" />
                        <span className="truncate">{prompt.folder}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{prompt.lastUsed}</span>
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
  );
}
