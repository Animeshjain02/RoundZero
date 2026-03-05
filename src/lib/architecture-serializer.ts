import type { Edge, Node } from "@xyflow/react";

interface SerializedNode {
  id: string;
  type: string;
  label: string;
  details?: string;
  position: { x: number; y: number };
}

interface SerializedEdge {
  id: string;
  source: string;
  sourceLabel: string;
  target: string;
  targetLabel: string;
}

export interface ArchitectureSerialization {
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  nodeCount: number;
  edgeCount: number;
}

export function serializeArchitecture(
  nodes: Node[],
  edges: Edge[],
): ArchitectureSerialization {
  const serializedNodes: SerializedNode[] = nodes.map((node) => {
    const data = node.data as Record<string, unknown>;
    return {
      id: node.id,
      type: (data?.type as string) || "unknown",
      label: (data?.label as string) || node.id,
      details: data?.details as string | undefined,
      position: node.position,
    };
  });

  const serializedEdges: SerializedEdge[] = edges.map((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    const sourceData = sourceNode?.data as Record<string, unknown>;
    const targetData = targetNode?.data as Record<string, unknown>;

    return {
      id: edge.id,
      source: edge.source,
      sourceLabel: (sourceData?.label as string) || edge.source,
      target: edge.target,
      targetLabel: (targetData?.label as string) || edge.target,
    };
  });

  return {
    nodes: serializedNodes,
    edges: serializedEdges,
    nodeCount: nodes.length,
    edgeCount: edges.length,
  };
}

export function formatArchitectureForLLM(
  serialization: ArchitectureSerialization,
): string {
  const nodeDescriptions = serialization.nodes
    .map((node) => {
      let desc = `- **${node.label}** (${node.type})`;
      if (node.details) {
        desc += `: ${node.details}`;
      }
      return desc;
    })
    .join("\n");

  const edgeDescriptions = serialization.edges
    .map((edge) => `- **${edge.sourceLabel}** → **${edge.targetLabel}**`)
    .join("\n");

  return `## Architecture Components (${serialization.nodeCount} nodes)
${nodeDescriptions || "No components added yet."}

## Connections (${serialization.edgeCount} edges)
${edgeDescriptions || "No connections defined yet."}`;
}
