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

export type ArticleMapPoint = {
	id: string;
	articleId: number;
	title: string;
	institutionName: string;
	city: string | null;
	region: string | null;
	country: string | null;
	latitude: number;
	longitude: number;
	technologyTerms: string[];
	environmentalTerms: string[];
	color: string;
};

export type TechnologyLegendItem = {
	key: string;
	label: string;
	color: string;
	count: number;
};

type TermsArticlesMapProps = {
	points: ArticleMapPoint[];
	technologyLegend: TechnologyLegendItem[];
	totalArticles: number;
	articlesWithMappedInstitutions: number;
};

const DEFAULT_CENTER: [number, number] = [-46.6333, -23.5505];
const DEFAULT_ZOOM = 1.8;
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

function capitalizeFirstLetter(text: string): string {
	const trimmed = text.trim();
	if (!trimmed) return text;
	return `${trimmed.charAt(0).toLocaleUpperCase("pt-BR")}${trimmed.slice(1)}`;
}

export function TermsArticlesMap({
	points,
	technologyLegend,
	totalArticles,
	articlesWithMappedInstitutions,
}: TermsArticlesMapProps) {
	const mapRef = useRef<MapRef | null>(null);
	const [mapTheme, setMapTheme] = useState<"light" | "dark">("light");
	const [mapVisualMode, setMapVisualMode] = useState<"map" | "satellite">("map");
	const [selectedPoint, setSelectedPoint] =
		useState<ArticleMapPoint | null>(null);
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

	const uniqueInstitutions = useMemo(() => {
		const set = new Set<string>();
		for (const point of points) {
			set.add(`${point.latitude.toFixed(5)},${point.longitude.toFixed(5)}`);
		}
		return set.size;
	}, [points]);

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

	const unmappedArticles = Math.max(
		0,
		totalArticles - articlesWithMappedInstitutions,
	);
	const customStyles =
		mapVisualMode === "satellite"
			? { light: SATELLITE_STYLE, dark: SATELLITE_STYLE }
			: undefined;

	return (
		<section className="mt-12 border-t border-[#e2e8f0] pt-8">
			<h2 className="text-sm font-bold uppercase tracking-[1px] text-[#334155]">
				Mapa de afiliações
			</h2>
			<p className="mt-1 text-sm text-[#64748b]">
				Afiliações dos artigos filtrados por termos, coloridas pela tecnologia
				do artigo.
			</p>

			<div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
				<StatCard label="Artigos filtrados" value={totalArticles} />
				<StatCard
					label="Com afiliação mapeada"
					value={articlesWithMappedInstitutions}
				/>
				<StatCard label="Instituições únicas" value={uniqueInstitutions} />
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
										aria-label={`Artigo ${point.title}`}
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
										{capitalizeFirstLetter(activeSelectedPoint.title)}
									</p>
									<p className="text-xs text-[#475569]">
										{activeSelectedPoint.institutionName}
									</p>
									{locationLabel ? (
										<p className="text-xs text-[#475569]">{locationLabel}</p>
									) : null}
									<p className="text-[11px] text-[#64748b]">
										Lat/Lon: {activeSelectedPoint.latitude.toFixed(4)},{" "}
										{activeSelectedPoint.longitude.toFixed(4)}
									</p>
									{activeSelectedPoint.technologyTerms.length > 0 ? (
										<div className="flex flex-wrap gap-1">
											{activeSelectedPoint.technologyTerms.map((term) => (
												<span
													className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-2 py-0.5 text-[10px] font-semibold text-[#1e3a8a]"
													key={`${activeSelectedPoint.id}-tec-${term}`}
												>
													Tec: {term}
												</span>
											))}
										</div>
									) : null}
									{activeSelectedPoint.environmentalTerms.length > 0 ? (
										<div className="flex flex-wrap gap-1">
											{activeSelectedPoint.environmentalTerms.map((term) => (
												<span
													className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-0.5 text-[10px] font-semibold text-[#166534]"
													key={`${activeSelectedPoint.id}-env-${term}`}
												>
													Env: {term}
												</span>
											))}
										</div>
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

			{technologyLegend.length > 0 ? (
				<div className="mt-5">
					<p className="text-xs font-bold uppercase tracking-[1px] text-[#475569]">
						Cores por tecnologia
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{technologyLegend.map((item) => (
							<span
								className="inline-flex items-center gap-2 rounded-full border border-[#dbe7df] bg-white px-3 py-1 text-xs font-semibold text-[#334155]"
								key={item.key}
							>
								<span
									aria-hidden
									className="h-2.5 w-2.5 rounded-full"
									style={{ backgroundColor: item.color }}
								/>
								{item.label} ({item.count})
							</span>
						))}
					</div>
				</div>
			) : null}
		</section>
	);
}

function StatCard({ label, value }: { label: string; value: number }) {
	const toneByLabel: Record<
		string,
		{
			borderClass: string;
			bgClass: string;
			labelClass: string;
			valueClass: string;
		}
	> = {
		"Artigos filtrados": {
			borderClass: "border-[#86efac]",
			bgClass: "bg-[#f0fdf4]",
			labelClass: "text-[#166534]",
			valueClass: "text-[#14532d]",
		},
		"Com afiliação mapeada": {
			borderClass: "border-[#60a5fa]",
			bgClass: "bg-[#eff6ff]",
			labelClass: "text-[#1d4ed8]",
			valueClass: "text-[#1e3a8a]",
		},
		"Instituições únicas": {
			borderClass: "border-[#fcd34d]",
			bgClass: "bg-[#fffbeb]",
			labelClass: "text-[#92400e]",
			valueClass: "text-[#713f12]",
		},
		"Sem geolocalização": {
			borderClass: "border-[#cbd5e1]",
			bgClass: "bg-[#f8fafc]",
			labelClass: "text-[#64748b]",
			valueClass: "text-[#0f172a]",
		},
	};

	const tone = toneByLabel[label] ?? toneByLabel["Sem geolocalização"];

	return (
		<div className={`rounded-xl border px-4 py-3 ${tone.borderClass} ${tone.bgClass}`}>
			<p className={`text-[11px] font-bold uppercase tracking-[0.8px] ${tone.labelClass}`}>
				{label}
			</p>
			<p className={`mt-1 text-2xl font-black ${tone.valueClass}`}>{value}</p>
		</div>
	);
}
