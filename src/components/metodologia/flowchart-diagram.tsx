"use client";

import {
	Background,
	Controls,
	MarkerType,
	ReactFlow,
	type Edge,
	type Node,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
	{
		id: "search",
		position: { x: 50, y: 150 },
		data: {
			label: (
				<div className="text-center">
					<div className="font-semibold text-[#0f172a]">
						String de busca (exemplo)
					</div>
					<div className="mt-1 text-xs text-[#475569]">
						(&quot;machine learning&quot; OR &quot;IA&quot;)
						<br />
						AND (&quot;eia&quot; OR &quot;environment&quot;)
					</div>
				</div>
			),
		},
		style: {
			background: "#f8fafc",
			border: "2px solid #3b82f6",
			borderRadius: "8px",
			padding: "16px",
			width: 220,
			color: "#0f172a",
		},
	},
	{
		id: "scopus",
		position: { x: 350, y: 50 },
		data: { label: "Scopus" },
		style: {
			background: "#fef3c7",
			border: "2px solid #f59e0b",
			borderRadius: "8px",
			padding: "12px 24px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "openalex",
		position: { x: 350, y: 220 },
		data: { label: "OpenAlex" },
		style: {
			background: "#fecaca",
			border: "2px solid #ef4444",
			borderRadius: "8px",
			padding: "12px 24px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "intersection",
		position: { x: 600, y: 135 },
		data: { label: "Intersecção" },
		style: {
			background: "#ddd6fe",
			border: "2px solid #8b5cf6",
			borderRadius: "8px",
			padding: "12px 24px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "fwci",
		position: { x: 600, y: 280 },
		data: { label: "Filtro FWCI > 1" },
		style: {
			background: "#fed7aa",
			border: "2px solid #f97316",
			borderRadius: "8px",
			padding: "12px 24px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "classifier",
		position: { x: 600, y: 400 },
		data: { label: "Classificação (605)" },
		style: {
			background: "#fbcfe8",
			border: "2px solid #ec4899",
			borderRadius: "8px",
			padding: "12px 24px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "agents",
		position: { x: 860, y: 400 },
		data: {
			label: (
				<div className="text-center text-sm">
					Fluxo de agentes
					<br />
					(3 LLMs)
				</div>
			),
		},
		style: {
			background: "#ccfbf1",
			border: "2px solid #14b8a6",
			borderRadius: "8px",
			padding: "12px 20px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "related",
		position: { x: 1110, y: 325 },
		data: { label: "Relacionados à AIA (483)" },
		style: {
			background: "#dcfce7",
			border: "2px solid #22c55e",
			borderRadius: "8px",
			padding: "12px 20px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "not-related",
		position: { x: 1110, y: 465 },
		data: { label: "Não relacionados à AIA (122)" },
		style: {
			background: "#fef2f2",
			border: "2px solid #ef4444",
			borderRadius: "8px",
			padding: "12px 20px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
	{
		id: "final",
		position: { x: 1380, y: 325 },
		data: {
			label: (
				<div className="text-center text-sm">
					Filtragem adicional por termos
					<br />
					específicos (118)
				</div>
			),
		},
		style: {
			background: "#bbf7d0",
			border: "2px solid #10b981",
			borderRadius: "8px",
			padding: "12px 24px",
			color: "#0f172a",
			fontWeight: 600,
		},
	},
];

const initialEdges: Edge[] = [
	{
		id: "e-search-scopus",
		source: "search",
		target: "scopus",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
	{
		id: "e-search-openalex",
		source: "search",
		target: "openalex",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
	{
		id: "e-scopus-intersection",
		source: "scopus",
		target: "intersection",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
	{
		id: "e-openalex-intersection",
		source: "openalex",
		target: "intersection",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
	{
		id: "e-intersection-fwci",
		source: "intersection",
		target: "fwci",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
	{
		id: "e-fwci-classifier",
		source: "fwci",
		target: "classifier",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
	{
		id: "e-classifier-agents",
		source: "classifier",
		target: "agents",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
	{
		id: "e-agents-related",
		source: "agents",
		target: "related",
		type: "smoothstep",
		style: { stroke: "#22c55e", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
	},
	{
		id: "e-agents-not-related",
		source: "agents",
		target: "not-related",
		type: "smoothstep",
		style: { stroke: "#ef4444", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
	},
	{
		id: "e-related-final",
		source: "related",
		target: "final",
		type: "smoothstep",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
	},
];

export function FlowchartDiagram() {
	const [nodes, , onNodesChange] = useNodesState(initialNodes);
	const [edges, , onEdgesChange] = useEdgesState(initialEdges);

	return (
		<div className="h-[640px] w-full overflow-hidden rounded-lg border border-[#cbd5e1] bg-white shadow-inner">
			<ReactFlow
				edges={edges}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				maxZoom={1.5}
				minZoom={0.5}
				nodes={nodes}
				onEdgesChange={onEdgesChange}
				onNodesChange={onNodesChange}
				proOptions={{ hideAttribution: true }}
			>
				<Background color="#e2e8f0" gap={16} size={1} />
				<Controls className="rounded-lg border border-[#cbd5e1] bg-white shadow-lg" />
			</ReactFlow>
		</div>
	);
}
