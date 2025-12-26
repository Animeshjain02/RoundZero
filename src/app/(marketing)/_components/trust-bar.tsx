"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Zap } from "lucide-react";

const companies = [
  "Google",
  "Amazon",
  "Meta",
  "Stripe",
  "Airbnb",
  "Vercel",
  "Netflix",
  "Spotify",
];

const stats = [
  {
    icon: TrendingUp,
    value: "+34%",
    label: "Score improvement",
    sublabel: "after just 3 sessions",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    value: "4,800+",
    label: "Offers landed",
    sublabel: "at top tech companies",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    value: "180ms",
    label: "Response time",
    sublabel: "feels like real conversation",
    gradient: "from-violet-500 to-purple-500",
  },
];

export function TrustBar() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle divider lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Company logos */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
            Trusted by candidates who landed offers at
          </p>

          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="flex justify-center items-center gap-8 md:gap-12 lg:gap-16 flex-wrap">
              {companies.map((company, i) => (
                <motion.span
                  key={company}
                  className="text-xl lg:text-2xl font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors duration-300 cursor-default"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {company}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
            >
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-500 shimmer-border overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-10 mb-4`}
                  >
                    <stat.icon className="h-6 w-6 text-foreground" />
                  </div>

                  <p className="text-4xl lg:text-5xl font-bold text-foreground mb-2 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-base font-semibold text-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
