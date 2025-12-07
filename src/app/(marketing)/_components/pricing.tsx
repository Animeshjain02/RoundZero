import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start for free, upgrade when you're serious.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-8 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-2">Free Tier</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Perfect for trying out the platform.
            </p>
            <Button variant="outline" className="w-full mb-8 h-10">
              Start for Free
            </Button>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>1 Interview / Month</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Basic Feedback</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Standard Latency</span>
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="rounded-xl border border-primary/20 bg-card p-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro Tier</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">$19</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-6">
              For serious candidates who want to win.
            </p>
            <Button className="w-full mb-8 h-10 shadow-lg shadow-primary/20">
              Get Pro Access
            </Button>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited Interviews</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>Advanced Metrics & Analytics</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>Resume Analysis</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority Support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
