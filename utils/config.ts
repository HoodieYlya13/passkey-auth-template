import { LocaleLanguages } from "@/i18n/utils";

export const APP_NAME = "App Name";
export const DEFAULT_LOCALE: LocaleLanguages = "en";
export const SERVERLESS = !process.env.NEXT_PUBLIC_API_URL;
export const ORIGIN = !SERVERLESS
  ? // Serverless
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  : // Server
    process.env.NEXT_PUBLIC_ORIGIN || "http://localhost:3000";
export const RP_ID = "localhost";
export const ISSUER = "issuer";
export const JWT_VALIDITY = 3600; // 1 hour
