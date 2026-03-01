import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="noise-bg flex min-h-dvh flex-col items-center justify-center bg-background px-6 antialiased selection:bg-primary selection:text-primary-foreground">
      <Card className="z-10 w-full max-w-2xl border-none bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-8 text-center p-0">
          {/* Monolithic Number */}
          <h1 className="font-heading text-[clamp(8rem,20vw,16rem)] font-black leading-none tracking-tighter text-foreground shadow-sm sm:text-[clamp(12rem,25vw,20rem)] select-none">
            404
          </h1>

          <div className="flex flex-col gap-4 text-foreground">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-widest sm:text-3xl">
              Page Not Found
            </h2>
            <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              The coordinates you provided do not exist in our systems. It may
              have been moved, deleted, or perhaps it never existed at all.
            </p>
          </div>

          {/* Crisp Industrial Button */}
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-none px-8 py-6 font-semibold uppercase tracking-wider"
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-3 h-5 w-5" />
                Return to Base
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid Pattern Background - Industrial texture without gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Hard cut fade instead of gradient */}
        <div className="absolute bottom-0 h-1/3 w-full bg-background/50 backdrop-blur-sm" />
      </div>
    </div>
  );
}
