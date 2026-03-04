import { Server, Database, Zap, Boxes, Globe, Cloud } from "lucide-react";

export const CUSTOM_NODES = {
  systemNode: "systemNode",
} as const;

export const NODE_TYPES = [
  {
    type: "client",
    label: "Client",
    details: "User / Mobile / Web",
    icon: Cloud,
  },
  {
    type: "compute",
    label: "Server",
    details: "App / API / Worker",
    icon: Server,
  },
  {
    type: "database",
    label: "Database",
    details: "SQL / NoSQL",
    icon: Database,
  },
  {
    type: "cache",
    label: "Cache",
    details: "Redis / Memcached",
    icon: Zap,
  },
  {
    type: "storage",
    label: "Storage",
    details: "S3 / Blob",
    icon: Boxes,
  },
  {
    type: "network",
    label: "Network",
    details: "LB / CDN / DNS",
    icon: Globe,
  },
] as const;

export function NodeSidebar() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    label: string,
    details?: string,
  ) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/label", label);
    if (details) {
      event.dataTransfer.setData("application/reactflow/details", details);
    }
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border/40 bg-card/50 backdrop-blur-sm p-4 animate-in slide-in-from-left duration-500 flex flex-col h-full">
      <div className="space-y-1 mb-6">
        <h2 className="text-lg font-bold tracking-tight">Components</h2>
        <p className="text-sm text-muted-foreground leading-relaxed text-balance">
          Drag and drop nodes to build your architecture.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="grid grid-cols-2 gap-3">
          {NODE_TYPES.map((node) => {
            const Icon = node.icon;

            return (
              <div
                key={node.type}
                className="group flex cursor-grab flex-col items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 p-3 text-center transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm active:cursor-grabbing"
                onDragStart={(event) =>
                  onDragStart(event, node.type, node.label, node.details)
                }
                draggable
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-xs font-semibold">
                    {node.label}
                  </span>
                  <span className="block text-[9px] text-muted-foreground/80 font-medium uppercase tracking-wider">
                    {node.details}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
