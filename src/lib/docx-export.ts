import type { TermsSearchExportRow } from "@/lib/terms-search";

type ZipEntry = {
	name: string;
	data: Uint8Array;
};

const encoder = new TextEncoder();

function toUint8Array(value: string | Uint8Array) {
	return typeof value === "string" ? encoder.encode(value) : value;
}

function createCrc32Table() {
	const table = new Uint32Array(256);
	for (let index = 0; index < 256; index += 1) {
		let current = index;
		for (let bit = 0; bit < 8; bit += 1) {
			current =
				(current & 1) === 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
		}
		table[index] = current >>> 0;
	}
	return table;
}

const crc32Table = createCrc32Table();

function crc32(data: Uint8Array) {
	let current = 0xffffffff;
	for (const byte of data) {
		current = crc32Table[(current ^ byte) & 0xff] ^ (current >>> 8);
	}
	return (current ^ 0xffffffff) >>> 0;
}

function u16(value: number) {
	return Uint8Array.of(value & 0xff, (value >>> 8) & 0xff);
}

function u32(value: number) {
	return Uint8Array.of(
		value & 0xff,
		(value >>> 8) & 0xff,
		(value >>> 16) & 0xff,
		(value >>> 24) & 0xff,
	);
}

function concatUint8Arrays(chunks: Uint8Array[]) {
	const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
	const buffer = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		buffer.set(chunk, offset);
		offset += chunk.length;
	}
	return buffer;
}

function buildZip(entriesInput: Array<{ name: string; data: string | Uint8Array }>) {
	const entries: ZipEntry[] = entriesInput.map((entry) => ({
		name: entry.name,
		data: toUint8Array(entry.data),
	}));
	const localFiles: Uint8Array[] = [];
	const centralDirectory: Uint8Array[] = [];
	let offset = 0;

	for (const entry of entries) {
		const fileName = encoder.encode(entry.name);
		const data = entry.data;
		const checksum = crc32(data);

		const localHeader = concatUint8Arrays([
			u32(0x04034b50),
			u16(20),
			u16(0),
			u16(0),
			u16(0),
			u16(0),
			u32(checksum),
			u32(data.length),
			u32(data.length),
			u16(fileName.length),
			u16(0),
			fileName,
		]);
		localFiles.push(localHeader, data);

		const centralHeader = concatUint8Arrays([
			u32(0x02014b50),
			u16(20),
			u16(20),
			u16(0),
			u16(0),
			u16(0),
			u16(0),
			u32(checksum),
			u32(data.length),
			u32(data.length),
			u16(fileName.length),
			u16(0),
			u16(0),
			u16(0),
			u16(0),
			u32(0),
			u32(offset),
			fileName,
		]);
		centralDirectory.push(centralHeader);

		offset += localHeader.length + data.length;
	}

	const centralDirectoryBytes = concatUint8Arrays(centralDirectory);
	const endOfCentralDirectory = concatUint8Arrays([
		u32(0x06054b50),
		u16(0),
		u16(0),
		u16(entries.length),
		u16(entries.length),
		u32(centralDirectoryBytes.length),
		u32(offset),
		u16(0),
	]);

	return concatUint8Arrays([
		concatUint8Arrays(localFiles),
		centralDirectoryBytes,
		endOfCentralDirectory,
	]);
}

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function buildTextRuns(value: string, bold: boolean = false) {
	const safeValue = value.length > 0 ? value : " ";
	const parts = safeValue.split("\n");

	return parts
		.map((part, index) => {
			const text = `<w:t xml:space="preserve">${escapeXml(part || " ")}</w:t>`;
			const runProperties = bold ? "<w:rPr><w:b/></w:rPr>" : "";
			const lineBreak = index < parts.length - 1 ? "<w:br/>" : "";
			return `<w:r>${runProperties}${text}${lineBreak}</w:r>`;
		})
		.join("");
}

function buildParagraph({
	content,
	spacingAfter = 80,
	lineHeight = 300,
}: {
	content: string;
	spacingAfter?: number;
	lineHeight?: number;
}) {
	return `
		<w:p>
			<w:pPr>
				<w:spacing w:after="${spacingAfter}" w:line="${lineHeight}" w:lineRule="auto"/>
			</w:pPr>
			${content}
		</w:p>
	`;
}

function buildCell({
	width,
	fill,
	content,
	padding = 110,
}: {
	width: number;
	fill: string;
	content: string;
	padding?: number;
}) {
	return `
		<w:tc>
			<w:tcPr>
				<w:tcW w:w="${width}" w:type="dxa"/>
				<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>
				<w:tcMar>
					<w:top w:w="${padding}" w:type="dxa"/>
					<w:left w:w="${padding}" w:type="dxa"/>
					<w:bottom w:w="${padding}" w:type="dxa"/>
					<w:right w:w="${padding}" w:type="dxa"/>
				</w:tcMar>
				<w:vAlign w:val="center"/>
			</w:tcPr>
			${content}
		</w:tc>
	`;
}

function buildHyperlinkRun({
	text,
	relationshipId,
}: {
	text: string;
	relationshipId: string;
}) {
	return `
		<w:hyperlink r:id="${relationshipId}">
			<w:r>
				<w:rPr>
					<w:color w:val="1D4ED8"/>
					<w:u w:val="single"/>
				</w:rPr>
				<w:t xml:space="preserve">${escapeXml(text)}</w:t>
			</w:r>
		</w:hyperlink>
	`;
}

function getLinkLabel(link: string) {
	if (/doi\.org\//i.test(link)) {
		return link.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "DOI: ");
	}
	return link;
}

function buildRow(
	values: string[],
	rowIndex: number,
	columns: Array<{
		width: number;
		compactPadding?: number;
		roomyPadding?: number;
		isRoomy?: boolean;
	}>,
	isHeader: boolean,
	buildCellContent: (value: string, columnIndex: number, isHeader: boolean) => string,
) {
	const fill = isHeader ? "D1D5DB" : rowIndex % 2 === 0 ? "F3F4F6" : "FFFFFF";
	return `
		<w:tr>
			${values
				.map((value, index) =>
					buildCell({
						width: columns[index].width,
						fill,
						padding: columns[index].isRoomy
							? (columns[index].roomyPadding ?? 180)
							: (columns[index].compactPadding ?? 90),
						content: buildCellContent(value, index, isHeader),
					}),
				)
				.join("")}
		</w:tr>
	`;
}

function buildDocumentXml(rows: TermsSearchExportRow[]) {
	const columns = [
		{
			label: "Área de AIA relacionada",
			key: "area_aia_relacionada",
			width: 2800,
			isRoomy: true,
			roomyPadding: 190,
		},
		{
			label: "Termos de busca tecnologia",
			key: "termos_busca_tecnologia",
			width: 2500,
			compactPadding: 90,
		},
		{
			label: "Termos de busca ambientais",
			key: "termos_busca_ambientais",
			width: 2500,
			compactPadding: 90,
		},
		{ label: "Data", key: "data", width: 1200, compactPadding: 80 },
		{ label: "Autores", key: "autores", width: 2400, compactPadding: 90 },
		{
			label: "Título",
			key: "titulo",
			width: 3900,
			isRoomy: true,
			roomyPadding: 210,
		},
		{ label: "Link", key: "link", width: 2800, compactPadding: 90 },
		{ label: "FWCI", key: "fwci", width: 850, compactPadding: 80 },
	] as const;
	const widths = columns.map((column) => column.width);
	const hyperlinkRelationships: Array<{ id: string; target: string }> = [];
	let hyperlinkCount = 0;
	const buildCellContent = (
		value: string,
		columnIndex: number,
		isHeader: boolean,
	) => {
		if (isHeader) {
			return buildParagraph({ content: buildTextRuns(value, true) });
		}

		const column = columns[columnIndex];
		const paragraphOptions =
			column.key === "area_aia_relacionada" || column.key === "titulo"
				? { spacingAfter: 120, lineHeight: 360 }
				: { spacingAfter: 60, lineHeight: 260 };

		if (column.key === "link" && value) {
			hyperlinkCount += 1;
			const relationshipId = `rIdHyperlink${hyperlinkCount}`;
			hyperlinkRelationships.push({ id: relationshipId, target: value });
			return buildParagraph({
				content: buildHyperlinkRun({
					text: getLinkLabel(value),
					relationshipId,
				}),
				...paragraphOptions,
			});
		}

		return buildParagraph({
			content: buildTextRuns(value, false),
			...paragraphOptions,
		});
	};
	const headerRow = buildRow(
		columns.map((column) => column.label),
		0,
		columns as unknown as Array<{
			width: number;
			compactPadding?: number;
			roomyPadding?: number;
			isRoomy?: boolean;
		}>,
		true,
		buildCellContent,
	);
	const bodyRows = rows.map((row, index) =>
		buildRow(
			columns.map((column) => row[column.key] ?? ""),
			index,
			columns as unknown as Array<{
				width: number;
				compactPadding?: number;
				roomyPadding?: number;
				isRoomy?: boolean;
			}>,
			false,
			buildCellContent,
		),
	);

	return {
		documentXml: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
	xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
	xmlns:o="urn:schemas-microsoft-com:office:office"
	xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
	xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
	xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
	xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
	xmlns:w10="urn:schemas-microsoft-com:office:word"
	xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
	xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
	xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
	xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
	xmlns:wne="http://schemas.microsoft.com/office/2006/wordml"
	xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
	mc:Ignorable="w14 wp14">
	<w:body>
		<w:p>
			<w:pPr>
				<w:spacing w:after="180"/>
			</w:pPr>
			<w:r>
				<w:rPr>
					<w:b/>
					<w:sz w:val="28"/>
				</w:rPr>
				<w:t>Artigos filtrados por busca nos grafos</w:t>
			</w:r>
		</w:p>
		<w:tbl>
			<w:tblPr>
				<w:tblStyle w:val="TableGrid"/>
				<w:tblW w:w="0" w:type="auto"/>
				<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
			</w:tblPr>
			<w:tblGrid>
				${widths
					.map((width) => `<w:gridCol w:w="${width}"/>`)
					.join("")}
			</w:tblGrid>
			${headerRow}
			${bodyRows.join("")}
		</w:tbl>
		<w:sectPr>
			<w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/>
			<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="708" w:footer="708" w:gutter="0"/>
		</w:sectPr>
	</w:body>
</w:document>`,
		relationshipsXml: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
	${hyperlinkRelationships
		.map(
			(relationship) =>
				`<Relationship Id="${relationship.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${escapeXml(relationship.target)}" TargetMode="External"/>`,
		)
		.join("")}
</Relationships>`,
	};
}

export function serializeTermsSearchRowsToDocx(rows: TermsSearchExportRow[]) {
	const { documentXml, relationshipsXml } = buildDocumentXml(rows);
	const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
	<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
	<Default Extension="xml" ContentType="application/xml"/>
	<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

	const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
	<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

	return buildZip([
		{ name: "[Content_Types].xml", data: contentTypes },
		{ name: "_rels/.rels", data: rootRels },
		{ name: "word/document.xml", data: documentXml },
		{ name: "word/_rels/document.xml.rels", data: relationshipsXml },
	]);
}
