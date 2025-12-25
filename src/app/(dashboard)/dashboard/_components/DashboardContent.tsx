"use client";

import {
  ArrowRight,
  Clock,
  Code2,
  LayoutDashboard,
  MessageSquare,
  Play,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

interface DashboardContentProps {
  user: User;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="w-full space-y-8 p-4 md:p-8 pt-6 animate-in fade-in-50 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back,{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {user.name ? user.name.split(" ")[0] : "User"}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to master your interview skills today?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hidden md:flex">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href="/dashboard/interview/create">
              <Play className="h-4 w-4 fill-current" />
              Start Mock Interview
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-none shadow-md bg-linear-to-br from-background to-muted/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-md bg-linear-to-br from-background to-muted/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on 0 evaluations
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-md bg-linear-to-br from-background to-muted/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl transition-all group-hover:bg-orange-500/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time Practiced
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep the streak going!
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-md bg-linear-to-br from-background to-muted/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-green-500/10 blur-2xl transition-all group-hover:bg-green-500/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skill Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Neutral</div>
            <p className="text-xs text-muted-foreground mt-1">
              Analyze more sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Activity Section */}
        <Card className="col-span-1 md:col-span-4 shadow-md border-muted/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest mock interview sessions and feedback as they happen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No interviews yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                You haven't started any mock interviews yet. Start a new session
                to see your progress here.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/interview/create">
                  Start First Interview
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start / Recommended */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          <Card className="shadow-md border-muted/60 bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <CardHeader>
              <CardTitle className="text-xl">Quick Start</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Jump right into a new session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/dashboard/interview/create?type=behavioral"
                  className="group flex items-center justify-between rounded-lg bg-white/10 p-3 transition-colors hover:bg-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Behavioral</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/dashboard/interview/create?type=coding"
                  className="group flex items-center justify-between rounded-lg bg-white/10 p-3 transition-colors hover:bg-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Coding Round</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-muted/60">
            <CardHeader>
              <CardTitle className="text-base">Recommended Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold">System Design</h4>
                    <span className="text-[10px] uppercase bg-secondary px-2 py-0.5 rounded-full font-bold text-secondary-foreground">
                      Hard
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Design a scalable URL shortener service.
                  </p>
                </div>
                <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold">React Hooks</h4>
                    <span className="text-[10px] uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
                      Medium
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Explain usage of useMemo vs useCallback.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
