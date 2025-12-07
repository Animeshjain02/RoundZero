import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/20 border-t border-border/40 pt-16 pb-8">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl tracking-tight">
            Stop practicing on real recruiters.
          </h2>
          <Button
            size="lg"
            className="h-14 px-10 text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all hover:-translate-y-1"
          >
            Start Your First Round Now
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left w-full max-w-4xl mx-auto">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <span>RoundZero</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The brutally honest AI interviewer that helps you land your dream
              job.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground/90">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground/90">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground/90">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RoundZero. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
