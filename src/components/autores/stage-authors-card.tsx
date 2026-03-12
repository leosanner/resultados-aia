"use client";

import { useMemo, useState } from "react";

type AuthorByStage = {
	authorId: string;
	authorName: string;
	publications: number[];
};

type StageAuthorsCardProps = {
	stageKey: string;
	stageTitle: string;
	authors: AuthorByStage[];
};

const PAGE_SIZE = 12;

function formatTotal(count: number) {
	return new Intl.NumberFormat("pt-BR").format(count);
}

export function StageAuthorsCard({
	stageKey,
	stageTitle,
	authors,
}: StageAuthorsCardProps) {
	const [page, setPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(authors.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const currentAuthors = useMemo(
		() => authors.slice(startIndex, startIndex + PAGE_SIZE),
		[authors, startIndex],
	);

	return (
		<article className="rounded-2xl border border-[#dbe6df] bg-white p-5 shadow-[0px_10px_25px_-18px_rgba(17,17,17,0.25)]">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-xl font-black tracking-[-0.4px] text-[#0f172a]">
					{stageTitle}
				</h2>
				<span className="rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.6px] text-[#256f4f]">
					{formatTotal(authors.length)} autores
				</span>
			</div>

			<div className="mt-4 space-y-2">
				{currentAuthors.length > 0 ? (
					currentAuthors.map((author, index) => (
						<div
							className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-2"
							key={`${stageKey}-${author.authorId}`}
						>
							<p className="text-sm font-semibold text-[#0f172a]">
								{startIndex + index + 1}. {author.authorName}
							</p>
							<span className="text-xs font-bold uppercase tracking-[0.6px] text-[#64748b]">
								{formatTotal(author.publications.length)} publicações
							</span>
						</div>
					))
				) : (
					<p className="text-sm text-[#64748b]">
						Sem autores mapeados para esta área.
					</p>
				)}
			</div>

			{authors.length > PAGE_SIZE ? (
				<div className="mt-4 flex items-center justify-between border-t border-[#e2e8f0] pt-3">
					<p className="text-xs font-semibold uppercase tracking-[0.6px] text-[#64748b]">
						Página {currentPage} de {totalPages}
					</p>
					<div className="flex items-center gap-2">
						<button
							className="rounded-full border border-[#cbd5e1] px-3 py-1 text-xs font-bold uppercase tracking-[0.6px] text-[#475569] disabled:cursor-not-allowed disabled:opacity-40"
							disabled={currentPage === 1}
							onClick={() => setPage((prev) => Math.max(1, prev - 1))}
							type="button"
						>
							Anterior
						</button>
						<button
							className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-bold uppercase tracking-[0.6px] text-white disabled:cursor-not-allowed disabled:opacity-40"
							disabled={currentPage === totalPages}
							onClick={() =>
								setPage((prev) => Math.min(totalPages, prev + 1))
							}
							type="button"
						>
							Próxima
						</button>
					</div>
				</div>
			) : null}
		</article>
	);
}

