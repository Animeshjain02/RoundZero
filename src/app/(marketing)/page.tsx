import { AudioSamples } from "./_components/audio-samples";
import { Comparison } from "./_components/comparison";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { HowItWorks } from "./_components/how-it-works";
import { Navbar } from "./_components/navbar";
import { Pricing } from "./_components/pricing";
import { SampleReport } from "./_components/sample-report";
import { TrustBar } from "./_components/trust-bar";

export default function Home() {
  return (
    <div className="min-h-screen container mx-auto bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <Comparison />
        <AudioSamples />
        <SampleReport />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
