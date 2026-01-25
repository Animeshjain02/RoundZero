"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface Skill {
  name: string;
  value: number;
}

interface SkillProgressProps {
  skills?: Skill[];
  isLoading?: boolean;
}

// Color mapping based on skill name
const getSkillColor = (name: string): string => {
  const colorMap: Record<string, string> = {
    Communication: "bg-emerald-500",
    "Problem Solving": "bg-blue-500",
    "Technical Knowledge": "bg-violet-500",
    "Code Quality": "bg-cyan-500",
    "Time Management": "bg-orange-500",
  };
  return colorMap[name] || "bg-primary";
};

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{skill.name}</span>
        <span className="font-medium">{skill.value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${getSkillColor(skill.name)} transition-all duration-500`}
          style={{ width: `${skill.value}%` }}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-6 text-muted-foreground">
      <p className="text-sm">Complete interviews to see your skill progress</p>
    </div>
  );
}

export function SkillProgress({ skills, isLoading }: SkillProgressProps) {
  const hasSkills = skills && skills.length > 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Skill Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : hasSkills ? (
          skills.map((skill) => <SkillBar key={skill.name} skill={skill} />)
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}
