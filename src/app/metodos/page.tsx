import Link from "next/link";
import { VennDiagram } from "@/components/charts/venn-diagram";
import { getLocale } from "@/i18n/get-locale";
import { metodosCopy } from "@/i18n/pages/metodos";

const FUNNEL_STEPS = [
	{ id: "search", value: 16000, approximate: true, width: "100%", tone: "bg-[#2563eb]" },
	{ id: "intersection", value: 5580, approximate: false, width: "65%", tone: "bg-[#0891b2]" },
	{ id: "fwci", value: 3880, approximate: false, width: "46%", tone: "bg-[#0d9488]" },
	{ id: "classifier", value: 605, approximate: false, width: "22%", tone: "bg-[#16a34a]" },
	{ id: "final", value: 122, approximate: false, width: "12%", tone: "bg-[#ea580c]" },
];

export default async function MethodsPage() {
	const locale = await getLocale();
	const copy = metodosCopy[locale];

	return (
		<div className="min-h-screen bg-[linear-gradient(135deg,_#ecfeff_0%,_#f0fdf4_35%,_#eff6ff_100%)] text-[#0f172a]">
			<header className="border-b border-[#bfdbfe] bg-white/80 px-6 py-5 backdrop-blur-sm md:px-10">
				<div className="mx-auto flex w-full max-w-[1160px] items-center justify-between">
					<div>
						<p className="text-xs font-bold uppercase tracking-[1px] text-[#2563eb]">
							{copy.header.kicker}
						</p>
						<h1 className="text-2xl font-black tracking-[-0.6px] text-[#0f172a]">
							{copy.header.title}
						</h1>
					</div>
					<Link
						className="inline-flex rounded-full border border-[#60a5fa] bg-[#eff6ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.6px] text-[#1d4ed8] hover:bg-[#dbeafe]"
						href="/"
					>
						{copy.header.backHome}
					</Link>
				</div>
			</header>

			<main className="mx-auto w-full max-w-[1160px] space-y-6 px-6 py-8 md:px-10">
				<section className="rounded-2xl border border-[#bfdbfe] bg-white p-6 shadow-[0px_10px_24px_-18px_rgba(37,99,235,0.5)]">
					<h2 className="text-xl font-black text-[#0f172a]">{copy.objective.title}</h2>
					<p className="mt-2 text-sm leading-7 text-[#334155]">{copy.objective.body}</p>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-2xl border border-[#bae6fd] bg-[#ecfeff] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#0e7490]">
							{copy.sources.title}
						</h3>
						<ul className="mt-3 space-y-2 text-sm font-semibold text-[#0f172a]">
							<li className="rounded-lg bg-white px-4 py-3">Scopus</li>
							<li className="rounded-lg bg-white px-4 py-3">OpenAlex</li>
						</ul>
					</article>

					<article className="rounded-2xl border border-[#86efac] bg-[#dcfce7] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#166534]">
							{copy.strategy.title}
						</h3>
						<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="rounded-lg border border-[#bbf7d0] bg-white p-3">
								<p className="text-xs font-bold uppercase tracking-[0.8px] text-[#16a34a]">
									{copy.strategy.technologyLabel}
								</p>
								<p className="mt-1 text-sm text-[#334155]">
									{copy.strategy.technologyQuery}
								</p>
							</div>
							<div className="rounded-lg border border-[#bbf7d0] bg-white p-3">
								<p className="text-xs font-bold uppercase tracking-[0.8px] text-[#16a34a]">
									{copy.strategy.environmentalLabel}
								</p>
								<p className="mt-1 text-sm text-[#334155]">
									{copy.strategy.environmentalQuery}
								</p>
							</div>
						</div>
					</article>
				</section>

				<section className="rounded-2xl border border-[#cbd5e1] bg-white p-6">
					<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
						{copy.overlap.title}
					</h3>
					<p className="mt-2 text-sm leading-7 text-[#475569]">{copy.overlap.body}</p>
					<div className="mt-5">
						<VennDiagram
							ariaLabel={copy.venn.aria}
							intersection={5880}
							leftColor="#0ea5e9"
							leftLabel="OpenAlex"
							leftOnly={6393}
							locale={locale}
							rightColor="#16a34a"
							rightLabel="Scopus"
							rightOnly={4384}
							total={16657}
							totalLabel={copy.venn.total}
						/>
					</div>
				</section>

				<section className="rounded-2xl border border-[#cbd5e1] bg-white p-6">
					<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
						{copy.funnel.title}
					</h3>
					<div className="mt-5 space-y-4">
						{FUNNEL_STEPS.map((step, index) => (
							<div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3" key={step.id}>
								<div className="mb-2 flex items-center justify-between gap-3">
									<p className="text-sm font-semibold text-[#0f172a]">
										{copy.funnel.steps[index]}
									</p>
									<span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#0f172a]">
										{copy.funnel.value(step.value, step.approximate)}
									</span>
								</div>
								<div className="h-3 w-full rounded-full bg-[#e2e8f0]">
									<div
										className={`h-3 rounded-full ${step.tone}`}
										style={{ width: step.width }}
									/>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#c2410c]">
							{copy.specialRule.title}
						</h3>
						<p className="mt-3 text-sm leading-7 text-[#7c2d12]">
							{copy.specialRule.before}
							<strong>{copy.specialRule.term}</strong>
							{copy.specialRule.after}
						</p>
					</article>

					<article className="rounded-2xl border border-[#93c5fd] bg-[#dbeafe] p-6">
						<h3 className="text-sm font-bold uppercase tracking-[1px] text-[#1d4ed8]">
							{copy.finalResult.title}
						</h3>
						<p className="mt-3 text-sm leading-7 text-[#1e3a8a]">
							{copy.finalResult.before}
							<strong>{copy.finalResult.highlight(122)}</strong>
							{copy.finalResult.after}
						</p>
					</article>
				</section>
			</main>
		</div>
	);
}
