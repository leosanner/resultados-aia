import fs from "fs/promises";
import path from "path";
import {
	Article,
	ArticleModel,
	EnvTerm,
	FrequencyTerms,
	TecTerm,
	envTerms,
	tecTerms,
} from "./article";

type FileOutputFormat = Record<string, number[]>;
export type StageArticle = Article & { id: number };

async function loadEiaStages(): Promise<FileOutputFormat> {
	const pathFile = path.join(process.cwd(), "src", "data", "eia_stages.json");
	const content = await fs.readFile(pathFile, "utf-8");
	return JSON.parse(content);
}

export class EiaModel {
	articleModel: ArticleModel;

	constructor() {
		this.articleModel = new ArticleModel();
	}

	async getArticlesByStage() {
		const eiaStagesWithArticles = await loadEiaStages();

		return await Object.entries(eiaStagesWithArticles).reduce<
			Promise<Record<string, StageArticle[]>>
		>(async (currentDictPromise, [key, value]) => {
			const currentDict = await currentDictPromise;

			const articlesWithIdPromise = value.map(async (articleId) => {
				const article = await this.articleModel.getArticleById(articleId);
				if (!article) {
					return null;
				}

				return { ...article, id: articleId };
			});

			const articlesWithId = await Promise.all(articlesWithIdPromise);
			currentDict[key] = articlesWithId.filter(
				(article): article is StageArticle => Boolean(article),
			);

			return currentDict;
		}, Promise.resolve({}));
	}

	async getArticlesSummary(): Promise<Record<string, number>> {
		const articlesByStage = await this.getArticlesByStage();

		return Object.entries(articlesByStage).reduce<Record<string, number>>(
			(currentDict, [key, value]) => {
				currentDict[key] = value.length;
				return currentDict;
			},
			{},
		);
	}

	async summaryByStage(stage: string) {
		const articlesByStage = await this.getArticlesByStage();
		const articlesStage = articlesByStage[stage];

		if (!articlesStage) {
			return;
		}

		return await this.filterTermsFrequency(articlesStage);
	}

	async filterArticlesByTerms(
		articles: StageArticle[],
		terms: { envTerm: EnvTerm[]; tecTerm: TecTerm[] },
	) {
		if (!terms.envTerm && !terms.tecTerm) {
			return articles;
		}

		if (terms.envTerm.length === 0) {
			terms.envTerm = [...envTerms];
		}

		if (terms.tecTerm.length === 0) {
			terms.tecTerm = [...tecTerms];
		}

		const matchByArticle = await Promise.all(
			articles.map(async (article) => {
				const articleFt = await this.articleModel.getArticleFrequencyTerms(
					article.id,
				);

				if (!articleFt) {
					return false;
				}

				const envFrequencyTerms = Object.keys(
					verifyOcurrencies(articleFt.env),
				) as EnvTerm[];
				const tecFrequencyTerms = Object.keys(
					verifyOcurrencies(articleFt.tec),
				) as TecTerm[];

				if (
					envFrequencyTerms.some((val) => terms.envTerm.includes(val)) &&
					tecFrequencyTerms.some((val) => terms.tecTerm.includes(val))
				) {
					return true;
				}
				return false;
			}),
		);

		return articles.filter((_, index) => matchByArticle[index]);
	}

	async filterTermsFrequency(articlesStage: StageArticle[]) {
		const ft: FrequencyTerms = { env: {}, tec: {} };

		for (const article of articlesStage) {
			const articleFt = await this.articleModel.getArticleFrequencyTerms(
				article.id,
			);
			const envFreq = verifyOcurrencies(articleFt.env);
			const tecFreq = verifyOcurrencies(articleFt.tec);

			for (const [key] of Object.entries(envFreq)) {
				if (!(key in ft.env)) {
					ft.env[key] = 0;
				}
				ft.env[key] += 1;
			}
			for (const [key] of Object.entries(tecFreq)) {
				if (!(key in ft.tec)) {
					ft.tec[key] = 0;
				}
				ft.tec[key] += 1;
			}
		}
		return ft;
	}
}

function verifyOcurrencies(obj: Record<string, number>) {
	return Object.fromEntries(
		Object.entries(obj).filter(([, value]) => value > 0),
	);
}
