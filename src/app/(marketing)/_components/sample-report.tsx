import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function SampleReport() {
  return (
    <section className="py-24 px-10 flex items-center justify-center overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Detailed Feedback, <br />
            <span className="text-primary">Not just "Good Job"</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get a comprehensive scorecard after every session. We analyze your
            communication style, technical accuracy, and problem-solving
            approach.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors border border-transparent hover:border-border/50">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0 text-red-600 border border-red-200 dark:border-red-900/50">
                <span className="font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Communication Score</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed breakdown of filler words, pacing, and tone.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors border border-transparent hover:border-border/50">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-blue-600 border border-blue-200 dark:border-blue-900/50">
                <span className="font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Technical Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  Did you handle edge cases? Was your complexity optimal?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-xl shadow-2xl border border-border/50 bg-background max-w-md mx-auto group">
            <Image
              src="/images/scorecard.png"
              alt="Sample Scorecard"
              width={600}
              height={800}
              className="w-full h-auto rounded-xl"
            />

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-background/90 backdrop-blur-md p-4 rounded-lg shadow-xl border border-border/50 max-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive" className="rounded-sm px-2 py-0.5">
                  Critical
                </Badge>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                "You used 'um' 42 times and avoided eye contact."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
