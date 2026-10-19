"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLandingCopy } from "@/components/i18n/locale-provider";
import { RAG_ASSISTANT_URL } from "@/lib/links";

type MainNavbarPage =
	| "contextualizacao"
	| "metodologia"
	| "autores"
	| "sumarizacao"
	| null;

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
	const copy = useLandingCopy();

	return (
		<header className="sticky top-0 z-50 w-full bg-white/70 shadow-sm backdrop-blur-xl">
			<div className="mx-auto flex h-20 w-full max-w-screen-2xl items-center justify-between gap-4 px-8">
				<Link
					href="/"
					className="text-2xl font-black tracking-tight text-[#00261a]"
				>
					{copy.nav.brand}
				</Link>

				<div className="flex items-center gap-6">
					<nav
						aria-label={copy.nav.aria}
						className="hidden items-center gap-8 md:flex"
					>
						<NavLink
							href="/contextualizacao-geral"
							isActive={activePage === "contextualizacao"}
						>
							{copy.nav.context}
						</NavLink>
						<NavLink
							href="/metodologia"
							isActive={activePage === "metodologia"}
						>
							{copy.nav.methodology}
						</NavLink>
						<NavLink
							href="/autores"
							isActive={activePage === "autores"}
						>
							{copy.nav.authors}
						</NavLink>
						<NavLink
							href="/sumarizacao"
							isActive={activePage === "sumarizacao"}
						>
							{copy.nav.summary}
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
							{copy.nav.assistant}
						</a>
						{showResultsBadge ? (
							<Link
								href="/termos"
								className="rounded-full bg-[#00261a] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b6756]"
							>
								{copy.nav.results}
							</Link>
						) : null}
						{showEntrarButton ? (
							<button
								aria-label={copy.nav.signInAria}
								className="hidden rounded-full bg-[#00261a] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b6756]"
								type="button"
							>
								{copy.nav.signIn}
							</button>
						) : null}
					</nav>
					<LanguageSwitcher />
				</div>
			</div>
		</header>
	);
}
