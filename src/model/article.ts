import { filterOcurrencies } from "@/utils/ocurrencies";
import fs from "fs/promises";
import path from "path";
export type Article = {
	title: string;
	abstract: string;
	keywords: string[];
};

export type FrequencyTerms = {
	env: Record<string, number>;
	tec: Record<string, number>;
};

export const tecTerms = [
	"Technological Innovation",
	"Natural Language Processing",
	"Geoprocessing",
	"Internet of Things",
	"Remote Sensing",
	"Data Science",
	"Machine Learning",
	"Digital Technologies",
	"Reinforcement Learning",
	"Data Visualization",
	"Prediction Analytics",
	"Augmented Reality",
	"Artificial Intelligence",
	"Deep Learning",
	"Digital Transformation",
	"Digital Twins",
] as const;

export const envTerms = [
	"environmental monitoring",
	"cumulative effects assessment",
	"environmental permit",
	"sustainability assessment",
	"environmental consent",
	"cumulative effect assessment",
	"impact assessment",
	"environmental clearance",
	"impact assessment report",
	"environmental assessment",
	"environmental license",
	"environmental consents",
	"environmental authorization",
	"environmental impact report",
	"environmental statement",
	"environmental approval",
	"environmental licensing",
	"environmental permitting",
	"impact statement",
	"environmental licence",
] as const;

export type TecTerm = (typeof tecTerms)[number];
export type EnvTerm = (typeof envTerms)[number];
export type Term = TecTerm | EnvTerm;

const loadFrequencyTerms = async () => {
	const pathFile = path.join(
		process.cwd(),
		"src",
		"data",
		"frequency_terms.json",
	);

	const content = await fs.readFile(pathFile, "utf-8");
	const data = JSON.parse(content);

	return data as Record<number, FrequencyTerms>;
};

export type ArticleOutputFormat = Record<number, Article>;

const loadArticleData = async (): Promise<Record<number, Article>> => {
	const pathFile = path.join(process.cwd(), "src", "data", "articles.json");
	const content = await fs.readFile(pathFile, "utf-8");
	const obj = JSON.parse(content);

	return obj as ArticleOutputFormat;
};

export class ArticleModel {
	async loadFrequencyTerms(): Promise<Record<number, FrequencyTerms>> {
		return await loadFrequencyTerms();
	}

	async getArticles(): Promise<Record<number, Article>> {
		return await loadArticleData();
	}

	async getArticleById(articleId: number) {
		const articles = await this.getArticles();
		return articles[articleId];
	}

	async getArticleFrequencyTerms(articleId: number) {
		const articlesFt = await this.loadFrequencyTerms();

		return articlesFt[articleId];
	}

	async filterArticlesByTerms(terms: { env: EnvTerm[]; tec: TecTerm[] }) {
		const articlesFt = await this.loadFrequencyTerms();
		const filteredArticles: Article[] = [];

		for (const [key, value] of Object.entries(articlesFt)) {
			const environmentTerms = Object.keys(filterOcurrencies(value.env));
			const technologicalTerms = Object.keys(filterOcurrencies(value.tec));

			if (
				verifyTermsInsideOptions(environmentTerms, terms.env) ||
				verifyTermsInsideOptions(technologicalTerms, terms.tec)
			) {
				filteredArticles.push(await this.getArticleById(Number(key)));
			}
		}

		console.log(filteredArticles.length);
		return filteredArticles;
	}
}

const verifyTermsInsideOptions = (terms: string[], options: string[]) => {
	if (terms.length === 0) {
		return false;
	}

	for (const term of terms) {
		if (options.includes(term.toLowerCase())) {
			return true;
		}
	}
	return false;
};
