"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { setClientCookie } from "@/utils/cookies/cookies.client";
import BottomModal from "../../../shared/components/BottomModal";

interface CookieConsentProps {
  initialHasConsent: boolean;
}

export default function CookieConsent({
  initialHasConsent,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(!initialHasConsent);
  const t = useTranslations("COOKIE_CONSENT");

  if (!isVisible) return null;

  const handleAcknowledge = () => {
    setClientCookie("cookie_consent", "acknowledged", {
      maxAge: 60 * 60 * 24 * 365,
    });
    setIsVisible(false);
  };

  return (
    <BottomModal
      title={t("TITLE")}
      description={t("DESCRIPTION")}
      isVisible={isVisible}
      actions={
        <button
          onClick={handleAcknowledge}
          className="w-full text-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-300 rounded-lg transition-colors cursor-pointer custom-shadow custom-shadow-hover"
        >
          {t("ACKNOWLEDGE")}
        </button>
      }
    />
  );
}
