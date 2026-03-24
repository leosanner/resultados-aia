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

export type LandingTermsGraphProps = {
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

const getNodeBaseStyle = (fontScale: number) => ({
	background: "#ffffff",
	borderRadius: 12,
	padding: `${Math.round(8 * fontScale)}px ${Math.round(10 * fontScale)}px`,
	color: "#111111",
	fontSize: Math.round(12 * fontScale),
	fontWeight: 600,
	boxShadow: "0 12px 22px -14px rgba(17, 17, 17, 0.42)",
});

const COLUMN_X = {
	tec: 140,
	articles: 620,
	env: 1100,
} as const;

const TOP_OFFSET = 24;
const BASE_ROW_GAP = 62;
const MAX_ROWS_PER_LANE = 14;
const LANE_GAP = 180;
const MIN_GRAPH_HEIGHT = 620;
const MAX_GRAPH_HEIGHT = 980;
const sortByLabel = (a: BaseGraphNode, b: BaseGraphNode) => {
	const labelA = (a.data.label ?? a.id).toString();
	const labelB = (b.data.label ?? b.id).toString();

	return labelA.localeCompare(labelB, "pt-BR", { numeric: true });
};

const buildSemanticColumn = (
	nodes: BaseGraphNode[],
	columnX: number,
	borderColor: string,
	side: "left" | "right",
	fontScale: number,
): { nodes: Node[]; maxY: number } => {
	const sortedNodes = [...nodes].sort(sortByLabel);
	const laneCount = Math.max(1, Math.ceil(sortedNodes.length / MAX_ROWS_PER_LANE));
	const rowsPerLane = Math.max(1, Math.ceil(sortedNodes.length / laneCount));
	const rowGap = Math.round(BASE_ROW_GAP * fontScale);
	let maxY = TOP_OFFSET;

	const positionedNodes = sortedNodes.map((node, index) => {
		const laneIndex = Math.floor(index / rowsPerLane);
		const rowIndex = index % rowsPerLane;
		const x =
			side === "left"
				? columnX - (laneCount - 1 - laneIndex) * LANE_GAP
				: columnX + laneIndex * LANE_GAP;
		const y = TOP_OFFSET + rowIndex * rowGap;
		if (y > maxY) maxY = y;

		return {
			id: node.id,
			position: { x, y },
			data: { label: node.data.label ?? node.id },
			style: {
				...getNodeBaseStyle(fontScale),
				border: `2px solid ${borderColor}`,
			},
		} satisfies Node;
	});

	return { nodes: positionedNodes, maxY };
};

const buildArticleNode = (
	node: BaseGraphNode,
	totalArticles: number,
	centerY: number,
	fontScale: number,
): Node => ({
	id: node.id,
	position: {
		x: COLUMN_X.articles,
		y: centerY,
	},
	data: { label: `${totalArticles} artigos` },
	style: {
		...getNodeBaseStyle(fontScale),
		border: "2px solid #7c3aed",
		background: "#f3e8ff",
		color: "#3b0764",
		fontSize: Math.round(14 * fontScale),
		padding: `${Math.round(12 * fontScale)}px ${Math.round(16 * fontScale)}px`,
	},
});

export function LandingTermsGraph({ graph }: LandingTermsGraphProps) {
	const router = useRouter();
	const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [manualPositions, setManualPositions] = useState<
		Record<string, { x: number; y: number }>
	>({});
	const [fontScale, setFontScale] = useState(1);

	const tecBaseNodes = useMemo(
		() => Object.values(graph.nodes.tecNode),
		[graph],
	);
	const envBaseNodes = useMemo(
		() => Object.values(graph.nodes.envNode),
		[graph],
	);
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
	}, [
		hasActiveFilter,
		graph.totalArticles,
		graph.articleIdsByTopicId,
		selectedTopicSet,
	]);

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

	const tecLayout = buildSemanticColumn(
		visibleTecNodesBase,
		COLUMN_X.tec,
		"#0ea5e9",
		"left",
		fontScale,
	);
	const tecNodes = tecLayout.nodes;
	const envLayout = buildSemanticColumn(
		visibleEnvNodesBase,
		COLUMN_X.env,
		"#22c55e",
		"right",
		fontScale,
	);
	const envNodes = envLayout.nodes;
	const maxColumnY = Math.max(tecLayout.maxY, envLayout.maxY, TOP_OFFSET + 220);
	const articleCenterY = TOP_OFFSET + (maxColumnY - TOP_OFFSET) / 2;
	const articleNodes: Node[] = visibleArticleNodeBase
		? [
				buildArticleNode(
					visibleArticleNodeBase,
					filteredArticleCount,
					articleCenterY,
					fontScale,
				),
			]
		: [];
	const graphHeight = Math.min(
		MAX_GRAPH_HEIGHT,
		Math.max(MIN_GRAPH_HEIGHT, Math.round(maxColumnY + 120)),
	);

	const visibleNodeIds = new Set(nodesToIds(tecNodes, articleNodes, envNodes));
	const nodes: Node[] = [...tecNodes, ...articleNodes, ...envNodes].map(
		(node) => {
			const manualPosition = manualPositions[node.id];

			return manualPosition ? { ...node, position: manualPosition } : node;
		},
	);
	const edges: Edge[] = visibleEdgesBase
		.filter(
			(edge) =>
				visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
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
		const query = new URLSearchParams();
		for (const term of selectedTermsByType.tec) query.append("tec", term);
		for (const term of selectedTermsByType.env) query.append("env", term);

		const queryString = query.toString();
		router.push(queryString ? `/termos?${queryString}` : "/termos");
	};

	const onNodeDragStop = (_: unknown, node: Node) => {
		setManualPositions((current) => ({
			...current,
			[node.id]: { x: node.position.x, y: node.position.y },
		}));
	};

	return (
		<div className="space-y-5">
			{/* Filter panel */}
			<div className="rounded-2xl border border-[#c8ddd0] bg-[#f4f9f5] p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<label
						className="flex items-center gap-2 text-sm font-bold text-[#00261a]"
						htmlFor="topic-filter"
					>
						<span className="material-symbols-outlined text-base text-[#446554]">filter_list</span>
						Filtrar por tópicos
					</label>
					<button
						className="cursor-pointer rounded-full border border-[#c0c8c3] bg-white px-3 py-1 text-xs font-semibold text-[#446554] transition-colors hover:border-[#00261a] hover:text-[#00261a]"
						onClick={clearFilters}
						type="button"
					>
						Limpar filtros
					</button>
				</div>
				<input
					className="mt-3 w-full rounded-xl border border-[#c8ddd0] bg-white px-4 py-2.5 text-sm text-[#191c1a] outline-none ring-[#2ECC71] transition placeholder:text-[#8a9b90] focus:border-[#2ECC71] focus:ring-2"
					id="topic-filter"
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder="Buscar tópico..."
					type="text"
					value={searchTerm}
				/>
				<div className="mt-4 max-h-44 space-y-4 overflow-y-auto pr-1">
					<div>
						<p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.6px] text-[#0369a1]">
							<span className="h-2 w-2 rounded-full bg-[#0ea5e9]" />
							Tecnologias
						</p>
						<div className="mt-2 flex flex-wrap gap-2">
							{filteredTecTopics.map((topic) => (
								<button
									aria-pressed={selectedTopicSet.has(topic.id)}
									className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
										selectedTopicSet.has(topic.id)
											? "border-[#0284c7] bg-[#0284c7] text-white shadow-[0_2px_8px_-2px_rgba(2,132,199,0.4)]"
											: "border-[#bae6fd] bg-white text-[#0369a1] hover:border-[#0ea5e9] hover:shadow-sm"
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
					<div>
						<p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.6px] text-[#15803d]">
							<span className="h-2 w-2 rounded-full bg-[#22c55e]" />
							Ambientais
						</p>
						<div className="mt-2 flex flex-wrap gap-2">
							{filteredEnvTopics.map((topic) => (
								<button
									aria-pressed={selectedTopicSet.has(topic.id)}
									className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
										selectedTopicSet.has(topic.id)
											? "border-[#16a34a] bg-[#16a34a] text-white shadow-[0_2px_8px_-2px_rgba(22,163,74,0.4)]"
											: "border-[#bbf7d0] bg-white text-[#166534] hover:border-[#22c55e] hover:shadow-sm"
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
			</div>

			{/* Controls bar */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#446554]">
					<span className="inline-flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full border-2 border-[#0ea5e9] bg-[#e0f2fe]" />
						Tecnologia
					</span>
					<span className="inline-flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full border-2 border-[#22c55e] bg-[#f0fdf4]" />
						Ambiental
					</span>
					<span className="inline-flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full border-2 border-[#7c3aed] bg-[#f3e8ff]" />
						Artigos
					</span>
				</div>
				<div className="flex items-center gap-3">
					<div className="inline-flex items-center gap-0.5 rounded-full border border-[#c8ddd0] bg-white px-1 py-0.5 text-xs font-semibold text-[#334155]">
						<button
							aria-label="Diminuir fonte dos nós"
							className="rounded-full px-2 py-1 transition-colors hover:bg-[#f0f7f2]"
							onClick={() => setFontScale((prev) => Math.max(0.8, prev - 0.1))}
							type="button"
						>
							A−
						</button>
						<span className="min-w-8 text-center text-[11px] text-[#556070]">
							{Math.round(fontScale * 100)}%
						</span>
						<button
							aria-label="Aumentar fonte dos nós"
							className="rounded-full px-2 py-1 transition-colors hover:bg-[#f0f7f2]"
							onClick={() => setFontScale((prev) => Math.min(1.6, prev + 0.1))}
							type="button"
						>
							A+
						</button>
					</div>
					<button
						className="group/btn relative cursor-pointer overflow-hidden rounded-full bg-[#00261a] px-5 py-2 text-xs font-bold uppercase tracking-[0.8px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
						onClick={showFoundArticles}
						type="button"
					>
						<span className="absolute inset-0 origin-left scale-x-0 bg-[#3b6756] transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />
						<span className="relative z-10">Mostrar resultados</span>
					</button>
				</div>
			</div>

			{/* Graph container */}
			<div
				className="w-full overflow-hidden rounded-2xl border border-[#c8ddd0] bg-[#fafcfb] shadow-[inset_0_2px_12px_-4px_rgba(6,71,34,0.06)]"
				style={{ height: graphHeight }}
			>
				<ReactFlow
					edges={edges}
					fitView
					fitViewOptions={{ padding: 0.26 }}
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
					<Background color="#d0ddd5" gap={18} size={1} />
					<Controls className="rounded-lg border border-[#c8ddd0] bg-white shadow-md" />
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
