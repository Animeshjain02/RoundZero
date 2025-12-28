"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PracticeItem {
  id: string | number;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  href?: string;
}

interface RecommendedPracticeProps {
  items?: PracticeItem[];
  isLoading?: boolean;
}

const difficultyConfig = {
  Easy: "text-emerald-500 bg-emerald-500/10",
  Medium: "text-amber-500 bg-amber-500/10",
  Hard: "text-red-500 bg-red-500/10",
};

const defaultItems: PracticeItem[] = [
  {
    id: 1,
    title: "Two Sum Problem",
    category: "Arrays",
    difficulty: "Easy",
    estimatedTime: "15 min",
    href: "/dashboard/practice/coding/two-sum",
  },
  {
    id: 2,
    title: "Design Twitter Feed",
    category: "System Design",
    difficulty: "Hard",
    estimatedTime: "45 min",
    href: "/dashboard/practice/design/twitter-feed",
  },
  {
    id: 3,
    title: "Tell me about a conflict",
    category: "Behavioral",
    difficulty: "Medium",
    estimatedTime: "10 min",
    href: "/dashboard/practice/behavioral/conflict",
  },
];

function PracticeItemCard({ item }: { item: PracticeItem }) {
  const content = (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/50 hover:border-border transition-all cursor-pointer group">
      <div className="space-y-1">
        <p className="font-medium text-sm group-hover:text-primary transition-colors">
          {item.title}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{item.category}</span>
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-0 h-5 ${difficultyConfig[item.difficulty]} border-0`}
          >
            {item.difficulty}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {item.estimatedTime}
      </div>
    </div>
  );

  if (item.href) {
    return <Link href={item.href}>{content}</Link>;
  }

  return content;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 rounded-xl border border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecommendedPractice({
  items = defaultItems,
  isLoading,
}: RecommendedPracticeProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          items.map((item) => <PracticeItemCard key={item.id} item={item} />)
        )}
      </CardContent>
    </Card>
  );
}
