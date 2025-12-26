"use client";

import { motion } from "framer-motion";
import { MessageCircle, Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Aditi Rao",
    role: "Software Engineer",
    company: "Google",
    image: null,
    quote:
      "RoundZero's behavioral prep was a game-changer. The AI caught weaknesses in my STAR stories that I never noticed. Landed my dream role after just 2 weeks of practice!",
    rating: 5,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Marcus Chen",
    role: "Staff Engineer",
    company: "Stripe",
    image: null,
    quote:
      "The voice interview felt incredibly real. The follow-up questions were sharp and pushed me to think deeper. This is the closest thing to an actual interview I've experienced.",
    rating: 5,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "Sarah Kim",
    role: "Product Manager",
    company: "Airbnb",
    image: null,
    quote:
      "Finally, honest feedback! It told me I said 'um' 47 times and my answers were too long. Fixed those issues and crushed my interviews. Worth every penny.",
    rating: 5,
    gradient: "from-orange-500 to-red-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm shimmer-border"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-primary" />
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
              Loved by candidates at{" "}
              <span className="ml-1 mt-2 bg-linear-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent bg-size-[200%_auto] animate-gradient">
                top companies
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="text-left">
              <p className="text-lg font-bold">4.9/5</p>
              <p className="text-xs text-muted-foreground">
                from 2,400+ reviews
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="relative h-full rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 hover:border-border hover:bg-card/50 transition-all duration-500 overflow-hidden shimmer-border">
                {/* Quote icon */}
                <Quote className="h-12 w-12 text-primary/10 mb-6" />

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground leading-relaxed mb-8 text-base lg:text-lg">
                  "{item.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                  <Avatar className="h-14 w-14 border-2 border-background ring-2 ring-primary/10">
                    <AvatarFallback
                      className={`bg-linear-to-br ${item.gradient} text-white font-bold text-lg`}
                    >
                      {item.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.role} @ {item.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
