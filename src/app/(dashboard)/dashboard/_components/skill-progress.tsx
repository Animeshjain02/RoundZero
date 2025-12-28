"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Skill {
  name: string;
  value: number;
  color: string;
}

interface SkillProgressProps {
  skills?: Skill[];
  isLoading?: boolean;
}

const defaultSkills: Skill[] = [
  { name: "Communication", value: 85, color: "bg-emerald-500" },
  { name: "Problem Solving", value: 72, color: "bg-blue-500" },
  { name: "Technical Knowledge", value: 68, color: "bg-violet-500" },
  { name: "System Design", value: 45, color: "bg-orange-500" },
];

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{skill.name}</span>
        <span className="font-medium">{skill.value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${skill.color} transition-all duration-500`}
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
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-8 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-2 w-full bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function SkillProgress({
  skills = defaultSkills,
  isLoading,
}: SkillProgressProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Skill Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          skills.map((skill) => <SkillBar key={skill.name} skill={skill} />)
        )}
      </CardContent>
    </Card>
  );
}
