import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { TrustBar } from "./_components/trust-bar";
import { HowItWorks } from "./_components/how-it-works";
import { Comparison } from "./_components/comparison";
import { AudioSamples } from "./_components/audio-samples";
import { SampleReport } from "./_components/sample-report";
import { Pricing } from "./_components/pricing";
import { Footer } from "./_components/footer";

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
