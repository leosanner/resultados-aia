import Link from "next/link";

const FUNNEL_STEPS = [
	{ label: "Busca total nas bases", value: "> 16.000", width: "100%", tone: "bg-[#2563eb]" },
	{ label: "Interseção Scopus + OpenAlex", value: "5.580", width: "65%", tone: "bg-[#0891b2]" },
	{ label: "Após filtro FWCI", value: "3.880", width: "46%", tone: "bg-[#0d9488]" },
	{ label: "Classificador AIA (relevantes)", value: "605", width: "22%", tone: "bg-[#16a34a]" },
	{
		label: "Filtro final: environmental monitoring + reforço ambiental",
		value: "122",
		width: "12%",
		tone: "bg-[#ea580c]",
	},
];

export default function MethodsPage() {
	return (
		<div className="min-h-screen bg-[linear-gradient(135deg,_#ecfeff_0%,_#f0fdf4_35%,_#eff6ff_100%)] text-[#0f172a]">
			<header className="border-b border-[#bfdbfe] bg-white/80 px-6 py-5 backdrop-blur-sm md:px-10">
				<div className="mx-auto flex w-full max-w-[1160px] items-center justify-between">
					<div>
						<p className="text-xs font-bold uppercase tracking-[1px] text-[#2563eb]">
							Projeto AIA
						</p>
						<h1 className="text-2xl font-black tracking-[-0.6px] text-[#0f172a]">
							Métodos e Pipeline
						</h1>
					</div>
					<Link
						className="inline-flex rounded-full border border-[#60a5fa] bg-[#eff6ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.6px] text-[#1d4ed8] hover:bg-[#dbeafe]"
						href="/"
					>
						Voltar para início
					</Link>
				</div>
			</header>

			<main className="mx-auto w-full max-w-[1160px] space-y-6 px-6 py-8 md:px-10">
				<section className="rounded-2xl border border-[#bfdbfe] bg-white p-6 shadow-[0px_10px_24px_-18px_rgba(37,99,235,0.5)]">
					<h2 className="text-xl font-black text-[#0f172a]">Objetivo Geral</h2>
					<p className="mt-2 text-sm leading-7 text-[#334155]">
						Identificar artigos na interseção entre tecnologia (IA/ML) e temas ambientais de
						Avaliação de Impacto Ambiental (AIA), gerando um conjunto pequeno e altamente
						relevante para análise.
					</p>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-2xl border border-[#bae6fd] bg-[#ecfeff] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#0e7490]">
							Fontes de dados
						</h3>
						<ul className="mt-3 space-y-2 text-sm font-semibold text-[#0f172a]">
							<li className="rounded-lg bg-white px-4 py-3">Scopus</li>
							<li className="rounded-lg bg-white px-4 py-3">OpenAlex</li>
						</ul>
					</article>

					<article className="rounded-2xl border border-[#86efac] bg-[#dcfce7] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
							Estratégia de busca
						</h3>
						<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="rounded-lg border border-[#bbf7d0] bg-white p-3">
								<p className="text-xs font-bold uppercase tracking-[0.8px] text-[#16a34a]">
									Tecnologia
								</p>
								<p className="mt-1 text-sm text-[#334155]">
									machine learning, deep learning e correlatos.
								</p>
							</div>
							<div className="rounded-lg border border-[#bbf7d0] bg-white p-3">
								<p className="text-xs font-bold uppercase tracking-[0.8px] text-[#16a34a]">
									Ambiental/AIA
								</p>
								<p className="mt-1 text-sm text-[#334155]">
									environmental impact assessment, risk analysis e correlatos.
								</p>
							</div>
						</div>
					</article>
				</section>

				<section className="rounded-2xl border border-[#cbd5e1] bg-white p-6">
					<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
						Funil de redução
					</h3>
					<div className="mt-5 space-y-4">
						{FUNNEL_STEPS.map((step) => (
							<div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3" key={step.label}>
								<div className="mb-2 flex items-center justify-between gap-3">
									<p className="text-sm font-semibold text-[#0f172a]">{step.label}</p>
									<span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#0f172a]">
										{step.value}
									</span>
								</div>
								<div className="h-3 w-full rounded-full bg-[#e2e8f0]">
									<div
										className={`h-3 rounded-full ${step.tone}`}
										style={{ width: step.width }}
									/>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#c2410c]">
							Regra especial aplicada
						</h3>
						<p className="mt-3 text-sm leading-7 text-[#7c2d12]">
							O termo <strong>environmental monitoring</strong> não pode aparecer sozinho.
							Ele precisa estar acompanhado de pelo menos outro termo ambiental (ou
							equivalente reforço semântico).
						</p>
					</article>

					<article className="rounded-2xl border border-[#93c5fd] bg-[#dbeafe] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#1d4ed8]">
							Resultado final da interface
						</h3>
						<p className="mt-3 text-sm leading-7 text-[#1e3a8a]">
							O conjunto final contém <strong>122 artigos</strong>, exibidos com título,
							resumo e palavras-chave, além de estatísticas agregadas para leitura rápida do
							corpus.
						</p>
					</article>
				</section>
			</main>
		</div>
	);
}
