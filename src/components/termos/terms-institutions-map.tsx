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
const FALLBACK_AREA_COLOR = "#64748b";
const SATELLITE_STYLE = {
	version: 8 as const,
	sources: {
		"esri-world-imagery": {
			type: "raster" as const,
			tiles: [
				"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			],
			tileSize: 256,
			attribution: "Tiles © Esri",
		},
	},
	layers: [
		{
			id: "esri-world-imagery-layer",
			type: "raster" as const,
			source: "esri-world-imagery",
		},
	],
};

function normalizeAreaLabel(label: string): string {
	return label.trim().toLowerCase().replace(/\s+/g, " ");
}

function capitalizeFirstLetter(text: string): string {
	const trimmed = text.trim();
	if (!trimmed) return text;
	return `${trimmed.charAt(0).toLocaleUpperCase("pt-BR")}${trimmed.slice(1)}`;
}

function hexToRgba(hexColor: string, alpha: number): string {
	const hex = hexColor.replace("#", "");
	if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex)) {
		return `rgba(100, 116, 139, ${alpha})`;
	}

	const normalized =
		hex.length === 3 ? hex.split("").map((char) => `${char}${char}`).join("") : hex;
	const r = Number.parseInt(normalized.slice(0, 2), 16);
	const g = Number.parseInt(normalized.slice(2, 4), 16);
	const b = Number.parseInt(normalized.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function TermsInstitutionsMap({
	points,
	areas,
	totalArticles,
	articlesWithMappedInstitutions,
}: TermsInstitutionsMapProps) {
	const mapRef = useRef<MapRef | null>(null);
	const [mapTheme, setMapTheme] = useState<"light" | "dark">("light");
	const [mapVisualMode, setMapVisualMode] = useState<"map" | "satellite">("map");
	const [selectedPoint, setSelectedPoint] =
		useState<InstitutionMapPoint | null>(null);
	const pointsById = useMemo(
		() => new globalThis.Map(points.map((point) => [point.id, point])),
		[points],
	);
	const areaColorByLabel = useMemo(
		() =>
			new globalThis.Map(
				areas.map((area) => [normalizeAreaLabel(area.label), area.color]),
			),
		[areas],
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

	const totalInstitutions = points.length;
	const unmappedArticles = Math.max(
		0,
		totalArticles - articlesWithMappedInstitutions,
	);
	const customStyles =
		mapVisualMode === "satellite"
			? { light: SATELLITE_STYLE, dark: SATELLITE_STYLE }
			: undefined;

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
				<StatCard
					label="Com afiliação mapeada"
					value={articlesWithMappedInstitutions}
				/>
				<StatCard label="Instituições únicas" value={totalInstitutions} />
				<StatCard label="Sem geolocalização" value={unmappedArticles} />
			</div>
			<div className="mt-4 flex items-center justify-between rounded-lg border border-[#dbe7df] bg-[#f8fafc] px-3 py-2">
				<p className="text-xs font-semibold uppercase tracking-[0.8px] text-[#475569]">
					Tema do mapa
				</p>
				<div
					aria-label="Seletor de tema do mapa"
					className="inline-flex rounded-md border border-[#cbd5e1] bg-white p-0.5"
					role="group"
				>
					<button
						aria-pressed={mapTheme === "light"}
						className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
							mapTheme === "light"
								? "bg-[#0f172a] text-white"
								: "text-[#475569] hover:bg-[#f1f5f9]"
						}`}
						onClick={() => setMapTheme("light")}
						type="button"
					>
						Claro
					</button>
					<button
						aria-pressed={mapTheme === "dark"}
						className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
							mapTheme === "dark"
								? "bg-[#0f172a] text-white"
								: "text-[#475569] hover:bg-[#f1f5f9]"
						}`}
						onClick={() => setMapTheme("dark")}
						type="button"
					>
						Escuro
					</button>
				</div>
			</div>
			<div className="mt-2 flex items-center justify-between rounded-lg border border-[#dbe7df] bg-[#f8fafc] px-3 py-2">
				<p className="text-xs font-semibold uppercase tracking-[0.8px] text-[#475569]">
					Visualização
				</p>
				<div
					aria-label="Seletor de visualização do mapa"
					className="inline-flex rounded-md border border-[#cbd5e1] bg-white p-0.5"
					role="group"
				>
					<button
						aria-pressed={mapVisualMode === "map"}
						className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
							mapVisualMode === "map"
								? "bg-[#0f172a] text-white"
								: "text-[#475569] hover:bg-[#f1f5f9]"
						}`}
						onClick={() => setMapVisualMode("map")}
						type="button"
					>
						Mapa
					</button>
					<button
						aria-pressed={mapVisualMode === "satellite"}
						className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
							mapVisualMode === "satellite"
								? "bg-[#0f172a] text-white"
								: "text-[#475569] hover:bg-[#f1f5f9]"
						}`}
						onClick={() => setMapVisualMode("satellite")}
						type="button"
					>
						Satélite
					</button>
				</div>
			</div>

			{points.length > 0 ? (
				<div className="mt-4 overflow-hidden rounded-xl border border-[#dbe7df]">
					<Map
						ref={mapRef}
						center={DEFAULT_CENTER}
						className="h-[520px] w-full md:h-[620px]"
						dragRotate={false}
						maxZoom={6}
						minZoom={1.3}
						pitch={0}
						styles={customStyles}
						theme={mapTheme}
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
											{activeSelectedPoint.articles
												.slice(0, 4)
												.map((article) => {
													const stageLabels = article.stageLabel
														.split("/")
														.map((label) => label.trim())
														.filter(Boolean);

													return (
														<li
															className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1.5"
															key={article.id}
														>
															<p className="font-semibold text-[#0f172a]">
																{capitalizeFirstLetter(article.title)}
															</p>
															<div className="mt-1 flex flex-wrap gap-1">
																{stageLabels.map((stageLabel) => {
																	const color =
																		areaColorByLabel.get(
																			normalizeAreaLabel(stageLabel),
																		) ?? FALLBACK_AREA_COLOR;

																	return (
																		<span
																			className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
																			key={`${article.id}-${stageLabel}`}
																			style={{
																				backgroundColor: hexToRgba(color, 0.14),
																				borderColor: hexToRgba(color, 0.35),
																				color,
																			}}
																		>
																			{stageLabel}
																		</span>
																	);
																})}
															</div>
														</li>
													);
												})}
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
