import "server-only";
import crypto from "crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { JWT_VALIDITY } from "./config/config.server";
import { ERROR_CODES } from "./errors";
import { JWT_PRIVATE_KEY, ISSUER, JWT_ALG } from "./config/config.server";
import { SERVERLESS } from "./config/config.client";
import { getUserAccessToken } from "./cookies/cookies.server";

export async function hashToken(token: string): Promise<string> {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getJwtSecretKey() {
  if (!JWT_PRIVATE_KEY || JWT_PRIVATE_KEY.length === 0)
    throw new Error(ERROR_CODES.JWT[1]);

  return new TextEncoder().encode(JWT_PRIVATE_KEY);
}

export async function generateSessionToken(payload: JWTPayload) {
  const key = getJwtSecretKey();

  if (!ISSUER) throw new Error(ERROR_CODES.SYST[1]);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(JWT_VALIDITY + "s")
    .sign(key);

  return { token, expiresIn: JWT_VALIDITY };
}

export async function verifySessionToken(token: string) {
  const key = getJwtSecretKey();

  if (!ISSUER) throw new Error(ERROR_CODES.SYST[1]);

  const { payload } = await jwtVerify(token, key, {
    issuer: ISSUER,
    algorithms: [JWT_ALG],
  });

  return payload;
}

export async function isAuthenticated(authenticationNeeded?: boolean) {
  if (SERVERLESS && authenticationNeeded) {
    const token = await getUserAccessToken();
    if (!token) throw new Error(ERROR_CODES.AUTH[4]);
    return true;
  }
  return true;
}