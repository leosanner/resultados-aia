"use client";

import { MainNavbar } from "@/components/layout/main-navbar";
import { usePathname } from "next/navigation";

export function DefaultHeader() {
	const pathname = usePathname();

	const activePage = pathname.startsWith("/contextualizacao-geral")
		? "contextualizacao"
		: pathname.startsWith("/metodologia")
			? "metodologia"
			: pathname.startsWith("/autores")
				? "autores"
				: null;

	const showResultsBadge = pathname.startsWith("/termos");

	return (
		<MainNavbar
			activePage={activePage}
			showEntrarButton
			showResultsBadge={showResultsBadge}
		/>
	);
}
