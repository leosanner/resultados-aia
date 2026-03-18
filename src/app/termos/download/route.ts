import { serializeTermsSearchRowsToDocx } from "@/lib/docx-export";
import {
	getTermsSearchResults,
	serializeTermsSearchRowsToCsv,
} from "@/lib/terms-search";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const format = searchParams.get("format") === "docx" ? "docx" : "csv";
	const results = await getTermsSearchResults({
		tec: searchParams.getAll("tec"),
		env: searchParams.getAll("env"),
		term: searchParams.getAll("term"),
		type: searchParams.getAll("type"),
	});
	const body =
		format === "docx"
			? serializeTermsSearchRowsToDocx(results.exportRows)
			: serializeTermsSearchRowsToCsv(results.exportRows);

	return new Response(body, {
		headers: {
			"Content-Type":
				format === "docx"
					? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					: "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="artigos-busca-grafos-aia.${format}"`,
			"Cache-Control": "no-store",
		},
	});
}
