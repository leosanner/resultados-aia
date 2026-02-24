type KeywordTagProps = {
  keyword: string;
  index: number;
};

const TAG_STYLES = [
  "bg-[rgba(43,238,75,0.1)] text-[#16a34a]",
  "bg-[#dbeafe] text-[#2563eb]",
  "bg-[#ecfeff] text-[#0e7490]",
];

export function KeywordTag({ keyword, index }: KeywordTagProps) {
  const styleClass = TAG_STYLES[index % TAG_STYLES.length];

  return (
    <span
      className={`inline-flex rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] ${styleClass}`}
    >
      {keyword}
    </span>
  );
}
