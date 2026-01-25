"use client";

import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StrengthsWeaknessesProps {
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  isLoading?: boolean;
}

function LoadingSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-4 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Performance Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your recent interviews
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <p className="text-center">Complete interviews to see insights</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
  suggestions,
  isLoading,
}: StrengthsWeaknessesProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const hasData =
    (strengths && strengths.length > 0) ||
    (weaknesses && weaknesses.length > 0) ||
    (suggestions && suggestions.length > 0);

  if (!hasData) {
    return <EmptyState />;
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Performance Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your recent interviews
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="strengths" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="strengths" className="text-xs">
              Strengths
            </TabsTrigger>
            <TabsTrigger value="weaknesses" className="text-xs">
              Improve
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-xs">
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strengths" className="space-y-2 mt-0">
            {(strengths || []).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
            {(!strengths || strengths.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No strengths identified yet
              </p>
            )}
          </TabsContent>

          <TabsContent value="weaknesses" className="space-y-2 mt-0">
            {(weaknesses || []).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-orange-500/10 p-2.5"
              >
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
            {(!weaknesses || weaknesses.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No areas for improvement identified yet
              </p>
            )}
          </TabsContent>

          <TabsContent value="tips" className="space-y-2 mt-0">
            {(suggestions || []).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-primary/10 p-2.5"
              >
                <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
            {(!suggestions || suggestions.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No suggestions yet
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
