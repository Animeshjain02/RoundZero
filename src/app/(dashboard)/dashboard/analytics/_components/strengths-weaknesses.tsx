"use client";

import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StrengthsWeaknessesProps {
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
}

const defaultStrengths = [
  "Clear communication style",
  "Strong problem decomposition",
  "Good time management",
  "Explains thought process well",
];

const defaultWeaknesses = [
  "Edge case handling",
  "System design scalability",
  "Code optimization",
];

const defaultSuggestions = [
  "Practice more system design problems",
  "Focus on edge cases in coding",
  "Review Big O complexity",
];

export function StrengthsWeaknesses({
  strengths = defaultStrengths,
  weaknesses = defaultWeaknesses,
  suggestions = defaultSuggestions,
}: StrengthsWeaknessesProps) {
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
            {strengths.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="weaknesses" className="space-y-2 mt-0">
            {weaknesses.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-orange-500/10 p-2.5"
              >
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-2 mt-0">
            {suggestions.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-primary/10 p-2.5"
              >
                <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
