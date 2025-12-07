import { Building2 } from "lucide-react";

export function TrustBar() {
  const companies = [
    { name: "Google", logo: "Google" },
    { name: "Amazon", logo: "Amazon" },
    { name: "Airbnb", logo: "Airbnb" },
    { name: "Linear", logo: "Linear" },
    { name: "Vercel", logo: "Vercel" },
  ];

  return (
    <section className="py-16 border-y border-border/40 bg-muted/10 backdrop-blur-sm">
      <div className="container text-center">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground mb-8 uppercase">
          Prep for roles at top companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex items-center gap-2 text-xl font-bold text-foreground/80 hover:text-foreground transition-colors"
            >
              <Building2 className="h-6 w-6" />
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
