"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const feedbackItems = [
  {
    icon: MessageSquare,
    title: "Communication Analysis",
    description:
      "Filler words, pacing, clarity score, and tone assessment with specific timestamps",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Target,
    title: "Technical Accuracy",
    description:
      "Solution correctness, edge case coverage, time/space complexity analysis",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Performance trends across sessions with personalized improvement roadmap",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
  },
];

export function SampleReport() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm shimmer-border"
            >
              <BarChart3 className="h-4 w-4 mr-2 text-primary" />
              Detailed analytics
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
              Feedback that
              <span className="block mt-2 text-primary">actually helps</span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground mb-10">
              No more vague "you did great!" Get specific, actionable insights
              after every session so you know exactly what to work on.
            </p>

            <div className="space-y-4">
              {feedbackItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="group relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-start gap-5 p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-300 shimmer-border overflow-hidden">
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    <div
                      className={`relative h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="relative">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Glow */}
            <div className="absolute -inset-8 bg-primary/20 blur-3xl opacity-30 animate-glow" />

            {/* Card frame */}
            <div className="relative rounded-3xl p-px bg-border/50 overflow-hidden">
              <div className="rounded-3xl bg-background/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/scorecard.png"
                  alt="RoundZero Scorecard"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Floating feedback card */}
            <motion.div
              className="absolute -left-4 bottom-12 sm:-left-8 lg:-left-12 animate-float"
              style={{ "--rotate": "-3deg" } as React.CSSProperties}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-5 shadow-2xl max-w-[260px] shimmer-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-semibold">
                    Improvement Area
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "You used filler words 23 times. Try pausing instead of saying
                  'um' or 'like'."
                </p>
              </div>
            </motion.div>

            {/* Score badge */}
            <motion.div
              className="absolute -right-2 top-12 sm:-right-4 lg:-right-8 animate-float-delayed"
              style={{ "--rotate": "3deg" } as React.CSSProperties}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="rounded-2xl bg-emerald-600 p-5 shadow-2xl shadow-emerald-500/20 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider opacity-80 font-medium">
                      Overall Score
                    </p>
                    <p className="text-3xl font-bold">
                      8.7
                      <span className="text-lg font-normal opacity-70">
                        /10
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-80 flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  Top 15% of candidates
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
