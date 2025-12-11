import crypto from "crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { ISSUER, JWT_VALIDITY } from "./config"; 

const alg = "HS256";

export async function hashToken(token: string): Promise<string> {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getJwtSecretKey() {
  const secret = process.env.JWT_PRIVATE_KEY;
  
  if (!secret || secret.length === 0) throw new Error("JWT_001");

  return new TextEncoder().encode(secret);
}

export async function generateSessionToken(payload: JWTPayload) {
  const key = getJwtSecretKey();

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(JWT_VALIDITY + "s")
    .sign(key);

  return { token, expiresIn: JWT_VALIDITY };
}

export async function verifySessionToken(token: string) {
  const key = getJwtSecretKey();

  const { payload } = await jwtVerify(token, key, {
    issuer: ISSUER,
    algorithms: [alg],
  });
  
  return payload;
}