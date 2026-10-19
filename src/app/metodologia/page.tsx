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
import { getLocale } from "@/i18n/get-locale";
import { metodologiaCopy } from "@/i18n/pages/metodologia";

export default async function MetodologiaPage() {
	const copy = metodologiaCopy[await getLocale()];

	return (
		<div className="min-h-screen bg-[#f7faf5] text-[#191c1a]">
			<main>
				<HeroSection />
				<MacroDivider
					accent="green"
					label={copy.macro.filtering.label}
					numeral="I"
					subtitle={copy.macro.filtering.subtitle}
				/>
				<MethodologyOverview />
				<PipelineFlow />
				<VisualDiagrams />
				<StageDetails />
				<AgentRefinementSection />
				<TriagemManual />
				<MacroDivider
					accent="amber"
					label={copy.macro.synthesis.label}
					numeral="II"
					subtitle={copy.macro.synthesis.subtitle}
				/>
				<ManusOverview />
				<ManusTimeline />
				<SynthesisArtifact />
			</main>
		</div>
	);
}
