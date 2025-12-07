"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useState } from "react";

export function AudioSamples() {
  const [playing, setPlaying] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    if (playing === id) {
      setPlaying(null);
    } else {
      setPlaying(id);
      // Simulate playing duration then stop
      setTimeout(() => setPlaying(null), 3000);
    }
  };

  const samples = [
    {
      id: "behavioral",
      title: "The Behavioral Question",
      desc: "AI asking about conflict resolution",
    },
    {
      id: "technical",
      title: "The Technical Drill",
      desc: "AI asking about React useEffect",
    },
    { id: "feedback", title: "The Feedback", desc: "AI critiquing an answer" },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Hear the difference
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience the natural, conversational flow of our AI interviewer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className="flex flex-col items-center p-8 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 backdrop-blur-sm group"
            >
              <Button
                size="icon"
                className="h-20 w-20 rounded-full mb-8 text-2xl shadow-xl shadow-primary/10 group-hover:scale-105 transition-transform"
                onClick={() => togglePlay(sample.id)}
              >
                {playing === sample.id ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              <h3 className="text-lg font-semibold mb-2">{sample.title}</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {sample.desc}
              </p>

              {/* Visualizer placeholder */}
              <div className="flex items-center gap-1 h-8">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-primary rounded-full transition-all duration-300 ${
                      playing === sample.id ? "animate-pulse" : "h-2 opacity-20"
                    }`}
                    style={{
                      height:
                        playing === sample.id
                          ? `${Math.random() * 24 + 8}px`
                          : "4px",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
