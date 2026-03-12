import { KeywordTag } from "@/components/articles/keyword-tag";
import { firstCharUpperCase } from "@/utils/format-txt";
import Link from "next/link";

export type ArticleMetadata = {
	label: string;
	value: string;
};

type ArticleCardProps = {
	abstract: string;
	href?: string;
	keywords: string[];
	metadata?: ArticleMetadata[];
	showAbstract?: boolean;
	titleHref?: string;
	title: string;
};

export function ArticleCard({
	abstract,
	href,
	keywords,
	metadata = [],
	showAbstract = true,
	titleHref,
	title,
}: ArticleCardProps) {
	const resolvedTitleHref = titleHref ?? href;
	const isExternalTitleHref =
		typeof resolvedTitleHref === "string" &&
		/^https?:\/\//i.test(resolvedTitleHref);

	return (
		<article className="rounded-[12px] border border-[#d7e4dc] bg-white p-[21px] shadow-[0px_14px_28px_-28px_rgba(17,24,39,0.9)] transition-colors hover:border-[#9bc9af]">
			<h2 className="text-[18px] font-bold leading-7 text-[#1f2937]">
				{resolvedTitleHref ? (
					isExternalTitleHref ? (
						<a
							className="transition-colors hover:text-[#0C7C3C] hover:underline"
							href={resolvedTitleHref}
							rel="noopener noreferrer"
							target="_blank"
						>
							{firstCharUpperCase(title)}
						</a>
					) : (
						<Link
							className="transition-colors hover:text-[#0C7C3C] hover:underline"
							href={resolvedTitleHref}
						>
							{firstCharUpperCase(title)}
						</Link>
					)
				) : (
					<>
						{firstCharUpperCase(title)}
					</>
				)}
			</h2>
			{showAbstract ? (
				<p className="mt-2 text-[14px] leading-6 text-[#556070]">{abstract}</p>
			) : null}
			{metadata.length > 0 ? (
				<div className="mt-2 space-y-1.5 border-l-2 border-[#d7e4dc] pl-3">
					{metadata.map((item) => {
						const isTechnology = item.label === "Tecnologia";
						const isEnvironmental = item.label === "Ambientais";
						const lineClassName = isTechnology
							? "text-[13px] leading-5 text-[#1F6F8B]"
							: isEnvironmental
								? "text-[13px] leading-5 text-[#0C7C3C]"
								: "text-[13px] leading-5 text-[#334155]";
						const labelClassName = isTechnology
							? "mr-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#1F6F8B]"
							: isEnvironmental
								? "mr-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#0C7C3C]"
								: "mr-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#64748b]";

						return (
							<p className={lineClassName} key={`${item.label}-${item.value}`}>
								<span className={labelClassName}>{item.label}</span>
								<span className="break-words">{item.value}</span>
							</p>
						);
					})}
				</div>
			) : null}
			<div className="mt-4 flex flex-wrap gap-2">
				{keywords.length > 0 ? (
					keywords.map((keyword, index) => (
						<KeywordTag
							index={index}
							key={`${keyword}-${index}`}
							keyword={keyword}
						/>
					))
				) : (
					<span className="inline-flex rounded-[4px] bg-[#eef4f0] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
						Sem palavras-chave
					</span>
				)}
			</div>
		</article>
	);
}
