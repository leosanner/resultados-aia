import {
	kddStageLabels,
	kddStageTechnologies,
	kddStages,
	type KddStage,
} from "@/data/kdd-mapping";
import { getTechArticlesSummary } from "@/lib/tech-summary";
import { tecTermToSlug } from "@/lib/tech-utils";
import { tecTerms, type TecTerm } from "@/model/article";

export type KddStageHeader = {
	stage: KddStage;
	label: string;
};

/** Trecho contíguo de etapas KDD ocupado por uma tecnologia. */
export type KddSegment = {
	/** Índice da etapa inicial (0 = primeira coluna). */
	startIndex: number;
	/** Número de etapas consecutivas cobertas. */
	span: number;
};

export type KddTechRow = {
	term: TecTerm;
	slug: string;
	count: number;
	/** Um ou mais segmentos; mais de um quando há intervalo entre as etapas. */
	segments: KddSegment[];
	/** Linha do grid (0 = primeira) após empacotar barras que não se sobrepõem. */
	rowIndex: number;
};

export const kddStageHeaders: KddStageHeader[] = kddStages.map((stage) => ({
	stage,
	label: kddStageLabels[stage],
}));

/** Agrupa índices de etapa ordenados em segmentos contíguos. */
function groupIntoSegments(stageIndexes: number[]): KddSegment[] {
	const segments: KddSegment[] = [];

	for (const index of stageIndexes) {
		const last = segments[segments.length - 1];
		if (last && index === last.startIndex + last.span) {
			last.span += 1;
		} else {
			segments.push({ startIndex: index, span: 1 });
		}
	}

	return segments;
}

/**
 * Monta as linhas do quadro Gantt de /sumarizacao: cada tecnologia (com artigos)
 * vira uma linha, e suas etapas consecutivas são unidas em uma única barra. Um
 * intervalo entre etapas quebra a tecnologia em segmentos separados.
 *
 * As linhas são ordenadas em cascata: pela etapa inicial e, em empate, pela
 * barra mais longa primeiro.
 */
export async function getKddTechRows(): Promise<KddTechRow[]> {
	const summary = await getTechArticlesSummary();

	const rows: KddTechRow[] = tecTerms
		.map((term) => {
			const stageIndexes = kddStages
				.map((stage, index) =>
					kddStageTechnologies[stage].includes(term) ? index : -1,
				)
				.filter((index) => index >= 0);

			return {
				term,
				slug: tecTermToSlug(term),
				count: summary[term]?.length ?? 0,
				segments: groupIntoSegments(stageIndexes),
				rowIndex: 0,
			};
		})
		.filter((row) => row.count > 0 && row.segments.length > 0);

	// Cascata: etapa inicial asc, depois barra mais longa, depois mais artigos.
	rows.sort((a, b) => {
		const aStart = a.segments[0].startIndex;
		const bStart = b.segments[0].startIndex;
		if (aStart !== bStart) return aStart - bStart;

		const aSpan = Math.max(...a.segments.map((segment) => segment.span));
		const bSpan = Math.max(...b.segments.map((segment) => segment.span));
		if (aSpan !== bSpan) return bSpan - aSpan;

		return b.count - a.count;
	});

	return packRows(rows);
}

/** Conjunto de colunas (etapas) cobertas por uma tecnologia, contando os gaps. */
function coveredColumns(row: KddTechRow): number[] {
	const columns: number[] = [];
	for (const segment of row.segments) {
		for (let i = 0; i < segment.span; i++) {
			columns.push(segment.startIndex + i);
		}
	}
	return columns;
}

/**
 * Empacota as barras verticalmente (first-fit): cada tecnologia ocupa a primeira
 * linha onde nenhuma de suas colunas conflita com outra já posicionada. Mantém
 * todos os segmentos de uma tecnologia na mesma linha, eliminando os vazios.
 */
function packRows(rows: KddTechRow[]): KddTechRow[] {
	const rowsColumns: Set<number>[] = [];

	for (const row of rows) {
		const columns = coveredColumns(row);

		let placed = rowsColumns.findIndex(
			(used) => !columns.some((column) => used.has(column)),
		);
		if (placed === -1) {
			placed = rowsColumns.length;
			rowsColumns.push(new Set());
		}

		for (const column of columns) rowsColumns[placed].add(column);
		row.rowIndex = placed;
	}

	return rows;
}
