"use client";

import {
	Background,
	Controls,
	MarkerType,
	ReactFlow,
	type Edge,
	type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type BaseGraphNode = {
	id: string;
	position: { x: number; y: number };
	data: { label?: string };
};

type BaseGraphEdge = {
	id: string;
	source: string;
	target: string;
	type?: string;
};

type LandingTermsGraphProps = {
	graph: {
		nodes: {
			envNode: Record<string, BaseGraphNode>;
			tecNode: Record<string, BaseGraphNode>;
			articlesNode: BaseGraphNode[];
		};
		edges: BaseGraphEdge[];
	};
};

const nodeBaseStyle = {
	background: "#ffffff",
	borderRadius: 12,
	padding: "8px 10px",
	color: "#0f172a",
	fontSize: 12,
	fontWeight: 600,
	boxShadow: "0 10px 18px -14px rgba(15, 23, 42, 0.55)",
};

const buildStyledNode = (node: BaseGraphNode, borderColor: string): Node => ({
	id: node.id,
	position: node.position,
	data: { label: node.data.label ?? node.id },
	style: {
		...nodeBaseStyle,
		border: `2px solid ${borderColor}`,
	},
});

export function LandingTermsGraph({ graph }: LandingTermsGraphProps) {
	const tecNodes: Node[] = Object.values(graph.nodes.tecNode).map((node) =>
		buildStyledNode(node, "#2563eb"),
	);
	const envNodes: Node[] = Object.values(graph.nodes.envNode).map((node) =>
		buildStyledNode(node, "#16a34a"),
	);
	const articleNodes: Node[] = graph.nodes.articlesNode.map((node) =>
		buildStyledNode(node, "#4c1d95"),
	);

	const nodes: Node[] = [...tecNodes, ...envNodes, ...articleNodes];
	const edges: Edge[] = graph.edges.map((edge) => ({
		id: edge.id,
		source: edge.source,
		target: edge.target,
		type: edge.type ?? "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 1.2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	}));

	return (
		<div className="h-[620px] w-full overflow-hidden rounded-3xl border border-[#cbd5e1] bg-white">
			<ReactFlow
				edges={edges}
				fitView
				fitViewOptions={{ padding: 0.15 }}
				maxZoom={1.4}
				minZoom={0.3}
				nodes={nodes}
				nodesConnectable={false}
				nodesDraggable={false}
				panOnDrag
				proOptions={{ hideAttribution: true }}
				selectNodesOnDrag={false}
			>
				<Background color="#e2e8f0" gap={16} size={1} />
				<Controls className="rounded-lg border border-[#cbd5e1] bg-white shadow-lg" />
			</ReactFlow>
		</div>
	);
}
