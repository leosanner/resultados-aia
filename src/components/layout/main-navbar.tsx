import Link from "next/link";
import { RAG_ASSISTANT_URL } from "@/lib/links";

type MainNavbarPage = "contextualizacao" | "metodologia" | "autores" | null;

type MainNavbarProps = {
	activePage?: MainNavbarPage;
	showResultsBadge?: boolean;
	showEntrarButton?: boolean;
};

function NavLink({
	href,
	isActive,
	children,
}: {
	href: string;
	isActive: boolean;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className={`group relative pb-1 text-lg font-bold tracking-tight transition-colors ${
				isActive ? "text-[#00261a]" : "text-[#446554]/70 hover:text-[#00261a]"
			}`}
		>
			{children}
			<span
				className={`absolute bottom-0 left-0 h-[2px] bg-[#f6be28] transition-transform duration-300 ease-out ${
					isActive
						? "w-full scale-x-100"
						: "w-full origin-left scale-x-0 group-hover:scale-x-100"
				}`}
			/>
		</Link>
	);
}

export function MainNavbar({
	activePage = null,
	showResultsBadge = false,
	showEntrarButton = false,
}: MainNavbarProps) {
	return (
		<header className="sticky top-0 z-50 w-full bg-white/70 shadow-sm backdrop-blur-xl">
			<div className="mx-auto flex h-20 w-full max-w-screen-2xl items-center justify-between px-8">
				<Link
					href="/"
					className="text-2xl font-black tracking-tight text-[#00261a]"
				>
					Explorador AIA
				</Link>

				<nav
					aria-label="Navegação principal"
					className="hidden items-center gap-8 md:flex"
				>
					<NavLink
						href="/contextualizacao-geral"
						isActive={activePage === "contextualizacao"}
					>
						Contextualização
					</NavLink>
					<NavLink
						href="/metodologia"
						isActive={activePage === "metodologia"}
					>
						Metodologia
					</NavLink>
					<NavLink
						href="/autores"
						isActive={activePage === "autores"}
					>
						Autores
					</NavLink>
					<a
						href={RAG_ASSISTANT_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="group inline-flex items-center gap-1.5 rounded-full border border-[#cfe0d6] bg-[#e9f5ed] px-4 py-2 text-sm font-semibold text-[#00261a] transition-colors hover:border-[#0C7C3C] hover:bg-[#0C7C3C] hover:text-white"
					>
						<span className="material-symbols-outlined text-[18px] leading-none text-[#0a6b34] transition-colors group-hover:text-[#f6be28]">
							forum
						</span>
						Assistente IA
					</a>
					{showResultsBadge ? (
						<Link
							href="/termos"
							className="rounded-full bg-[#00261a] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b6756]"
						>
							Resultados
						</Link>
					) : null}
					{showEntrarButton ? (
						<button
							aria-label="Entrar na plataforma"
							className="hidden rounded-full bg-[#00261a] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b6756]"
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
