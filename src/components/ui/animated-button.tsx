import { cn } from "@/lib/utils";

type AnimatedButtonProps = {
	href: string;
	label: string;
	className?: string;
	textClassName?: string;
	inverted?: boolean;
	tone?: "green" | "blue";
};

export function AnimatedButton({
	href,
	label,
	className,
	textClassName,
	inverted = false,
	tone = "green",
}: AnimatedButtonProps) {
	const fillClass = inverted
		? "bg-[#085E2E]"
		: tone === "blue"
			? "bg-[#1F6F8B]"
			: "bg-[#0C7C3C]";

	return (
		<div className={cn("inline-flex", className)}>
			<a
				href={href}
				className={cn(
					"group relative inline-flex min-h-10 items-center justify-start overflow-hidden rounded-md px-4 py-2 text-xs font-bold uppercase tracking-[0.6px] outline outline-1",
					inverted
						? "bg-[#0C7C3C] outline-[#0C7C3C]"
						: tone === "blue"
							? "bg-white outline-[#81a9ba]"
							: "bg-white outline-[#7bbf96]",
				)}
			>
				<span
					className={cn(
						"absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
						fillClass,
					)}
				/>
				<span
					className={cn(
						"relative w-full text-left transition-colors duration-300 ease-in-out",
						inverted
							? "text-white group-hover:text-white"
							: tone === "blue"
								? "text-[#1F6F8B] group-hover:text-white"
								: "text-[#085E2E] group-hover:text-white",
						textClassName,
					)}
				>
					{label}
				</span>
			</a>
		</div>
	);
}

export const Component = () => (
	<AnimatedButton href="#" label="Animation Button" />
);
