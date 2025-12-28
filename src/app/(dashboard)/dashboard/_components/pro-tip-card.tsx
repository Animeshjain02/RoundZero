"use client";

import { X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface ProTip {
  id: string | number;
  title?: string;
  content: string;
}

interface ProTipCardProps {
  tip?: ProTip;
  onDismiss?: (id: string | number) => void;
  dismissible?: boolean;
}

const defaultTip: ProTip = {
  id: "default",
  title: "Pro Tip",
  content:
    "Practice behavioral questions using the STAR method. Structure your answers with Situation, Task, Action, and Result for maximum impact.",
};

export function ProTipCard({
  tip = defaultTip,
  onDismiss,
  dismissible = false,
}: ProTipCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.(tip.id);
  };

  return (
    <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-primary/10 to-violet-500/5 relative overflow-hidden">
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-violet-600 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            {tip.title && (
              <p className="font-semibold text-sm mb-1">{tip.title}</p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tip.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
