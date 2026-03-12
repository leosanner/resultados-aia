import { cn } from "@/lib/utils";

type AnimatedButtonProps = {
	href: string;
	label: string;
	className?: string;
	accentClassName?: string;
	textClassName?: string;
	inverted?: boolean;
};

export function AnimatedButton({
	href,
	label,
	className,
	accentClassName,
	textClassName,
	inverted = false,
}: AnimatedButtonProps) {
	return (
		<div className={cn("inline-flex", className)}>
			<a
				href={href}
				className={cn(
					"group relative inline-flex min-h-10 items-center justify-start overflow-hidden rounded-md px-4 py-2 text-xs font-bold uppercase tracking-[0.6px] outline outline-1 transition-all duration-300",
					inverted
						? "bg-[#0C7C3C] outline-[#0C7C3C] hover:bg-[#0C7C3C]"
						: "bg-white outline-[#7bbf96] hover:bg-white",
				)}
			>
				<span
					className={cn(
						"absolute bottom-0 left-0 mb-9 ml-9 h-44 w-44 -translate-x-full translate-y-full rotate-[-40deg] rounded transition-all duration-500 ease-out group-hover:mb-28 group-hover:ml-0 group-hover:translate-x-0",
						inverted ? "bg-white" : "bg-[#0C7C3C]",
						accentClassName,
					)}
				/>
				<span
					className={cn(
						"relative w-full text-left transition-colors duration-300 ease-in-out",
						inverted
							? "text-white group-hover:text-[#0C7C3C]"
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
