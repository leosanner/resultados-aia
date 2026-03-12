import { MainNavbar } from "@/components/layout/main-navbar";
import { HeroSection } from "@/components/metodologia/hero-section";
import { MethodologyOverview } from "@/components/metodologia/methodology-overview";
import { PipelineFlow } from "@/components/metodologia/pipeline-flow";
import { VisualDiagrams } from "@/components/metodologia/visual-diagrams";
import { StageDetails } from "@/components/metodologia/stage-details";
import { AgentRefinementSection } from "@/components/metodologia/agent-refinement-section";

export default function MetodologiaPage() {
	return (
		<div className="min-h-screen bg-white text-[#0f172a]">
			<MainNavbar activePage="metodologia" />

			<main>
				<section className="mx-auto w-full max-w-[1160px] px-6 pb-4 pt-8 md:px-10">
					<p className="text-xs font-bold uppercase tracking-[1px] text-[#2563eb]">
						Projeto AIA
					</p>
					<h1 className="mt-1 text-2xl font-black tracking-[-0.6px] text-[#0f172a]">
						Metodologia
					</h1>
				</section>
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
