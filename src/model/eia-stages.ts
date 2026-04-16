import fs from "fs/promises";
import path from "path";
import {
	Article,
	ArticleModel,
	EnvTerm,
	FrequencyTerms,
	TecTerm,
	envTerms,
	resolveArticleTerms,
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

	async getArticlesByStageWithPages(pageSize: number = -1) {
		const articlesByStage = await this.getArticlesByStage();
		if (pageSize <= 0) {
			return articlesByStage;
		}

		const splitedContent: Record<string, Record<number, StageArticle[]>> = {};

		for (const [key, value] of Object.entries(articlesByStage) as [
			string,
			StageArticle[],
		][]) {
			splitedContent[key] = splitIntoPages(value, pageSize);
		}

		function splitIntoPages(articles: StageArticle[], pageSize: number) {
			const pages: Record<number, StageArticle[]> = {};
			for (let start = 0, page = 1; start < articles.length; start += pageSize, page++) {
				pages[page] = articles.slice(start, start + pageSize);
			}

			return pages;
		}

		return splitedContent;
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
		const selectedEnvTerms = terms.envTerm ?? [];
		const selectedTecTerms = terms.tecTerm ?? [];

		// Sem filtros selecionados: retorna a lista original sem reduzir resultados.
		if (selectedEnvTerms.length === 0 && selectedTecTerms.length === 0) {
			return articles;
		}

		const effectiveEnvTerms =
			selectedEnvTerms.length > 0 ? selectedEnvTerms : [...envTerms];
		const effectiveTecTerms =
			selectedTecTerms.length > 0 ? selectedTecTerms : [...tecTerms];
		const articlesFt = await this.articleModel.loadFrequencyTerms();

		const matchByArticle = await Promise.all(
			articles.map(async (article) => {
				const resolvedTerms = resolveArticleTerms(
					article,
					articlesFt[article.id],
				);
				const envFrequencyTerms = resolvedTerms.environmental;
				const tecFrequencyTerms = resolvedTerms.technology;

				if (
					envFrequencyTerms.some((val) => effectiveEnvTerms.includes(val)) &&
					tecFrequencyTerms.some((val) => effectiveTecTerms.includes(val))
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
		const articlesFt = await this.articleModel.loadFrequencyTerms();

		for (const article of articlesStage) {
			const resolvedTerms = resolveArticleTerms(
				article,
				articlesFt[article.id],
			);

			for (const key of resolvedTerms.environmental) {
				if (!(key in ft.env)) {
					ft.env[key] = 0;
				}
				ft.env[key] += 1;
			}
			for (const key of resolvedTerms.technology) {
				if (!(key in ft.tec)) {
					ft.tec[key] = 0;
				}
				ft.tec[key] += 1;
			}
		}
		return ft;
	}

}
