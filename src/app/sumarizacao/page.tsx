import { GraphEmbedSection } from "@/components/sumarizacao/graph-embed-section";
import { YearTermsComparison } from "@/components/sumarizacao/year-terms-comparison";
import { getLocale } from "@/i18n/get-locale";
import { sumarizacaoCopy } from "@/i18n/pages/sumarizacao";
import { getYearTermsData, type YearTermsData } from "@/lib/year-terms";

export default async function SumarizacaoPage() {
	const copy = sumarizacaoCopy[await getLocale()];
	let yearData: YearTermsData | null = null;

	try {
		yearData = await getYearTermsData();
	} catch {
		yearData = null;
	}

	return (
		<div className="min-h-screen bg-[#f7faf5] text-[#191c1a]">
			<main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-8 pb-14 pt-16 lg:gap-16">
				<header className="max-w-2xl">
					<h1 className="text-4xl font-black tracking-[-0.9px] text-[#00261a]">
						{copy.page.title}
					</h1>
					<p className="mt-3 text-base leading-relaxed text-[#446554]">
						{copy.page.subtitle}
					</p>
				</header>

				{yearData && yearData.rows.length > 0 ? (
					<YearTermsComparison
						rows={yearData.rows}
						years={yearData.years}
						defaultThreshold={yearData.defaultThreshold}
					/>
				) : null}

				<GraphEmbedSection />
			</main>
		</div>
	);
}
