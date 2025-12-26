"use client";

import { Menu, Target } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary via-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/20">
              <Target className="h-5 w-5" />
            </div>
            <span className="tracking-tight">RoundZero</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              { href: "#features", label: "Features" },
              { href: "#pricing", label: "Pricing" },
              { href: "#demo", label: "Demo" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "ghost",
                className: "text-muted-foreground hover:text-foreground",
              })}
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "default",
                className: "shadow-lg shadow-primary/20",
              })}
            >
              Start a mock now
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-border">
              <div className="flex flex-col gap-4 mt-8 px-2">
                <Link
                  href="#features"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#demo"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Live Demo
                </Link>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Theme</span>
                  <ModeToggle />
                </div>
                <Link
                  href="/sign-in"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Button className="w-full mt-2">Start Practice - Free</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
