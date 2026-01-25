"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BrainCircuit,
  Clock,
  Globe,
  Mic2,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BrainCircuit,
    title: "Adaptive AI Interviewer",
    description:
      "Our AI doesn't just ask pre-scripted questions. It understands your answers, probes deeper, and challenges your thinking just like a real interviewer would.",
    gradient: "from-blue-500 to-cyan-500",
    size: "large",
  },
  {
    icon: Mic2,
    title: "Natural Voice Conversations",
    description:
      "Practice with real-time voice interactions. No typing, no delays—just natural conversation.",
    gradient: "from-violet-500 to-purple-500",
    size: "small",
  },
  {
    icon: Target,
    title: "Resume-Tailored Questions",
    description:
      "Upload your resume and job description. Get questions specifically designed for your experience and target role.",
    gradient: "from-emerald-500 to-teal-500",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Detailed Performance Analytics",
    description:
      "Track your communication patterns, filler words, pacing, and improvement over time with granular insights.",
    gradient: "from-orange-500 to-red-500",
    size: "medium",
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description:
      "Practice anytime, anywhere. No scheduling, no waiting for mock interview partners.",
    gradient: "from-pink-500 to-rose-500",
    size: "small",
  },
  {
    icon: Globe,
    title: "Multiple Interview Types",
    description:
      "Behavioral, technical, system design, and coding interviews—all in one platform.",
    gradient: "from-amber-500 to-yellow-500",
    size: "medium",
  },
];

export function FeaturesBento() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 text-sm shimmer-border"
          >
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            Platform features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
            Everything you need to
            <span className="block mt-2 bg-linear-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent bg-size-[200%_auto] animate-gradient">
              nail the interview
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            A complete interview preparation ecosystem powered by cutting-edge
            AI technology.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, i) => {
            const colSpan =
              feature.size === "large"
                ? "md:col-span-2"
                : feature.size === "medium"
                  ? "md:col-span-2 lg:col-span-2"
                  : "md:col-span-1";

            return (
              <motion.div
                key={feature.title}
                className={`group relative bento-card ${colSpan}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="relative h-full rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 lg:p-10 hover:border-border hover:bg-card/50 transition-all duration-500 overflow-hidden shimmer-border">
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                  />

                  <div className="relative h-full flex flex-col">
                    {/* Icon */}
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-linear-to-br from-${feature.gradient
                        .split(" ")[0]
                        .replace("from-", "")}/10 to-${feature.gradient
                        .split(" ")[1]
                        .replace(
                          "to-",
                          "",
                        )}/10 mb-6 group-hover:scale-110 transition-transform duration-300 w-fit`}
                    >
                      <feature.icon className="h-7 w-7 text-foreground" />
                    </div>

                    <h3 className="text-xl lg:text-2xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                      {feature.description}
                    </p>

                    {/* Decorative glow */}
                    <div
                      className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
