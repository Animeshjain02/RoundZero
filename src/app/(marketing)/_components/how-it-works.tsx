import { Code2, FileText, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section
      id="features"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How RoundZero Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete interview simulation that adapts to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="md:col-span-1 lg:col-span-1 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border-border/50 hover:border-primary/20 h-full group">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Context Aware</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We scan your PDF Resume and the Job Description to create a
                custom interrogation strategy tailored specifically to your
                background.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 lg:col-span-1 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border-border/50 hover:border-primary/20 h-full group">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                <Mic className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Voice First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Speak naturally. Our AI listens and responds instantly with
                human-like latency, simulating a real conversation.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 lg:col-span-1 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border-border/50 hover:border-primary/20 h-full group">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                <Code2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Live Coding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Full Monaco Editor environment for technical rounds. Write, run,
                and debug code while explaining your thought process.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
