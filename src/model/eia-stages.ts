import fs from "fs/promises";
import path from "path";
import { Article, ArticleModel } from "./article";

type FileOutputFormat = Record<string, number[]>;

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
			Promise<Record<string, Article[]>>
		>(async (currentDictPromise, [key, value]) => {
			const currentDict = await currentDictPromise;

			const articlesExtensePromise = value.map((articleId) => {
				return this.articleModel.getArticleById(articleId);
			});

			currentDict[key] = await Promise.all(articlesExtensePromise);
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
}
