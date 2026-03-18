import {
	getTermsSearchResults,
	serializeTermsSearchRowsToCsv,
} from "@/lib/terms-search";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const results = await getTermsSearchResults({
		tec: searchParams.getAll("tec"),
		env: searchParams.getAll("env"),
		term: searchParams.getAll("term"),
		type: searchParams.getAll("type"),
	});
	const csv = serializeTermsSearchRowsToCsv(results.exportRows);

	return new Response(csv, {
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition":
				'attachment; filename="artigos-busca-grafos-aia.csv"',
			"Cache-Control": "no-store",
		},
	});
}
