import {
	ArticleCard,
	type ArticleMetadata,
} from "@/components/articles/article-card";
import { ArticlesYearLineChart } from "@/components/charts/articles-year-line-chart";
import { getToneColorByIndex } from "@/components/charts/chart-palettes";
import { TermsInstitutionsMapClient } from "@/components/termos/terms-institutions-map-client";
import { TermsBarChart } from "@/components/charts/terms-bar-chart";
import institutionInformationData from "@/data/instituition_information.json";
import { formatStageTitle, stageKeyToSlug } from "@/lib/area-utils";
import {
	ArticleModel,
	type Article,
	type EnvTerm,
	type TecTerm,
} from "@/model/article";
import { EiaModel, type StageArticle } from "@/model/eia-stages";
import Link from "next/link";
import type {
	AreaLegendItem,
	InstitutionMapPoint,
} from "@/components/termos/terms-institutions-map";

type PageProps = {
	searchParams: Promise<{
		term?: string | string[];
		type?: string | string[];
		tec?: string | string[];
		env?: string | string[];
	}>;
};

function formatTermLabel(text: string) {
	return text
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function toArray(value: string | string[] | undefined) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}

function normalizeTerms(values: string[]) {
	return Array.from(
		new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)),
	);
}

function buildArticleFingerprint(article: Article) {
	return JSON.stringify({
		title: article.title,
		abstract: article.abstract,
		keywords: article.keywords,
	});
}

type ExtendedArticleRecord = {
	title?: string;
	json_title?: string;
	publish_date?: string | null;
	publication_year?: number | string | null;
	doi_x?: string | null;
	doi_y?: string | null;
	source?: string | null;
	["primary_location.source.display_name"]?: string | null;
	cited_by_count?: number | string | null;
	language?: string | null;
	["authorships.institutions.id"]?: string | string[] | null;
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

const logoIcon =
	"https://www.figma.com/api/mcp/asset/5991a927-15ee-4ad4-a626-237193d1b42d";

function hexToRgba(hex: string, alpha: number) {
	const normalized = hex.replace("#", "");
	const parsed = Number.parseInt(normalized, 16);
	const r = (parsed >> 16) & 255;
	const g = (parsed >> 8) & 255;
	const b = parsed & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildArticleMetadata(
	record: ExtendedArticleRecord | undefined,
): ArticleMetadata[] {
	if (!record) return [];

	const publicationDate =
		typeof record.publish_date === "string" ? record.publish_date.trim() : "";
	const publicationYear =
		typeof record.publication_year === "number"
			? String(record.publication_year)
			: typeof record.publication_year === "string"
				? record.publication_year.trim()
				: "";
	const sourceName =
		typeof record["primary_location.source.display_name"] === "string"
			? record["primary_location.source.display_name"].trim()
			: typeof record.source === "string"
				? record.source.trim()
				: "";
	const doiRaw =
		typeof record.doi_x === "string" && record.doi_x.trim()
			? record.doi_x.trim()
			: typeof record.doi_y === "string"
				? record.doi_y.replace(/^https?:\/\/doi\.org\//i, "").trim()
				: "";
	const citedBy =
		typeof record.cited_by_count === "number"
			? String(record.cited_by_count)
			: typeof record.cited_by_count === "string"
				? record.cited_by_count.trim()
				: "";
	const language =
		typeof record.language === "string" ? record.language.trim() : "";

	return [
		publicationDate ? { label: "Data", value: publicationDate } : null,
		!publicationDate && publicationYear
			? { label: "Ano", value: publicationYear }
			: null,
		sourceName ? { label: "Fonte", value: sourceName } : null,
		doiRaw ? { label: "DOI", value: doiRaw } : null,
		citedBy ? { label: "Citações", value: citedBy } : null,
		language ? { label: "Idioma", value: language } : null,
	].filter((item): item is ArticleMetadata => Boolean(item));
}

export default async function TermArticlesPage({ searchParams }: PageProps) {
	const currentSearchParams = await searchParams;
	const selectedTecTerms = normalizeTerms(toArray(currentSearchParams.tec));
	const selectedEnvTerms = normalizeTerms(toArray(currentSearchParams.env));
	let totalResults = 0;

	// Backward compatibility with /termos?term=...&type=...
	if (selectedTecTerms.length === 0 && selectedEnvTerms.length === 0) {
		const legacyTerm = toArray(currentSearchParams.term)[0]
			?.trim()
			.toLowerCase();
		const legacyType = toArray(currentSearchParams.type)[0];
		if (legacyTerm) {
			if (legacyType === "env") {
				selectedEnvTerms.push(legacyTerm);
			} else {
				selectedTecTerms.push(legacyTerm);
			}
		}
	}

	const hasSelectedTerms =
		selectedTecTerms.length > 0 || selectedEnvTerms.length > 0;
	const eiaModel = new EiaModel();
	const articleModel = new ArticleModel();
	const articlesByStage = await eiaModel.getArticlesByStage();
	const articlesExtendedRaw = await articleModel.getArticlesExtended();
	const matchingArticleIds = new Set<number>();

	if (hasSelectedTerms) {
		const filteredArticles = await articleModel.filterArticlesByTerms({
			env: selectedEnvTerms as EnvTerm[],
			tec: selectedTecTerms as TecTerm[],
		});
		totalResults = filteredArticles.length;
		const filteredByFingerprint = filteredArticles.reduce<
			Record<string, number>
		>((current, article) => {
			const fingerprint = buildArticleFingerprint(article);
			current[fingerprint] = (current[fingerprint] ?? 0) + 1;
			return current;
		}, {});
		const allArticles = await articleModel.getArticles();

		for (const [articleId, article] of Object.entries(allArticles)) {
			const fingerprint = buildArticleFingerprint(article);
			if ((filteredByFingerprint[fingerprint] ?? 0) > 0) {
				matchingArticleIds.add(Number(articleId));
				filteredByFingerprint[fingerprint] -= 1;
			}
		}
	}

	const groupedResults = Object.entries(articlesByStage).map(
		([stageKey, articles]) => {
			const stageArticles = hasSelectedTerms
				? articles.filter((article) => matchingArticleIds.has(article.id))
				: ([] as StageArticle[]);

			return {
				stageKey,
				articles: stageArticles,
			};
		},
	);
	const groupsWithResults = groupedResults
		.filter((group) => group.articles.length > 0)
		.sort((a, b) => b.articles.length - a.articles.length);
	const tone = "blue" as const;
	const groupsWithColors = groupsWithResults.map((group, index) => ({
		...group,
		color: getToneColorByIndex(tone, index),
	}));
	const chartItems: BarChartItem[] = groupsWithResults.map((group) => ({
		label: formatStageTitle(group.stageKey),
		value: group.articles.length,
	}));
	const articleStagesById = new Map<number, string[]>();
	for (const group of groupedResults) {
		for (const article of group.articles) {
			const currentStages = articleStagesById.get(article.id) ?? [];
			currentStages.push(group.stageKey);
			articleStagesById.set(article.id, currentStages);
		}
	}
	const stageColorByKey = new Map(
		groupsWithColors.map((group) => [group.stageKey, group.color]),
	);
	const areaLegend: AreaLegendItem[] = groupsWithColors.map((group) => ({
		stageKey: group.stageKey,
		label: formatStageTitle(group.stageKey),
		color: group.color,
		count: group.articles.length,
	}));
	const articlesExtended =
		articlesExtendedRaw as unknown as Record<string, ExtendedArticleRecord>;
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
				}
			>;
			stageCounts: Map<string, number>;
		}
	>();
	const articlesWithMappedInstitutions = new Set<number>();

	for (const articleId of matchingArticleIds) {
		const record = articlesExtended[String(articleId)];
		if (!record) continue;

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
				(articleStagesById.get(articleId) ?? []).map((stageKey) =>
					formatStageTitle(stageKey),
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
					}))
					.slice(0, 6),
				dominantAreaLabel: dominantStageKey
					? formatStageTitle(dominantStageKey)
					: "Área não classificada",
				color: dominantStageKey
					? (stageColorByKey.get(dominantStageKey) ?? "#0ea5e9")
					: "#0ea5e9",
			};
		},
	);

	institutionMapPoints.sort((a, b) => b.articleCount - a.articleCount);
	const yearlyCountByPublicationYear = new Map<number, number>();
	for (const articleId of matchingArticleIds) {
		const publicationYearRaw =
			articlesExtended[String(articleId)]?.publication_year;
		const publicationYear =
			typeof publicationYearRaw === "number"
				? publicationYearRaw
				: Number(publicationYearRaw);

		if (
			!Number.isInteger(publicationYear) ||
			publicationYear < 1900 ||
			publicationYear > 2100
		) {
			continue;
		}

		yearlyCountByPublicationYear.set(
			publicationYear,
			(yearlyCountByPublicationYear.get(publicationYear) ?? 0) + 1,
		);
	}
	const yearlyArticlesTrend = Array.from(
		yearlyCountByPublicationYear.entries(),
	)
		.sort((a, b) => a[0] - b[0])
		.map(([year, total]) => ({ year, total }));

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e8f5ee_0%,_#f5f8f6_42%,_#ffffff_100%)] text-[#0f172a]">
			<header className="w-full border-b border-[#173f2f] bg-[#0f1f19]/95 px-6 py-6 backdrop-blur-sm sm:px-10 lg:px-20 lg:py-8">
				<div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2ecc71]/20 ring-1 ring-[#28a745]/30">
							<img alt="" className="h-4 w-4" src={logoIcon} />
						</div>
						<div className="leading-tight">
							<p className="text-xl font-extrabold tracking-[-0.5px] text-white">
								Explorador AIA
							</p>
							<p className="text-[10px] font-bold uppercase tracking-[1px] text-[#7dd3a8]">
								Base de Pesquisa
							</p>
						</div>
					</div>
					<nav
						aria-label="Navegação principal"
						className="hidden items-center gap-8 md:flex"
					>
						<Link
							className="text-sm font-medium text-[#d6e5dd] transition-colors hover:text-white"
							href="/"
						>
							Biblioteca
						</Link>
						<Link
							className="text-sm font-medium text-white"
							href="/metodologia"
						>
							Métodos
						</Link>
						<Link
							className="text-sm font-medium text-[#d6e5dd] transition-colors hover:text-white"
							href="/autores"
						>
							Autores
						</Link>
						<span className="rounded-full bg-[#2ecc71] px-5 py-2 text-sm font-semibold text-white">
							Resultados
						</span>
					</nav>
				</div>
			</header>

			<main className="mx-auto w-full max-w-[992px] px-6 py-8 md:px-12">

				<section className="mt-6 rounded-[18px] border border-[#dbe7df] bg-white/90 p-6 shadow-[0px_18px_34px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#7a8a9d]">
						Filtro por termos
					</p>
					<h1 className="mt-2 text-3xl font-black tracking-[-0.8px] text-[#0f172a] md:text-4xl">
						{hasSelectedTerms
							? "Resultados por termos selecionados"
							: "Selecione termos no grafo"}
					</h1>
					<p className="mt-2 text-base text-[#64748b]">
						{hasSelectedTerms
							? `${totalResults} artigos encontrados.`
							: "Selecione termos no painel do grafo e use o botão para ver os artigos encontrados."}
					</p>
					{hasSelectedTerms ? (
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

				{hasSelectedTerms && chartItems.length > 0 ? (
					<section className="mt-8 rounded-[16px] border border-[#dce9e1] bg-white p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
							Distribuição por etapa
						</h2>
						<p className="mt-1 text-sm text-[#64748b]">
							Quantidade de artigos encontrados em cada etapa da AIA.
						</p>
						<div className="mt-4">
							<TermsBarChart items={chartItems} tone={tone} />
						</div>
					</section>
				) : null}

				{hasSelectedTerms && totalResults > 0 ? (
					<section className="mt-8 rounded-[16px] border border-[#dce9e1] bg-white p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
							Evolução anual de artigos
						</h2>
						<p className="mt-1 text-sm text-[#64748b]">
							Quantidade de artigos publicados por ano para os termos
							selecionados.
						</p>
						<div className="mt-4">
							<ArticlesYearLineChart items={yearlyArticlesTrend} />
						</div>
					</section>
				) : null}

				{hasSelectedTerms && totalResults > 0 ? (
					<TermsInstitutionsMapClient
						areas={areaLegend}
						articlesWithMappedInstitutions={articlesWithMappedInstitutions.size}
						points={institutionMapPoints}
						totalArticles={totalResults}
					/>
				) : null}

				{hasSelectedTerms ? (
					<section className="mt-8 space-y-5">
						{groupsWithColors.map((group) => {
							const areaSlug = stageKeyToSlug(group.stageKey);
							const stageTitle = formatStageTitle(group.stageKey);
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
													{stageTitle} ({group.articles.length})
												</span>
											</span>
										</summary>
										<div className="space-y-4 px-4 pb-4">
											{group.articles.map((article) => (
												<ArticleCard
													abstract={article.abstract}
													href={`/areas/${areaSlug}/artigos/${article.id}`}
													key={`${group.stageKey}-${article.id}`}
													keywords={article.keywords ?? []}
													metadata={buildArticleMetadata(
														articlesExtended[String(article.id)],
													)}
													showAbstract={false}
													title={article.title}
												/>
											))}
										</div>
									</details>
								</section>
							);
						})}
					</section>
				) : null}

				{hasSelectedTerms && totalResults === 0 ? (
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
