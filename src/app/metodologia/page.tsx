import { HeroSection } from "@/components/metodologia/hero-section";
import { MethodologyOverview } from "@/components/metodologia/methodology-overview";
import { PipelineFlow } from "@/components/metodologia/pipeline-flow";
import { VisualDiagrams } from "@/components/metodologia/visual-diagrams";
import { StageDetails } from "@/components/metodologia/stage-details";
import { AgentRefinementSection } from "@/components/metodologia/agent-refinement-section";

export default function MetodologiaPage() {
	return (
		<div className="min-h-screen bg-[#e8efe9] text-[#1f2937]">
			<main>
				<HeroSection />
				<MethodologyOverview />
				<PipelineFlow />
				<VisualDiagrams />
				<StageDetails />
				<AgentRefinementSection />
			</main>
		</div>
	);
}
