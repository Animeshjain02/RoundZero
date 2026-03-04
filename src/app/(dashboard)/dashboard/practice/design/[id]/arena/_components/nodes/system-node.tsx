import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Server, Database, Cloud, Globe, Boxes, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type SystemNodeData = {
  label: string;
  type: "compute" | "database" | "cache" | "storage" | "network" | "client";
  details?: string;
};

type CustomNode = Node<SystemNodeData, "systemNode">;

const ICONS = {
  compute: Server,
  database: Database,
  cache: Zap,
  storage: Boxes,
  network: Globe,
  client: Cloud,
} as const;

export function SystemNode({ data, selected }: NodeProps<CustomNode>) {
  const Icon = ICONS[data.type as keyof typeof ICONS] || Server;

  return (
    <div
      className={cn(
        "group relative flex min-w-[150px] flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 transition-all duration-200",
        selected
          ? "border-primary shadow-lg shadow-primary/20 ring-1 ring-primary"
          : "border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md",
      )}
    >
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="h-3 w-3 border-2 border-background bg-primary/80 transition-all hover:bg-primary"
      />

      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-colors",
          data.type === "compute" &&
            "bg-blue-500/10 border-blue-500/20 text-blue-500",
          data.type === "database" &&
            "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
          data.type === "cache" &&
            "bg-amber-500/10 border-amber-500/20 text-amber-500",
          data.type === "storage" &&
            "bg-purple-500/10 border-purple-500/20 text-purple-500",
          data.type === "network" &&
            "bg-rose-500/10 border-rose-500/20 text-rose-500",
          data.type === "client" &&
            "bg-slate-500/10 border-slate-500/20 text-slate-500 dark:text-slate-400",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="text-center">
        <div className="text-sm font-semibold tracking-tight">{data.label}</div>
        {data.details && (
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
            {data.details}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="h-3 w-3 border-2 border-background bg-primary/80 transition-all hover:bg-primary"
      />
    </div>
  );
}
