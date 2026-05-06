"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Props = {
	pageSizeOptions: readonly number[];
	selectedPageSize: number;
};

export function TermsPageSizeSelect({ pageSizeOptions, selectedPageSize }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const next = new URLSearchParams(searchParams?.toString() ?? "");
		next.set("pageSize", event.target.value);
		next.set("page", "1");
		startTransition(() => {
			router.push(`/termos?${next.toString()}`, { scroll: false });
		});
	}

	return (
		<label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.8px] text-[#64748b]">
			Artigos por página
			<select
				className="h-10 min-w-28 rounded-md border border-[#cfe0d6] bg-white px-2.5 text-sm font-semibold text-[#1f2937] outline-none focus:border-[#0C7C3C] disabled:opacity-70"
				disabled={isPending}
				onChange={handleChange}
				value={String(selectedPageSize)}
			>
				{pageSizeOptions.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</label>
	);
}
