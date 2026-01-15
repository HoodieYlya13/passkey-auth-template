"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocaleLanguages } from "@/i18n/utils";
import {
  deleteClientCookie,
  setClientCookie,
} from "@/utils/cookies/cookies.client";
import { useTranslations } from "next-intl";
import BottomModal from "../../../shared/components/BottomModal";

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
    <BottomModal
      title={t("TITLE")}
      isVisible={isVisible}
      description={t.rich("DESCRIPTION", {
        important: (chunks) => (
          <span className="font-medium text-foreground uppercase">
            {chunks}
          </span>
        ),
        preferredLocale: locale,
        currentLocale: localeMismatch,
      })}
      actions={
        <>
          <button
            onClick={handleSwitch}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-300 rounded-lg transition-colors cursor-pointer custom-shadow custom-shadow-hover"
          >
            {t("KEEP", { locale: localeMismatch.toUpperCase() })}
          </button>
          <button
            onClick={handleStay}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-300 rounded-lg transition-colors cursor-pointer custom-shadow custom-shadow-hover"
          >
            {t("SWITCH", { locale: locale.toUpperCase() })}
          </button>
        </>
      }
    />
  );
}
