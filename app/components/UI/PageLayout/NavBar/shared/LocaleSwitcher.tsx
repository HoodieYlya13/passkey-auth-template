"use client";

import { LocaleLanguages } from "@/i18n/utils";
import { setClientCookie } from "@/utils/cookies/cookies.client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Switcher from "./Switcher";
import { DEFAULT_LOCALE } from "@/utils/config/config.client";

const getIconPath = (t: string) => {
  switch (t) {
    case "fr":
      return (
        <>
          <path fill="#FFF" d="M0 0h513v342H0z" />
          <path fill="#00318A" d="M0 0h171v342H0z" />
          <path fill="#D80027" d="M342 0h171v342H342z" />
        </>
      );
    default:
      return (
        <>
          <g fill="#FFF">
            <path d="M0 0h513v341.3H0V0z" />
            <path d="M311.7 230 513 341.3v-31.5L369.3 230h-57.6zM200.3 111.3 0 0v31.5l143.7 79.8h56.6z" />
          </g>
          <g fill="#0052B4">
            <path d="M393.8 230 513 295.7V230H393.8zm-82.1 0L513 341.3v-31.5L369.3 230h-57.6zm146.9 111.3-147-81.7v81.7h147zM90.3 230 0 280.2V230h90.3zm110 14.2v97.2H25.5l174.8-97.2zM118.2 111.3 0 45.6v65.7h118.2zm82.1 0L0 0v31.5l143.7 79.8h56.6zM53.4 0l147 81.7V0h-147zM421.7 111.3 513 61.1v50.2h-91.3zm-110-14.2V0h174.9L311.7 97.1z" />
          </g>
          <g fill="#D80027">
            <path d="M288 0h-64v138.7H0v64h224v138.7h64V202.7h224v-64H288V0z" />
            <path d="M311.7 230 513 341.3v-31.5L369.3 230h-57.6zM143.7 230 0 309.9v31.5L200.3 230h-56.6zM200.3 111.3 0 0v31.5l143.7 79.8h56.6zM368.3 111.3 513 31.5V0L311.7 111.3h56.6z" />
          </g>
        </>
      );
  }
};

const renderIcon = (t: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 513 342"
    className="cursor-pointer custom-shadow custom-shadow-hover h-5 w-auto"
  >
    {getIconPath(t)}
  </svg>
);

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
    setClientCookie("preferred_locale", locale);

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

  const languages: LocaleLanguages[] = ["fr", "en"];

  const currentLanguage =
    languages.find((code) => code === storedLocale) || DEFAULT_LOCALE;

  return (
    <Switcher
      isOpen={showAll}
      setIsOpen={setShowAll}
      currentElement={renderIcon(currentLanguage)}
      activeKey={currentLanguage}
      elements={languages.map((code) => ({
        key: code,
        content: renderIcon(code),
        onClick: () => switchTo(code),
      }))}
    />
  );
}
