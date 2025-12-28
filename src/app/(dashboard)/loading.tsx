import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
