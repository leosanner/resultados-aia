import { envTerms, tecTerms } from "@/model/article";
import { randomChoice } from "@/utils/random-choices";
import fs from "fs/promises";
import path from "path";

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

// nós dos artigos
// nóes de termos de busca (ambientais e tecnologias)
// artigo -> termos de tecnologia e ambientais

const buildTermsNode = (termType: "env" | "tec") => {
	const terms = termType === "env" ? envTerms : tecTerms;
	const nodes: Node[] = [];
	let idx = 0;

	for (const term of terms) {
		const node: Node = {
			id: `${termType}-${idx}`,
			data: { label: term.toLowerCase() },
			position: { x: randomChoice(-50, 50), y: randomChoice(-50, 50) },
		};

		++idx;
		nodes.push(node);
	}

	return nodes;
};

const buildGraphFiles = async () => {
	const [stageObject, frequenciesObject] = await Promise.all([
		loadFile(stagesPath),
		loadFile(frequenciesPath),
	]);
};

console.log(buildTermsNode("tec"));
