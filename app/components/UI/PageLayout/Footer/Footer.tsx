"use client";

import { APP_NAME } from "@/utils/config/config.client";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("FOOTER");

  return (
    <footer className="w-full h-16 sm:h-20 backdrop-blur-md liquid-glass-background border-t liquid-glass-border-color shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.03)] flex justify-center items-center z-10">
      <div className="w-full max-w-7xl px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-foreground/50">
        <div className="font-medium">
          &copy; {currentYear} <span className="text-foreground font-semibold">{APP_NAME}</span>. {t("ALL_RIGHTS_RESERVED")}
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">{t("PRIVACY_POLICY")}</a>
          <a href="#" className="hover:text-foreground transition-colors">{t("TERMS_OF_SERVICE")}</a>
        </div>
      </div>
    </footer>
  );
}
