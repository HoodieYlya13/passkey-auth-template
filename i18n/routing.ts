import { defineRouting } from "next-intl/routing";
import { SUPPORTED_LOCALES } from "./utils";
import { DEFAULT_LOCALE } from "@/utils/config/config.client";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,

  defaultLocale: DEFAULT_LOCALE,
});
