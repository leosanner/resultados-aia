"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
			articlesNode: BaseGraphNode;
		};
		edges: BaseGraphEdge[];
		totalArticles: number;
		articleIdsByTopicId: Record<string, string[]>;
	};
};

const nodeBaseStyle = {
	background: "#ffffff",
	borderRadius: 12,
	padding: "8px 10px",
	color: "#111111",
	fontSize: 12,
	fontWeight: 600,
	boxShadow: "0 12px 22px -14px rgba(17, 17, 17, 0.42)",
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

const getRowGap = (itemsCount: number, minGap = MIN_ROW_GAP, maxGap = MAX_ROW_GAP) => {
	if (itemsCount <= 1) return maxGap;

	const estimatedGap = Math.floor((MAX_VIEWPORT_HEIGHT - TOP_OFFSET) / (itemsCount - 1));

	return Math.max(minGap, Math.min(maxGap, estimatedGap));
};

const buildArticleNode = (node: BaseGraphNode, totalArticles: number): Node => ({
	id: node.id,
	position: {
		x: COLUMN_X.articles,
		y: TOP_OFFSET + (MAX_VIEWPORT_HEIGHT - TOP_OFFSET) / 2,
	},
	data: { label: `${totalArticles} artigos` },
	style: {
		...nodeBaseStyle,
		border: "2px solid #166534",
		background: "#dcfce7",
		fontSize: 14,
		padding: "12px 16px",
	},
});

export function LandingTermsGraph({ graph }: LandingTermsGraphProps) {
	const router = useRouter();
	const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [manualPositions, setManualPositions] = useState<
		Record<string, { x: number; y: number }>
	>({});

	const tecBaseNodes = useMemo(() => Object.values(graph.nodes.tecNode), [graph]);
	const envBaseNodes = useMemo(() => Object.values(graph.nodes.envNode), [graph]);
	const articleBaseNode = graph.nodes.articlesNode;
	const normalizedSearch = searchTerm.trim().toLowerCase();
	const showAllTopics = normalizedSearch.length === 0;
	const connectedTopicIds = useMemo(
		() => new Set(graph.edges.map((edge) => edge.target)),
		[graph.edges],
	);
	const connectedTecNodes = useMemo(
		() => tecBaseNodes.filter((node) => connectedTopicIds.has(node.id)),
		[tecBaseNodes, connectedTopicIds],
	);
	const connectedEnvNodes = useMemo(
		() => envBaseNodes.filter((node) => connectedTopicIds.has(node.id)),
		[envBaseNodes, connectedTopicIds],
	);

	const filteredTecTopics = useMemo(() => {
		if (showAllTopics) return connectedTecNodes;

		return connectedTecNodes.filter((node) =>
			(node.data.label ?? node.id).toLowerCase().includes(normalizedSearch),
		);
	}, [showAllTopics, connectedTecNodes, normalizedSearch]);

	const filteredEnvTopics = useMemo(() => {
		if (showAllTopics) return connectedEnvNodes;

		return connectedEnvNodes.filter((node) =>
			(node.data.label ?? node.id).toLowerCase().includes(normalizedSearch),
		);
	}, [showAllTopics, connectedEnvNodes, normalizedSearch]);

	const topicNodeIds = useMemo(
		() =>
			new Set(
				[...connectedTecNodes, ...connectedEnvNodes].map((node) => node.id),
			),
		[connectedTecNodes, connectedEnvNodes],
	);

	const selectedTopicSet = useMemo(
		() => new Set(selectedTopicIds.filter((id) => topicNodeIds.has(id))),
		[selectedTopicIds, topicNodeIds],
	);
	const topicLookup = useMemo(() => {
		const lookup = new Map<string, { label: string; kind: "tec" | "env" }>();

		for (const node of tecBaseNodes) {
			lookup.set(node.id, { label: node.data.label ?? node.id, kind: "tec" });
		}
		for (const node of envBaseNodes) {
			lookup.set(node.id, { label: node.data.label ?? node.id, kind: "env" });
		}

		return lookup;
	}, [tecBaseNodes, envBaseNodes]);
	const selectedTermsByType = useMemo(() => {
		const tec: string[] = [];
		const env: string[] = [];

		for (const topicId of selectedTopicSet) {
			const topic = topicLookup.get(topicId);
			if (!topic) continue;

			if (topic.kind === "tec") tec.push(topic.label);
			else env.push(topic.label);
		}

		return { tec, env };
	}, [selectedTopicSet, topicLookup]);

	const hasActiveFilter = selectedTopicSet.size > 0;
	const filteredArticleCount = useMemo(() => {
		if (!hasActiveFilter) return graph.totalArticles;

		const matchedArticles = new Set<string>();
		for (const topicId of selectedTopicSet) {
			const articleIds = graph.articleIdsByTopicId[topicId] ?? [];
			for (const articleId of articleIds) {
				matchedArticles.add(articleId);
			}
		}

		return matchedArticles.size;
	}, [hasActiveFilter, graph.totalArticles, graph.articleIdsByTopicId, selectedTopicSet]);

	const visibleEdgesBase = useMemo(() => {
		if (!hasActiveFilter) return graph.edges;

		return graph.edges.filter((edge) => selectedTopicSet.has(edge.target));
	}, [graph.edges, hasActiveFilter, selectedTopicSet]);

	const visibleArticleIds = useMemo(() => {
		if (!hasActiveFilter) return new Set([articleBaseNode.id]);

		return new Set(visibleEdgesBase.map((edge) => edge.source));
	}, [hasActiveFilter, visibleEdgesBase, articleBaseNode]);

	const visibleTecNodesBase = useMemo(() => {
		if (!hasActiveFilter) return tecBaseNodes;

		return tecBaseNodes.filter((node) => selectedTopicSet.has(node.id));
	}, [hasActiveFilter, tecBaseNodes, selectedTopicSet]);

	const visibleEnvNodesBase = useMemo(() => {
		if (!hasActiveFilter) return envBaseNodes;

		return envBaseNodes.filter((node) => selectedTopicSet.has(node.id));
	}, [hasActiveFilter, envBaseNodes, selectedTopicSet]);

	const visibleArticleNodeBase = useMemo(
		() =>
			filteredArticleCount > 0 && visibleArticleIds.has(articleBaseNode.id)
				? articleBaseNode
				: null,
		[filteredArticleCount, visibleArticleIds, articleBaseNode],
	);

	const semanticMaxColumnLength = Math.max(
		visibleTecNodesBase.length,
		visibleEnvNodesBase.length,
		1,
	);
	const semanticRowGap = getRowGap(semanticMaxColumnLength);

	const tecNodes: Node[] = buildSemanticColumn(
		visibleTecNodesBase,
		COLUMN_X.tec,
		"#0ea5e9",
		semanticMaxColumnLength,
		semanticRowGap,
	);
	const articleNodes: Node[] = visibleArticleNodeBase
		? [buildArticleNode(visibleArticleNodeBase, filteredArticleCount)]
		: [];
	const envNodes: Node[] = buildSemanticColumn(
		visibleEnvNodesBase,
		COLUMN_X.env,
		"#22c55e",
		semanticMaxColumnLength,
		semanticRowGap,
	);

	const visibleNodeIds = new Set(nodesToIds(tecNodes, articleNodes, envNodes));
	const nodes: Node[] = [...tecNodes, ...articleNodes, ...envNodes].map((node) => {
		const manualPosition = manualPositions[node.id];

		return manualPosition ? { ...node, position: manualPosition } : node;
	});
	const edges: Edge[] = visibleEdgesBase
		.filter(
			(edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
		)
		.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			type: edge.type ?? "smoothstep",
			style: { stroke: "#64748b", strokeWidth: 1.35 },
			markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
		}));

	const toggleTopic = (topicId: string) => {
		setSelectedTopicIds((current) =>
			current.includes(topicId)
				? current.filter((id) => id !== topicId)
				: [...current, topicId],
		);
	};

	const clearFilters = () => setSelectedTopicIds([]);
	const showFoundArticles = () => {
		if (selectedTermsByType.tec.length === 0 && selectedTermsByType.env.length === 0) {
			return;
		}

		const query = new URLSearchParams();
		for (const term of selectedTermsByType.tec) query.append("tec", term);
		for (const term of selectedTermsByType.env) query.append("env", term);

		router.push(`/termos?${query.toString()}`);
	};

	const onNodeDragStop = (_: unknown, node: Node) => {
		setManualPositions((current) => ({
			...current,
			[node.id]: { x: node.position.x, y: node.position.y },
		}));
	};

		return (
		<div className="space-y-4">
			<div className="rounded-2xl border border-[#bfdcff] bg-[#eef6ff] p-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<label className="text-sm font-semibold text-[#0f172a]" htmlFor="topic-filter">
						Filtrar por tópicos
					</label>
					<button
						className="rounded-full border border-[#a5b4fc] bg-white px-3 py-1 text-xs font-semibold text-[#4338ca] transition-colors hover:bg-[#eef2ff]"
						onClick={clearFilters}
						type="button"
					>
						Limpar filtros
					</button>
				</div>
				<input
					className="mt-3 w-full rounded-xl border border-[#bfdbfe] bg-white px-3 py-2 text-sm text-[#111111] outline-none ring-[#3b82f6] transition focus:ring-2"
					id="topic-filter"
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder="Buscar tópico..."
					type="text"
					value={searchTerm}
				/>
				<div className="mt-3 max-h-44 overflow-y-auto pr-1">
					<p className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#0369a1]">
						Tecnológicos
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{filteredTecTopics.map((topic) => (
							<button
								aria-pressed={selectedTopicSet.has(topic.id)}
								className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
									selectedTopicSet.has(topic.id)
										? "border-[#0284c7] bg-[#0284c7] text-white"
										: "border-[#7dd3fc] bg-white text-[#0369a1] hover:bg-[#e0f2fe]"
								}`}
								key={topic.id}
								onClick={() => toggleTopic(topic.id)}
								type="button"
							>
								{topic.data.label ?? topic.id}
							</button>
						))}
					</div>
					<p className="mt-4 text-[11px] font-bold uppercase tracking-[0.4px] text-[#15803d]">
						Ambientais
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{filteredEnvTopics.map((topic) => (
							<button
								aria-pressed={selectedTopicSet.has(topic.id)}
								className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
									selectedTopicSet.has(topic.id)
										? "border-[#16a34a] bg-[#16a34a] text-white"
										: "border-[#86efac] bg-white text-[#166534] hover:bg-[#f0fdf4]"
								}`}
								key={topic.id}
								onClick={() => toggleTopic(topic.id)}
								type="button"
							>
								{topic.data.label ?? topic.id}
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="flex justify-end">
				<button
					className="rounded-full bg-[#16a34a] px-4 py-2 text-xs font-bold uppercase tracking-[0.8px] text-white transition-colors enabled:hover:bg-[#15803d] disabled:cursor-not-allowed disabled:bg-[#86efac]"
					disabled={
						selectedTermsByType.tec.length === 0 &&
						selectedTermsByType.env.length === 0
					}
					onClick={showFoundArticles}
					type="button"
				>
					Mostrar artigos encontrados
				</button>
			</div>
			<div className="h-[620px] w-full overflow-hidden rounded-3xl border border-[#cbd5e1] bg-[#f8fafc]">
				<ReactFlow
					edges={edges}
					fitView
					fitViewOptions={{ padding: 0.15 }}
					maxZoom={1.4}
					minZoom={0.3}
					nodes={nodes}
					nodesConnectable={false}
					nodesDraggable
					onNodeDragStop={onNodeDragStop}
					panOnDrag
					proOptions={{ hideAttribution: true }}
					selectNodesOnDrag={false}
				>
					<Background color="#dbe6f5" gap={16} size={1} />
					<Controls className="rounded-lg border border-[#bfdbfe] bg-white shadow-lg" />
				</ReactFlow>
			</div>
		</div>
	);
}

const nodesToIds = (...nodeGroups: Node[][]) => {
	const ids: string[] = [];

	for (const group of nodeGroups) {
		for (const node of group) {
			ids.push(node.id);
		}
	}

	return ids;
};
