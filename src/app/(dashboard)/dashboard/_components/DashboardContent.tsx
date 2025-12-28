"use client";

import {
  ProTipCard,
  QuickStart,
  RecentInterviews,
  RecommendedPractice,
  SkillProgress,
  StatsCards,
  WelcomeHeader,
} from "./index";

interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

interface DashboardContentProps {
  user: User;
}

// Mock data, we will replace it with API's
const mockInterviews = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    type: "Technical" as const,
    score: 8.2,
    date: "2 hours ago",
    duration: "45 min",
    status: "completed" as const,
  },
  {
    id: 2,
    title: "Product Manager",
    type: "Behavioral" as const,
    score: 7.8,
    date: "Yesterday",
    duration: "32 min",
    status: "completed" as const,
  },
  {
    id: 3,
    title: "Staff Engineer",
    type: "System Design" as const,
    score: null,
    date: "In progress",
    duration: "15 min",
    status: "in_progress" as const,
  },
];

export default function DashboardContent({ user }: DashboardContentProps) {
  // TODO: Will integrate with API and remove the mock data

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      <WelcomeHeader userName={user.name} />
      <StatsCards />
      <QuickStart />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Interviews */}
        <div className="lg:col-span-2">
          <RecentInterviews interviews={mockInterviews} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <SkillProgress />
          <RecommendedPractice />
          <ProTipCard />
        </div>
      </div>
    </div>
  );
}
