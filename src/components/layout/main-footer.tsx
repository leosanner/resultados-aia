import Image from "next/image";
import Link from "next/link";

import { getLocale } from "@/i18n/get-locale";
import { landingCopy } from "@/i18n/landing";

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

export async function MainFooter() {
	const copy = landingCopy[await getLocale()];

	return (
		<footer className="border-t border-[#123629] bg-[#0b281f] px-6 py-12 sm:px-10 lg:px-20">
			<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 text-sm text-[#d4e3da]">
				<div className="grid gap-8 sm:grid-cols-2 sm:items-center">
					<nav
						aria-label={copy.footer.aria}
						className="flex flex-wrap items-center gap-x-6 gap-y-2"
					>
						<FooterLink href="/">{copy.footer.home}</FooterLink>
						<FooterLink href="/contextualizacao-geral">{copy.footer.context}</FooterLink>
						<FooterLink href="/metodologia">{copy.footer.methodology}</FooterLink>
						<FooterLink href="/autores">{copy.footer.authors}</FooterLink>
						<FooterLink href="/termos">{copy.footer.terms}</FooterLink>
					</nav>
					<div className="flex flex-col gap-3 sm:items-end">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88a596]">
							{copy.footer.supportedBy}
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
					<p>{copy.footer.copyright}</p>
				</div>
			</div>
		</footer>
	);
}
