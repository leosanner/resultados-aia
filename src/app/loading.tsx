export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-[1280px] animate-pulse">
        <div className="h-10 w-48 rounded-lg bg-[#e2e8f0]" />
        <div className="mt-10 h-12 w-full max-w-[560px] rounded-lg bg-[#e2e8f0]" />
        <div className="mt-4 h-7 w-full max-w-[640px] rounded-lg bg-[#e2e8f0]" />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="rounded-3xl border border-[#f1f5f9] bg-white p-8" key={index}>
              <div className="h-16 w-16 rounded-2xl bg-[#e2e8f0]" />
              <div className="mt-6 h-8 w-2/3 rounded-md bg-[#e2e8f0]" />
              <div className="mt-3 h-4 w-full rounded-md bg-[#e2e8f0]" />
              <div className="mt-2 h-4 w-5/6 rounded-md bg-[#e2e8f0]" />
              <div className="mt-6 h-7 w-28 rounded-full bg-[#e2e8f0]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
