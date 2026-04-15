import {
	ArticleCard,
	type ArticleMetadata,
} from "@/components/articles/article-card";
import { getToneColorByIndex } from "@/components/charts/chart-palettes";
import { TermsMultiLineChartClient } from "@/components/charts/terms-multi-line-chart-client";
import { TermsArticlesMapClient } from "@/components/termos/terms-articles-map-client";
import institutionInformationData from "@/data/instituition_information.json";
import {
	buildTermsDownloadQuery,
	formatTermLabel,
	getTermsSearchResults,
	type TermsSearchArticleRecord,
} from "@/lib/terms-search";
import type {
	ArticleMapPoint,
	TechnologyLegendItem,
} from "@/components/termos/terms-articles-map";
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
	corresponding_institution_ids?: string | string[] | null;
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

const MULTI_TECH_COLOR = "#ec4899";
const NO_TECH_COLOR = "#94a3b8";
const MULTI_TECH_KEY = "__multi__";
const NO_TECH_KEY = "__none__";

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
		flatArticles,
		technologyTermsTrend,
		environmentalTermsTrend,
		articlesExtended,
	} = await getTermsSearchResults(currentSearchParams);

	const availableTechnologyTerms = Array.from(
		new Set(flatArticles.flatMap((record) => record.technologyTermsFull)),
	).sort((a, b) => a.localeCompare(b, "pt-BR"));
	const technologyColorByKey = new Map<string, string>();
	availableTechnologyTerms.forEach((term, index) => {
		technologyColorByKey.set(term, getToneColorByIndex("blue", index));
	});

	const downloadQuery = buildTermsDownloadQuery({
		tec: selectedTecTerms,
		env: selectedEnvTerms,
	});

	const institutionsById =
		institutionInformationData as Record<string, InstitutionInformationRecord>;
	const mapPoints: ArticleMapPoint[] = [];
	const articlesWithMappedInstitutions = new Set<number>();
	const technologyCountsByKey = new Map<string, number>();

	for (const record of flatArticles) {
		const extended = articlesExtended[String(record.article.id)] as
			| ExtendedArticleRecord
			| undefined;
		if (!extended) continue;

		const institutionIds = toStringArray(
			extended.corresponding_institution_ids,
		);
		let hasMapped = false;

		const techFull = record.technologyTermsFull;
		let pointColor: string;
		let pointKey: string;
		if (techFull.length === 0) {
			pointColor = NO_TECH_COLOR;
			pointKey = NO_TECH_KEY;
		} else if (techFull.length === 1) {
			pointKey = techFull[0];
			pointColor = technologyColorByKey.get(techFull[0]) ?? NO_TECH_COLOR;
		} else {
			pointColor = MULTI_TECH_COLOR;
			pointKey = MULTI_TECH_KEY;
		}

		const seenInstitutionIds = new Set<string>();
		for (const rawInstitutionId of institutionIds) {
			const institutionId = rawInstitutionId.trim();
			if (!isValidOpenAlexInstitutionId(institutionId)) continue;
			if (seenInstitutionIds.has(institutionId)) continue;
			seenInstitutionIds.add(institutionId);

			const institution = institutionsById[institutionId];
			if (!institution || !institution.geo) continue;

			const { latitude, longitude } = institution.geo;
			if (typeof latitude !== "number" || typeof longitude !== "number") {
				continue;
			}

			hasMapped = true;
			mapPoints.push({
				id: `${record.article.id}-${institutionId}`,
				articleId: record.article.id,
				title: record.article.title,
				institutionName: institution.display_name,
				city: institution.geo?.city ?? null,
				region: institution.geo?.region ?? null,
				country: institution.geo?.country ?? institution.country_code ?? null,
				latitude,
				longitude,
				technologyTerms: record.technologyTermsFull.map(formatTermLabel),
				environmentalTerms: record.environmentalTermsFull.map(formatTermLabel),
				color: pointColor,
			});
		}

		if (hasMapped) {
			articlesWithMappedInstitutions.add(record.article.id);
			technologyCountsByKey.set(
				pointKey,
				(technologyCountsByKey.get(pointKey) ?? 0) + 1,
			);
		}
	}

	const technologyLegend: TechnologyLegendItem[] = [];
	for (const term of availableTechnologyTerms) {
		const count = technologyCountsByKey.get(term) ?? 0;
		if (count === 0) continue;
		technologyLegend.push({
			key: term,
			label: formatTermLabel(term),
			color: technologyColorByKey.get(term) ?? NO_TECH_COLOR,
			count,
		});
	}
	const multiCount = technologyCountsByKey.get(MULTI_TECH_KEY) ?? 0;
	if (multiCount > 0) {
		technologyLegend.push({
			key: MULTI_TECH_KEY,
			label: "Múltiplas tecnologias",
			color: MULTI_TECH_COLOR,
			count: multiCount,
		});
	}
	const noTechCount = technologyCountsByKey.get(NO_TECH_KEY) ?? 0;
	if (noTechCount > 0) {
		technologyLegend.push({
			key: NO_TECH_KEY,
			label: "Sem tecnologia",
			color: NO_TECH_COLOR,
			count: noTechCount,
		});
	}

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

				{totalResults > 0 ? (
					<section className="mt-8 space-y-6">
						<div className="rounded-[16px] border border-[#dce9e1] bg-white p-5">
							<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
								Séries temporais por categoria
							</h2>
							<p className="mt-1 text-sm text-[#64748b]">
								Cada linha representa um termo dentro do conjunto de artigos já
								filtrado no grafo.
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
									key={`technology-${technologyTermsTrend.map((item) => item.key).join("|")}`}
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
									key={`environmental-${environmentalTermsTrend.map((item) => item.key).join("|")}`}
									series={environmentalTermsTrend}
									tone="green"
								/>
							</div>
						</section>
					</section>
				) : null}

				{totalResults > 0 ? (
					<TermsArticlesMapClient
						articlesWithMappedInstitutions={articlesWithMappedInstitutions.size}
						points={mapPoints}
						technologyLegend={technologyLegend}
						totalArticles={totalResults}
					/>
				) : null}

				{totalResults > 0 ? (
					<section className="mt-8 space-y-4">
						{flatArticles.map((article) => (
							<ArticleCard
								abstract={article.article.abstract}
								href={article.articleUrl}
								key={article.article.id}
								keywords={article.article.keywords ?? []}
								metadata={buildArticleMetadata(article)}
								showAbstract={false}
								titleHref={article.preferredLink}
								title={article.article.title}
							/>
						))}
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
