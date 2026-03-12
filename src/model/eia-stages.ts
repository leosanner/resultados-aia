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
					filterOcurrencies(articleFt.env),
				) as EnvTerm[];
				const tecFrequencyTerms = Object.keys(
					filterOcurrencies(articleFt.tec),
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
