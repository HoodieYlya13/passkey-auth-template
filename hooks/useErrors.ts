import { useTranslations } from "next-intl";
import { useMemo } from "react";

export const useErrors = () => {
  const t = useTranslations("ERRORS");

  return useMemo(
    () => ({
      getError: (code: string, value: string = "") => {
        return t.has(code) ? t(code, { value }) : t("SYST_001");
      },
    }),
    [t]
  );
};
