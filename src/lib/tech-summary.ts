import {
	ArticleModel,
	TecTerm,
	resolveArticleTerms,
	tecTerms,
} from "@/model/article";

export type TechArticlesSummary = Record<TecTerm, number[]>;

export async function getTechArticlesSummary(): Promise<TechArticlesSummary> {
	const articleModel = new ArticleModel();
	const [articles, articlesFt] = await Promise.all([
		articleModel.getArticles(),
		articleModel.loadFrequencyTerms(),
	]);

	const buckets: Record<TecTerm, Set<number>> = tecTerms.reduce(
		(acc, term) => {
			acc[term] = new Set<number>();
			return acc;
		},
		{} as Record<TecTerm, Set<number>>,
	);

	for (const key of Object.keys(articles)) {
		const articleId = Number(key);
		const article = articles[articleId];
		const resolved = resolveArticleTerms(article, articlesFt[articleId]);

		for (const term of resolved.technology) {
			buckets[term].add(articleId);
		}
	}

	return tecTerms.reduce((acc, term) => {
		acc[term] = Array.from(buckets[term]).sort((a, b) => a - b);
		return acc;
	}, {} as TechArticlesSummary);
}
