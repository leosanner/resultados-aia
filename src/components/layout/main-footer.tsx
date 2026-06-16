import Image from "next/image";
import Link from "next/link";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link
			href={href}
			className="group relative cursor-pointer pb-1 font-medium tracking-tight text-[#d4e3da] transition-colors hover:text-white"
		>
			{children}
			<span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#f6be28] transition-transform duration-300 ease-out group-hover:scale-x-100" />
		</Link>
	);
}

export function MainFooter() {
	return (
		<footer className="border-t border-[#123629] bg-[#0b281f] px-6 py-12 sm:px-10 lg:px-20">
			<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 text-sm text-[#d4e3da]">
				<div className="grid gap-8 sm:grid-cols-2 sm:items-center">
					<nav
						aria-label="Mapa do site"
						className="flex flex-wrap items-center gap-x-6 gap-y-2"
					>
						<FooterLink href="/">Início</FooterLink>
						<FooterLink href="/contextualizacao-geral">Contextualização Geral</FooterLink>
						<FooterLink href="/metodologia">Metodologia</FooterLink>
						<FooterLink href="/autores">Autores</FooterLink>
						<FooterLink href="/termos">Termos</FooterLink>
					</nav>
					<div className="flex flex-col gap-3 sm:items-end">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88a596]">
							Projeto apoiado por
						</span>
						<span className="inline-flex items-center rounded-lg bg-white px-5 py-3 shadow-sm">
							<Image
								src="/petrobras-logo.png"
								alt="Petrobras"
								width={933}
								height={277}
								priority={false}
								className="h-10 w-auto"
							/>
						</span>
					</div>
				</div>
				<div className="border-t border-[#123629] pt-6 text-[#9cb3a8]">
					<p>© 2026 Projeto Base de Pesquisa AIA.</p>
				</div>
			</div>
		</footer>
	);
}
