export type PipelineStage = {
	id: number;
	title: string;
	shortTitle: string;
	subtitle: string;
	input: string | null;
	output: string;
	colorClass: string;
	bgClass: string;
	borderClass: string;
	what: string;
	why: string;
	criteria: string[];
};

export const PIPELINE_STAGES: PipelineStage[] = [
	{
		id: 1,
		title: "1. Busca bibliográfica",
		shortTitle: "Busca bibliográfica",
		subtitle: "Coleta inicial em bases acadêmicas",
		input: null,
		output: "16.657 registros",
		colorClass: "from-[#3b82f6] to-[#06b6d4]",
		bgClass: "bg-[#eff6ff]",
		borderClass: "border-[#93c5fd]",
		what: "Busca estruturada nas bases Scopus e OpenAlex com combinação de termos tecnológicos e ambientais.",
		why: "A combinação de bases aumenta cobertura e reduz viés de fonte única.",
		criteria: [
			"Termos tecnológicos: machine learning, deep learning, internet of things, artificial intelligence.",
			"Termos ambientais: environmental impact assessment, risk analysis, risk management.",
			"Estratégia booleana para cruzamento temático entre tecnologia e ambiente.",
		],
	},
	{
		id: 2,
		title: "2. Intersecção entre Scopus e OpenAlex",
		shortTitle: "Intersecção",
		subtitle: "Consolidação e remoção de duplicatas",
		input: "16.657 registros",
		output: "5.880 registros",
		colorClass: "from-[#8b5cf6] to-[#a855f7]",
		bgClass: "bg-[#f5f3ff]",
		borderClass: "border-[#c4b5fd]",
		what: "Identificação das publicações presentes simultaneamente nas duas bases.",
		why: "A intersecção fornece um conjunto mais consistente para as próximas etapas.",
		criteria: [
			"Matching por DOI e metadados principais.",
			"Conferência de consistência de título e ano.",
			"Deduplicação final para conjunto consolidado.",
		],
	},
	{
		id: 3,
		title: "3. Filtro de impacto (FWCI > 1)",
		shortTitle: "FWCI > 1",
		subtitle: "Seleção por relevância de citações",
		input: "5.880 registros",
		output: "3.880 registros",
		colorClass: "from-[#f59e0b] to-[#f97316]",
		bgClass: "bg-[#fffbeb]",
		borderClass: "border-[#fcd34d]",
		what: "Aplicação de corte por impacto de citação com FWCI maior que 1.",
		why: "FWCI > 1 indica desempenho de citação acima da média global do campo.",
		criteria: [
			"Critério objetivo: FWCI estritamente maior que 1.",
			"Normalização por área e janela temporal.",
			"Preservação de estudos com impacto científico superior.",
		],
	},
	{
		id: 4,
		title: "4. Classificador de relevância (AIA)",
		shortTitle: "Classificador ML",
		subtitle: "Triagem automática por machine learning",
		input: "3.880 registros",
		output: "605 registros",
		colorClass: "from-[#f43f5e] to-[#ec4899]",
		bgClass: "bg-[#fff1f2]",
		borderClass: "border-[#fda4af]",
		what: "Classificação automática para identificar aderência temática à Avaliação de Impacto Ambiental.",
		why: "Reduz esforço manual e aumenta consistência na seleção de relevância.",
		criteria: [
			"Classificação binária de pertinência ao domínio.",
			"Uso de limiar de decisão para priorizar precisão.",
			"Retenção de estudos com maior alinhamento semântico ao tema.",
		],
	},
	{
		id: 5,
		title: "5. Fluxo de agentes com três LLMs",
		shortTitle: "Fluxo de agentes",
		subtitle: "Validação temática orientada por consenso",
		input: "605 registros",
		output: "483 relacionados / 122 não relacionados",
		colorClass: "from-[#0ea5e9] to-[#14b8a6]",
		bgClass: "bg-[#ecfeff]",
		borderClass: "border-[#67e8f9]",
		what: "Os 605 artigos classificados foram submetidos a um fluxo de agentes que agregou a opinião de três LLMs para verificar aderência às áreas de Avaliação de Impacto Ambiental.",
		why: "A agregação de múltiplos modelos reduz vieses individuais e aumenta a robustez da decisão de relevância temática.",
		criteria: [
			"Avaliação independente por três LLMs para cada artigo.",
			"Agente agregador para consolidar consenso de pertinência temática.",
			"Separação em dois grupos: relacionados (483) e não relacionados (122).",
		],
	},
	{
		id: 6,
		title: "6. Filtragem final por domínio",
		shortTitle: "Filtragem final",
		subtitle: "Refinamento temático específico",
		input: "483 registros relacionados",
		output: "118 registros",
		colorClass: "from-[#10b981] to-[#22c55e]",
		bgClass: "bg-[#ecfdf5]",
		borderClass: "border-[#86efac]",
		what: "Filtragem final com termos específicos do domínio de AIA para compor o conjunto definitivo.",
		why: "Garante alta aderência ao escopo analítico da plataforma.",
		criteria: [
			"Conjunto de termos específicos de AIA e gestão de risco ambiental.",
			"Verificação de contexto para evitar menções superficiais.",
			"Validação do alinhamento com os objetivos da pesquisa.",
		],
	},
];
