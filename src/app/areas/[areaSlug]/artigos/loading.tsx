export default function LoadingAreaArticles() {
  return (
    <div className="min-h-screen bg-[#f6f8f6] px-6 py-8 md:px-12">
      <div className="mx-auto w-full max-w-[992px] animate-pulse">
        <div className="h-4 w-28 rounded bg-[#e2e8f0]" />
        <div className="mt-6 h-10 w-72 rounded bg-[#e2e8f0]" />
        <div className="mt-3 h-6 w-80 rounded bg-[#e2e8f0]" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="rounded-[12px] border border-[#e2e8f0] bg-white p-6" key={index}>
              <div className="h-7 w-2/3 rounded bg-[#e2e8f0]" />
              <div className="mt-3 h-4 w-full rounded bg-[#e2e8f0]" />
              <div className="mt-2 h-4 w-11/12 rounded bg-[#e2e8f0]" />
              <div className="mt-4 flex gap-2">
                <div className="h-5 w-24 rounded bg-[#e2e8f0]" />
                <div className="h-5 w-20 rounded bg-[#e2e8f0]" />
                <div className="h-5 w-16 rounded bg-[#e2e8f0]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
