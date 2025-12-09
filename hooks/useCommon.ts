import { useTranslations } from "next-intl";
import { useMemo } from "react";

export const useCommon = () => {
  const t = useTranslations("COMMON");

  return useMemo(
    () => ({
      getCommon: (code: string, value: string = "") => {
        return t.has(code) ? t(code, { value }) : t("LOADING");
      },
    }),
    [t]
  );
};
