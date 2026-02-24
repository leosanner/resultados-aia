import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Explorador AIA",
  description: "Visão geral de áreas e pesquisas em Avaliação de Impacto Ambiental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
