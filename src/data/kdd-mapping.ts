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

/** Explicação curta de cada etapa KDD, exibida no tooltip do quadro. */
export const kddStageDescriptions: Record<KddStage, string> = {
	selection:
		"Seleção dos dados relevantes entre as fontes disponíveis, definindo o recorte que será analisado.",
	preprocessing:
		"Limpeza e tratamento dos dados: remoção de ruído, correção de inconsistências e valores ausentes.",
	transformation:
		"Transformação e redução dos dados para formatos e atributos adequados à mineração.",
	data_mining:
		"Aplicação de algoritmos para descobrir padrões, relações e modelos nos dados preparados.",
	interpretation_evaluation:
		"Interpretação e avaliação dos padrões encontrados, filtrando o que é de fato útil e válido.",
	knowledge:
		"Conhecimento consolidado a partir dos padrões, pronto para apoiar a tomada de decisão.",
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
