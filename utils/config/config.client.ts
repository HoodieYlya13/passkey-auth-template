import { LocaleLanguages } from "@/i18n/utils";

export const TESTING_MODE = process.env.NEXT_PUBLIC_TESTING_MODE || "true";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Passkey";
export const DEFAULT_LOCALE = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en") as LocaleLanguages;

// Serverless
export const SERVERLESS = process.env.NEXT_PUBLIC_SERVERLESS || "true";
