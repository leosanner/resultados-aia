import { TermsInstitutionsMapClient } from "@/components/termos/terms-institutions-map-client";
import { TermsMultiLineChartClient } from "@/components/charts/terms-multi-line-chart-client";
import { formatTecTermLabel, slugToTecTerm } from "@/lib/tech-utils";
import { getTechStats } from "@/lib/tech-stats";
import { BarChart3 } from "lucide-react";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export default async function TechStatisticsPage({ params }: PageProps) {
	const { slug } = await params;
	const tecTerm = slugToTecTerm(slug);

	if (!tecTerm) {
		notFound();
	}

	const stats = await getTechStats(tecTerm);

	if (!stats) {
		notFound();
	}

	const techName = formatTecTermLabel(tecTerm);

	return (
		<div className="min-h-screen bg-[#e4ece7] text-[#1f2937]">
			<main className="mx-auto w-full max-w-[1100px] px-6 py-8 md:px-12">
				<section className="rounded-2xl border border-[#8fbfa5] bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf8_100%)] p-6 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#64748b]">
						Painel da tecnologia
					</p>
					<div className="mt-2 flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9f1f5] ring-1 ring-[#b3c8d7]">
							<BarChart3 aria-hidden className="h-4 w-4 text-[#1F6F8B]" />
						</div>
						<h1 className="text-4xl font-black tracking-[-0.9px] text-[#1f2937]">
							Estatísticas de {techName}
						</h1>
					</div>
					<p className="mt-2 text-base text-[#556070]">
						Distribuição geográfica das afiliações e evolução dos termos
						coocorrentes ao longo do tempo.
					</p>
				</section>

				<section className="mt-8">
					<TermsInstitutionsMapClient
						areas={stats.areaLegend}
						articlesWithMappedInstitutions={stats.articlesWithMappedInstitutions}
						points={stats.institutionMapPoints}
						totalArticles={stats.totalArticles}
					/>
				</section>

				<section className="mt-8 rounded-[12px] border border-[#60a5fa] bg-[#f8fbff] p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
					<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#1d4ed8]">
						Termos de tecnologia ao longo do tempo
					</h2>
					<p className="mt-1 text-sm text-[#556070]">
						Coocorrência de outras tecnologias nos artigos de {techName}, por
						ano de publicação.
					</p>
					<div className="mt-4">
						<TermsMultiLineChartClient
							emptyMessage="Não há termos de tecnologia coocorrentes para esta seleção."
							series={stats.technologyTermsTrend}
							tone="blue"
						/>
					</div>
				</section>

				<section className="mt-8 rounded-[12px] border border-[#86efac] bg-[#f8fff9] p-5 shadow-[0px_14px_30px_-28px_rgba(17,24,39,0.7)]">
					<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
						Termos ambientais ao longo do tempo
					</h2>
					<p className="mt-1 text-sm text-[#556070]">
						Evolução dos termos ambientais nos artigos de {techName}, por ano
						de publicação.
					</p>
					<div className="mt-4">
						<TermsMultiLineChartClient
							emptyMessage="Não há termos ambientais para esta seleção."
							series={stats.environmentalTermsTrend}
							tone="green"
						/>
					</div>
				</section>
			</main>
		</div>
	);
}
