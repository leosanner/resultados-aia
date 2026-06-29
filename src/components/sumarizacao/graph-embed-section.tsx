"use client";

import { useState } from "react";
import { GRAFO_GRAPH_URL } from "@/lib/links";

export function GraphEmbedSection() {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<section
			aria-label="Grafo interativo de tecnologias e termos"
			className="relative overflow-hidden rounded-3xl border border-[#d0ddd5] bg-gradient-to-br from-white via-white to-[#f0f7f2] p-6 shadow-[0_20px_50px_-16px_rgba(6,71,34,0.1)] sm:p-10"
		>
			<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
				<div className="max-w-lg">
					<p className="text-xs font-bold uppercase tracking-[1.5px] text-[#446554]">
						Visualização interativa
					</p>
					<h2 className="mt-2 text-3xl font-extrabold tracking-[-0.5px] text-[#00261a]">
						Grafo de Tecnologias e Termos
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-[#556070]">
						Explore as conexões entre tecnologias e termos diretamente no grafo
						interativo embutido abaixo.
					</p>
				</div>
				<a
					href={GRAFO_GRAPH_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="group inline-flex items-center gap-1.5 rounded-full border border-[#cfe0d6] bg-[#e9f5ed] px-4 py-2 text-sm font-semibold text-[#00261a] transition-colors hover:border-[#0C7C3C] hover:bg-[#0C7C3C] hover:text-white"
				>
					Abrir em nova aba
					<span
						aria-hidden
						className="material-symbols-outlined text-[18px] leading-none text-[#0a6b34] transition-colors group-hover:text-[#f6be28]"
					>
						arrow_outward
					</span>
				</a>
			</div>

			<div className="relative h-[80vh] min-h-[480px] overflow-hidden rounded-2xl border border-[#d0ddd5] bg-white">
				{isLoading ? (
					<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
						<span
							aria-hidden
							className="h-8 w-8 animate-spin rounded-full border-2 border-[#cfe0d6] border-t-[#0C7C3C]"
						/>
						<p className="text-sm font-medium text-[#446554]">
							Carregando o grafo…
						</p>
					</div>
				) : null}
				<iframe
					src={GRAFO_GRAPH_URL}
					title="Grafo interativo de tecnologias e termos"
					className="h-full w-full border-0"
					loading="lazy"
					onLoad={() => setIsLoading(false)}
				/>
			</div>

			<p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#80938b]">
				<span
					aria-hidden
					className="material-symbols-outlined mt-px text-[15px] leading-none"
				>
					info
				</span>
				<span>
					O grafo é carregado de um serviço externo. Caso não apareça, use o botão
					“Abrir em nova aba”.
				</span>
			</p>
		</section>
	);
}
