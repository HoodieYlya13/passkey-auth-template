import { useTranslations } from "next-intl";

export const useCommon = () => {
  const t = useTranslations("COMMON");

  return {
    commonT: (code: string, value: string = "") => {
      return t.has(code) ? t(code, { value }) : t("LOADING");
    },
  };
};
