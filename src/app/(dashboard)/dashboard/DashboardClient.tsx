import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  FileText,
  Folder,
  Zap,
  TrendingUp,
  Users,
  Star,
  Clock,
  TestTube,
} from "lucide-react";
import Link from "next/link";

export default function DashboardClient() {
  const recentPrompts = [
    {
      id: 1,
      title: "Code Review Assistant",
      folder: "Development",
      lastUsed: "2 hours ago",
      tests: 12,
    },
    {
      id: 2,
      title: "Email Generator",
      folder: "Marketing",
      lastUsed: "1 day ago",
      tests: 8,
    },
    {
      id: 3,
      title: "Bug Report Analyzer",
      folder: "Development",
      lastUsed: "3 days ago",
      tests: 15,
    },
  ];

  const folders = [
    { name: "Development", count: 12, color: "bg-blue-500" },
    { name: "Marketing", count: 8, color: "bg-green-500" },
    { name: "Research", count: 5, color: "bg-purple-500" },
    { name: "Personal", count: 3, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your prompt activity.
          </p>
        </div>
        <Link href="/prompts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+4</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4K</div>
            <Progress value={62} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              62% of monthly limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Community Likes
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Prompts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Prompts</CardTitle>
            <CardDescription>Your most recently used prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{prompt.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Folder className="w-3 h-3" />
                        <span>{prompt.folder}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{prompt.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <TestTube className="w-3 h-3 mr-1" />
                      {prompt.tests}
                    </Badge>
                    <Link href={`/prompts/${prompt.id}`}>
                      <Button variant="ghost" size="sm">
                        Open
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Folders */}
        <Card>
          <CardHeader>
            <CardTitle>Folders</CardTitle>
            <CardDescription>Organize your prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {folders.map((folder) => (
                <div
                  key={folder.name}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${folder.color}`} />
                    <span className="font-medium">{folder.name}</span>
                  </div>
                  <Badge variant="secondary">{folder.count}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into your most common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/prompts/new">
              <Button
                variant="outline"
                className="flex items-center bg-transparent"
              >
                <Plus className="h-6 w-6" />
                <span>New Prompt</span>
              </Button>
            </Link>
            <Link href="/test">
              <Button
                variant="outline"
                className="flex items-center bg-transparent"
              >
                <TestTube className="h-6 w-6" />
                <span>Test Prompt</span>
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                className="flex items-center bg-transparent"
              >
                <Users className="h-6 w-6" />
                <span>Explore</span>
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                variant="outline"
                className="flex items-center bg-transparent"
              >
                <TrendingUp className="h-6 w-6" />
                <span>Leaderboard</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
