export function Comparison() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Stop practicing the wrong way
          </h2>
          <p className="text-lg text-muted-foreground">
            See how RoundZero compares to traditional preparation methods.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="py-6 px-6 text-left text-sm font-medium text-muted-foreground w-1/4">
                    Feature
                  </th>
                  <th className="py-6 px-6 text-center text-sm font-medium text-muted-foreground w-1/4">
                    Friends / Peers
                  </th>
                  <th className="py-6 px-6 text-center text-sm font-medium text-muted-foreground w-1/4">
                    LeetCode
                  </th>
                  <th className="py-6 px-6 text-center text-lg font-bold text-primary w-1/4 bg-primary/5">
                    RoundZero
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="py-4 px-6 font-medium">Availability</td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    Hard to schedule
                  </td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    24/7
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-foreground bg-primary/5">
                    24/7
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Feedback</td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    "You did good!" (Polite)
                  </td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    Pass / Fail
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-foreground bg-primary/5">
                    "You missed edge case X"
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Reality</td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    Low pressure
                  </td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    Text only
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-foreground bg-primary/5">
                    Voice + Code + Pressure
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Cost</td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    Free (but favors owed)
                  </td>
                  <td className="py-4 px-6 text-center text-muted-foreground">
                    $35/mo
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-foreground bg-primary/5">
                    Free Tier Available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
