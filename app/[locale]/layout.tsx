import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { APP_NAME } from "@/utils/config/config.client";
import {
  Theme,
  ThemeProvider,
} from "../components/UI/shared/components/ThemeProvider";
import {
  getLocaleMismatch,
  getPreferredLocale,
  getServerCookie,
} from "@/utils/cookies/cookies.server";
import { Toaster } from "../components/UI/shared/components/Toaster";
import UserGeoInfo from "../components/UI/PageLayout/Context/UserGeoInfo/UserGeoInfo";
import { LocaleLanguages } from "@/i18n/utils";
import LocaleMismatch from "../components/UI/PageLayout/Context/BottomModals/LocaleMismatch";
import CookieConsent from "../components/UI/PageLayout/Context/BottomModals/CookieConsent";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HOME_PAGE" });
  const name = APP_NAME;

  return {
    title: t("META.TITLE", { name }),
    description: t("META.DESCRIPTION", { name }),
  };
}

async function LocaleLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = ((await getServerCookie("theme")) || "dark") as Theme;
  const preferredLocale = (await getPreferredLocale()) as LocaleLanguages;
  const localeMismatch = (await getLocaleMismatch()) as LocaleLanguages;
  const hasCookieConsent = !!(await getServerCookie("cookie_consent"));

  return (
    <NextIntlClientProvider>
      <ThemeProvider defaultTheme={theme}>
        {/* Inject dark theme class immediately during stream rendering to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.className = "${theme === "dark" ? "dark" : ""}";`,
          }}
        />

        {children}

        <Toaster />

        {localeMismatch && (
          <LocaleMismatch
            locale={preferredLocale}
            localeMismatch={localeMismatch}
          />
        )}

        {!hasCookieConsent && (
          <CookieConsent initialHasConsent={hasCookieConsent} />
        )}
        <UserGeoInfo />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <LocaleLayoutContent>
            {children}
          </LocaleLayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
