"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export type TermsSortBy = "publicationDate" | "fwci";
export type TermsSortOrder = "asc" | "desc";

type Props = {
	selectedSortBy: TermsSortBy;
	selectedSortOrder: TermsSortOrder;
};

const SORT_BY_OPTIONS: Array<{ label: string; value: TermsSortBy }> = [
	{ label: "Data de publicação", value: "publicationDate" },
	{ label: "FWCI", value: "fwci" },
];

const SORT_ORDER_OPTIONS: Array<{ label: string; value: TermsSortOrder }> = [
	{ label: "Decrescente", value: "desc" },
	{ label: "Crescente", value: "asc" },
];

export function TermsSortSelect({
	selectedSortBy,
	selectedSortOrder,
}: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	function updateParam(key: "sortBy" | "sortOrder", value: string) {
		const next = new URLSearchParams(searchParams?.toString() ?? "");
		next.set(key, value);
		next.set("page", "1");
		startTransition(() => {
			router.push(`/termos?${next.toString()}`, { scroll: false });
		});
	}

	return (
		<div className="flex flex-wrap gap-3">
			<label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.8px] text-[#64748b]">
				Ordenar por
				<select
					className="h-10 min-w-44 rounded-md border border-[#cfe0d6] bg-white px-2.5 text-sm font-semibold text-[#1f2937] outline-none focus:border-[#0C7C3C] disabled:opacity-70"
					disabled={isPending}
					onChange={(event) => updateParam("sortBy", event.target.value)}
					value={selectedSortBy}
				>
					{SORT_BY_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</label>

			<label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.8px] text-[#64748b]">
				Ordem
				<select
					className="h-10 min-w-36 rounded-md border border-[#cfe0d6] bg-white px-2.5 text-sm font-semibold text-[#1f2937] outline-none focus:border-[#0C7C3C] disabled:opacity-70"
					disabled={isPending}
					onChange={(event) => updateParam("sortOrder", event.target.value)}
					value={selectedSortOrder}
				>
					{SORT_ORDER_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
