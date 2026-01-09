import "server-only";

export const ORIGIN = process.env.ORIGIN;
export const APP_PASSWORD = process.env.APP_PASSWORD || "Password";

// Serverless
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const EMAIL_FROM = process.env.EMAIL_FROM || "Magic Link <magic-link@noreply.hy13dev.com>";
export const RP_ID = process.env.RP_ID || "localhost";
export const ISSUER = process.env.ISSUER || "app-name-passkey-auth-template";
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
export const JWT_ALG = process.env.JWT_ALG || "HS256";
export const JWT_VALIDITY = process.env.JWT_VALIDITY || 3600; // 1 hour
