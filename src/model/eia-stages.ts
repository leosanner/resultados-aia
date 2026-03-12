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
import { filterOcurrencies } from "@/utils/ocurrencies";

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

		const matchByArticle = await Promise.all(
			articles.map(async (article) => {
				const articleFt = await this.articleModel.getArticleFrequencyTerms(
					article.id,
				);

				if (!articleFt) {
					return false;
				}

				const envFrequencyTerms = Object.keys(
					filterOcurrencies(articleFt.env),
				) as EnvTerm[];
				const tecFrequencyTerms = Object.keys(
					filterOcurrencies(articleFt.tec),
				) as TecTerm[];

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

		for (const article of articlesStage) {
			const articleFt = await this.articleModel.getArticleFrequencyTerms(
				article.id,
			);
			const envFreq = filterOcurrencies(articleFt.env);
			const tecFreq = filterOcurrencies(articleFt.tec);

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

	async getAuthorsByStage() {
		// {eia_stage:{authorId: {authorName, publications}}}

		const articlesExtended = await this.articleModel.getArticlesExtended();

		const articlesIdByStage: Record<string, number[]> = Object.entries(
			await this.getArticlesByStage(),
		).reduce<Record<string, number[]>>((currentDict, [key, value]) => {
			const stageArticleIds = value.map((val) => val.id);
			currentDict[key] = stageArticleIds;

			return currentDict;
		}, {});

		const authorsByStage: Record<
			string,
			Record<string, { authorName: string; publications: number[] }>
		> = {};

		for (const [articleId, articleContent] of Object.entries(
			articlesExtended,
		)) {
			const articleRelatedAreas = findIdInAreas(
				Number(articleId),
				articlesIdByStage,
			);

			if (articleRelatedAreas.length === 0) {
				continue;
			}

			for (const area of articleRelatedAreas) {
				if (!(area in authorsByStage)) {
					authorsByStage[area] = {};
				}

				if (!articleContent.authors) {
					continue;
				}

				for (const author of articleContent.authors) {
					if (!(author.id in authorsByStage[area])) {
						authorsByStage[area][author.id] = {
							authorName: author.name,
							publications: [],
						};
					}

					if (
						!authorsByStage[area][author.id].publications.includes(
							Number(articleId),
						)
					) {
						authorsByStage[area][author.id].publications.push(
							Number(articleId),
						);
					}
				}
			}
		}

		return authorsByStage;
	}
}

const findIdInAreas = (id: number, content: Record<string, number[]>) => {
	const areas: string[] = [];
	for (const [key, value] of Object.entries(content)) {
		if (value.includes(id)) {
			areas.push(key);
		}
	}
	return areas;
};
