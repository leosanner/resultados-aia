"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useLandingCopy, useLocale } from "@/components/i18n/locale-provider";
import { setLocale } from "@/i18n/set-locale";
import type { Locale } from "@/i18n/locale";

const OPTIONS: { code: Locale; short: string }[] = [
	{ code: "pt", short: "PT" },
	{ code: "en", short: "EN" },
];

export function LanguageSwitcher() {
	const locale = useLocale();
	const copy = useLandingCopy();
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const select = (next: Locale) => {
		if (next === locale || pending) return;

		startTransition(async () => {
			await setLocale(next);
			router.refresh();
		});
	};

	return (
		<div
			role="group"
			aria-label={copy.switcher.label}
			className="inline-flex items-center rounded-full border border-[#cfe0d6] bg-[#f4f9f5] p-0.5"
		>
			{OPTIONS.map((option) => {
				const active = locale === option.code;
				const name = option.code === "pt" ? copy.switcher.pt : copy.switcher.en;

				return (
					<button
						key={option.code}
						type="button"
						aria-pressed={active}
						aria-label={name}
						disabled={pending}
						onClick={() => select(option.code)}
						className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition-colors disabled:cursor-wait ${
							active
								? "bg-[#00261a] text-white"
								: "text-[#446554] hover:text-[#00261a]"
						}`}
					>
						{option.short}
					</button>
				);
			})}
		</div>
	);
}
