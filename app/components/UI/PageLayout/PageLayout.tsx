import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";
import UserGeoInfo from "./CustomerGeoInfo/UserGeoInfo";
import clsx from "clsx";
import Aurora from "./NavBar/shared/Aurora";
import LocaleMismatch from "./LocaleMismatch";
import { LocaleLanguages } from "@/i18n/utils";
import {
  getPreferredLocale,
  getServerCookie,
} from "@/utils/cookies/cookiesServer";

interface PageLayoutProps {
  children: React.ReactNode;
  padding?: boolean;
  showNavBar?: boolean;
  showFooter?: boolean;
  auroraBackground?: boolean;
}

export default async function PageLayout({
  children,
  padding = true,
  showNavBar = true,
  showFooter = true,
  auroraBackground = false,
}: PageLayoutProps) {
  const locale = (await getPreferredLocale()) as LocaleLanguages;

  const localeMismatch = (await getServerCookie("locale_mismatch")) as
    | LocaleLanguages
    | undefined;

  return (
    <div className="flex flex-col bg-background text-foreground font-black transition-colors duration-300">
      {showNavBar && <NavBar locale={locale} localeMismatch={localeMismatch} />}

      {auroraBackground && <Aurora speed={0.3} />}

      {localeMismatch && (
        <LocaleMismatch locale={locale} localeMismatch={localeMismatch} />
      )}

      <div className="flex flex-col z-10">
        <main
          className={clsx("grow flex flex-col min-h-dvh", {
            "p-5 pb-0 md:p-10 md:pb-0 pt-20": padding,
          })}
        >
          {children}
        </main>
        {showFooter && <Footer />}
      </div>

      <UserGeoInfo />
    </div>
  );
}
