import { filterOcurrencies } from "@/utils/ocurrencies";
import fs from "fs/promises";
import path from "path";

export type Article = {
	title: string;
	abstract: string;
	keywords: string[];
};

export type ArticleExtend = Article & {
	authors: {
		id: string;
		name: string;
		affiliation_id: string[];
	}[];
	affiliation: { name: string; country: string; id: string }[];
	publish_date: string;
	publication_year: number;
	doi_y: string;
	doi_x: string;
	id: string;
};

export type FrequencyTerms = {
	env: Record<string, number>;
	tec: Record<string, number>;
};

export type ResolvedArticleTerms = {
	environmental: EnvTerm[];
	technology: TecTerm[];
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

function normalizeText(value: string) {
	return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function resolveTermsFromContent<T extends readonly string[]>(
	content: string,
	explicitTerms: string[],
	fallbackTerms: T,
) {
	const normalizedExplicitTerms = new Set(
		explicitTerms.map((term) => normalizeText(term)).filter(Boolean),
	);
	const normalizedContent = normalizeText(content);

	return fallbackTerms.filter((term) => {
		const normalizedTerm = normalizeText(term);
		if (normalizedExplicitTerms.has(normalizedTerm)) {
			return true;
		}

		if (!normalizedContent) {
			return false;
		}

		return normalizedContent.includes(normalizedTerm);
	}) as T[number][];
}

export function resolveArticleTerms(
	article: Article | undefined,
	articleFt: FrequencyTerms | undefined,
): ResolvedArticleTerms {
	const searchableContent = [
		article?.title ?? "",
		article?.abstract ?? "",
		Array.isArray(article?.keywords) ? article.keywords.join(" ") : "",
	].join(" ");
	const explicitEnvironmentalTerms = Object.keys(
		filterOcurrencies(articleFt?.env ?? {}),
	);
	const explicitTechnologyTerms = Object.keys(filterOcurrencies(articleFt?.tec ?? {}));

	return {
		environmental: resolveTermsFromContent(
			searchableContent,
			explicitEnvironmentalTerms,
			envTerms,
		) as EnvTerm[],
		technology: resolveTermsFromContent(
			searchableContent,
			explicitTechnologyTerms,
			tecTerms,
		) as TecTerm[],
	};
}

export type ArticleOutputFormat = Record<number, Article>;

const loadArticleData = async (
	articleFileName: string = "articles.json",
): Promise<Record<number, Article>> => {
	const pathFile = path.join(process.cwd(), "src", "data", articleFileName);
	const content = await fs.readFile(pathFile, "utf-8");
	const obj = JSON.parse(content);

	return obj as ArticleOutputFormat;
};

const loadArticleDataExtended = async (
	articleFileName: string = "articles_extended.json",
) => {
	const pathFile = path.join(process.cwd(), "src", "data", articleFileName);
	const content = await fs.readFile(pathFile, "utf-8");
	const obj = JSON.parse(content);

	return obj as Record<number, ArticleExtend>;
};

export class ArticleModel {
	async loadFrequencyTerms(): Promise<Record<number, FrequencyTerms>> {
		return await loadFrequencyTerms();
	}

	async getArticles(): Promise<Record<number, Article>> {
		return await loadArticleData();
	}

	async getArticlesExtended(): Promise<Record<number, ArticleExtend>> {
		return await loadArticleDataExtended();
	}

	async getArticleById(articleId: number) {
		const articles = await this.getArticles();
		return articles[articleId];
	}

	async getArticleFrequencyTerms(articleId: number) {
		const articlesFt = await this.loadFrequencyTerms();

		return articlesFt[articleId];
	}

	async getResolvedArticleTerms(articleId: number): Promise<ResolvedArticleTerms> {
		const [article, articleFt] = await Promise.all([
			this.getArticleById(articleId),
			this.getArticleFrequencyTerms(articleId),
		]);

		return resolveArticleTerms(article, articleFt);
	}

	async getAuthorsByTechnology(): Promise<
		Record<TecTerm, Record<string, { authorName: string; publications: number[] }>>
	> {
		const [articlesExtended, articlesFt] = await Promise.all([
			this.getArticlesExtended(),
			this.loadFrequencyTerms(),
		]);

		const result: Record<
			string,
			Record<string, { authorName: string; publications: Set<number> }>
		> = {};

		for (const [articleIdKey, articleContent] of Object.entries(articlesExtended)) {
			const articleId = Number(articleIdKey);
			const article = {
				title: articleContent.title,
				abstract: articleContent.abstract,
				keywords: articleContent.keywords,
			};
			const { technology } = resolveArticleTerms(article, articlesFt[articleId]);

			if (technology.length === 0 || !articleContent.authors) {
				continue;
			}

			for (const tecTerm of technology) {
				if (!(tecTerm in result)) {
					result[tecTerm] = {};
				}

				for (const author of articleContent.authors) {
					if (!(author.id in result[tecTerm])) {
						result[tecTerm][author.id] = {
							authorName: author.name,
							publications: new Set<number>(),
						};
					}
					result[tecTerm][author.id].publications.add(articleId);
				}
			}
		}

		const finalResult: Record<
			TecTerm,
			Record<string, { authorName: string; publications: number[] }>
		> = {} as Record<
			TecTerm,
			Record<string, { authorName: string; publications: number[] }>
		>;

		for (const [tecTerm, authors] of Object.entries(result)) {
			finalResult[tecTerm as TecTerm] = Object.fromEntries(
				Object.entries(authors).map(([authorId, { authorName, publications }]) => [
					authorId,
					{ authorName, publications: Array.from(publications) },
				]),
			);
		}

		return finalResult;
	}

	async filterArticlesByTerms(terms: { env: EnvTerm[]; tec: TecTerm[] }) {
		const filteredArticles: Article[] = [];
		const [articles, articlesFt] = await Promise.all([
			this.getArticles(),
			this.loadFrequencyTerms(),
		]);

		for (const key of Object.keys(articles)) {
			const articleId = Number(key);
			const article = articles[articleId];
			const resolvedTerms = resolveArticleTerms(article, articlesFt[articleId]);
			const environmentTerms = resolvedTerms.environmental;
			const technologicalTerms = resolvedTerms.technology;

			if (
				verifyTermsInsideOptions(environmentTerms, terms.env) ||
				verifyTermsInsideOptions(technologicalTerms, terms.tec)
			) {
				filteredArticles.push(article);
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
