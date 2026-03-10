import Link from "next/link";
import { HeroSection } from "@/components/metodologia/hero-section";
import { MethodologyOverview } from "@/components/metodologia/methodology-overview";
import { PipelineFlow } from "@/components/metodologia/pipeline-flow";
import { VisualDiagrams } from "@/components/metodologia/visual-diagrams";
import { StageDetails } from "@/components/metodologia/stage-details";
import { StatsCards } from "@/components/metodologia/stats-cards";
import { AgentRefinementSection } from "@/components/metodologia/agent-refinement-section";

export default function MetodologiaPage() {
	return (
		<div className="min-h-screen bg-white text-[#0f172a]">
			<header className="border-b border-[#bfdbfe] bg-white/80 px-6 py-5 backdrop-blur-sm md:px-10">
				<div className="mx-auto flex w-full max-w-[1160px] items-center justify-between">
					<div>
						<p className="text-xs font-bold uppercase tracking-[1px] text-[#2563eb]">
							Projeto AIA
						</p>
						<h1 className="text-2xl font-black tracking-[-0.6px] text-[#0f172a]">
							Metodologia
						</h1>
					</div>
					<Link
						className="inline-flex rounded-full border border-[#60a5fa] bg-[#eff6ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.6px] text-[#1d4ed8] hover:bg-[#dbeafe]"
						href="/"
					>
						Voltar para início
					</Link>
				</div>
			</header>

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
