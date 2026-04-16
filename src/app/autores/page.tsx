import { ArticleModel } from "@/model/article";
import { TechnologyAuthorsCard } from "@/components/autores/technology-authors-card";

type AuthorByTechnology = {
	authorId: string;
	authorName: string;
	publications: number[];
};

export default async function AuthorsPage() {
	const articleModel = new ArticleModel();
	const authorsByTechnology = await articleModel.getAuthorsByTechnology();

	const technologies = Object.entries(authorsByTechnology)
		.map(([technologyKey, authors]) => {
			const sortedAuthors = Object.entries(authors)
				.map(([authorId, author]) => {
					const uniquePublications = Array.from(new Set(author.publications));
					return {
						authorId,
						authorName: author.authorName,
						publications: uniquePublications,
					} as AuthorByTechnology;
				})
				.sort((a, b) => b.publications.length - a.publications.length);

			const totalPublications = new Set(
				sortedAuthors.flatMap((author) => author.publications),
			).size;

			return {
				technologyKey,
				technologyLabel: technologyKey,
				authors: sortedAuthors,
				totalPublications,
			};
		})
		.sort((a, b) => b.totalPublications - a.totalPublications);

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#edf8f2_0%,_#f4f8f6_40%,_#ffffff_100%)] text-[#111111]">
			<main className="mx-auto w-full max-w-[1280px] px-6 py-8 sm:px-10 lg:px-20">
				<section className="max-w-[760px]">
					<p className="text-xs font-bold uppercase tracking-[1.2px] text-[#256f4f]">
						Novo Painel
					</p>
					<h1 className="mt-2 text-4xl font-black tracking-[-1px] text-[#111111] md:text-5xl">
						Autores por Tecnologia
					</h1>
					<p className="mt-3 text-base text-[#4a5568]">
						Ranking de autores por tecnologia da string de busca, ordenados por
						total de publicações.
					</p>
				</section>

				<section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
					{technologies.map((technology) => (
						<TechnologyAuthorsCard
							authors={technology.authors}
							key={technology.technologyKey}
							technologyKey={technology.technologyKey}
							technologyLabel={technology.technologyLabel}
						/>
					))}
				</section>
			</main>
		</div>
	);
}
