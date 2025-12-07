import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Target } from "lucide-react";
import { ModeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 px-20 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="h-5 w-5" />
          </div>
          <span>RoundZero</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#demo"
            className="hover:text-foreground transition-colors"
          >
            Live Demo
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <Link
            href="/sign-in"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Sign In
          </Link>
          <Button>Start Practice - Free</Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              <Link href="#features" className="text-lg font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-lg font-medium">
                Pricing
              </Link>
              <Link href="#demo" className="text-lg font-medium">
                Live Demo
              </Link>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Theme</span>
                <ModeToggle />
              </div>
              <Link href="/sign-in" className="text-lg font-medium">
                Sign In
              </Link>
              <Button className="w-full">Start Practice - Free</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
