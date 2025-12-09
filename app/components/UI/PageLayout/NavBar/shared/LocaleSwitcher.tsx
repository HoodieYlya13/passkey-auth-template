"use client";

import { LocaleLanguages } from "@/i18n/utils";
import { setClientCookie } from "@/utils/cookies/cookiesClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Switcher from "./Switcher";

interface LocaleSwitcherProps {
  storedLocale: LocaleLanguages;
  localeMismatch?: LocaleLanguages;
}

export default function LocaleSwitcher({
  storedLocale,
  localeMismatch,
}: LocaleSwitcherProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const switchTo = async (locale: LocaleLanguages) => {
    await setClientCookie("preferred_locale", locale);

    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    const segments = pathname.split("/");
    segments[1] = locale;
    const newPath = segments.join("/") + search + hash;
    router.push(newPath);
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    const currentLocale = pathname.split("/")[1];

    if (!localeMismatch && storedLocale && storedLocale !== currentLocale) {
      const segments = pathname.split("/");
      segments[1] = storedLocale;
      router.replace(segments.join("/"));
    }
  }, [router, storedLocale, localeMismatch]);

  const languages = [
    { code: "fr", alt: "French" },
    { code: "en", alt: "English" },
  ];

  const currentLanguage = languages.find(({ code }) => code === storedLocale);

  return (
    <Switcher
      isOpen={showAll}
      setIsOpen={setShowAll}
      currentElement={
        currentLanguage && (
          <Image
            src={`/img/flags/${currentLanguage.code.toUpperCase()}.svg`}
            width={24}
            height={16}
            alt={currentLanguage.alt}
            className="cursor-pointer border custom-shadow custom-shadow-hover"
          />
        )
      }
      elements={languages.map(({ code, alt }) => ({
        key: code,
        content: (
          <Image
            src={`/img/flags/${code.toUpperCase()}.svg`}
            width={24}
            height={16}
            alt={alt}
            className="cursor-pointer border custom-shadow custom-shadow-hover"
          />
        ),
        onClick: () => switchTo(code as LocaleLanguages),
      }))}
    />
  );
}
