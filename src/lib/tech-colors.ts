import type { TecTerm } from "@/model/article";

/**
 * Identidade de cor por tecnologia, usada no quadro KDD (/sumarizacao).
 *
 * Como uma tecnologia se repete em várias colunas, a cor é um código que permite
 * rastreá-la ao longo do fluxo. O matiz codifica a família (sensoriamento =
 * verde/teal · IA/ML = azul→violeta · dados/linguagem = âmbar/laranja ·
 * emergentes = magenta/ameixa/rosa) e o matiz exato identifica o termo.
 *
 * - `base`: cor cheia, para a borda e o ponto.
 * - `text`: tom escuro do mesmo matiz, para rótulo e contagem (contraste AA sobre `tint`).
 * - `tint`: fundo muito claro do matiz.
 */
export type TechColor = {
	base: string;
	text: string;
	tint: string;
};

const NEUTRAL: TechColor = {
	base: "#6b7a72",
	text: "#3c463f",
	tint: "#eef2ef",
};

export const techColors: Record<TecTerm, TechColor> = {
	// Sensoriamento & espacial — verde/teal
	"Remote Sensing": { base: "#0F8A78", text: "#0A5C50", tint: "#E2F1EE" },
	Geoprocessing: { base: "#4F8A33", text: "#37601F", tint: "#EBF3E3" },
	"Internet of Things": { base: "#1597AE", text: "#0E6276", tint: "#E2F0F4" },
	// Dados & linguagem — âmbar/laranja
	"Data Science": { base: "#C08109", text: "#875B05", tint: "#F8EFD6" },
	"Natural Language Processing": { base: "#CC5A26", text: "#963D17", tint: "#FAE8DE" },
	"Data Visualization": { base: "#B19011", text: "#7A630B", tint: "#F7F0D5" },
	// IA / ML — azul → violeta
	"Machine Learning": { base: "#2C66C8", text: "#214B93", tint: "#E6ECFA" },
	"Reinforcement Learning": { base: "#1389C4", text: "#0D5E86", tint: "#E1EFF9" },
	"Artificial Intelligence": { base: "#5048D6", text: "#3932A0", tint: "#E9E8FA" },
	"Deep Learning": { base: "#8038D9", text: "#5C289F", tint: "#F0E7FB" },
	"Prediction Analytics": { base: "#6D55D0", text: "#4C3A9C", tint: "#ECE9FA" },
	// Emergentes & resultado — magenta/ameixa/rosa
	"Digital Twins": { base: "#C02D80", text: "#8C1E5D", tint: "#FAE2EE" },
	"Digital Technologies": { base: "#8A4AAE", text: "#653780", tint: "#F1E8F6" },
	"Technological Innovation": { base: "#C0354B", text: "#902437", tint: "#FAE3E6" },
	"Digital Transformation": { base: "#A6358C", text: "#7B2767", tint: "#F6E2F0" },
	"Augmented Reality": { base: "#D14F68", text: "#9D3A4E", tint: "#FBE6EA" },
};

export function getTechColor(term: TecTerm): TechColor {
	return techColors[term] ?? NEUTRAL;
}
