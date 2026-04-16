"use client";

import { motion } from "framer-motion";

const MATRIX_COLUMNS = [
	"Tecnologia",
	"Técnica aplicada",
	"Contexto de aplicação",
	"Autores / Ano",
	"Potencial AIA",
];

const SKELETON_WIDTHS = [
	[72, 86, 68, 58, 80],
	[64, 74, 82, 62, 70],
	[78, 66, 74, 70, 62],
];

export function SynthesisArtifact() {
	return (
		<section className="px-8 pt-8 pb-28">
			<motion.div
				className="mx-auto max-w-screen-2xl overflow-hidden rounded-xl border border-[#d0ddd5] bg-white shadow-[0_24px_40px_-4px_rgba(25,28,26,0.06)]"
				initial={{ opacity: 0, y: 24 }}
				transition={{ duration: 0.55 }}
				viewport={{ margin: "-60px", once: true }}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className="flex flex-col items-start justify-between gap-5 border-b border-[#d0ddd5] bg-gradient-to-r from-[#fff8e1]/70 via-[#fff8e1]/20 to-white px-6 py-6 md:flex-row md:items-center md:px-10">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#f6be28]/50 bg-[#fff8e1] text-[#b88706]">
							<span className="material-symbols-outlined" style={{ fontSize: 24 }}>
								description
							</span>
						</div>
						<div>
							<div className="mb-1 text-[10px] font-semibold uppercase tracking-[1.6px] text-[#b88706]">
								Artefato final
							</div>
							<h3 className="text-xl font-semibold text-[#00261a] md:text-2xl">
								Matriz de síntese consolidada
							</h3>
							<p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#556070]">
								Consolidação das tecnologias mais proeminentes identificadas nos
								31 artigos, categorizadas conforme a estrutura temática e
								organizadas em formato tabular de leitura direta.
							</p>
						</div>
					</div>
					<div className="shrink-0 rounded-md border border-[#d0ddd5] bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[#556070]">
						.docx
					</div>
				</div>

				<div className="overflow-x-auto px-4 py-6 md:px-8">
					<table className="w-full min-w-[720px] border-separate border-spacing-0">
						<thead>
							<tr>
								{MATRIX_COLUMNS.map((col, index) => (
									<th
										className="border-b border-[#d0ddd5] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#64748b]"
										key={col}
									>
										<span className="flex items-center gap-2">
											<span className="font-mono text-[#94a3b8]">
												{String(index + 1).padStart(2, "0")}
											</span>
											{col}
										</span>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{SKELETON_WIDTHS.map((row, rowIndex) => (
								<tr key={rowIndex}>
									{row.map((width, colIndex) => (
										<td
											className="border-b border-[#eef2ef] px-3 py-4"
											key={colIndex}
										>
											<div
												className="h-2.5 rounded-full bg-[#eef2ef]"
												style={{ width: `${width}%` }}
											/>
										</td>
									))}
								</tr>
							))}
							<tr>
								<td
									className="px-3 py-4 text-center text-xs italic text-[#94a3b8]"
									colSpan={MATRIX_COLUMNS.length}
								>
									⋯ demais linhas consolidadas por categoria temática
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="border-t border-[#d0ddd5] bg-[#f7faf5] px-6 py-4 text-xs text-[#556070] md:px-10">
					Consolidado em documento Microsoft Word, organizado por categoria
					temática, apresentando de forma clara e ordenada a tecnologia, a
					técnica aplicada e o contexto de aplicação.
				</div>
			</motion.div>
		</section>
	);
}
