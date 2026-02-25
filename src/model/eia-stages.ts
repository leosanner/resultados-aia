import fs from "fs/promises";
import path from "path";
import { Article, ArticleModel, FrequencyTerms } from "./article";

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
		const eiaStagesWithArticles = await loadEiaStages();
		return Object.entries(eiaStagesWithArticles).reduce<Record<string, number>>(
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
