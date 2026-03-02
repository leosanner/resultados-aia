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

const COLUMN_X = {
	tec: 80,
	articles: 520,
	env: 960,
} as const;

const TOP_OFFSET = 24;
const MAX_VIEWPORT_HEIGHT = 560;
const MIN_ROW_GAP = 26;
const MAX_ROW_GAP = 46;

const sortByLabel = (a: BaseGraphNode, b: BaseGraphNode) => {
	const labelA = (a.data.label ?? a.id).toString();
	const labelB = (b.data.label ?? b.id).toString();

	return labelA.localeCompare(labelB, "pt-BR", { numeric: true });
};

const buildSemanticColumn = (
	nodes: BaseGraphNode[],
	columnX: number,
	borderColor: string,
	maxColumnLength: number,
	rowGap: number,
): Node[] => {
	const sortedNodes = [...nodes].sort(sortByLabel);
	const columnOffset = ((maxColumnLength - sortedNodes.length) * rowGap) / 2;

	return sortedNodes.map((node, index) => ({
		id: node.id,
		position: {
			x: columnX,
			y: TOP_OFFSET + columnOffset + index * rowGap,
		},
		data: { label: node.data.label ?? node.id },
		style: {
			...nodeBaseStyle,
			border: `2px solid ${borderColor}`,
		},
	}));
};

export function LandingTermsGraph({ graph }: LandingTermsGraphProps) {
	const tecBaseNodes = Object.values(graph.nodes.tecNode);
	const envBaseNodes = Object.values(graph.nodes.envNode);
	const articleBaseNodes = graph.nodes.articlesNode;
	const maxColumnLength = Math.max(
		tecBaseNodes.length,
		envBaseNodes.length,
		articleBaseNodes.length,
	);
	const estimatedGap =
		maxColumnLength > 1
			? Math.floor((MAX_VIEWPORT_HEIGHT - TOP_OFFSET) / (maxColumnLength - 1))
			: MAX_ROW_GAP;
	const rowGap = Math.max(MIN_ROW_GAP, Math.min(MAX_ROW_GAP, estimatedGap));

	const tecNodes: Node[] = buildSemanticColumn(
		tecBaseNodes,
		COLUMN_X.tec,
		"#2563eb",
		maxColumnLength,
		rowGap,
	);
	const articleNodes: Node[] = buildSemanticColumn(
		articleBaseNodes,
		COLUMN_X.articles,
		"#4c1d95",
		maxColumnLength,
		rowGap,
	);
	const envNodes: Node[] = buildSemanticColumn(
		envBaseNodes,
		COLUMN_X.env,
		"#16a34a",
		maxColumnLength,
		rowGap,
	);

	const nodes: Node[] = [...tecNodes, ...articleNodes, ...envNodes];
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
