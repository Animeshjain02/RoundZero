"use client";

import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedbackSectionProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export function FeedbackSection({
  strengths,
  weaknesses,
  suggestions,
}: FeedbackSectionProps) {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Detailed Feedback
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Key takeaways from this session
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
            <TabsTrigger value="suggestions" className="text-xs">
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="strengths"
            className="space-y-3 mt-0 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {strengths.length > 0 ? (
              strengths.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/90">{item}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No strengths recorded.
              </p>
            )}
          </TabsContent>

          <TabsContent
            value="weaknesses"
            className="space-y-3 mt-0 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {weaknesses.length > 0 ? (
              weaknesses.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-orange-500/5 border border-orange-500/10 p-3"
                >
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/90">{item}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No areas for improvement recorded.
              </p>
            )}
          </TabsContent>

          <TabsContent
            value="suggestions"
            className="space-y-3 mt-0 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/10 p-3"
                >
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/90">{item}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No suggestions available.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
