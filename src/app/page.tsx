import { EiaModel } from "@/model/eia-stages";
import { formatStageTitle, stageKeyToSlug } from "@/lib/area-utils";
import Link from "next/link";

type AreaCard = {
	title: string;
	description: string;
	badgeClass: string;
	iconBgClass: string;
	iconSrc: string;
};

const logoIcon =
	"https://www.figma.com/api/mcp/asset/5991a927-15ee-4ad4-a626-237193d1b42d";
const iconBio =
	"https://www.figma.com/api/mcp/asset/a3509103-a2b1-4f73-812b-97cfac5d0a1a";
const iconWater =
	"https://www.figma.com/api/mcp/asset/a7a57faf-0b63-4d58-b9cd-0fe66ec7b7c0";
const iconAir =
	"https://www.figma.com/api/mcp/asset/1e1911ad-8bee-42e0-86b0-84ae16b21f97";
const iconSocio =
	"https://www.figma.com/api/mcp/asset/04d40bcb-6910-4016-9cba-b3be379390db";
const iconSoil =
	"https://www.figma.com/api/mcp/asset/10893607-8353-4a76-8311-fb2cc881c849";
const iconNoise =
	"https://www.figma.com/api/mcp/asset/060d7210-9823-45a1-8aaa-7e14ffdf1e93";

const CARD_STYLES: AreaCard[] = [
	{
		title: "",
		description: "",
		badgeClass: "bg-[#16a34a] text-white",
		iconBgClass: "bg-[#dcfce7]",
		iconSrc: iconBio,
	},
	{
		title: "",
		description: "",
		badgeClass: "bg-[#0284c7] text-white",
		iconBgClass: "bg-[#dbeafe]",
		iconSrc: iconWater,
	},
	{
		title: "",
		description: "",
		badgeClass: "bg-[#0d9488] text-white",
		iconBgClass: "bg-[#ccfbf1]",
		iconSrc: iconAir,
	},
	{
		title: "",
		description: "",
		badgeClass: "bg-[#9333ea] text-white",
		iconBgClass: "bg-[#f3e8ff]",
		iconSrc: iconSocio,
	},
	{
		title: "",
		description: "",
		badgeClass: "bg-[#d97706] text-white",
		iconBgClass: "bg-[#fef3c7]",
		iconSrc: iconSoil,
	},
	{
		title: "",
		description: "",
		badgeClass: "bg-[#e11d48] text-white",
		iconBgClass: "bg-[#ffe4e6]",
		iconSrc: iconNoise,
	},
];

function formatTotal(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

export default async function Home() {
	let summary: Record<string, number> | null = null;
	let loadError = false;

	try {
		const eiaModel = new EiaModel();
		summary = await eiaModel.getArticlesSummary();
	} catch {
		loadError = true;
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dcfce7_0%,_#dbeafe_45%,_#f8fafc_100%)] text-[#0f172a]">
			<header className="w-full border-b border-[#bfdbfe] bg-white/70 px-6 py-6 backdrop-blur-sm sm:px-10 lg:px-20 lg:py-8">
				<div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22c55e]/20 ring-1 ring-[#16a34a]/30">
							<img alt="" className="h-4 w-4" src={logoIcon} />
						</div>
						<div className="leading-tight">
							<p className="text-xl font-extrabold tracking-[-0.5px] text-[#1e293b]">
								Explorador AIA
							</p>
							<p className="text-[10px] font-bold uppercase tracking-[1px] text-[#2563eb]">
								Base de Pesquisa
							</p>
						</div>
					</div>

					<nav
						aria-label="Navegação principal"
						className="hidden items-center gap-8 md:flex"
					>
						<Link
							className="text-sm font-medium text-[#64748b] transition-colors hover:text-[#1e293b]"
							href="/"
						>
							Biblioteca
						</Link>
						<Link
							className="text-sm font-medium text-[#64748b] transition-colors hover:text-[#1e293b]"
							href="/metodos"
						>
							Métodos
						</Link>
						<button
							aria-label="Entrar na plataforma"
							className="rounded-full bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
							type="button"
						>
							Entrar
						</button>
					</nav>
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 pb-14 pt-6 sm:px-10 lg:gap-16 lg:px-20 lg:pt-12">
				<section className="max-w-[672px]">
					<h1 className="text-4xl font-black leading-[1.05] tracking-[-1.2px] text-[#0f172a] md:text-5xl">
						Visão Geral das Etapas da AIA
					</h1>
					<p className="mt-4 text-lg leading-[1.6] text-[#64748b]">
						Explore pesquisas em Avaliação de Impacto Ambiental organizadas por
						etapas reais do processo.
					</p>
				</section>

				{loadError ? (
					<section className="rounded-3xl border border-[#f1f5f9] bg-white p-8">
						<h2 className="text-xl font-bold text-[#1e293b]">
							Não foi possível carregar os dados
						</h2>
						<p className="mt-2 text-sm text-[#64748b]">
							Ocorreu um erro ao buscar os artigos. Tente novamente em
							instantes.
						</p>
					</section>
				) : (
					<section
						aria-label="Áreas de pesquisa"
						className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
					>
						{Object.entries(summary ?? {}).map(([stageKey, total], index) => {
							const style = CARD_STYLES[index % CARD_STYLES.length];
							const stageTitle = formatStageTitle(stageKey);
							const description = `Artigos relacionados à etapa "${stageTitle}" no processo de AIA.`;
							const stageSlug = stageKeyToSlug(stageKey);

							return (
								<article
									className="flex min-h-[292px] flex-col rounded-3xl border border-[#bfdbfe] bg-white p-[33px] shadow-[0px_10px_25px_-18px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:border-[#60a5fa] hover:shadow-[0px_18px_34px_-22px_rgba(37,99,235,0.6)]"
									key={stageKey}
								>
									<div
										className={`flex h-16 w-16 items-center justify-center rounded-2xl ${style.iconBgClass}`}
									>
										<img
											alt=""
											className="h-7 w-7 object-contain"
											src={style.iconSrc}
										/>
									</div>
									<h2 className="mt-6 text-[36px]/8 font-bold text-[#1e293b] sm:text-4xl lg:text-3xl">
										{stageTitle}
									</h2>
									<p className="mt-2 line-clamp-2 text-sm leading-[22.75px] text-[#64748b]">
										{description}
									</p>
									<div className="mt-6">
										<span
											className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.6px] ${style.badgeClass}`}
										>
											{formatTotal(total)} artigos
										</span>
									</div>
									<div className="mt-6 flex flex-wrap gap-3">
										<Link
											aria-label={`Abrir artigos da área ${stageTitle}`}
											className="inline-flex rounded-full bg-[#2563eb] px-4 py-2 text-xs font-bold uppercase tracking-[0.6px] text-white hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
											href={`/areas/${stageSlug}/artigos`}
										>
											Ver artigos
										</Link>
										<Link
											aria-label={`Abrir estatísticas da área ${stageTitle}`}
											className="inline-flex rounded-full border border-[#60a5fa] bg-[#eff6ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.6px] text-[#1d4ed8] hover:bg-[#dbeafe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
											href={`/areas/${stageSlug}/estatisticas`}
										>
											Ver estatísticas
										</Link>
									</div>
								</article>
							);
						})}
					</section>
				)}

				{!loadError &&
				summary &&
				Object.values(summary).every((count) => count === 0) ? (
					<section className="rounded-3xl border border-[#f1f5f9] bg-white p-8">
						<h2 className="text-xl font-bold text-[#1e293b]">
							Nenhum resultado encontrado
						</h2>
						<p className="mt-2 text-sm text-[#64748b]">
							Ainda não há artigos classificados para estas áreas.
						</p>
					</section>
				) : null}
			</main>

			<footer className="border-t border-[#bfdbfe] bg-white/80 px-6 py-12 sm:px-10 lg:px-20">
				<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 text-sm text-[#94a3b8] md:flex-row md:items-center md:justify-between">
					<p>
						© 2026 Projeto Base de Pesquisa AIA. Acesso simplificado à pesquisa.
					</p>
					<nav
						aria-label="Links do rodapé"
						className="flex flex-wrap items-center gap-8"
					>
						<a className="transition-colors hover:text-[#64748b]" href="#">
							Documentação
						</a>
						<a className="transition-colors hover:text-[#64748b]" href="#">
							Acesso à API
						</a>
						<a className="transition-colors hover:text-[#64748b]" href="#">
							Privacidade
						</a>
					</nav>
				</div>
			</footer>
		</div>
	);
}
