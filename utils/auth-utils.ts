import crypto from "crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { ALGORITHM_SIGNATURE, ISSUER, JWT_VALIDITY } from "./config";

export async function hashToken(token: string): Promise<string> {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function getJwtSecretKey() {
  const keyEnv = process.env.JWT_PRIVATE_KEY;
  if (!keyEnv) throw new Error("JWT_001");

  try {
    const { importPKCS8 } = await import("jose");
    let pem = keyEnv;
    try {
      const decoded = Buffer.from(keyEnv, "base64").toString("utf-8");
      if (decoded.includes("-----BEGIN")) pem = decoded;
    } catch {}

    if (pem.includes("-----BEGIN")) return await importPKCS8(pem, ALGORITHM_SIGNATURE);
  } catch (error) {
    console.warn("Failed to import PKCS8, falling back to secret", error);
  }

  return new TextEncoder().encode(keyEnv);
}

export async function generateSessionToken(payload: JWTPayload) {
  const key = await getJwtSecretKey();
  const alg = key instanceof Uint8Array ? "HS256" : ALGORITHM_SIGNATURE;
  const expiresIn = JWT_VALIDITY;

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(JWT_VALIDITY + "s")
    .sign(key);

  return { token, expiresIn };
}

export async function verifySessionToken(token: string) {
  const key = await getJwtSecretKey();

  const { payload } = await jwtVerify(token, key, {
    issuer: ISSUER,
  });
  return payload;
}
