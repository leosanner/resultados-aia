"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { stageArticlesCopy } from "@/i18n/pages/stage-articles";

type ErrorPageProps = {
	error: Error;
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	const copy = stageArticlesCopy[useLocale()];

	return (
		<div className="min-h-screen bg-[#f6f8f6] px-6 py-8 md:px-12">
			<div className="mx-auto w-full max-w-[992px] rounded-[12px] border border-[#e2e8f0] bg-white p-6">
				<h1 className="text-lg font-bold text-[#0f172a]">{copy.errorTitle}</h1>
				<p className="mt-2 text-sm text-[#64748b]">
					{error.message || copy.unexpectedError}
				</p>
				<button
					className="mt-4 rounded-[8px] bg-[#0f172a] px-4 py-2 text-sm font-bold text-white hover:bg-[#1e293b]"
					onClick={reset}
					type="button"
				>
					{copy.tryAgain}
				</button>
			</div>
		</div>
	);
}
