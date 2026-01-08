import crypto from "crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { JWT_VALIDITY } from "./config"; 
import { ERROR_CODES } from "./errors";

const alg = "HS256";
const issuer = process.env.ISSUER;

export async function hashToken(token: string): Promise<string> {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getJwtSecretKey() {
  const secret = process.env.JWT_PRIVATE_KEY;
  
  if (!secret || secret.length === 0) throw new Error(ERROR_CODES.JWT[1]);

  return new TextEncoder().encode(secret);
}

export async function generateSessionToken(payload: JWTPayload) {
  const key = getJwtSecretKey();

  if (!issuer) throw new Error(ERROR_CODES.SYST[1]);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime(JWT_VALIDITY + "s")
    .sign(key);

  return { token, expiresIn: JWT_VALIDITY };
}

export async function verifySessionToken(token: string) {
  const key = getJwtSecretKey();

  if (!issuer) throw new Error(ERROR_CODES.SYST[1]);

  const { payload } = await jwtVerify(token, key, {
    issuer,
    algorithms: [alg],
  });
  
  return payload;
}