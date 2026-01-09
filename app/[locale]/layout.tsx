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
import { getServerCookie } from "@/utils/cookies/cookies.server";
import { Toaster } from "../components/UI/shared/components/Toaster";

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

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const theme = ((await getServerCookie("theme")) || "dark") as Theme;

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={theme === "dark" ? "dark" : ""}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider defaultTheme={theme}>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
