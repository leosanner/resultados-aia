"use client";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-[#f6f8f6] px-6 py-8 md:px-12">
      <div className="mx-auto w-full max-w-[992px] rounded-[12px] border border-[#e2e8f0] bg-white p-6">
        <h1 className="text-lg font-bold text-[#0f172a]">Não foi possível carregar os artigos</h1>
        <p className="mt-2 text-sm text-[#64748b]">{error.message || "Ocorreu um erro inesperado."}</p>
        <button
          className="mt-4 rounded-[8px] bg-[#0f172a] px-4 py-2 text-sm font-bold text-white hover:bg-[#1e293b]"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
