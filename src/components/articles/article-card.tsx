import { KeywordTag } from "@/components/articles/keyword-tag";

type ArticleCardProps = {
  abstract: string;
  keywords: string[];
  title: string;
};

export function ArticleCard({ abstract, keywords, title }: ArticleCardProps) {
  return (
    <article className="rounded-[12px] border border-[#e2e8f0] bg-white p-[21px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <h2 className="text-[18px] font-bold leading-7 text-[#0f172a]">{title}</h2>
      <p className="mt-2 text-[14px] leading-6 text-[#64748b]">{abstract}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.map((keyword, index) => <KeywordTag index={index} key={`${keyword}-${index}`} keyword={keyword} />)
        ) : (
          <span className="inline-flex rounded-[4px] bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
            Sem palavras-chave
          </span>
        )}
      </div>
    </article>
  );
}
