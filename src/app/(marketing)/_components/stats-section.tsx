"use client";

import { motion, useInView } from "framer-motion";
import { Award, Clock, Target, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  {
    icon: Users,
    value: 15000,
    suffix: "+",
    label: "Active Users",
    description: "Practicing worldwide",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    value: 4800,
    suffix: "+",
    label: "Job Offers",
    description: "Successfully landed",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Clock,
    value: 50000,
    suffix: "+",
    label: "Mock Interviews",
    description: "Conducted this month",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    value: 92,
    suffix: "%",
    label: "Success Rate",
    description: "Of users improving",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    value: 34,
    suffix: "%",
    label: "Score Boost",
    description: "Average improvement",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "User rating",
    gradient: "from-amber-500 to-yellow-500",
  },
];

function CounterAnimation({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
            Trusted by thousands of
            <span className="block mt-2 bg-linear-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent bg-size-[200%_auto] animate-gradient">
              interview candidates
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            Join the community that's mastering interviews with AI-powered
            practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="relative h-full rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 hover:border-border hover:bg-card/50 transition-all duration-500 overflow-hidden shimmer-border">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                />

                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-linear-to-br from-${stat.gradient
                      .split(" ")[0]
                      .replace("from-", "")}/10 to-${stat.gradient
                      .split(" ")[1]
                      .replace(
                        "to-",
                        "",
                      )}/10 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-7 w-7 text-foreground" />
                  </div>

                  {/* Counter */}
                  <div className="mb-2">
                    <p className="text-5xl lg:text-6xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      <CounterAnimation
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </p>
                  </div>

                  {/* Label */}
                  <p className="text-xl font-semibold mb-1">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>

                  {/* Decorative glow */}
                  <div
                    className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
