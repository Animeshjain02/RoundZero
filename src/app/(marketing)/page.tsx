"use client";

import { AudioSamples } from "./_components/audio-samples";
import { Comparison } from "./_components/comparison";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { HowItWorks } from "./_components/how-it-works";
import { Navbar } from "./_components/navbar";
import { Pricing } from "./_components/pricing";
import { SampleReport } from "./_components/sample-report";
import { Testimonials } from "./_components/testimonials";
import { TrustBar } from "./_components/trust-bar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden noise-bg">
      {/* Premium gradient mesh background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Primary gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_50%)] animate-glow" />
        {/* Secondary accent orb */}
        <div
          className="absolute top-[40%] -right-[20%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(262_83%_58%/0.08),transparent_50%)] animate-glow"
          style={{ animationDelay: "2s" }}
        />
        {/* Tertiary orb */}
        <div
          className="absolute top-[70%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06),transparent_50%)] animate-glow"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Navbar />
      <main className="relative z-[1]">
        <Hero />
        <TrustBar />
        <HowItWorks />
        <Comparison />
        <AudioSamples />
        <Testimonials />
        <SampleReport />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
