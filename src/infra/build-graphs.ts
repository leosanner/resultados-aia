import { envTerms, tecTerms } from "@/model/article";
import { verifyOcurrencies } from "@/utils/ocurrencies";
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

const stagesPath = path.join(process.cwd(), "src", "data", "eia_stages.json");

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
	articlesNode: Node[];
};

export type GraphContent = {
	nodes: GraphNodes;
	edges: Edge[];
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

const buildArticleNodes = (articleData: Record<number, object>) => {
	const articleNodes: Node[] = [];

	for (const key of Object.keys(articleData)) {
		const node: Node = {
			id: `art-${key}`,
			position: { x: getRandomPosition("x"), y: getRandomPosition("y") },
			data: { label: key },
		};

		articleNodes.push(node);
	}

	return articleNodes;
};

const buildEdges = (
	articleData: Record<number, object>,
	tecNodes: TermsNode,
	envNodes: TermsNode,
) => {
	const edges: Edge[] = [];

	for (const [key, value] of Object.entries(articleData) as [
		string,
		Record<string, Record<string, number>>,
	][]) {
		const tecOcurrencies = verifyOcurrencies(value["tec"]);
		const envOcurrencies = verifyOcurrencies(value["env"]);

		const _tecTerms = Object.keys(tecOcurrencies) as string[];
		const _envTerms = Object.keys(envOcurrencies);

		let idxTec = 0;
		let idxEnv = 0;
		for (const term of _tecTerms) {
			const tecNodeInfo = tecNodes[term.toLowerCase()];
			if (!tecNodeInfo) continue;
			edges.push({
				id: `edge-tec-${key}-${idxTec}`,
				source: `art-${key}`,
				target: tecNodeInfo.id,
			});
			++idxTec;
		}

		for (const term of _envTerms) {
			const envNodeInfo = envNodes[term.toLowerCase()];
			if (!envNodeInfo) continue;
			edges.push({
				id: `edge-env-${key}-${idxEnv}`,
				source: `art-${key}`,
				target: envNodeInfo.id,
			});
			++idxEnv;
		}
	}

	return edges;
};

export const graphContent = async (): Promise<GraphContent> => {
	const articleData = await loadFile(frequenciesPath);
	const tecNode = buildTermsNode("tec");
	const envNode = buildTermsNode("env");
	const articlesNode = buildArticleNodes(articleData);
	const edges = buildEdges(articleData, tecNode, envNode);

	return {
		nodes: {
			envNode,
			tecNode,
			articlesNode,
		},
		edges,
	};
};
