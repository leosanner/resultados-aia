import { envTerms, tecTerms } from "@/model/article";
import { filterOcurrencies } from "@/utils/ocurrencies";
import { randomChoice } from "@/utils/random-choices";
import fs from "fs/promises";
import path from "path";

const X_MAX: number = 500;
const Y_MAX: number = 500;

const getRandomPosition = (axis: "x" | "y") => {
	const axisLimit = axis === "x" ? X_MAX : Y_MAX;

	return randomChoice(-axisLimit, axisLimit);
};

const frequenciesPath = path.join(
	process.cwd(),
	"src",
	"data",
	"frequency_terms.json",
);

const loadFile = async (filePath: string) => {
	const file = await fs.readFile(filePath, "utf-8");

	return JSON.parse(file);
};

export type Node = {
	id: string;
	position: { x: number; y: number };
	data: { label?: string };
	type?: string;
};

export type Edge = {
	id: string;
	source: string;
	target: string;
	type?: string;
	lable?: string;
};

type TermsNode = Record<string, Node>;

export type GraphNodes = {
	envNode: TermsNode;
	tecNode: TermsNode;
	articlesNode: Node;
};

export type GraphContent = {
	nodes: GraphNodes;
	edges: Edge[];
	totalArticles: number;
	articleIdsByTopicId: Record<string, string[]>;
};

const buildTermsNode = (termType: "env" | "tec"): TermsNode => {
	const terms = termType === "env" ? envTerms : tecTerms;
	const nodes: Record<string, Node> = {};
	let idx = 0;

	for (const term of terms) {
		const node: Node = {
			id: `${termType}-${idx}`,
			data: { label: term.toLowerCase() },
			position: {
				x: getRandomPosition("x"),
				y: getRandomPosition("y"),
			},
		};

		++idx;
		nodes[term.toLowerCase()] = node;
	}

	return nodes;
};

const buildArticleNode = (articleData: Record<number, object>): Node => ({
	id: "art-total",
	position: { x: getRandomPosition("x"), y: getRandomPosition("y") },
	data: { label: `${Object.keys(articleData).length} artigos` },
});

const buildEdgesAndArticleIndex = (
	articleData: Record<number, object>,
	tecNodes: TermsNode,
	envNodes: TermsNode,
) => {
	const edges: Edge[] = [];
	const tecTargets = new Set<string>();
	const envTargets = new Set<string>();
	const articleIdsByTopicId = new Map<string, Set<string>>();

	for (const [articleId, value] of Object.entries(articleData) as [
		string,
		Record<string, Record<string, number>>,
	][]) {
		const tecOcurrencies = filterOcurrencies(value["tec"]);
		const envOcurrencies = filterOcurrencies(value["env"]);

		const _tecTerms = Object.keys(tecOcurrencies) as string[];
		const _envTerms = Object.keys(envOcurrencies);

		for (const term of _tecTerms) {
			const tecNodeInfo = tecNodes[term.toLowerCase()];
			if (!tecNodeInfo) continue;
			tecTargets.add(tecNodeInfo.id);
			if (!articleIdsByTopicId.has(tecNodeInfo.id)) {
				articleIdsByTopicId.set(tecNodeInfo.id, new Set());
			}
			articleIdsByTopicId.get(tecNodeInfo.id)?.add(articleId);
		}

		for (const term of _envTerms) {
			const envNodeInfo = envNodes[term.toLowerCase()];
			if (!envNodeInfo) continue;
			envTargets.add(envNodeInfo.id);
			if (!articleIdsByTopicId.has(envNodeInfo.id)) {
				articleIdsByTopicId.set(envNodeInfo.id, new Set());
			}
			articleIdsByTopicId.get(envNodeInfo.id)?.add(articleId);
		}
	}

	let idxTec = 0;
	for (const target of tecTargets) {
		edges.push({
			id: `edge-tec-total-${idxTec}`,
			source: "art-total",
			target,
		});
		++idxTec;
	}

	let idxEnv = 0;
	for (const target of envTargets) {
		edges.push({
			id: `edge-env-total-${idxEnv}`,
			source: "art-total",
			target,
		});
		++idxEnv;
	}

	return {
		edges,
		articleIdsByTopicId: Object.fromEntries(
			Array.from(articleIdsByTopicId.entries()).map(([topicId, articleIds]) => [
				topicId,
				Array.from(articleIds),
			]),
		),
	};
};

export const graphContent = async (): Promise<GraphContent> => {
	const articleData = await loadFile(frequenciesPath);
	const totalArticles = Object.keys(articleData).length;
	const tecNode = buildTermsNode("tec");
	const envNode = buildTermsNode("env");
	const articlesNode = buildArticleNode(articleData);
	const { edges, articleIdsByTopicId } = buildEdgesAndArticleIndex(
		articleData,
		tecNode,
		envNode,
	);

	return {
		nodes: {
			envNode,
			tecNode,
			articlesNode,
		},
		edges,
		totalArticles,
		articleIdsByTopicId,
	};
};
