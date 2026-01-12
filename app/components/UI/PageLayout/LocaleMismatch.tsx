"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocaleLanguages } from "@/i18n/utils";
import {
  deleteClientCookie,
  setClientCookie,
} from "@/utils/cookies/cookies.client";
import { useTranslations } from "next-intl";

interface LocaleMismatchProps {
  locale: LocaleLanguages;
  localeMismatch: LocaleLanguages;
}

export default function LocaleMismatch({
  locale,
  localeMismatch,
}: LocaleMismatchProps) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const t = useTranslations("LOCALE_MISMATCH");

  if (!isVisible) return null;

  const handleSwitch = async () => {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    const segments = pathname.split("/");
    segments[1] = localeMismatch;
    const newPath = segments.join("/") + search + hash;

    setClientCookie("preferred_locale", localeMismatch);

    deleteClientCookie("locale_mismatch");

    router.push(newPath);
  };

  const handleStay = async () => {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    const segments = pathname.split("/");
    segments[1] = locale;
    const newPath = segments.join("/") + search + hash;

    setIsVisible(false);
    setClientCookie("preferred_locale", locale);
    deleteClientCookie("locale_mismatch");

    router.push(newPath);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-background p-6 rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-4 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-gray-900">{t("TITLE")}</h3>
        <p className="text-sm text-gray-600">
          {t.rich("DESCRIPTION", {
            important: (chunks) => (
              <span className="font-medium text-gray-900 uppercase">
                {chunks}
              </span>
            ),
            preferredLocale: locale,
            currentLocale: localeMismatch,
          })}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSwitch}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer custom-shadow custom-shadow-hover"
        >
          {t("KEEP", { locale: localeMismatch.toUpperCase() })}
        </button>
        <button
          onClick={handleStay}
          className="flex-1 px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded-lg transition-colors cursor-pointer custom-shadow custom-shadow-hover"
        >
          {t("SWITCH", { locale: locale.toUpperCase() })}
        </button>
      </div>
    </div>
  );
}
