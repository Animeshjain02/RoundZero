"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  Connection,
  Edge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SystemNode } from "./nodes/system-node";
import { NodeSidebar } from "./node-sidebar";

import type { NodeTypes, Node } from "@xyflow/react";
import { orpc } from "@/lib/orpc-client";

const nodeTypes: NodeTypes = {
  systemNode: SystemNode as any,
};

// Extracted inner component to use hooks that depend on ReactFlowProvider
function ArenaInner({ problemId }: { problemId: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getNodes, getEdges, fitView } = useReactFlow();

  const { data: attempt, isLoading } = useQuery(
    orpc.practice.getAttempt.queryOptions({
      input: { problemId },
    }),
  );

  const { mutate: saveAttempt, isPending: isSaving } = useMutation(
    orpc.practice.submitAttempt.mutationOptions({
      onSuccess: () => toast.success("Architecture saved successfully"),
      onError: () => toast.error("Failed to save progress"),
    }),
  );

  // Load existing attempt data
  useEffect(() => {
    if (attempt?.architectureJson) {
      const json = attempt.architectureJson as {
        nodes?: Node[];
        edges?: Edge[];
      };
      if (json.nodes?.length) setNodes(json.nodes);
      if (json.edges?.length) setEdges(json.edges);

      // Give React Flow a moment to render before fitting view
      setTimeout(() => fitView({ padding: 0.2 }), 50);
    }
  }, [attempt, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow/type");
      const label = event.dataTransfer.getData("application/reactflow/label");
      const details = event.dataTransfer.getData(
        "application/reactflow/details",
      );

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Calculate drop position
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type: "systemNode",
        position,
        data: { label, type, details },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const handleSave = () => {
    const payload = {
      nodes: getNodes(),
      edges: getEdges(),
    };

    saveAttempt({
      problemId,
      architectureJson: payload,
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <NodeSidebar />

      <div className="relative flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-dot-pattern"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={2}
            className="opacity-40"
          />
          <Controls className="bg-background border border-border/50 shadow-sm rounded-xl overflow-hidden" />

          <Panel position="top-right" className="m-4">
            <div className="flex items-center gap-3">
              {isLoading && (
                <span className="text-xs text-muted-foreground mr-2 flex items-center bg-background/80 backdrop-blur px-3 py-1.5 rounded-xl border border-border/50 shadow-sm">
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin text-primary" />{" "}
                  Loading state...
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl bg-background/80 backdrop-blur shadow-sm border-border/50 font-medium cursor-pointer"
                onClick={() => {
                  setNodes([]);
                  setEdges([]);
                }}
              >
                Clear Board
              </Button>
              <Button
                size="sm"
                className="rounded-xl shadow-md font-medium cursor-pointer"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Progress
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

// Wrapper to provide ReactFlow context to the canvas core
export default function ArenaCanvas({ problemId }: { problemId: string }) {
  // Prevent hydration UI mismatch since Flow relies on window size
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-background">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <ArenaInner problemId={problemId} />
    </ReactFlowProvider>
  );
}
