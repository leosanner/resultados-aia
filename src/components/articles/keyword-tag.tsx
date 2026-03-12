type KeywordTagProps = {
  keyword: string;
  index: number;
};

const TAG_STYLES = [
  "bg-[#edf8f2] text-[#0C7C3C]",
  "bg-[#edf5fa] text-[#1F6F8B]",
  "bg-[#fff8e5] text-[#7a641e]",
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
