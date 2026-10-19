import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { DefaultHeader } from "@/components/layout/default-header";
import { MainFooter } from "@/components/layout/main-footer";
import { getLocale } from "@/i18n/get-locale";
import { landingCopy } from "@/i18n/landing";
import { localeTag } from "@/i18n/locale";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = landingCopy[locale];

  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={localeTag(locale)} className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" />
      </head>
      <body className="antialiased">
        <LocaleProvider locale={locale}>
          <div className="flex min-h-screen flex-col">
            <DefaultHeader />
            <div className="flex-1">{children}</div>
            <MainFooter />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
