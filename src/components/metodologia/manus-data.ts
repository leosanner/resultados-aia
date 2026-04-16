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

export const MANUS_PHASES: ManusPhase[] = [
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
