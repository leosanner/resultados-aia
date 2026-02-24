import fs from "fs/promises";
import path from "path";
export type Article = {
	title: string;
	abstract: string;
	keywords: string[];
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
}

// (async () => {
// 	const model = new ArticleModel();
// 	const r = await model.getArticles();

// 	console.log(r);
// })();
