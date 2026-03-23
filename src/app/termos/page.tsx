import {
	ArticleCard,
	type ArticleMetadata,
} from "@/components/articles/article-card";
import { getToneColorByIndex } from "@/components/charts/chart-palettes";
import { TermsMultiLineChartClient } from "@/components/charts/terms-multi-line-chart-client";
import { TermsInstitutionsMapClient } from "@/components/termos/terms-institutions-map-client";
import { TermsBarChartClient } from "@/components/charts/terms-bar-chart-client";
import institutionInformationData from "@/data/instituition_information.json";
import {
	buildTermsDownloadQuery,
	formatTermLabel,
	getTermsSearchResults,
	type TermsSearchArticleRecord,
} from "@/lib/terms-search";
import type {
	AreaLegendItem,
	InstitutionMapPoint,
} from "@/components/termos/terms-institutions-map";
import Link from "next/link";

type PageProps = {
	searchParams: Promise<{
		term?: string | string[];
		type?: string | string[];
		tec?: string | string[];
		env?: string | string[];
	}>;
};

type ExtendedArticleRecord = {
	authors?: { name?: string | null }[];
	["authorships.institutions.id"]?: string | string[] | null;
	publish_date?: string | null;
	publication_year?: number | string | null;
	fwci?: number | string | null;
	title?: string;
	json_title?: string;
};

type InstitutionInformationRecord = {
	display_name: string;
	country_code?: string | null;
	geo?: {
		city?: string | null;
		region?: string | null;
		country?: string | null;
		latitude: number;
		longitude: number;
	};
};

function toStringArray(value: string | string[] | null | undefined) {
	if (typeof value === "string") {
		return [value];
	}
	if (Array.isArray(value)) {
		return value.filter((entry): entry is string => typeof entry === "string");
	}
	return [];
}

function isValidOpenAlexInstitutionId(value: string) {
	return /^https:\/\/openalex\.org\/I\d+$/i.test(value.trim());
}

type BarChartItem = {
	label: string;
	value: number;
};

function hexToRgba(hex: string, alpha: number) {
	const normalized = hex.replace("#", "");
	const parsed = Number.parseInt(normalized, 16);
	const r = (parsed >> 16) & 255;
	const g = (parsed >> 8) & 255;
	const b = parsed & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildDownloadHref(format: "csv" | "docx", query: string) {
	return query ? `/termos/download?${query}&format=${format}` : `/termos/download?format=${format}`;
}

function buildArticleMetadata(record: TermsSearchArticleRecord): ArticleMetadata[] {
	return [
		record.publicationDate ? { label: "Data", value: record.publicationDate } : null,
		record.authorsLabel ? { label: "Autores", value: record.authorsLabel } : null,
		record.technologyTerms.length > 0
			? { label: "Tecnologia", value: record.technologyTerms.join(", ") }
			: null,
		record.environmentalTerms.length > 0
			? { label: "Ambientais", value: record.environmentalTerms.join(", ") }
			: null,
		record.fwci ? { label: "FWCI", value: record.fwci } : null,
	].filter((item): item is ArticleMetadata => Boolean(item));
}

export default async function TermArticlesPage({ searchParams }: PageProps) {
	const currentSearchParams = await searchParams;
	const {
		selectedTecTerms,
		selectedEnvTerms,
		hasSelectedTerms,
		isShowingAllResults,
		totalResults,
		matchingArticleIds,
		groups,
		technologyTermsTrend,
		environmentalTermsTrend,
		areasTrend,
		articlesExtended,
	} = await getTermsSearchResults(currentSearchParams);
	const tone = "blue" as const;
	const groupsWithColors = groups.map((group, index) => ({
		...group,
		color: getToneColorByIndex(tone, index),
	}));
	const chartItems: BarChartItem[] = groups.map((group) => ({
		label: group.stageTitle,
		value: group.articles.length,
	}));
	const articleStagesById = new Map<number, string[]>();
	for (const group of groups) {
		for (const article of group.articles) {
			const currentStages = articleStagesById.get(article.article.id) ?? [];
			currentStages.push(group.stageKey);
			articleStagesById.set(article.article.id, currentStages);
		}
	}
	const stageColorByKey = new Map(
		groupsWithColors.map((group) => [group.stageKey, group.color]),
	);
	const areaLegend: AreaLegendItem[] = groupsWithColors.map((group) => ({
		stageKey: group.stageKey,
		label: group.stageTitle,
		color: group.color,
		count: group.articles.length,
	}));
	const downloadQuery = buildTermsDownloadQuery({
		tec: selectedTecTerms,
		env: selectedEnvTerms,
	});
	const articleRecordsById = new Map(
		groups.flatMap((group) =>
			group.articles.map((article) => [article.article.id, article] as const),
		),
	);
	const institutionsById =
		institutionInformationData as Record<string, InstitutionInformationRecord>;
	const institutionAccumulator = new Map<
		string,
		{
			institution: InstitutionInformationRecord;
			articleIds: Set<number>;
			articleDetails: Map<
				number,
				{
					title: string;
					stageLabels: string[];
					technologyTerms: string[];
					environmentalTerms: string[];
				}
			>;
			stageCounts: Map<string, number>;
		}
	>();
	const articlesWithMappedInstitutions = new Set<number>();

	for (const articleId of matchingArticleIds) {
		const record = articlesExtended[String(articleId)] as
			| ExtendedArticleRecord
			| undefined;
		const articleRecord = articleRecordsById.get(articleId);
		if (!record || !articleRecord) continue;

		const institutionIds = toStringArray(record["authorships.institutions.id"]);
		let hasInstitutionForCurrentArticle = false;

		for (const rawInstitutionId of institutionIds) {
			const institutionId = rawInstitutionId.trim();
			if (!isValidOpenAlexInstitutionId(institutionId)) continue;

			const institution = institutionsById[institutionId];
			if (!institution || !institution.geo) continue;

			const { latitude, longitude } = institution.geo;
			if (typeof latitude !== "number" || typeof longitude !== "number") {
				continue;
			}

			hasInstitutionForCurrentArticle = true;
			const current = institutionAccumulator.get(institutionId);
			const articleTitle =
				record.title ?? record.json_title ?? `Artigo ${articleId}`;
			const stageLabels =
				articleStagesById.get(articleId)?.map(
					(stageKey) =>
						groups.find((group) => group.stageKey === stageKey)?.stageTitle ??
						stageKey,
				) ?? [];
			const normalizedStageLabels =
				stageLabels.length > 0 ? stageLabels : ["Área não classificada"];

			if (!current) {
				const stageCounts = new Map<string, number>();
				for (const stageKey of articleStagesById.get(articleId) ?? []) {
					stageCounts.set(stageKey, (stageCounts.get(stageKey) ?? 0) + 1);
				}

				institutionAccumulator.set(institutionId, {
					institution,
					articleIds: new Set([articleId]),
					articleDetails: new Map([
						[
							articleId,
							{
								title: articleTitle,
								stageLabels: normalizedStageLabels,
								technologyTerms: articleRecord.technologyTerms,
								environmentalTerms: articleRecord.environmentalTerms,
							},
						],
					]),
					stageCounts,
				});
				continue;
			}

			current.articleIds.add(articleId);
			if (!current.articleDetails.has(articleId)) {
				current.articleDetails.set(articleId, {
					title: articleTitle,
					stageLabels: normalizedStageLabels,
					technologyTerms: articleRecord.technologyTerms,
					environmentalTerms: articleRecord.environmentalTerms,
				});
			}
			for (const stageKey of articleStagesById.get(articleId) ?? []) {
				current.stageCounts.set(
					stageKey,
					(current.stageCounts.get(stageKey) ?? 0) + 1,
				);
			}
		}

		if (hasInstitutionForCurrentArticle) {
			articlesWithMappedInstitutions.add(articleId);
		}
	}

	const institutionMapPoints: InstitutionMapPoint[] = Array.from(
		institutionAccumulator.entries(),
	).map(
		([
			institutionId,
			{ institution, articleIds, articleDetails, stageCounts },
		]) => {
			const dominantStageKey = Array.from(stageCounts.entries()).sort(
				(a, b) => b[1] - a[1],
			)[0]?.[0];

			return {
				id: institutionId,
				name: institution.display_name,
				city: institution.geo?.city ?? null,
				region: institution.geo?.region ?? null,
				country: institution.geo?.country ?? institution.country_code ?? null,
				latitude: institution.geo?.latitude ?? 0,
				longitude: institution.geo?.longitude ?? 0,
				articleCount: articleIds.size,
				articles: Array.from(articleDetails.entries())
					.map(([id, detail]) => ({
						id,
						title: detail.title,
						stageLabel: detail.stageLabels.join(" / "),
						technologyTerms: detail.technologyTerms,
						environmentalTerms: detail.environmentalTerms,
					}))
					.slice(0, 6),
				dominantAreaLabel: dominantStageKey
					? (groups.find((group) => group.stageKey === dominantStageKey)
							?.stageTitle ?? dominantStageKey)
					: "Área não classificada",
				color: dominantStageKey
					? (stageColorByKey.get(dominantStageKey) ?? "#0ea5e9")
					: "#0ea5e9",
			};
		},
	);

	institutionMapPoints.sort((a, b) => b.articleCount - a.articleCount);

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e8f5ee_0%,_#f5f8f6_42%,_#ffffff_100%)] text-[#0f172a]">
			<main className="mx-auto w-full max-w-[992px] px-6 py-8 md:px-12">

				<section className="mt-6 rounded-[18px] border border-[#dbe7df] bg-white/90 p-6 shadow-[0px_18px_34px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#7a8a9d]">
						Filtro por termos
					</p>
					<h1 className="mt-2 text-3xl font-black tracking-[-0.8px] text-[#0f172a] md:text-4xl">
						{isShowingAllResults
							? "Todos os resultados do grafo"
							: hasSelectedTerms
							? "Resultados por termos selecionados"
							: "Resultados por termos"}
					</h1>
					<p className="mt-2 text-base text-[#64748b]">
						{isShowingAllResults
							? `${totalResults} artigos encontrados sem filtros aplicados.`
							: hasSelectedTerms
							? `${totalResults} artigos encontrados.`
							: "Resultados carregados."}
					</p>
					{totalResults > 0 ? (
						<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3">
								<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#1d4ed8]">
									Total
								</p>
								<p className="mt-1 text-2xl font-black text-[#1e3a8a]">
									{totalResults}
								</p>
							</div>
							<div className="rounded-xl border border-[#bae6fd] bg-[#ecfeff] px-4 py-3">
								<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#0369a1]">
									Termos Tec
								</p>
								<p className="mt-1 text-2xl font-black text-[#0c4a6e]">
									{selectedTecTerms.length}
								</p>
							</div>
							<div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
								<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#15803d]">
									Termos Env
								</p>
								<p className="mt-1 text-2xl font-black text-[#14532d]">
									{selectedEnvTerms.length}
								</p>
							</div>
						</div>
					) : null}
				</section>

				{selectedTecTerms.length > 0 ? (
					<div className="mt-4 flex flex-wrap gap-2">
						{selectedTecTerms.map((term) => (
							<span
								className="inline-flex rounded-full border border-[#bfdbfe] bg-white px-3 py-1 text-xs font-semibold text-[#1e3a8a]"
								key={`tec-${term}`}
							>
								Tec: {formatTermLabel(term)}
							</span>
						))}
					</div>
				) : null}

				{selectedEnvTerms.length > 0 ? (
					<div className="mt-2 flex flex-wrap gap-2">
						{selectedEnvTerms.map((term) => (
							<span
								className="inline-flex rounded-full border border-[#bbf7d0] bg-white px-3 py-1 text-xs font-semibold text-[#166534]"
								key={`env-${term}`}
							>
								Env: {formatTermLabel(term)}
							</span>
						))}
					</div>
				) : null}

				{totalResults > 0 ? (
					<section className="mt-4 flex flex-wrap justify-end gap-3">
						<Link
							className="inline-flex items-center rounded-full border border-[#bfdbfe] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.8px] text-[#1d4ed8] shadow-[0px_16px_30px_-18px_rgba(37,99,235,0.35)] transition-colors hover:bg-[#eff6ff]"
							href={buildDownloadHref("csv", downloadQuery)}
						>
							Baixar CSV
						</Link>
						<Link
							className="inline-flex items-center rounded-full bg-[#2563eb] px-5 py-3 text-sm font-bold uppercase tracking-[0.8px] text-white shadow-[0px_16px_30px_-18px_rgba(37,99,235,0.75)] transition-colors hover:bg-[#1d4ed8]"
							href={buildDownloadHref("docx", downloadQuery)}
						>
							Baixar DOCX
						</Link>
					</section>
				) : null}

				{chartItems.length > 0 ? (
					<section className="mt-8 rounded-[16px] border border-[#dce9e1] bg-white p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
							Distribuição por etapa
						</h2>
						<p className="mt-1 text-sm text-[#64748b]">
							Quantidade de artigos encontrados em cada etapa da AIA.
						</p>
						<div className="mt-4">
							<TermsBarChartClient items={chartItems} tone={tone} />
						</div>
					</section>
				) : null}

				{totalResults > 0 ? (
					<section className="mt-8 space-y-6">
						<div className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
							<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
								Séries temporais por categoria
							</h2>
							<p className="mt-1 text-sm text-[#64748b]">
								Cada linha representa um termo ou área dentro do conjunto de
								artigos já filtrado no grafo.
							</p>
						</div>

						<section className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
							<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#0f4c81]">
								Termos de tecnologia
							</h3>
							<p className="mt-1 text-sm text-[#64748b]">
								{selectedTecTerms.length > 0
									? "Linhas geradas apenas para os termos tecnológicos selecionados."
									: "Nenhum termo tecnológico foi selecionado; o gráfico considera todos os termos tecnológicos presentes nos artigos filtrados."}
							</p>
							<div className="mt-4">
								<TermsMultiLineChartClient
									emptyMessage="Não há termos tecnológicos com ano de publicação válido nos artigos filtrados."
									series={technologyTermsTrend}
									tone="blue"
								/>
							</div>
						</section>

						<section className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
							<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
								Termos ambientais
							</h3>
							<p className="mt-1 text-sm text-[#64748b]">
								{selectedEnvTerms.length > 0
									? "Linhas geradas apenas para os termos ambientais selecionados."
									: "Nenhum termo ambiental foi selecionado; o gráfico considera todos os termos ambientais presentes nos artigos filtrados."}
							</p>
							<div className="mt-4">
								<TermsMultiLineChartClient
									emptyMessage="Não há termos ambientais com ano de publicação válido nos artigos filtrados."
									series={environmentalTermsTrend}
									tone="green"
								/>
							</div>
						</section>

						<section className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
							<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#7c2d12]">
								Áreas de AIA
							</h3>
							<p className="mt-1 text-sm text-[#64748b]">
								Todas as áreas de AIA são consideradas, independentemente dos
								termos selecionados no grafo.
							</p>
							<div className="mt-4">
								<TermsMultiLineChartClient
									emptyMessage="Não há anos válidos para montar a série temporal das áreas de AIA."
									series={areasTrend}
									tone="blue"
								/>
							</div>
						</section>
					</section>
				) : null}

				{totalResults > 0 ? (
					<TermsInstitutionsMapClient
						areas={areaLegend}
						articlesWithMappedInstitutions={articlesWithMappedInstitutions.size}
						points={institutionMapPoints}
						totalArticles={totalResults}
					/>
				) : null}

				{totalResults > 0 ? (
					<section className="mt-8 space-y-5">
						{groupsWithColors.map((group) => {
							const subtleBackground = hexToRgba(group.color, 0.09);

							return (
								<section key={group.stageKey}>
									<details
										className="group rounded-[14px] bg-white shadow-[0px_14px_26px_-24px_rgba(15,23,42,0.35)]"
										style={{ border: `1px solid ${hexToRgba(group.color, 0.4)}` }}
									>
										<summary
											className="cursor-pointer list-none px-4 py-3.5 text-lg font-bold text-[#0f172a] marker:content-none"
											style={{ backgroundColor: subtleBackground }}
										>
											<span className="inline-flex items-center gap-2.5">
												<span
													aria-hidden
													className="inline-flex h-6 w-6 items-center justify-center rounded-full text-sm text-white transition-transform group-open:rotate-90"
													style={{ backgroundColor: group.color }}
												>
													▸
												</span>
												<span>
													{group.stageTitle} ({group.articles.length})
												</span>
											</span>
										</summary>
										<div className="space-y-4 px-4 pb-4">
											{group.articles.map((article) => (
												<ArticleCard
													abstract={article.article.abstract}
													href={article.articleUrl}
													key={`${group.stageKey}-${article.article.id}`}
													keywords={article.article.keywords ?? []}
													metadata={buildArticleMetadata(article)}
													showAbstract={false}
													titleHref={article.preferredLink}
													title={article.article.title}
												/>
											))}
										</div>
									</details>
								</section>
							);
						})}
					</section>
				) : null}

				{totalResults === 0 ? (
					<section className="mt-8 rounded-[12px] border border-[#e2e8f0] bg-white p-6">
						<h2 className="text-lg font-bold text-[#0f172a]">
							Nenhum artigo encontrado
						</h2>
						<p className="mt-2 text-sm text-[#64748b]">
							Não encontramos artigos para a combinação de termos selecionada.
						</p>
					</section>
				) : null}
			</main>
		</div>
	);
}
