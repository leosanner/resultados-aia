import Link from "next/link";

type MainNavbarPage = "contextualizacao" | "metodologia" | "autores" | null;

type MainNavbarProps = {
	activePage?: MainNavbarPage;
	showResultsBadge?: boolean;
	showEntrarButton?: boolean;
};

const logoIcon =
	"https://www.figma.com/api/mcp/asset/5991a927-15ee-4ad4-a626-237193d1b42d";

function navItemClass(isActive: boolean) {
	return isActive
		? "text-sm font-medium text-white"
		: "text-sm font-medium text-[#d6e5dd] transition-colors hover:text-white";
}

export function MainNavbar({
	activePage = null,
	showResultsBadge = false,
	showEntrarButton = false,
}: MainNavbarProps) {
	return (
		<header className="w-full border-b border-[#173f2f] bg-[#0f1f19]/95 px-6 py-6 backdrop-blur-sm sm:px-10 lg:px-20 lg:py-8">
			<div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2ecc71]/20 ring-1 ring-[#28a745]/30">
						<img alt="" className="h-4 w-4" src={logoIcon} />
					</div>
					<div className="leading-tight">
						<Link
							href={"/"}
							className="text-xl font-extrabold tracking-[-0.5px] text-white"
						>
							Explorador AIA
						</Link>
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
						className={navItemClass(activePage === "contextualizacao")}
						href="/contextualizacao-geral"
					>
						Contextualização Geral
					</Link>
					<Link
						className={navItemClass(activePage === "metodologia")}
						href="/metodologia"
					>
						Metodologia
					</Link>
					<Link
						className={navItemClass(activePage === "autores")}
						href="/autores"
					>
						Autores
					</Link>
					{showResultsBadge ? (
						<span className="rounded-full bg-[#2ecc71] px-5 py-2 text-sm font-semibold text-white">
							Resultados
						</span>
					) : null}
					{showEntrarButton ? (
						<button
							aria-label="Entrar na plataforma"
							className="hidden rounded-full bg-[#2ecc71] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#28a745]"
							type="button"
						>
							Entrar
						</button>
					) : null}
				</nav>
			</div>
		</header>
	);
}
