import Link from "next/link";

export function MainFooter() {
	return (
		<footer className="border-t border-[#123629] bg-[#0b281f] px-6 py-12 sm:px-10 lg:px-20">
			<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 text-sm text-[#d4e3da] md:flex-row md:items-start md:justify-between">
				<nav aria-label="Mapa do site" className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/">
						Início
					</Link>
					<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/contextualizacao-geral">
						Contextualização Geral
					</Link>
					<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/metodologia">
						Metodologia
					</Link>
					<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/autores">
						Autores
					</Link>
					<Link className="text-white transition-colors hover:text-[#d4e3da]" href="/termos">
						Termos
					</Link>
				</nav>
				<p>© 2026 Projeto Base de Pesquisa AIA.</p>
			</div>
		</footer>
	);
}
