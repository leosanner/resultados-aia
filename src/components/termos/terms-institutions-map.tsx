"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
	Map,
	MapMarker,
	MapControls,
	MapPopup,
	MarkerContent,
	type MapRef,
} from "@/components/ui/map";

export type InstitutionMapPoint = {
	id: string;
	name: string;
	city: string | null;
	region: string | null;
	country: string | null;
	latitude: number;
	longitude: number;
	articleCount: number;
	articles: Array<{
		id: number;
		title: string;
		stageLabel: string;
	}>;
	dominantAreaLabel: string;
	color: string;
};

export type AreaLegendItem = {
	stageKey: string;
	label: string;
	color: string;
	count: number;
};

type TermsInstitutionsMapProps = {
	points: InstitutionMapPoint[];
	areas: AreaLegendItem[];
	totalArticles: number;
	articlesWithMappedInstitutions: number;
};

const DEFAULT_CENTER: [number, number] = [-46.6333, -23.5505];
const DEFAULT_ZOOM = 1.8;

export function TermsInstitutionsMap({
	points,
	areas,
	totalArticles,
	articlesWithMappedInstitutions,
}: TermsInstitutionsMapProps) {
	const mapRef = useRef<MapRef | null>(null);
	const [selectedPoint, setSelectedPoint] = useState<InstitutionMapPoint | null>(
		null,
	);
	const pointsById = useMemo(
		() => new globalThis.Map(points.map((point) => [point.id, point])),
		[points],
	);

	const activeSelectedPoint = selectedPoint
		? (pointsById.get(selectedPoint.id) ?? null)
		: null;
	const locationLabel = activeSelectedPoint
		? [
				activeSelectedPoint.city,
				activeSelectedPoint.region,
				activeSelectedPoint.country,
			]
				.filter(Boolean)
				.join(", ")
		: "";

	useEffect(() => {
		const map = mapRef.current;
		if (!map || points.length === 0) return;

		if (points.length === 1) {
			map.flyTo({
				center: [points[0].longitude, points[0].latitude],
				zoom: 4.2,
				duration: 900,
			});
			return;
		}

		let minLng = Number.POSITIVE_INFINITY;
		let minLat = Number.POSITIVE_INFINITY;
		let maxLng = Number.NEGATIVE_INFINITY;
		let maxLat = Number.NEGATIVE_INFINITY;

		for (const point of points) {
			if (point.longitude < minLng) minLng = point.longitude;
			if (point.longitude > maxLng) maxLng = point.longitude;
			if (point.latitude < minLat) minLat = point.latitude;
			if (point.latitude > maxLat) maxLat = point.latitude;
		}

		map.fitBounds(
			[
				[minLng, minLat],
				[maxLng, maxLat],
			],
			{ padding: 48, maxZoom: 4.5, duration: 950 },
		);
	}, [points]);

	const topInstitutions = points.slice(0, 6);
	const totalInstitutions = points.length;
	const unmappedArticles = Math.max(
		0,
		totalArticles - articlesWithMappedInstitutions,
	);

	return (
		<section className="mt-8 rounded-[16px] border border-[#dce9e1] bg-white p-5">
			<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
				Mapa de afiliações
			</h2>
			<p className="mt-1 text-sm text-[#64748b]">
				Afiliações dos artigos filtrados por termos, georreferenciadas por
				instituição.
			</p>

			<div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
				<StatCard label="Artigos filtrados" value={totalArticles} />
				<StatCard label="Com afiliação mapeada" value={articlesWithMappedInstitutions} />
				<StatCard label="Instituições únicas" value={totalInstitutions} />
				<StatCard label="Sem geolocalização" value={unmappedArticles} />
			</div>

			{points.length > 0 ? (
				<div className="mt-4 overflow-hidden rounded-xl border border-[#dbe7df]">
					<Map
						ref={mapRef}
						center={DEFAULT_CENTER}
						className="h-[440px] w-full"
						dragRotate={false}
						maxZoom={6}
						minZoom={1.3}
						pitch={0}
						zoom={DEFAULT_ZOOM}
					>
						{points.map((point) => (
							<MapMarker
								key={point.id}
								latitude={point.latitude}
								longitude={point.longitude}
								onClick={() => setSelectedPoint(point)}
							>
								<MarkerContent>
									<button
										aria-label={`Instituição ${point.name}`}
										className="h-4 w-4 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(15,23,42,0.16)] transition-transform hover:scale-110"
										style={{ backgroundColor: point.color }}
										type="button"
									/>
								</MarkerContent>
							</MapMarker>
						))}
						<MapControls position="bottom-right" showCompass={false} showZoom />
						{activeSelectedPoint ? (
							<MapPopup
								closeOnClick={false}
								closeButton
								latitude={activeSelectedPoint.latitude}
								longitude={activeSelectedPoint.longitude}
								onClose={() => setSelectedPoint(null)}
							>
								<div className="w-[280px] space-y-2">
									<p className="text-sm font-bold text-[#0f172a]">
										{activeSelectedPoint.name}
									</p>
									{locationLabel ? (
										<p className="text-xs text-[#475569]">{locationLabel}</p>
									) : null}
									<p className="text-[11px] text-[#64748b]">
										Lat/Lon: {activeSelectedPoint.latitude.toFixed(4)},{" "}
										{activeSelectedPoint.longitude.toFixed(4)}
									</p>
									{activeSelectedPoint.articles.length > 0 ? (
										<ul className="space-y-2 text-xs text-[#334155]">
											{activeSelectedPoint.articles.slice(0, 4).map((article) => (
												<li
													className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1.5"
													key={article.id}
												>
													<p className="font-semibold text-[#0f172a]">
														{article.title}
													</p>
													<p className="mt-0.5 text-[11px] text-[#475569]">
														Área AIA: {article.stageLabel}
													</p>
												</li>
											))}
										</ul>
									) : null}
								</div>
							</MapPopup>
						) : null}
					</Map>
				</div>
			) : (
				<div className="mt-4 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-4 text-sm text-[#64748b]">
					Nenhuma afiliação georreferenciável foi encontrada para os artigos
					filtrados.
				</div>
			)}

			{areas.length > 0 ? (
				<div className="mt-5">
					<p className="text-xs font-bold uppercase tracking-[1px] text-[#475569]">
						Cores por área (mesma paleta do gráfico)
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{areas.map((area) => (
							<span
								className="inline-flex items-center gap-2 rounded-full border border-[#dbe7df] bg-white px-3 py-1 text-xs font-semibold text-[#334155]"
								key={area.stageKey}
							>
								<span
									aria-hidden
									className="h-2.5 w-2.5 rounded-full"
									style={{ backgroundColor: area.color }}
								/>
								{area.label} ({area.count})
							</span>
						))}
					</div>
				</div>
			) : null}

			{topInstitutions.length > 0 ? (
				<div className="mt-5">
					<p className="text-xs font-bold uppercase tracking-[1px] text-[#475569]">
						Instituições com mais artigos na seleção
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{topInstitutions.map((institution) => (
							<button
								className="inline-flex items-center gap-2 rounded-full border border-[#dbe7df] bg-white px-3 py-1 text-xs font-semibold text-[#334155]"
								key={institution.id}
								onClick={() => setSelectedPoint(institution)}
								type="button"
							>
								<span
									aria-hidden
									className="h-2.5 w-2.5 rounded-full"
									style={{ backgroundColor: institution.color }}
								/>
								<span>{institution.name}</span>
								<span
									className="rounded-full px-2 py-0.5 text-[10px]"
									style={{
										backgroundColor: `${institution.color}22`,
										color: institution.color,
									}}
								>
									{institution.articleCount}
								</span>
							</button>
						))}
					</div>
				</div>
			) : null}
		</section>
	);
}

function StatCard({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-xl border border-[#dbe7df] bg-[#f8fafc] px-4 py-3">
			<p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#64748b]">
				{label}
			</p>
			<p className="mt-1 text-2xl font-black text-[#0f172a]">{value}</p>
		</div>
	);
}
