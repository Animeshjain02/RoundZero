"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Target,
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error?.message || "Failed to sign out");
          },
        },
      });
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>
            <span>RoundZero</span>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted overflow-hidden">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden md:inline-block max-w-[150px] truncate">
                  {user.name || user.email}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isPending}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isPending ? "Signing out..." : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s an overview of your interview preparation progress.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Practice Sessions
              </CardTitle>
              <CardDescription>
                Track your mock interview sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">
                sessions completed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Skills Progress
              </CardTitle>
              <CardDescription>
                Your interview skill development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">no data yet</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Start a new practice session</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Practice</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
