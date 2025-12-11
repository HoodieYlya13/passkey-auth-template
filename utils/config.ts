import { LocaleLanguages } from "@/i18n/utils";

export const APP_NAME = "App Name";
export const DEFAULT_LOCALE: LocaleLanguages = "en";
export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN;

// Serverless
export const SERVERLESS = !!process.env.POSTGRES_URL;
export const JWT_VALIDITY = 3600; // 1 hour