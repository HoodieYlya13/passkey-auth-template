import Footer from "@/app/components/UI/PageLayout/Footer/Footer";
import NavBar from "@/app/components/UI/PageLayout/NavBar/NavBar";
import { LocaleLanguages } from "@/i18n/utils";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: LocaleLanguages }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col font-black transition-colors duration-300">
      <NavBar locale={locale} />

      <div className="flex flex-col">
        <main className="grow flex flex-col min-h-dvh pt-(--nav-height)">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
