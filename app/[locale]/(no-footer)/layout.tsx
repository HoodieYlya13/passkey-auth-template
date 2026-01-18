import NavBar from "@/app/components/UI/PageLayout/NavBar/NavBar";
import { LocaleLanguages } from "@/i18n/utils";

export default async function NoFooterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col font-black transition-colors duration-300">
      <NavBar locale={locale as LocaleLanguages} />

      <main className="grow flex flex-col min-h-dvh pt-(--nav-height)">
        {children}
      </main>
    </div>
  );
}
