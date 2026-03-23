# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Explorador AIA** — a Next.js 16 dashboard for exploring Environmental Impact Assessment (Avaliação de Impacto Ambiental) research articles. The app classifies articles by EIA stages and cross-references them with technology and environmental terms. The UI language is Brazilian Portuguese; article data and terms are in English.

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (Next.js core-web-vitals + TypeScript rules)

No test framework is configured.

## Architecture

### Data Layer (`src/data/`)

Static JSON files loaded server-side via `fs.readFile`:
- `articles.json` / `articles_extended.json` — article records (basic and extended with authors, affiliations, DOIs, FWCI)
- `frequency_terms.json` — per-article term frequency counts, split into `env` (environmental) and `tec` (technology) categories
- `eia_stages.json` — maps EIA stage keys (snake_case) to arrays of article IDs
- `instituition_information.json` — institution geolocation data

### Domain Models (`src/model/`)

- `ArticleModel` — loads articles and frequency terms, supports filtering by term categories
- `EiaModel` — composes `ArticleModel`, provides stage-based article grouping, pagination, term frequency summaries, and author extraction
- `graph.ts` — builds a graph (nodes + edges) connecting articles to env/tec terms for the `@xyflow/react` visualization

### Key Conventions

- **EIA stage keys** are snake_case strings (e.g., `screening`, `impact_prediction`). Conversion to URL slugs uses hyphens via `stageKeyToSlug`/`slugToStageKey` in `src/lib/area-utils.ts`.
- **Term filtering** uses `filterOcurrencies()` from `src/utils/ocurrencies.ts` to threshold raw frequency counts before treating a term as present.
- **Server/client split**: chart and map components follow the pattern of a server component (data fetching) wrapping a `*-client.tsx` component (interactive rendering). Example: `terms-bar-chart.tsx` → `terms-bar-chart-client.tsx`.

### Routes (App Router)

| Route | Purpose |
|---|---|
| `/` | Landing page — EIA stage summary cards + article-term graph |
| `/areas/[areaSlug]/artigos` | Paginated article list for a stage |
| `/areas/[areaSlug]/artigos/[articleId]` | Single article detail |
| `/areas/[areaSlug]/estatisticas` | Stage-level statistics (charts) |
| `/termos` | Term search with filters, trend charts, CSV export |
| `/termos/download` | API route — generates CSV export |
| `/metodologia` | Methodology explanation page |
| `/metodos` | Methods page |
| `/autores` | Authors by stage |
| `/contextualizacao-geral` | General context page |

### UI Stack

- **Tailwind CSS v4** with `@tailwindcss/postcss`
- **shadcn/ui** (radix-nova style, `components.json` config) — components in `src/components/ui/`
- **MUI X Charts** (`@mui/x-charts`) for line/bar charts
- **MapLibre GL** for geographic maps
- **@xyflow/react** for the article-term graph visualization
- **Framer Motion** for animations
- **React Compiler** enabled (`reactCompiler: true` in next.config.ts)
- Path alias: `@/*` → `./src/*`

### Design System

Two design guideline documents exist at the repo root:
- `BRANDING.MD` — eco-tech minimalist style (green palette, pill buttons, bento cards, extensive whitespace)
- `DESIGN_GUIDELINES.md` — Petrobras-inspired institutional portal patterns (green primary `#0C7C3C`, metric cards, map layouts, 12-column grid)

Primary colors: forest green (`#064722`, `#0C7C3C`), vibrant green (`#27AE60`, `#2ECC71`), yellow accent (`#F2C94C`). Text: `#2B2B2B` primary, `#556070` secondary.
