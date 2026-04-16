import { AgentRefinementSection } from "@/components/metodologia/agent-refinement-section";
import { HeroSection } from "@/components/metodologia/hero-section";
import { MacroDivider } from "@/components/metodologia/macro-divider";
import { ManusOverview } from "@/components/metodologia/manus-overview";
import { ManusTimeline } from "@/components/metodologia/manus-timeline";
import { MethodologyOverview } from "@/components/metodologia/methodology-overview";
import { PipelineFlow } from "@/components/metodologia/pipeline-flow";
import { StageDetails } from "@/components/metodologia/stage-details";
import { SynthesisArtifact } from "@/components/metodologia/synthesis-artifact";
import { TriagemManual } from "@/components/metodologia/triagem-manual";
import { VisualDiagrams } from "@/components/metodologia/visual-diagrams";

export default function MetodologiaPage() {
	return (
		<div className="min-h-screen bg-[#f7faf5] text-[#191c1a]">
			<main>
				<HeroSection />
				<MacroDivider
					accent="green"
					label="Filtragem Científica"
					numeral="I"
					subtitle="De 16.657 registros a 118 artigos altamente relevantes, por meio de intersecção de bases, impacto de citação, aprendizado de máquina e consenso entre LLMs."
				/>
				<MethodologyOverview />
				<PipelineFlow />
				<VisualDiagrams />
				<StageDetails />
				<AgentRefinementSection />
				<TriagemManual />
				<MacroDivider
					accent="amber"
					label="Síntese Assistida por IA"
					numeral="II"
					subtitle="Extração estruturada com a plataforma Manus, guiada por uma cadeia de cinco ações deliberadas e parametrizadas."
				/>
				<ManusOverview />
				<ManusTimeline />
				<SynthesisArtifact />
			</main>
		</div>
	);
}
