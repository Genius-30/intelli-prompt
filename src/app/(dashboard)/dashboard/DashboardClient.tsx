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
import StreakCircle from '@/components/dashboard/Streak'

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

  const currentStreak = 7; // update this from your logic
  const longestStreak = 25;

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
      <StreakCircle currentStreak={currentStreak} longestStreak={longestStreak} />
    </div>
  );
}
