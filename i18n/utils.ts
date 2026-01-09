import { DEFAULT_LOCALE } from "@/utils/config/config.client";
import en from "react-phone-number-input/locale/en";
import fr from "react-phone-number-input/locale/fr";

const rawLabels = { fr, en } as const;
export const SUPPORTED_LOCALES = Object.keys(rawLabels) as Array<
  keyof typeof rawLabels
>;

export type LocaleLanguages = (typeof SUPPORTED_LOCALES)[number];
export type LocaleLanguagesUpperCase = Uppercase<LocaleLanguages>;

export const DEFAULT_LOCALE_UPPERCASE: LocaleLanguagesUpperCase =
  DEFAULT_LOCALE.toUpperCase() as LocaleLanguagesUpperCase;

export function getPhoneInputLabels(): (typeof rawLabels)[typeof DEFAULT_LOCALE] {
  const resolvedLocale = getPreferredLocaleClientSide() as LocaleLanguages;
  return rawLabels[resolvedLocale];
}

export function getPreferredLocaleClientSide(
  toUpperCase = false
): LocaleLanguages | LocaleLanguagesUpperCase {
  if (typeof document === "undefined")
    return toUpperCase ? DEFAULT_LOCALE_UPPERCASE : DEFAULT_LOCALE;

  const preferredLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("preferred_locale="))
    ?.split("=")[1] as LocaleLanguages;

  const locale = SUPPORTED_LOCALES.includes(preferredLocale)
    ? preferredLocale
    : DEFAULT_LOCALE;

  return toUpperCase
    ? (locale.toUpperCase() as LocaleLanguagesUpperCase)
    : locale;
}
