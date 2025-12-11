import { LocaleLanguages } from "@/i18n/utils";

export const APP_NAME = "App Name";
export const DEFAULT_LOCALE: LocaleLanguages = "en";
export const SERVERLESS = !process.env.NEXT_PUBLIC_API_URL;
export const ORIGIN = !SERVERLESS
  ? // Serverless
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  : // Server
    process.env.NEXT_PUBLIC_ORIGIN || "http://localhost:3000";
export const RP_ID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
export const ISSUER = process.env.NEXT_PUBLIC_ISSUER || "app-name";
export const JWT_VALIDITY = 3600; // 1 hour
type JwtAlgorithm = "RS256" | "ES256";
export const ALGORITHM_SIGNATURE: JwtAlgorithm =
  (process.env.JWT_ALGORITHM as JwtAlgorithm) || "ES256";