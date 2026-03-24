import Link from "next/link";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link
			href={href}
			className="group relative cursor-pointer pb-1 text-white transition-colors hover:text-[#d4e3da]"
		>
			{children}
			<span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#f6be28] transition-transform duration-300 ease-out group-hover:scale-x-100" />
		</Link>
	);
}

export function MainFooter() {
	return (
		<footer className="border-t border-[#123629] bg-[#0b281f] px-6 py-12 sm:px-10 lg:px-20">
			<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 text-sm text-[#d4e3da] md:flex-row md:items-start md:justify-between">
				<nav aria-label="Mapa do site" className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<FooterLink href="/">Início</FooterLink>
					<FooterLink href="/contextualizacao-geral">Contextualização Geral</FooterLink>
					<FooterLink href="/metodologia">Metodologia</FooterLink>
					<FooterLink href="/autores">Autores</FooterLink>
					<FooterLink href="/termos">Termos</FooterLink>
				</nav>
				<p>© 2026 Projeto Base de Pesquisa AIA.</p>
			</div>
		</footer>
	);
}
