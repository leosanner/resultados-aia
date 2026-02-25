import { KeywordTag } from "@/components/articles/keyword-tag";
import { formatStageTitle, slugToStageKey } from "@/lib/area-utils";
import { ArticleModel } from "@/model/article";
import { EiaModel } from "@/model/eia-stages";
import { firstCharUpperCase } from "@/utils/format-txt";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		areaSlug: string;
		articleId: string;
	}>;
};

function formatTermName(term: string) {
	return term
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function getHighlightedTerms(terms: Record<string, number> | undefined) {
	return Object.entries(terms ?? {})
		.filter(([, amount]) => amount > 0)
		.sort((a, b) => b[1] - a[1])
		.map(([term]) => formatTermName(term));
}

export default async function ArticleDetailsPage({ params }: PageProps) {
	const { areaSlug, articleId } = await params;
	const stageKey = slugToStageKey(areaSlug);
	const parsedArticleId = Number(articleId);

	if (!Number.isInteger(parsedArticleId) || parsedArticleId < 0) {
		notFound();
	}

	const eiaModel = new EiaModel();
	const articleModel = new ArticleModel();
	const [articlesByStage, article, articleFrequencyTerms] = await Promise.all([
		eiaModel.getArticlesByStage(),
		articleModel.getArticleById(parsedArticleId),
		articleModel.getArticleFrequencyTerms(parsedArticleId),
	]);

	if (!(stageKey in articlesByStage) || !article) {
		notFound();
	}

	const stageArticles = articlesByStage[stageKey] ?? [];
	const isArticleInCurrentStage = stageArticles.some(
		(currentArticle) => currentArticle.id === parsedArticleId,
	);
	if (!isArticleInCurrentStage) {
		notFound();
	}

	const keywords = article.keywords ?? [];
	const technologyTerms = getHighlightedTerms(articleFrequencyTerms?.tec);
	const environmentalTerms = getHighlightedTerms(articleFrequencyTerms?.env);
	const stageName = formatStageTitle(stageKey);

	return (
		<div className="min-h-screen bg-[#f6f8f6] text-[#0f172a]">
			<main className="mx-auto w-full max-w-[992px] px-6 py-8 md:px-12">
				<Link
					className="text-xs font-bold uppercase tracking-[1.2px] text-[#94a3b8] hover:text-[#64748b]"
					href={`/areas/${areaSlug}/artigos`}
				>
					Voltar para artigos da área
				</Link>

				<p className="mt-6 text-xs font-bold uppercase tracking-[1.2px] text-[#94a3b8]">
					{stageName}
				</p>

				<article className="mt-3 rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
					<h1 className="text-3xl font-black tracking-[-0.8px] text-[#0f172a]">
						{firstCharUpperCase(article.title)}
					</h1>

					<section className="mt-6">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#64748b]">
							Resumo
						</h2>
						<p className="mt-2 text-[15px] leading-7 text-[#334155]">
							{article.abstract}
						</p>
					</section>

					<section className="mt-6">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#64748b]">
							Palavras-chave
						</h2>
						<div className="mt-3 flex flex-wrap gap-2">
							{keywords.length > 0 ? (
								keywords.map((keyword, index) => (
									<KeywordTag
										index={index}
										key={`${keyword}-${index}`}
										keyword={keyword}
									/>
								))
							) : (
								<span className="inline-flex rounded-[4px] bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
									Sem palavras-chave
								</span>
							)}
						</div>
					</section>

					<section className="mt-6 rounded-[10px] border border-[#dcfce7] bg-[#f0fdf4] p-4">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
							Termos de tecnologia
						</h2>
						<div className="mt-3 flex flex-wrap gap-2">
							{technologyTerms.length > 0 ? (
								technologyTerms.map((term, index) => (
									<span
										className="inline-flex rounded-[4px] bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#166534]"
										key={`${term}-${index}`}
									>
										{term}
									</span>
								))
							) : (
								<span className="text-xs font-medium text-[#15803d]">
									Sem termos de tecnologia destacados.
								</span>
							)}
						</div>
					</section>

					<section className="mt-4 rounded-[10px] border border-[#bae6fd] bg-[#ecfeff] p-4">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#0e7490]">
							Termos ambientais
						</h2>
						<div className="mt-3 flex flex-wrap gap-2">
							{environmentalTerms.length > 0 ? (
								environmentalTerms.map((term, index) => (
									<span
										className="inline-flex rounded-[4px] bg-[#cffafe] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#0e7490]"
										key={`${term}-${index}`}
									>
										{term}
									</span>
								))
							) : (
								<span className="text-xs font-medium text-[#0e7490]">
									Sem termos ambientais destacados.
								</span>
							)}
						</div>
					</section>
				</article>
			</main>
		</div>
	);
}
