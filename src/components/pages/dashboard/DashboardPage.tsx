"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, FileText, Flame, Folder, Heart, Star, Zap } from "lucide-react";

import { FolderSelectModal } from "@/components/dashboard/FolderSelectModal";
import GradientProgress from "@/components/ui/gradient-progress";
import Link from "next/link";
import StreakCircle from "@/components/dashboard/Streak";

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

  const {
    data: streakData,
    currentStreak,
    longestStreak,
  } = generateStreakData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your prompt activity overview.
          </p>
        </div>
        <FolderSelectModal />
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900/50">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-semibold">Daily Streak</CardTitle>
          <CardDescription className="text-sm">
            Keep the momentum going with consistent daily activity
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <StreakCircle currentStreak={9} longestStreak={25}/>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardStats.map((stat, i) => (
          <Card
            key={i}
            className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              {stat.description}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Recent Prompts
          </CardTitle>
          <CardDescription>
            Your most recently used prompts and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {recentPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/folders/${prompt.folderId}/prompts/${prompt.id}`}
              >
                <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium leading-none mb-1 truncate">
                        {prompt.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Folder className="w-3 h-3" />
                          <span className="truncate">{prompt.folder}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
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
  );
}

function generateStreakData() {
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const totalDays = 60;
  const rawData = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseChance = isWeekend ? 0.4 : 0.8;
    const recencyBonus = i < 14 ? 0.2 : 0;
    const activityChance = baseChance + recencyBonus;
    const isActive = Math.random() < activityChance;
    const count = isActive ? Math.floor(Math.random() * 8) + 1 : 0;
    rawData.push({
      date: date.toISOString().split("T")[0],
      day: date.getDate(),
      month: monthNames[date.getMonth()],
      dayName: dayNames[date.getDay()],
      count,
      isActive,
      isToday: i === 0,
      daysAgo: i,
    });
  }
  let currentStreak = 0;
  for (let i = rawData.length - 1; i >= 0; i--) {
    if (rawData[i].isActive) currentStreak++;
    else break;
  }
  let longestStreak = 0;
  let tempStreak = 0;
  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i].isActive) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  return {
    data: rawData,
    currentStreak,
    longestStreak,
  };
}
