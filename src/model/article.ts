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
	async getArticles(): Promise<Record<number, Article>> {
		return await loadArticleData();
	}

	async getArticleById(articleId: number) {
		const articles = await this.getArticles();
		return articles[articleId];
	}

	async getArticleFrequencyTerms(articleId: number) {
		const articlesFt = await loadFrequencyTerms();

		return articlesFt[articleId];
	}
}
