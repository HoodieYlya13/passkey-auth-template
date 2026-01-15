import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";
import UserGeoInfo from "./Context/UserGeoInfo/UserGeoInfo";
import clsx from "clsx";
import Aurora from "../shared/components/Aurora";
import LocaleMismatch from "./Context/BottomModals/LocaleMismatch";
import { LocaleLanguages } from "@/i18n/utils";
import {
  getPreferredLocale,
  getServerCookie,
} from "@/utils/cookies/cookies.server";
import QueryParamsToast from "./Context/QueryParamsToast";
import CookieConsent from "./Context/BottomModals/CookieConsent";

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

  const hasCookieConsent = !!(await getServerCookie("cookie_consent"));

  return (
    <div className="flex flex-col font-black transition-colors duration-300">
      <QueryParamsToast />

      {showNavBar && <NavBar locale={locale} localeMismatch={localeMismatch} />}

      {auroraBackground && <Aurora speed={0.3} />}

      {localeMismatch && (
        <LocaleMismatch locale={locale} localeMismatch={localeMismatch} />
      )}

      {!hasCookieConsent && <CookieConsent initialHasConsent={hasCookieConsent} />}

      <div className="flex flex-col z-10">
        <main
          className={clsx("grow flex flex-col min-h-dvh", {
            "p-5 pb-0 pt-20 md:px-10": padding,
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
