import { ERROR_CODES } from "@/utils/errors";
import { useTranslations } from "next-intl";

export const useErrors = () => {
  const t = useTranslations("ERRORS");

  return {
    errorT: (code: string, value: string = "") => {
      return t.has(code) ? t(code, { value }) : t(ERROR_CODES.SYST[1]);
    },
  };
};
