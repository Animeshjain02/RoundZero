"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  type EdgeTypes,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Node, NodeTypes } from "@xyflow/react";
import { RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ArchitectureEvaluation } from "@/lib/gemini";
import { orpc } from "@/lib/orpc-client";
import { DataFlowEdge } from "./edges/data-flow-edge";
import { EvaluationResultsSheet } from "./evaluation-results-sheet";
import { NodeSidebar } from "./node-sidebar";
import { SystemNode } from "./nodes/system-node";

const nodeTypes: NodeTypes = {
  systemNode: SystemNode as any,
};

const edgeTypes: EdgeTypes = {
  dataFlowEdge: DataFlowEdge as any,
};

const defaultEdgeOptions = {
  type: "dataFlowEdge",
  animated: false,
};

const connectionLineStyle = {
  strokeWidth: 2,
  stroke: "color-mix(in oklch, var(--primary) 50%, transparent)",
  strokeDasharray: "6 4",
};

// Extracted inner component to use hooks that depend on ReactFlowProvider
function ArenaInner({ problemId }: { problemId: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getNodes, getEdges, fitView } = useReactFlow();

  const [showResults, setShowResults] = useState(false);
  const [evaluationResult, setEvaluationResult] =
    useState<ArchitectureEvaluation | null>(null);

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

  const { mutate: evaluateArchitecture, isPending: isEvaluating } = useMutation(
    orpc.practice.evaluateArchitecture.mutationOptions({
      onSuccess: (data) => {
        setEvaluationResult(data);
        setShowResults(true);
        toast.success("Architecture evaluated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to evaluate architecture");
      },
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

    // Load existing AI feedback if available
    if (attempt?.aiFeedback) {
      setEvaluationResult(attempt.aiFeedback as ArchitectureEvaluation);
    }
  }, [attempt, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) => addEdge({ ...params, type: "dataFlowEdge" }, eds)),
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

  // Delete selected nodes/edges on Backspace / Delete key
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Backspace" || event.key === "Delete") {
        // Don't delete if user is typing in an input/textarea
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }

        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    },
    [setNodes, setEdges],
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

  const handleEvaluate = () => {
    if (nodes.length === 0) {
      toast.error("Please add some components before submitting for review");
      return;
    }

    const payload = {
      nodes: getNodes(),
      edges: getEdges(),
    };

    evaluateArchitecture({
      problemId,
      nodes: payload.nodes,
      edges: payload.edges,
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <NodeSidebar />

      <div
        className="relative flex-1"
        ref={reactFlowWrapper}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineStyle={connectionLineStyle}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-dot-pattern"
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={null}
          selectionOnDrag
          selectNodesOnDrag={false}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={2}
            className="opacity-40"
          />
          <Controls className="bg-background border border-border/50 shadow-sm rounded-xl overflow-hidden" />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="rounded-xl!"
            maskColor="rgba(0, 0, 0, 0.15)"
          />

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
              <Button
                size="sm"
                className="rounded-xl shadow-md font-medium cursor-pointer"
                onClick={handleEvaluate}
                disabled={isEvaluating}
              >
                {isEvaluating ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Submit for Review
              </Button>
              {evaluationResult && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl shadow-md font-medium cursor-pointer"
                  onClick={() => setShowResults(true)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  View Last Review
                </Button>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <EvaluationResultsSheet
        open={showResults}
        onOpenChange={setShowResults}
        evaluation={evaluationResult}
        isLoading={isEvaluating}
      />
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
