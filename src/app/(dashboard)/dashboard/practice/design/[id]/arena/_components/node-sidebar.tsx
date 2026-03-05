import {
  DESIGN_NODES,
  type DesignNode,
  NODE_CATEGORIES,
} from "@/lib/design-nodes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const CUSTOM_NODES = {
  systemNode: "systemNode",
} as const;

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
    <aside className="w-80 shrink-0 border-r border-border/40 bg-card/30 backdrop-blur-xl p-0 flex flex-col h-screen max-h-[calc(100vh-4rem)] overflow-hidden shadow-2xl">
      <div className="shrink-0 p-6 pb-4 space-y-1.5 border-b border-border/10 bg-background/5">
        <h2 className="text-xl font-bold tracking-tight text-foreground/90">
          Components
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
          Drag and drop components to build your architecture.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 py-8 space-y-12 pb-24">
            {NODE_CATEGORIES.map((category) => {
              const categoryNodes = DESIGN_NODES.filter(
                (node) => node.category === category.id,
              );
              const CategoryIcon = category.icon;

              if (categoryNodes.length === 0) return null;

              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center gap-2.5 px-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <CategoryIcon className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-[11px] font-bold text-foreground/60 uppercase tracking-[0.15em]">
                      {category.label}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {categoryNodes.map((node: DesignNode) => {
                      const Icon = node.icon;

                      return (
                        <div
                          key={node.type}
                          className={cn(
                            "group relative flex cursor-grab flex-col items-center justify-center gap-3",
                            "rounded-2xl border border-border/50 bg-background/40 p-4 text-center transition-all duration-300",
                            "hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                            "dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:scale-95 active:cursor-grabbing",
                          )}
                          onDragStart={(event) =>
                            onDragStart(
                              event,
                              node.type,
                              node.label,
                              node.details,
                            )
                          }
                          draggable
                          title={node.description}
                        >
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/40 text-muted-foreground transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary group-hover:scale-110">
                            <Icon className="h-6 w-6 stroke-[1.5]" />
                            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-foreground/5 group-hover:ring-primary/20 transition-all" />
                          </div>

                          <div className="space-y-1.5 min-w-0 w-full px-1">
                            <span className="block text-[11px] font-bold text-foreground/80 leading-tight truncate">
                              {node.label}
                            </span>
                            <span className="block text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest truncate">
                              {node.details}
                            </span>
                          </div>

                          {/* Hover subtle glow */}
                          <div className="absolute inset-0 -z-10 bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100 rounded-2xl" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
