import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_only_for_development"
);

export async function createJwtToken(payload, expiresIn = "1d") {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(JWT_SECRET);

    return token;
  } catch (error) {
    console.error("Error creating JWT token:", error);
    throw error;
  }
}

export async function verifyJwtToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
}
