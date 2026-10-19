import type { Locale } from "@/i18n/locale";

export type MetodologiaCopy = {
	hero: {
		title: string;
		subtitle: string;
		filteringBadge: string;
		synthesisBadge: string;
	};
	macro: {
		kicker: string;
		kickerWithNumeral: (numeral: string) => string;
		filtering: { label: string; subtitle: string };
		synthesis: { label: string; subtitle: string };
	};
	overview: {
		title: string;
		lead: string;
		mid: string;
		tail: string;
	};
	pipeline: {
		title: string;
		subtitle: string;
		stage5Card: string;
		stage5CardMobile: string;
	};
	diagrams: {
		title: string;
		vennTitle: string;
		vennBody: string;
		openAlexOnly: string;
		intersection: string;
		scopusOnly: string;
		flowTitle: string;
		flowBody: string;
		searchExampleLabel: string;
	};
	venn: {
		total: (count: string) => string;
	};
	stages: {
		title: string;
		input: string;
		output: string;
		what: string;
		why: string;
		criteria: string;
	};
	agent: {
		title: string;
		body: string;
		cards: { label: string; description: string }[];
	};
	triagem: {
		finalSet: string;
		manual: string;
		selected: string;
	};
	manus: {
		kicker: string;
		title: string;
		p1Before: string;
		p1Middle: string;
		p1After: string;
		p2Before: string;
		p2Strong: string;
		p2Mid: string;
		p2Italic: string;
		p2After: string;
		metrics: string[];
		timelineTitle: string;
		timelineSubtitle: string;
		outputLabel: string;
	};
	synthesis: {
		kicker: string;
		title: string;
		body: string;
		columns: string[];
		moreRows: string;
		footer: string;
	};
	flowchart: {
		searchTitle: string;
		intersection: string;
		fwci: string;
		classification: string;
		agentsLine1: string;
		agentsLine2: string;
		related: string;
		notRelated: string;
		finalLine1: string;
		finalLine2: string;
	};
	stats: {
		title: string;
		cards: { label: string; value: string; description: string }[];
		finalTitle: string;
		finalBody: string;
		note: string;
	};
};

export const metodologiaCopy: Record<Locale, MetodologiaCopy> = {
	pt: {
		hero: {
			title: "Metodologia",
			subtitle:
				"Pipeline em duas macroetapas: filtragem científica de um corpus massivo para um conjunto refinado, seguida de síntese estruturada do conteúdo com agente de IA supervisionado.",
			filteringBadge: "I · Filtragem Científica",
			synthesisBadge: "II · Síntese Assistida por IA",
		},
		macro: {
			kicker: "Macroetapa",
			kickerWithNumeral: (numeral) => `Macroetapa ${numeral}`,
			filtering: {
				label: "Filtragem Científica",
				subtitle:
					"De 16.657 registros a 118 artigos altamente relevantes, por meio de intersecção de bases, impacto de citação, aprendizado de máquina e consenso entre LLMs.",
			},
			synthesis: {
				label: "Síntese Assistida por IA",
				subtitle:
					"Extração estruturada com a plataforma Manus, guiada por uma cadeia de cinco ações deliberadas e parametrizadas.",
			},
		},
		overview: {
			title: "Visão geral do processo",
			lead: "O processo metodológico combinou buscas estruturadas em duas bases acadêmicas (Scopus e OpenAlex) com termos de tecnologia e termos ambientais relacionados ao contexto aplicado. A partir de um conjunto inicial de",
			mid: "registros, aplicamos filtros sucessivos de intersecção, impacto de citação (FWCI), classificação por aprendizado de máquina, fluxo de agentes com consenso entre três LLMs e filtragem por domínio específico, resultando em",
			tail: "registros altamente relevantes.",
		},
		pipeline: {
			title: "Pipeline de filtragem",
			subtitle: "Processo de redução progressiva de 16.657 para 118 registros",
			stage5Card: "483/122",
			stage5CardMobile: "483 rel / 122 nao rel",
		},
		diagrams: {
			title: "Diagramas do processo",
			vennTitle: "Intersecção: Scopus vs OpenAlex",
			vennBody:
				"Diagrama de Venn mostrando a intersecção entre as publicações encontradas nas bases Scopus e OpenAlex. O overlap de 5.880 registros representa o conjunto consolidado para análise posterior.",
			openAlexOnly: "Apenas OpenAlex",
			intersection: "Intersecção",
			scopusOnly: "Apenas Scopus",
			flowTitle: "Fluxograma do pipeline",
			flowBody:
				"Representação visual completa do fluxo metodológico, desde a busca inicial, passando pelo fluxo de agentes com três LLMs e pela separação entre estudos relacionados e não relacionados, até a filtragem final por termos específicos de AIA.",
			searchExampleLabel: "String de busca (exemplo):",
		},
		venn: {
			total: (count) => `Total: ${count} publicações`,
		},
		stages: {
			title: "Detalhamento das etapas",
			input: "Entrada: ",
			output: "Saída: ",
			what: "O que foi feito",
			why: "Por que foi feito",
			criteria: "Critérios de filtragem",
		},
		agent: {
			title: "Etapa complementar de validação e refinamento",
			body: "Após a etapa de classificação, os 605 artigos resultantes foram submetidos a um fluxo de agentes composto pela avaliação de três LLMs, com o objetivo de verificar se os estudos apresentavam relação com áreas de Avaliação de Impacto Ambiental. Nessa etapa, 483 artigos foram considerados relacionados, enquanto 122 foram classificados como não relacionados. Posteriormente, apenas os artigos classificados como relacionados passaram por um refinamento adicional com base em termos ambientais previamente utilizados na string de busca, resultando em um conjunto final de 118 artigos.",
			cards: [
				{
					label: "Artigos após classificação",
					description: "Conjunto submetido ao fluxo de agentes",
				},
				{
					label: "Relacionados à AIA",
					description: "Consenso do agente agregador com três LLMs",
				},
				{
					label: "Não relacionados à AIA",
					description: "Excluídos após avaliação de pertinência temática",
				},
				{
					label: "Conjunto final",
					description: "Refinamento final com termos ambientais específicos",
				},
			],
		},
		triagem: {
			finalSet: "Conjunto final da Macroetapa I",
			manual: "Triagem manual",
			selected: "Selecionados para síntese",
		},
		manus: {
			kicker: "Plataforma Manus · MANUS, 2026",
			title: "Síntese assistida pela plataforma Manus",
			p1Before:
				"A segunda macroetapa caracterizou-se pela utilização da plataforma",
			p1Middle:
				", um agente de Inteligência Artificial autônomo, para a extração, processamento e sumarização dos dados contidos nos",
			p1After: "artigos selecionados.",
			p2Before: "É importante ressaltar que a adoção desta ferramenta",
			p2Strong: "não ocorreu de forma passiva nem não supervisionada",
			p2Mid:
				"— frequentemente caracterizada por comandos genéricos ou prompts não estruturados. Pelo contrário, a interação com a IA foi conduzida por meio de uma cadeia de ações",
			p2Italic: "deliberadas, estruturadas e parametrizadas",
			p2After: ", descritas nas cinco fases abaixo.",
			metrics: [
				"Artigos selecionados",
				"Categorias temáticas",
				"Fases no fluxo",
			],
			timelineTitle: "Cadeia de ações na plataforma Manus",
			timelineSubtitle:
				"Cinco fases sequenciais que estruturaram a extração, o enriquecimento e a consolidação dos dados dos 31 artigos.",
			outputLabel: "Output",
		},
		synthesis: {
			kicker: "Artefato final",
			title: "Matriz de síntese consolidada",
			body: "Consolidação das tecnologias mais proeminentes identificadas nos 31 artigos, categorizadas conforme a estrutura temática e organizadas em formato tabular de leitura direta.",
			columns: [
				"Tecnologia",
				"Técnica aplicada",
				"Contexto de aplicação",
				"Autores / Ano",
				"Potencial AIA",
			],
			moreRows: "⋯ demais linhas consolidadas por categoria temática",
			footer:
				"Consolidado em documento Microsoft Word, organizado por categoria temática, apresentando de forma clara e ordenada a tecnologia, a técnica aplicada e o contexto de aplicação.",
		},
		flowchart: {
			searchTitle: "String de busca (exemplo)",
			intersection: "Intersecção",
			fwci: "Filtro FWCI > 1",
			classification: "Classificação (605)",
			agentsLine1: "Fluxo de agentes",
			agentsLine2: "(3 LLMs)",
			related: "Relacionados à AIA (483)",
			notRelated: "Não relacionados à AIA (122)",
			finalLine1: "Filtragem adicional por termos",
			finalLine2: "específicos (118)",
		},
		stats: {
			title: "Indicadores do processo",
			cards: [
				{
					label: "Taxa de redução",
					value: "99,3%",
					description: "De 16.657 para 118 registros",
				},
				{
					label: "Precisão do processo",
					value: "Alta",
					description: "Múltiplas camadas de validação",
				},
				{
					label: "Qualidade garantida",
					value: "FWCI > 1",
					description: "Impacto acima da média mundial",
				},
			],
			finalTitle: "Conjunto final de dados",
			finalBody:
				"Registros altamente relevantes e validados para Avaliação de Impacto Ambiental",
			note: "Esta metodologia garante que apenas publicações de alto impacto científico e diretamente relacionadas ao domínio de Avaliação de Impacto Ambiental sejam incluídas na plataforma.",
		},
	},
	en: {
		hero: {
			title: "Methodology",
			subtitle:
				"A pipeline in two macro-stages: scientific filtering of a large corpus down to a refined set, followed by structured synthesis of the content with a supervised AI agent.",
			filteringBadge: "I · Scientific Filtering",
			synthesisBadge: "II · AI-Assisted Synthesis",
		},
		macro: {
			kicker: "Macro-stage",
			kickerWithNumeral: (numeral) => `Macro-stage ${numeral}`,
			filtering: {
				label: "Scientific Filtering",
				subtitle:
					"From 16,657 records to 118 highly relevant articles, through database intersection, citation impact, machine learning, and consensus among LLMs.",
			},
			synthesis: {
				label: "AI-Assisted Synthesis",
				subtitle:
					"Structured extraction with the Manus platform, guided by a chain of five deliberate, parameterized actions.",
			},
		},
		overview: {
			title: "Process overview",
			lead: "The methodological process combined structured searches in two academic databases (Scopus and OpenAlex) with technology terms and environmental terms related to the applied context. From an initial set of",
			mid: "records, we applied successive filters for intersection, citation impact (FWCI), machine-learning classification, an agent flow with consensus among three LLMs, and domain-specific filtering, resulting in",
			tail: "highly relevant records.",
		},
		pipeline: {
			title: "Filtering pipeline",
			subtitle: "Progressive reduction from 16,657 to 118 records",
			stage5Card: "483/122",
			stage5CardMobile: "483 rel / 122 not rel",
		},
		diagrams: {
			title: "Process diagrams",
			vennTitle: "Intersection: Scopus vs OpenAlex",
			vennBody:
				"Venn diagram showing the intersection between publications found in the Scopus and OpenAlex databases. The overlap of 5,880 records is the consolidated set for later analysis.",
			openAlexOnly: "OpenAlex only",
			intersection: "Intersection",
			scopusOnly: "Scopus only",
			flowTitle: "Pipeline flowchart",
			flowBody:
				"Complete visual representation of the methodological flow, from the initial search, through the agent flow with three LLMs and the separation of related and unrelated studies, to the final filtering by EIA-specific terms.",
			searchExampleLabel: "Search string (example):",
		},
		venn: {
			total: (count) => `Total: ${count} publications`,
		},
		stages: {
			title: "Stage details",
			input: "Input: ",
			output: "Output: ",
			what: "What was done",
			why: "Why it was done",
			criteria: "Filtering criteria",
		},
		agent: {
			title: "Complementary validation and refinement stage",
			body: "After the classification stage, the resulting 605 articles were submitted to an agent flow made up of assessments from three LLMs, in order to check whether the studies were related to Environmental Impact Assessment areas. At this stage, 483 articles were considered related, while 122 were classified as not related. Only the articles classified as related then went through an additional refinement based on environmental terms previously used in the search string, resulting in a final set of 118 articles.",
			cards: [
				{
					label: "Articles after classification",
					description: "Set submitted to the agent flow",
				},
				{
					label: "Related to EIA",
					description: "Consensus of the aggregator agent across three LLMs",
				},
				{
					label: "Not related to EIA",
					description: "Excluded after the thematic relevance assessment",
				},
				{
					label: "Final set",
					description: "Final refinement with specific environmental terms",
				},
			],
		},
		triagem: {
			finalSet: "Final set from macro-stage I",
			manual: "Manual screening",
			selected: "Selected for synthesis",
		},
		manus: {
			kicker: "Manus platform · MANUS, 2026",
			title: "Synthesis assisted by the Manus platform",
			p1Before: "The second macro-stage used the",
			p1Middle:
				" platform, an autonomous artificial intelligence agent, to extract, process, and summarize the data in the",
			p1After: "selected articles.",
			p2Before: "It is important to note that this tool",
			p2Strong: "was not adopted passively or without supervision",
			p2Mid:
				"— a pattern often characterized by generic commands or unstructured prompts. On the contrary, the interaction with the AI was conducted through a chain of",
			p2Italic: "deliberate, structured, and parameterized",
			p2After: " actions, described in the five phases below.",
			metrics: ["Selected articles", "Thematic categories", "Phases in the flow"],
			timelineTitle: "Chain of actions on the Manus platform",
			timelineSubtitle:
				"Five sequential phases that structured the extraction, enrichment, and consolidation of data from the 31 articles.",
			outputLabel: "Output",
		},
		synthesis: {
			kicker: "Final artifact",
			title: "Consolidated synthesis matrix",
			body: "Consolidation of the most prominent technologies identified in the 31 articles, categorized according to the thematic structure and organized in a tabular format for direct reading.",
			columns: [
				"Technology",
				"Applied technique",
				"Application context",
				"Authors / year",
				"EIA potential",
			],
			moreRows: "⋯ further rows consolidated by thematic category",
			footer:
				"Consolidated in a Microsoft Word document, organized by thematic category, presenting the technology, the applied technique, and the application context in a clear and ordered way.",
		},
		flowchart: {
			searchTitle: "Search string (example)",
			intersection: "Intersection",
			fwci: "FWCI > 1 filter",
			classification: "Classification (605)",
			agentsLine1: "Agent flow",
			agentsLine2: "(3 LLMs)",
			related: "Related to EIA (483)",
			notRelated: "Not related to EIA (122)",
			finalLine1: "Additional filtering by",
			finalLine2: "specific terms (118)",
		},
		stats: {
			title: "Process indicators",
			cards: [
				{
					label: "Reduction rate",
					value: "99.3%",
					description: "From 16,657 to 118 records",
				},
				{
					label: "Process precision",
					value: "High",
					description: "Multiple layers of validation",
				},
				{
					label: "Guaranteed quality",
					value: "FWCI > 1",
					description: "Impact above the global average",
				},
			],
			finalTitle: "Final dataset",
			finalBody:
				"Highly relevant records validated for Environmental Impact Assessment",
			note: "This methodology ensures that only publications with high scientific impact and directly related to the Environmental Impact Assessment domain are included in the platform.",
		},
	},
};
