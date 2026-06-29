import type { TecTerm } from "@/model/article";

/**
 * Etapas do fluxo KDD (Knowledge Discovery in Databases) usadas no quadro de
 * síntese em /sumarizacao. A ordem do array define a ordem das colunas.
 *
 * Importante: as etapas KDD são metadados curados desta iniciativa e NÃO têm
 * relação com as etapas de EIA (`eia_stages.json`). Apenas a contagem de
 * artigos de cada tecnologia é derivada dos dados do sistema.
 */
export const kddStages = [
	"selection",
	"preprocessing",
	"transformation",
	"data_mining",
	"interpretation_evaluation",
	"knowledge",
] as const;

export type KddStage = (typeof kddStages)[number];

export const kddStageLabels: Record<KddStage, string> = {
	selection: "Selection",
	preprocessing: "Preprocessing",
	transformation: "Transformation",
	data_mining: "Data Mining",
	interpretation_evaluation: "Interpretation / Evaluation",
	knowledge: "Knowledge",
};

/**
 * Mapeamento curado de cada etapa KDD para as tecnologias que nela se aplicam.
 * Transcrito do diagrama de referência. Uma tecnologia pode aparecer em várias
 * etapas (inclusive não-contíguas). Tecnologias sem artigos no recorte atual
 * são removidas em tempo de render (ver `lib/kdd-board.ts`).
 */
export const kddStageTechnologies: Record<KddStage, TecTerm[]> = {
	selection: ["Remote Sensing", "Internet of Things", "Geoprocessing", "Digital Technologies"],
	preprocessing: ["Data Science", "Geoprocessing", "Natural Language Processing", "Digital Technologies"],
	transformation: ["Data Science", "Natural Language Processing", "Geoprocessing", "Data Visualization"],
	data_mining: [
		"Machine Learning",
		"Deep Learning",
		"Artificial Intelligence",
		"Prediction Analytics",
		"Reinforcement Learning",
	],
	interpretation_evaluation: [
		"Data Visualization",
		"Artificial Intelligence",
		"Digital Twins",
		"Augmented Reality",
		"Geoprocessing",
	],
	knowledge: ["Digital Transformation", "Technological Innovation", "Digital Twins", "Digital Technologies"],
};
