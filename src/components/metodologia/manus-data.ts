import type { Locale } from "@/i18n/locale";

export type ManusPhase = {
	id: 1 | 2 | 3 | 4 | 5;
	code: "CFG" | "PRM" | "CTX" | "EXE" | "ART";
	title: string;
	subtitle: string;
	summary: string;
	parametersLabel: string;
	parameters: string[];
	extras?: {
		heading: string;
		items: string[];
	};
	output?: string;
};

const MANUS_PHASES_PT: ManusPhase[] = [
	{
		id: 1,
		code: "CFG",
		title: "Configuração do ambiente de projeto",
		subtitle: "Workspace dedicado no Manus",
		summary:
			"Criação de um ambiente de projeto dedicado dentro da plataforma Manus, servindo como repositório centralizado para os documentos PDF previamente categorizados e para as diretrizes operacionais que guiam todo o fluxo subsequente.",
		parametersLabel: "Ativos configurados",
		parameters: [
			"workspace dedicado",
			"PDFs categorizados",
			"diretrizes operacionais",
		],
	},
	{
		id: 2,
		code: "PRM",
		title: "Definição de system prompts",
		subtitle: "Regras estritas de formatação e conduta impostas à IA",
		summary:
			"A interação com a IA foi conduzida por meio de uma cadeia de ações deliberadas, estruturadas e parametrizadas — não por prompts genéricos. Foram estabelecidas regras estritas que delimitaram o comportamento do agente ao longo de toda a extração.",
		parametersLabel: "Regras de nível de projeto",
		parameters: [
			"Aderência ABNT (NBR 6023:2018)",
			"Formato de relatório técnico",
			"Identificar aplicações para a AIA",
			"Questionar usuário em decisões importantes",
		],
	},
	{
		id: 3,
		code: "CTX",
		title: "Contextualização e planejamento",
		subtitle: "Acesso autônomo ao repositório de PDFs",
		summary:
			"Antes do processamento, o contexto global do projeto e os objetivos específicos da tarefa foram detalhadamente explicados à IA. Concedeu-se acesso ao Google Drive com os 31 artigos em PDF, organizados em cinco categorias temáticas previamente definidas. A partir desse acervo, o Manus gerou um plano de ação em fases (leitura/extração → enriquecimento → estruturação de tabelas), validado antes da execução.",
		parametersLabel: "Inputs contextuais",
		parameters: [
			"Google Drive (31 PDFs)",
			"Plano validado antes da execução",
			"Processamento paralelo e autônomo",
		],
		extras: {
			heading: "Cinco categorias temáticas",
			items: [
				"Inteligência Artificial",
				"Geotecnologias",
				"Sensoriamento Remoto",
				"Abordagens Institucionais",
				"Sistemas de Suporte à Decisão",
			],
		},
	},
	{
		id: 4,
		code: "EXE",
		title: "Execução iterativa e refinamento",
		subtitle: "Extração padronizada por grande área",
		summary:
			"A extração de dados ocorreu de forma iterativa. Para cada grande área, a IA analisou os resumos técnicos e extraiu um conjunto padronizado de campos estruturados, com refinamento contínuo dos resultados intermediários.",
		parametersLabel: "Dinâmica de execução",
		parameters: ["Iteração por grande área", "Refinamento contínuo"],
		extras: {
			heading: "Campos extraídos por artigo",
			items: [
				"Tecnologia principal",
				"Técnica aplicada",
				"Contexto de aplicação",
				"Autores / ano",
				"Potencial para a AIA",
			],
		},
	},
	{
		id: 5,
		code: "ART",
		title: "Geração de artefatos de síntese",
		subtitle: "Consolidação em matriz estruturada",
		summary:
			"Como produto final da cadeia de ações, a IA foi orientada a consolidar os dados extraídos em um documento estruturado em formato Microsoft Word, contendo uma matriz de síntese com as tecnologias mais proeminentes identificadas nos 31 artigos.",
		parametersLabel: "Parâmetros de consolidação",
		parameters: [
			"Agrupamento por categoria temática",
			"Visualização tabular",
		],
		output: "Matriz de síntese (.docx)",
	},
];

const MANUS_PHASES_EN: ManusPhase[] = [
	{
		id: 1,
		code: "CFG",
		title: "Project environment setup",
		subtitle: "Dedicated workspace in Manus",
		summary:
			"A dedicated project environment was created inside the Manus platform, serving as a centralized repository for the previously categorized PDF documents and for the operational guidelines that steer the entire subsequent flow.",
		parametersLabel: "Configured assets",
		parameters: [
			"dedicated workspace",
			"categorized PDFs",
			"operational guidelines",
		],
	},
	{
		id: 2,
		code: "PRM",
		title: "System prompt definition",
		subtitle: "Strict formatting and conduct rules imposed on the AI",
		summary:
			"Interaction with the AI was conducted through a chain of deliberate, structured, and parameterized actions — not generic prompts. Strict rules were established that bounded the agent's behavior throughout the extraction.",
		parametersLabel: "Project-level rules",
		parameters: [
			"ABNT adherence (NBR 6023:2018)",
			"Technical report format",
			"Identify applications for EIA",
			"Ask the user about important decisions",
		],
	},
	{
		id: 3,
		code: "CTX",
		title: "Contextualization and planning",
		subtitle: "Autonomous access to the PDF repository",
		summary:
			"Before processing, the project's global context and the specific objectives of the task were explained to the AI in detail. Access was granted to Google Drive, which held the 31 articles in PDF, organized into five previously defined thematic categories. From that collection, Manus generated a phased action plan (reading/extraction → enrichment → table structuring), validated before execution.",
		parametersLabel: "Contextual inputs",
		parameters: [
			"Google Drive (31 PDFs)",
			"Plan validated before execution",
			"Parallel, autonomous processing",
		],
		extras: {
			heading: "Five thematic categories",
			items: [
				"Artificial Intelligence",
				"Geotechnologies",
				"Remote Sensing",
				"Institutional Approaches",
				"Decision Support Systems",
			],
		},
	},
	{
		id: 4,
		code: "EXE",
		title: "Iterative execution and refinement",
		subtitle: "Standardized extraction by major area",
		summary:
			"Data extraction was iterative. For each major area, the AI analyzed the technical summaries and extracted a standardized set of structured fields, with continuous refinement of the intermediate results.",
		parametersLabel: "Execution dynamics",
		parameters: ["Iteration by major area", "Continuous refinement"],
		extras: {
			heading: "Fields extracted per article",
			items: [
				"Main technology",
				"Applied technique",
				"Application context",
				"Authors / year",
				"Potential for EIA",
			],
		},
	},
	{
		id: 5,
		code: "ART",
		title: "Synthesis artifact generation",
		subtitle: "Consolidation into a structured matrix",
		summary:
			"As the final product of the chain of actions, the AI was instructed to consolidate the extracted data into a structured Microsoft Word document containing a synthesis matrix with the most prominent technologies identified in the 31 articles.",
		parametersLabel: "Consolidation parameters",
		parameters: ["Grouping by thematic category", "Tabular view"],
		output: "Synthesis matrix (.docx)",
	},
];

export const manusPhasesByLocale: Record<Locale, ManusPhase[]> = {
	pt: MANUS_PHASES_PT,
	en: MANUS_PHASES_EN,
};
