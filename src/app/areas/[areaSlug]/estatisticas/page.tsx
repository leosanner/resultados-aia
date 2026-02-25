import { TermsBarChart } from "@/components/charts/terms-bar-chart";
import { formatStageTitle, slugToStageKey } from "@/lib/area-utils";
import { EiaModel } from "@/model/eia-stages";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		areaSlug: string;
	}>;
};

type BarChartItem = {
	label: string;
	value: number;
};

function formatTermLabel(text: string) {
	return text
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function mapTermsToChart(terms: Record<string, number> | undefined): BarChartItem[] {
	return Object.entries(terms ?? {})
		.map(([label, value]) => ({ label: formatTermLabel(label), value }))
		.sort((a, b) => b.value - a.value)
		.filter((item) => item.value > 0);
}

export default async function AreaStatisticsPage({ params }: PageProps) {
	const { areaSlug } = await params;
	const stageKey = slugToStageKey(areaSlug);
	const eiaModel = new EiaModel();
	const [summaryByStage, summary] = await Promise.all([
		eiaModel.summaryByStage(stageKey),
		eiaModel.getArticlesSummary(),
	]);

	if (!(stageKey in summary) || !summaryByStage) {
		notFound();
	}

	const stageName = formatStageTitle(stageKey);
	const technologyTerms = mapTermsToChart(summaryByStage.tec).slice(0, 12);
	const environmentalTerms = mapTermsToChart(summaryByStage.env).slice(0, 12);

	return (
		<div className="min-h-screen bg-[#e9f5ee] text-[#0f172a]">
			<main className="mx-auto w-full max-w-[1100px] px-6 py-8 md:px-12">
				<Link
					className="text-xs font-bold uppercase tracking-[1.2px] text-[#94a3b8] hover:text-[#64748b]"
					href="/"
				>
					Voltar para áreas
				</Link>

				<h1 className="mt-4 text-4xl font-black tracking-[-0.9px] text-[#0f172a]">
					Estatísticas de {stageName}
				</h1>
				<p className="mt-2 text-base text-[#64748b]">
					Gráfico de barras com frequência dos termos encontrados na etapa.
				</p>

				<section className="mt-8 space-y-6">
					<article className="rounded-[12px] border border-[#7dd3fc] bg-[#cffafe] p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#0e7490]">
							Termos de tecnologia
						</h2>
						<div className="mt-4">
							<TermsBarChart items={technologyTerms} tone="blue" />
						</div>
					</article>

					<article className="rounded-[12px] border border-[#86efac] bg-[#dcfce7] p-5">
						<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
							Termos ambientais
						</h2>
						<div className="mt-4">
							<TermsBarChart items={environmentalTerms} tone="green" />
						</div>
					</article>
				</section>
			</main>
		</div>
	);
}
