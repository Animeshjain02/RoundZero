import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Now in Public Beta
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Fail here, so you <br />
          <span className="text-primary">don't fail there.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance mb-10">
          Real-time voice interviews tailored to your Resume. Powered by Gemini.
          Feedback in milliseconds, not days.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button
            size="lg"
            className="h-12 px-8 text-base group shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            Upload Resume & Start
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base hover:bg-secondary/80 backdrop-blur-sm"
          >
            <FileText className="mr-2 h-4 w-4" />
            View Sample Report
          </Button>
        </div>

        <div className="relative w-full max-w-5xl mx-auto rounded-xl border border-border/50 bg-background/50 shadow-2xl overflow-hidden group backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <Image
            src="/images/hero.png"
            alt="RoundZero Interface"
            width={1200}
            height={800}
            className="w-full h-auto rounded-xl shadow-2xl"
            priority
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
        </div>
      </div>
    </section>
  );
}
