import { GraphEmbedSection } from "@/components/sumarizacao/graph-embed-section";
import { KddBoard } from "@/components/sumarizacao/kdd-board";
import {
	getKddTechRows,
	kddStageHeaders,
	type KddTechRow,
} from "@/lib/kdd-board";

export default async function SumarizacaoPage() {
	let rows: KddTechRow[] | null = null;

	try {
		rows = await getKddTechRows();
	} catch {
		rows = null;
	}

	return (
		<div className="min-h-screen bg-[#f7faf5] text-[#191c1a]">
			<main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-8 pb-14 pt-16 lg:gap-16">
				<header className="max-w-2xl">
					<h1 className="text-4xl font-black tracking-[-0.9px] text-[#00261a]">
						Sumarização dos resultados
					</h1>
					<p className="mt-3 text-base leading-relaxed text-[#446554]">
						Uma visão consolidada das tecnologias digitais aplicadas à AIA,
						organizadas pelo fluxo de descoberta de conhecimento (KDD), e o grafo
						interativo de tecnologias e termos.
					</p>
				</header>

				{rows ? (
					<KddBoard stages={kddStageHeaders} rows={rows} />
				) : (
					<section className="rounded-xl border border-[#c0c8c3] bg-white p-8">
						<h2 className="text-xl font-bold text-[#00261a]">
							Não foi possível carregar o quadro
						</h2>
						<p className="mt-2 text-sm text-[#414944]">
							Ocorreu um erro ao buscar os dados das tecnologias. Tente novamente
							em instantes.
						</p>
					</section>
				)}

				<GraphEmbedSection />
			</main>
		</div>
	);
}
